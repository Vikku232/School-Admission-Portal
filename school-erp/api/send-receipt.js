import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      email,
      studentName = 'Student',
      studentId = 'RIPS-2027',
      receiptNo = `REC-${Date.now()}`,
      amount = 22000,
      paymentMethod = 'Razorpay (Verified UPI/Card)',
      referenceNo = `pay_${Date.now()}`,
      feeType = 'Class 11/12 Senior Secondary Quarterly Tuition Fee'
    } = req.body || {};

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, error: 'Recipient email is required' });
    }

    const recipient = email.trim();
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const formattedAmount = `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    // Create Gmail transporter (Runs inside Vercel Serverless AWS Lambda where port 587 / 465 is OPEN)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME || 'dgarmy.vikash@gmail.com',
        pass: process.env.MAIL_PASSWORD || 'vrtpuwxsiturrfug'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: auto; padding: 24px; background-color: #f1f5f9; border-radius: 16px;">
        <!-- Header -->
        <div style="background-color: #1e3a8a; color: #ffffff; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <div style="width: 48px; height: 48px; background: #ffffff; color: #1e3a8a; font-weight: 800; font-size: 18px; line-height: 48px; border-radius: 50%; margin: 0 auto 10px auto; border: 2px solid #f5c518;">RIPS</div>
          <h2 style="margin: 0; color: #f5c518; letter-spacing: 0.5px; font-size: 20px;">ROYAL INTERNATIONAL PUBLIC SCHOOL</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #cbd5e1;">Senior Secondary Wing • CBSE Affiliation No. 1930284</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #94a3b8;">Bursar & Accounts Division • Official Fee Realization Voucher</p>
        </div>

        <!-- Success Banner -->
        <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top: none;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: #ecfdf5; border: 2px solid #10b981; color: #065f46; font-size: 13px; font-weight: bold; padding: 6px 18px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
              ✓ Payment Verified & Receipt Confirmed
            </div>
            <h3 style="margin: 14px 0 4px 0; color: #0f172a; font-size: 18px;">Thank You! Fee Payment Realized Successfully.</h3>
            <p style="margin: 0; color: #64748b; font-size: 13px;">Dear Parent / Student, this is your official digital fee receipt for your records.</p>
          </div>

          <!-- Transaction Summary Table -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Receipt Voucher Number:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; font-family: monospace; color: #1e3a8a; font-size: 14px;">${receiptNo}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Student Name:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0f172a;">${studentName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Admission / Student ID:</td>
                <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: bold; color: #334155;">${studentId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Date:</td>
                <td style="padding: 6px 0; text-align: right; color: #334155; font-weight: 500;">${dateStr}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Payment Channel:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #6d28d9;">${paymentMethod}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Razorpay Reference ID:</td>
                <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #0284c7; font-weight: bold;">${referenceNo}</td>
              </tr>
            </table>
          </div>

          <!-- Line Items Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <thead>
              <tr style="background: #1e3a8a; color: #ffffff;">
                <th style="padding: 10px 12px; text-align: left; border-radius: 6px 0 0 0;">Fee Description</th>
                <th style="padding: 10px 12px; text-align: right; border-radius: 0 6px 0 0;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px; color: #334155;">${feeType}</td>
                <td style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">${formattedAmount}</td>
              </tr>
              <tr style="background: #f8fafc; font-weight: bold; font-size: 14px;">
                <td style="padding: 12px; color: #1e3a8a;">Total Amount Realized (Full):</td>
                <td style="padding: 12px; text-align: right; color: #059669; font-size: 16px;">${formattedAmount}</td>
              </tr>
            </tbody>
          </table>

          <!-- Digital Seal -->
          <div style="background: #fdf4ff; border: 1px dashed #c084fc; border-radius: 8px; padding: 12px; text-align: center; color: #7e22ce; font-size: 12px; margin-bottom: 20px;">
            ★ COMPUTER GENERATED OFFICIAL RECEIPT — DIGITALLY VERIFIED BY R.I.P.S. BURSAR DIVISION ★
          </div>

          <!-- Actions -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://school-admission-portal-2.onrender.com/api/payments/razorpay/receipt/${receiptNo}" target="_blank" style="display: inline-block; background: #1e3a8a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              📄 View & Print Official Printable Voucher
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 16px; color: #64748b; font-size: 11px;">
          <p style="margin: 0;">Royal International Public School • Knowledge City • Support Desk: <a href="mailto:dgarmy.vikash@gmail.com" style="color: #1e3a8a;">dgarmy.vikash@gmail.com</a></p>
          <p style="margin: 4px 0 0 0; color: #94a3b8;">© 2027 RIPS Senior Secondary School. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Royal International Public School" <dgarmy.vikash@gmail.com>',
      to: recipient,
      subject: `🧾 Official Fee Receipt #${receiptNo} - Royal International Public School`,
      html: htmlBody
    });

    console.log(`[Vercel Mailer] Receipt ${receiptNo} sent to ${recipient}. MessageId: ${info.messageId}`);
    return res.status(200).json({
      success: true,
      receiptNo,
      recipient,
      messageId: info.messageId,
      message: 'Official fee receipt email successfully dispatched to your inbox.'
    });

  } catch (error) {
    console.error('[Vercel Mailer Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch email'
    });
  }
}
