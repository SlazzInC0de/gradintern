# Privacy Policy

Last updated: 29 October 2026

This policy covers GradIntern as it exists in this repository. If you run your own copy, you are responsible for how your deployment handles data.

## What we collect

When you register:

- **Name**
- **Email address**
- **Password**, stored only as a bcrypt hash. The plain password is never stored or logged.
- **Role** (`grad` or `recruiter`)
- Account creation and update timestamps

When a recruiter posts a job: the listing details entered in the form (title, company, location, type and description). Listings are public to everyone who visits the job board, together with the company name.

## How it is used

- Your name, email and password are used only to create your account and sign you in.
- Your role decides what you can do (for example, only recruiters can post jobs).
- We do not sell, rent or share your data with anyone, and we do not send marketing emails.

## Where it is stored

- Account and listing data is stored in a MongoDB Atlas database.
- After you log in, your sign-in token and basic profile (name, email, role) are kept in your browser's `localStorage` so you stay signed in. Logging out removes them. The token expires after 1 day.

## Cookies and tracking

GradIntern uses no cookies, analytics or advertising trackers.

## Your choices

- You can log out at any time to clear the data saved in your browser.
- To have your account or a listing deleted, email **vsuryansh080405@gmail.com** from the address you registered with.

## Changes

Changes to this policy are made in this file and are visible in its commit history.
