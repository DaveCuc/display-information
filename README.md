<p align="center">
  <img src="https://github.com/DaveCuc/DaveCuc/blob/main/1a.png" width="80" alt="Logo" />
</p>

<h1 align="center">Display Information (FIDS) ✈️🚉🚌</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion">
</p>

**Display Information** is an immersive Dashboard designed to replicate the visual experience of Flight Information Display Systems (FIDS) found in airports and train stations. It synchronizes your events directly from **Google Calendar** and keeps your daily schedule in sight with stunning aesthetics.

## ✨ Key Features

* **Automatic Synchronization**: Connect your Google account and view your activities immediately without extra configuration.
* **Multiple Immersive Themes**:
  * 🔮 **Hologram (Modern)**: Glassmorphism design with a hypnotic moving background.
  * ✈️ **Airport**: Classic electromechanical *Split-Flap* display style.
  * 🚌 **Bus Station**: Classic red LED dot-matrix display.
  * 🚇 **Subway**: Dark industrial aesthetic with blue LEDs.
* **Dual Clock Component**: 12h or 24h display toggle with smooth layout animations.
* **Integrated Feedback System**: Built-in modal to submit design proposals and bug reports.

## 🚀 Technologies Used

* **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
* **Styling**: Tailwind CSS + Framer Motion (for fluid animations)
* **Authentication**: NextAuth.js (Google Provider)
* **APIs**: Google Calendar API
* **Email Backend**: Nodemailer

## 🛠️ Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DaveCuc/display-information.git
   cd display-information
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the project based on the following format:

   ```env
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_super_secure_secret_here

   # Google Cloud (With Google Calendar API enabled)
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret

   # SMTP for Feedback system (e.g., Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FEEDBACK_RECEIVER_EMAIL=your_receiving_email@gmail.com
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Open the App**: Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Production Deployment

This application is designed to be easily deployed on **Vercel** or any Node.js environment. When moving to production, update your environment variables:

* **`NEXTAUTH_URL`**: Must be changed to your real domain (e.g., `https://mydomain.com`). *Note: Vercel often configures this automatically.*
* **`NEXTAUTH_SECRET`**: **Mandatory** in production. It is the cryptographic key used to sign sessions. Generate one using `openssl rand -base64 32`.
* **Google Cloud Console**: Remember to add your new production URL (e.g., `https://mydomain.com/api/auth/callback/google`) to the **Authorized redirect URIs** list in your Google Cloud Console.

## 🔒 Security

Please review our [Security Policy](SECURITY.md) for information on reporting vulnerabilities and understanding the security model.

## 📝 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. Copyright (c) 2026 DaveCuc.
