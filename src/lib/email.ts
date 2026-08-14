import { Resend } from "resend";

const ADMIN_EMAIL = "ofer.delkom@gmail.com";
const FROM = "EnterRent <noreply@enterent.org>";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

export async function sendHostVerifiedEmail(host: { email: string; full_name: string }) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM,
    to: host.email,
    cc: ADMIN_EMAIL,
    subject: "You're verified on EnterRent!",
    text: `Hi ${host.full_name},

Great news — your host profile is now verified on EnterRent.

You can now browse other verified hosts, propose stay swaps, and request emergency backup hosting.

Log in to get started: https://enterent.org/login

— The EnterRent team`,
  });
}
