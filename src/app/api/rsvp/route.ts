import { NextResponse } from "next/server";
import { sendInviteEmail } from "@/lib/mailer";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, message: "Email không hợp lệ" }, { status: 400 });
    }

    await sendInviteEmail(email);
    return NextResponse.json({ ok: true, message: "Đã gửi thư mời tới email của bạn" });
  } catch (error: unknown) {
    console.error("RSVP API error", error);
    return NextResponse.json({ ok: false, message: "Không thể gửi email, vui lòng thử lại sau" }, { status: 500 });
  }
}



