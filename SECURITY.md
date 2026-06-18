# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Report security issues via GitHub's private vulnerability reporting, or email the maintainer directly. Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and aim to release a fix within 7 days for critical issues.

## Security Model

**Display Information (FIDS)** is an open-source web application running on Next.js. It integrates with Google Calendar to display events in a dashboard format safely.

### Threat Surface & Mitigation

| Vector | Mitigation |
|--------|-----------|
| **Credential Leakage** | API Keys (`GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `SMTP_PASS`) are strictly managed through environment variables (`.env`). They are **never** committed to version control. |
| **Authentication & Sessions** | Uses **NextAuth.js** to manage secure, encrypted, HTTP-only cookie sessions. Prevents unauthorized access to user calendars. |
| **API Rate Limiting** | Server-side endpoints fetching data from Google Calendar use proper NextAuth session validation to prevent unauthorized requests and abuse. |
| **XSS & Injection** | React and Next.js automatically sanitize inputs. The feedback system uses parameterized state handling to prevent XSS. |
| **Arbitrary Code Execution** | The application is a standard Next.js deployment. It does not execute arbitrary user code or perform dynamic `eval()`. |

### What Display Information does NOT do

- Does not store your Google Calendar events permanently in a database (events are fetched on-the-fly via Google API).
- Does not collect, sell, or transmit telemetry or analytics data to third parties.
- Does not store API keys in plaintext JSON files or frontend code.

### Outbound Network Calls

- **Google APIs:** Makes outbound HTTPS requests to Google's OAuth and Calendar endpoints to authenticate users and fetch upcoming events.
- **SMTP Server:** Makes outbound requests to the configured SMTP server to send user feedback emails securely.
