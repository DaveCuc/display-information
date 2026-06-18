import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FEEDBACK_RECEIVER_EMAIL } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FEEDBACK_RECEIVER_EMAIL) {
      console.error("Missing SMTP credentials in .env");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 465,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const userEmail = session?.user?.email || "Usuario Anónimo";
    const userName = session?.user?.name || "Sin nombre";

    await transporter.sendMail({
      from: `"FIDS Feedback" <${SMTP_USER}>`,
      to: FEEDBACK_RECEIVER_EMAIL,
      subject: `[FIDS] Nuevo Feedback de ${userName}`,
      html: `
        <h2>Nuevo comentario recibido</h2>
        <p><strong>De:</strong> ${userName} (${userEmail})</p>
        <hr />
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending feedback email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
