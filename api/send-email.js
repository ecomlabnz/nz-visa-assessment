// Vercel serverless function to send emails
// This runs server-side, avoiding CORS issues

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_PFwsAu5b_8tUAUboX3f5iaA6GZUPHLGrv');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, html, text } = req.body;

    if (!email || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your NZ Business Investor Visa Assessment Results',
      html: html,
      text: text,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return res.status(500).json({ error: result.error });
    }

    return res.status(200).json({ success: true, id: result.data.id });
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ error: error.message });
  }
}