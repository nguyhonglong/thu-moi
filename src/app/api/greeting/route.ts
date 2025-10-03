import { NextResponse } from "next/server";
import { sendVoiceGreetingEmail, sendTextGreetingEmail } from "@/lib/mailer";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const audio = form.get("audio") as File | null;
    const message = (form.get("message") || "").toString().trim();

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, message: "Vui lòng nhập tên hợp lệ" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, message: "Email không hợp lệ" }, { status: 400 });
    }
    if (!audio && !message) {
      return NextResponse.json({ ok: false, message: "Vui lòng ghi âm hoặc nhập lời chúc" }, { status: 400 });
    }

    if (audio) {
      const sizeLimit = 15 * 1024 * 1024; // 15MB
      // @ts-ignore: size may not exist on File in older lib dom types
      const fileSize = (audio as any).size ?? 0;
      if (fileSize > sizeLimit) {
        return NextResponse.json({ ok: false, message: "File quá lớn (tối đa 15MB)" }, { status: 413 });
      }

      const arrayBuffer = await audio.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await sendVoiceGreetingEmail({
        senderName: name,
        senderEmail: email,
        audioBuffer: buffer,
        mimeType: (audio as any).type || "audio/webm",
        filename: (audio as any).name || `loi-chuc-${Date.now()}.webm`,
        textMessage: message || undefined,
      });
      return NextResponse.json({ ok: true, message: "Đã gửi lời chúc tới Long" });
    }

    // Text-only path
    await sendTextGreetingEmail({ senderName: name, senderEmail: email, message });
    return NextResponse.json({ ok: true, message: "Đã gửi lời chúc (văn bản) tới Long" });
  } catch (error: unknown) {
    console.error("GREETING API error", error);
    return NextResponse.json({ ok: false, message: "Không thể gửi, vui lòng thử lại sau" }, { status: 500 });
  }
}


