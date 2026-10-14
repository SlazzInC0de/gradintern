// API tests with the Mongoose layer stubbed, so they run without a database.
// Run: npm test   (uses the built-in node:test runner)
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test-secret';

const User = require('../models/User');
const Listing = require('../models/Listing');

// ---- in-memory stand-ins for MongoDB -------------------------------------
let users = [];
let listings = [];

User.findOne = async (query) => users.find((u) => u.email === query.email) || null;
User.prototype.save = async function save() { users.push(this); return this; };
Listing.prototype.save = async function save() { listings.push(this); return this; };
Listing.find = () => ({
  populate: () => ({ sort: async () => [...listings].reverse() }),
});

const app = express();
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', require('../routes/auth'));
app.use('/api/listings', require('../routes/listings'));

let server;
let base;

before(async () => {
  server = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());
beforeEach(() => { users = []; listings = []; });

const post = (path, body, token) => fetch(base + path, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  body: JSON.stringify(body),
});

const tokenFor = (role) => jwt.sign({ userId: '64b000000000000000000000', role }, process.env.JWT_SECRET);
const validJob = { title: 'Backend Intern', company: 'Acme', location: 'Bengaluru', salary: '30k/month', description: 'Build and test REST APIs.' };

// ---- auth -----------------------------------------------------------------
test('register hashes the password and rejects duplicate emails', async () => {
  const body = { name: 'Asha', email: 'asha@uni.edu', password: 'S3cret!pass', role: 'grad' };
  assert.equal((await post('/api/auth/register', body)).status, 201);
  assert.notEqual(users[0].password, body.password);
  assert.ok(await bcrypt.compare(body.password, users[0].password));

  assert.equal((await post('/api/auth/register', body)).status, 400);
});

test('login returns a JWT carrying the role, and rejects a wrong password', async () => {
  await post('/api/auth/register', { name: 'Ravi', email: 'ravi@corp.com', password: 'Hire!me123', role: 'recruiter' });

  const ok = await post('/api/auth/login', { email: 'ravi@corp.com', password: 'Hire!me123' });
  assert.equal(ok.status, 200);
  const { token } = await ok.json();
  assert.equal(jwt.verify(token, process.env.JWT_SECRET).role, 'recruiter');

  const bad = await post('/api/auth/login', { email: 'ravi@corp.com', password: 'wrong' });
  assert.equal(bad.status, 400);
});

test('login with an unknown email gives the same error as a wrong password', async () => {
  const res = await post('/api/auth/login', { email: 'ghost@nowhere.com', password: 'x' });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).message, 'Invalid Email or Password');
});

// ---- RBAC -----------------------------------------------------------------
test('posting a job without a token is 401', async () => {
  assert.equal((await post('/api/listings', validJob)).status, 401);
});

test('a tampered or expired token is 403', async () => {
  const forged = jwt.sign({ userId: 'x', role: 'recruiter' }, 'not-the-secret');
  assert.equal((await post('/api/listings', validJob, forged)).status, 403);

  const expired = jwt.sign({ userId: 'x', role: 'recruiter', exp: Math.floor(Date.now() / 1000) - 60 }, process.env.JWT_SECRET);
  assert.equal((await post('/api/listings', validJob, expired)).status, 403);
});

test('a grad cannot post a job', async () => {
  assert.equal((await post('/api/listings', validJob, tokenFor('grad'))).status, 403);
  assert.equal(listings.length, 0);
});

test('a recruiter can post a valid job and it appears on the board', async () => {
  assert.equal((await post('/api/listings', validJob, tokenFor('recruiter'))).status, 201);
  const board = await (await fetch(`${base}/api/listings`)).json();
  assert.equal(board.length, 1);
  assert.equal(board[0].title, validJob.title);
});

// ---- payload validation ---------------------------------------------------
for (const [field, value, why] of [
  ['title', 'ab', 'too short'],
  ['title', 'x'.repeat(101), 'too long'],
  ['company', 42, 'not a string'],
  ['description', 'short', 'under 10 chars'],
  ['salary', undefined, 'missing'],
]) {
  test(`rejects a job whose ${field} is ${why}`, async () => {
    const res = await post('/api/listings', { ...validJob, [field]: value }, tokenFor('recruiter'));
    assert.equal(res.status, 400);
    assert.equal(listings.length, 0);
  });
}

test('oversized request bodies are refused', async () => {
  const res = await post('/api/listings', { ...validJob, description: 'x'.repeat(200 * 1024) }, tokenFor('recruiter'));
  assert.equal(res.status, 413);
});

test('rejects a job with a missing location', async () => {
  const res = await post('/api/listings', { ...validJob, location: '' }, tokenFor('recruiter'));
  assert.equal(res.status, 400);
});

// ---- failure handling -----------------------------------------------------
test('database failures return a 500 without leaking internals', async (t) => {
  const err = new Error('connection reset by Atlas');
  t.mock.method(Listing.prototype, 'save', async () => { throw err; });
  t.mock.method(User, 'findOne', async () => { throw err; });
  t.mock.method(Listing, 'find', () => { throw err; });
  t.mock.method(console, 'error', () => {});

  const cases = [
    [() => post('/api/listings', validJob, tokenFor('recruiter')), 'Failed to post job'],
    [() => fetch(`${base}/api/listings`), 'Failed to load listings'],
    [() => post('/api/auth/register', { name: 'A', email: 'a@b.c', password: 'p', role: 'grad' }), 'Server error during registration'],
    [() => post('/api/auth/login', { email: 'a@b.c', password: 'p' }), 'Server error during login'],
  ];
  for (const [call, message] of cases) {
    const res = await call();
    assert.equal(res.status, 500);
    const body = await res.json();
    assert.equal(body.message, message);
    assert.equal(body.stack, undefined);
    assert.ok(!JSON.stringify(body).includes('Atlas'));
  }
});
