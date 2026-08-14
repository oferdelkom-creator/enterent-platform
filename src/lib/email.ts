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

Here's how to get the most out of it:

1. Add your listings — go to "My listings" and add every property you host, with your
   Airbnb listing link and iCal URL so we can show real availability.
   https://enterent.org/dashboard/listings

2. Sync your calendar — after adding a listing, click "Sync calendar" so other hosts
   can see when you're actually free.

3. Browse verified hosts — go to "Find hosts" to look for a stay swap for your own
   vacation, or a backup host near a property you're worried about.
   https://enterent.org/dashboard/find

4. Send a request — found a good match? Propose a swap (offering one of your own
   listings) or ask for emergency backup, with your dates and a short message.

5. Track it — "Requests" shows everything you've sent and received, so you can
   accept, decline, or cancel as things move.
   https://enterent.org/dashboard/requests

Log in to get started: https://enterent.org/login

— The EnterRent team`,
  });
}
