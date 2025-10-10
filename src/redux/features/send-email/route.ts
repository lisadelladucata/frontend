import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json();

    const data = await resend.emails.send({
      from: fromEmail || "onboarding@resend.dev",
      to: [to],
      subject: subject,
      html: `<strong>${body}</strong>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
