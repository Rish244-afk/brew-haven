import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey && !resendApiKey.includes("placeholder")
  ? new Resend(resendApiKey)
  : null;

const SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "Brew Haven <onboarding@resend.dev>";
const OWNER_EMAIL = process.env.ADMIN_EMAIL || "hello@brewhaven.co";

export async function sendOrderConfirmationEmail(params: {
  toEmail: string;
  customerName: string;
  orderId: string;
  totalAmount: number; // in cents
  items: { name: string; quantity: number; price: number }[];
}) {
  const formattedTotal = (params.totalAmount / 100).toFixed(2);
  const itemsListHtml = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #ede5d4;">${item.name} x ${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #ede5d4; text-align: right;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const subject = `Order Confirmation #${params.orderId.slice(-6).toUpperCase()} — Brew Haven`;
  const html = `
    <div style="font-family: Georgia, serif; background-color: #f5f0e8; padding: 40px 20px; color: #2a1f14;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <h1 style="color: #c9a96e; font-size: 26px; font-weight: normal; margin-top: 0;">Brew Haven</h1>
        <p style="font-size: 16px; color: #6b5744;">Dear ${params.customerName},</p>
        <p style="font-size: 15px; line-height: 1.6;">Thank you for your order! We are preparing your artisanal selection with slow care and precision.</p>
        
        <div style="margin: 24px 0; padding: 16px; background: #fdfaf5; border: 1px solid #ede5d4;">
          <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #c9a96e;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${itemsListHtml}
          </table>
          <p style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 16px; color: #2a1f14;">Total: $${formattedTotal}</p>
        </div>

        <p style="font-size: 13px; color: #9c826a; text-align: center; margin-top: 32px; border-top: 1px solid #ede5d4; padding-top: 16px;">
          Brew Haven — 12 Quiet Lane, Haven District, New York, NY<br>
          <em>"Coffee is not rushed — it is respected."</em>
        </p>
      </div>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: params.toEmail,
        subject,
        html,
      });
      console.log(`✉️ Order confirmation email dispatched via Resend to ${params.toEmail}`);
    } catch (err) {
      console.error("⚠️ Resend email dispatch error:", err);
    }
  } else {
    console.log(`[DEV EMAIL SIMULATION] To: ${params.toEmail} | Subject: ${subject}`);
  }
}

export async function sendReservationConfirmationEmail(params: {
  toEmail: string;
  name: string;
  date: string;
  time: string;
  partySize: number;
  reservationId: string;
}) {
  const subject = `Reservation Confirmed — Brew Haven (${params.date})`;
  const html = `
    <div style="font-family: Georgia, serif; background-color: #f5f0e8; padding: 40px 20px; color: #2a1f14;">
      <div style="max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 4px;">
        <h1 style="color: #c9a96e; font-size: 26px; font-weight: normal; margin-top: 0;">Brew Haven</h1>
        <p style="font-size: 16px;">Dear ${params.name},</p>
        <p style="font-size: 15px; line-height: 1.6;">Your table reservation at Brew Haven has been received and confirmed!</p>
        
        <div style="margin: 24px 0; padding: 20px; background: #1a1208; color: #f5f0e8; border-left: 4px solid #c9a96e;">
          <p style="margin: 4px 0;"><strong>Date:</strong> ${params.date}</p>
          <p style="margin: 4px 0;"><strong>Time:</strong> ${params.time}</p>
          <p style="margin: 4px 0;"><strong>Guests:</strong> ${params.partySize} ${params.partySize === 1 ? "person" : "people"}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #c9a96e;">Ref: #${params.reservationId.slice(-6).toUpperCase()}</p>
        </div>

        <p style="font-size: 14px; color: #6b5744;">We look forward to hosting your quiet moment of luxury.</p>
      </div>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: params.toEmail,
        subject,
        html,
      });
      // Also notify owner
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: OWNER_EMAIL,
        subject: `New Reservation Alert: ${params.name} (${params.partySize} guests)`,
        html,
      });
    } catch (err) {
      console.error("⚠️ Resend reservation email dispatch error:", err);
    }
  } else {
    console.log(`[DEV EMAIL SIMULATION] Reservation confirmed for ${params.toEmail}`);
  }
}

export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  type: string;
  message: string;
}) {
  const subject = `New Contact Enquiry [${params.type.toUpperCase()}] from ${params.name}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #2a1f14;">
      <h2>New Enquiry Submitted on Brew Haven</h2>
      <p><strong>Name:</strong> ${params.name}</p>
      <p><strong>Email:</strong> ${params.email}</p>
      <p><strong>Category:</strong> ${params.type}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f5f0e8; padding: 12px; border-left: 3px solid #c9a96e;">${params.message}</blockquote>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: OWNER_EMAIL,
        subject,
        html,
      });
    } catch (err) {
      console.error("⚠️ Resend contact email error:", err);
    }
  } else {
    console.log(`[DEV EMAIL SIMULATION] Contact alert: ${subject}`);
  }
}
