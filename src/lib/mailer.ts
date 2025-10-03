import nodemailer from "nodemailer";

function getBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: getBoolean(process.env.SMTP_SECURE, false),
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendInviteEmail(toEmail: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const subject = "Thư mời lễ tốt nghiệp — Ngụy Hồng Long";
  const html = `
    <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; line-height:1.6">
      <h2 style="margin:0 0 12px">LỜI MỜI</h2>
      <p>Kính mời Quý thầy cô, bạn bè và gia đình tham dự lễ tốt nghiệp của <strong>Ngụy Hồng Long</strong>.</p>
      <ul>
        <li><strong>Ngành</strong>: Khoa học Máy tính</li>
        <li><strong>Thời gian</strong>: 09:00 — 11:00, 04/10/2025</li>
        <li><strong>Địa điểm</strong>: Hội trường 300, Trường Đại học Mỏ — Địa chất</li>
        <li><strong>Địa chỉ</strong>: Số 8, phố Viên, phường Đức Thắng, Bắc Từ Liêm, Hà Nội</li>
      </ul>
      <p>Nếu cần hỗ trợ, vui lòng liên hệ: <a href="tel:0974758821">0974 758 821</a>.</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb" />
      <p>Trân trọng mời.</p>
    </div>
  `;

  await transporter.sendMail({ from, to: toEmail, subject, html });
}

export async function sendVoiceGreetingEmail(params: {
  senderName: string;
  senderEmail: string;
  audioBuffer: Buffer;
  mimeType?: string;
  filename?: string;
  textMessage?: string;
}) {
  const { senderName, senderEmail, audioBuffer, mimeType, filename, textMessage } = params;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const to = process.env.GREETING_TO || "nguyhonglong2002@gmail.com";
  const subject = `Lời chúc bằng lời từ ${senderName}`;
  const html = `
    <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; line-height:1.6">
      <p><strong>${senderName}</strong> &lt;${senderEmail}&gt; đã gửi lời chúc bằng lời.</p>
      ${textMessage ? `<p>Nội dung kèm theo:</p><blockquote style="margin:8px 0;padding:10px 12px;background:#f6f8fb;border-left:3px solid #9ab">${textMessage.replace(/\n/g, "<br/>")}</blockquote>` : ""}
      <p>File ghi âm được đính kèm trong email này.</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    replyTo: senderEmail,
    attachments: [
      {
        filename: filename || `loi-chuc-${Date.now()}.webm`,
        content: audioBuffer,
        contentType: mimeType || "audio/webm",
      },
    ],
  });
}

export async function sendTextGreetingEmail(params: {
  senderName: string;
  senderEmail: string;
  message: string;
}) {
  const { senderName, senderEmail, message } = params;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const to = process.env.GREETING_TO || "nguyhonglong2002@gmail.com";
  const subject = `Lời chúc từ ${senderName}`;
  const html = `
    <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0b1220; line-height:1.6">
      <p><strong>${senderName}</strong> &lt;${senderEmail}&gt; đã gửi lời chúc bằng văn bản:</p>
      <blockquote style="margin:8px 0;padding:10px 12px;background:#f6f8fb;border-left:3px solid #9ab;white-space:pre-wrap">${message.replace(/\n/g, "<br/>")}</blockquote>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    replyTo: senderEmail,
  });
}



