/**
 * Benchmark for the auth path.
 *
 * 1. jwt.verify() in isolation (HS256), the work verifyToken does per request.
 * 2. Full HTTP round trip through Express + verifyToken + RBAC + payload
 *    validation, with the database write stubbed out so only the API layer
 *    is measured.
 *
 * Usage:  node scripts/bench-auth.js            (from backend/)
 *         ITER=20000 node scripts/bench-auth.js
 */
const http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'bench-secret-'.padEnd(64, 'x');

// Stub Listing.save() so the benchmark never touches MongoDB.
const Listing = require('../models/Listing');
Listing.prototype.save = async function save() { return this; };

const listingRoutes = require('../routes/listings');

const ITER = Number(process.env.ITER || 10000);
const HTTP_ITER = Number(process.env.HTTP_ITER || 2000);

function stats(samplesNs) {
  const ms = samplesNs.map((n) => Number(n) / 1e6).sort((a, b) => a - b);
  const pick = (p) => ms[Math.min(ms.length - 1, Math.floor(p * ms.length))];
  const mean = ms.reduce((s, v) => s + v, 0) / ms.length;
  return { n: ms.length, mean, p50: pick(0.5), p95: pick(0.95), p99: pick(0.99) };
}

function fmt(name, s) {
  const f = (v) => v.toFixed(3).padStart(8);
  return `${name.padEnd(34)} n=${String(s.n).padStart(6)}  mean ${f(s.mean)} ms  p50 ${f(s.p50)} ms  p95 ${f(s.p95)} ms  p99 ${f(s.p99)} ms`;
}

function benchVerify() {
  const token = jwt.sign({ userId: '64b000000000000000000000', role: 'recruiter' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  for (let i = 0; i < 1000; i += 1) jwt.verify(token, process.env.JWT_SECRET); // warm-up
  const samples = [];
  for (let i = 0; i < ITER; i += 1) {
    const t0 = process.hrtime.bigint();
    jwt.verify(token, process.env.JWT_SECRET);
    samples.push(process.hrtime.bigint() - t0);
  }
  return stats(samples);
}

function request(port, token, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      host: '127.0.0.1', port, path: '/api/listings', method: 'POST', agent: keepAlive,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), Authorization: `Bearer ${token}` },
    }, (res) => { res.resume(); res.on('end', () => resolve(res.statusCode)); });
    req.on('error', reject);
    req.end(data);
  });
}

const keepAlive = new http.Agent({ keepAlive: true, maxSockets: 1 });

async function benchHttp() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.use('/api/listings', listingRoutes);
  const server = await new Promise((r) => { const s = app.listen(0, '127.0.0.1', () => r(s)); });
  const { port } = server.address();

  const recruiter = jwt.sign({ userId: '64b000000000000000000000', role: 'recruiter' }, process.env.JWT_SECRET);
  const grad = jwt.sign({ userId: '64b000000000000000000001', role: 'grad' }, process.env.JWT_SECRET);
  const body = { title: 'Backend Intern', company: 'Acme', location: 'Bengaluru', salary: '30k/month', description: 'Build and test REST APIs.' };

  const results = {};
  for (const [label, token, expected] of [['POST /api/listings (recruiter, 201)', recruiter, 201], ['POST /api/listings (grad, 403)', grad, 403]]) {
    for (let i = 0; i < 200; i += 1) await request(port, token, body); // warm-up
    const samples = [];
    for (let i = 0; i < HTTP_ITER; i += 1) {
      const t0 = process.hrtime.bigint();
      const code = await request(port, token, body);
      samples.push(process.hrtime.bigint() - t0);
      if (code !== expected) throw new Error(`${label}: expected ${expected}, got ${code}`);
    }
    results[label] = stats(samples);
  }
  server.close();
  keepAlive.destroy();
  return results;
}

(async () => {
  console.log(`Node ${process.version} on ${process.platform}/${process.arch}\n`);
  console.log(fmt('jwt.verify (HS256)', benchVerify()));
  const http = await benchHttp();
  for (const [label, s] of Object.entries(http)) console.log(fmt(label, s));
  process.exit(0);
})().catch((err) => { console.error(err); process.exit(1); });
