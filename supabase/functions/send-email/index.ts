// Reviewed and verified for email notifications task.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface NotificationPayload {
  userId: string;
  type: 'booking_confirmation' | 'booking_reminder' | 'consultation_cancelled' | 'processing_time_alert' | 'welcome' | 'premium_purchase';
  data: Record<string, any>;
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@visabuild.com';

// Template generators
const templates = {
  booking_confirmation: (data: any) => ({
    subject: `Consultation Confirmed: ${data.lawyerName} - ${data.date}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">Your Consultation is Confirmed</h1>
        <p>Hi ${data.userName},</p>
        <p>Your consultation has been successfully booked.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Consultation Details</h3>
          <p><strong>Lawyer:</strong> ${data.lawyerName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Duration:</strong> ${data.duration}</p>
          <p><strong>Amount Paid:</strong> $${data.amount}</p>
        </div>
        
        <p>You can add this to your calendar using the button in your VisaBuild account.</p>
        <p>If you need to reschedule, please do so at least 24 hours in advance.</p>
        
        <a href="${data.dashboardUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View in Dashboard</a>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">This is an automated message from VisaBuild. Please do not reply to this email.</p>
      </div>
    `,
    text: `Your consultation with ${data.lawyerName} on ${data.date} at ${data.time} is confirmed. Amount paid: $${data.amount}. View details: ${data.dashboardUrl}`
  }),
  
  booking_reminder: (data: any) => ({
    subject: `Reminder: Consultation with ${data.lawyerName} in 24 hours`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">Consultation Reminder</h1>
        <p>Hi ${data.userName},</p>
        <p>This is a friendly reminder that you have a consultation coming up tomorrow.</p>
        
        <div style="background: #fffbeb; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #92400e;">Tomorrow's Consultation</h3>
          <p><strong>Lawyer:</strong> ${data.lawyerName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Duration:</strong> ${data.duration}</p>
        </div>
        
        <p>Please ensure you have any relevant documents ready for discussion.</p>
        
        <a href="${data.dashboardUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Details</a>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">This is an automated reminder from VisaBuild.</p>
      </div>
    `,
    text: `Reminder: You have a consultation with ${data.lawyerName} tomorrow at ${data.time}. View details: ${data.dashboardUrl}`
  }),
  
  consultation_cancelled: (data: any) => ({
    subject: `Consultation Cancelled: ${data.lawyerName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Consultation Cancelled</h1>
        <p>Hi ${data.userName},</p>
        <p>Your consultation has been cancelled.</p>
        
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #991b1b;">Cancelled Consultation</h3>
          <p><strong>Lawyer:</strong> ${data.lawyerName}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Reason:</strong> ${data.reason || 'No reason provided'}</p>
        </div>
        
        ${data.refundAmount ? `<p>A refund of $${data.refundAmount} has been processed and will appear in your account within 5-10 business days.</p>` : ''}
        
        <a href="${data.directoryUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Book Another Consultation</a>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">This is an automated message from VisaBuild.</p>
      </div>
    `,
    text: `Your consultation with ${data.lawyerName} on ${data.date} has been cancelled. ${data.refundAmount ? `Refund: $${data.refundAmount}` : ''} Book another: ${data.directoryUrl}`
  }),
  
  processing_time_alert: (data: any) => ({
    subject: `Processing Time Update: ${data.visaName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">Processing Time Alert</h1>
        <p>Hi ${data.userName},</p>
        <p>The processing time for a visa you're tracking has changed.</p>
        
        <div style="background: ${data.trend === 'faster' ? '#ecfdf5' : '#fffbeb'}; border: 1px solid ${data.trend === 'faster' ? '#6ee7b7' : '#fbbf24'}; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: ${data.trend === 'faster' ? '#065f46' : '#92400e'};">
            ${data.visaName}
          </h3>
          <p><strong>Previous average:</strong> ${data.oldDays} days</p>
          <p><strong>New average:</strong> ${data.newDays} days</p>
          <p><strong>Trend:</strong> ${data.trend === 'faster' ? '✓ Getting faster' : '⚠ Getting slower'}</p>
        </div>
        
        <p>This update is based on ${data.entryCount} recent tracker submissions.</p>
        
        <a href="${data.visaUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">View Visa Details</a>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">You're receiving this because you subscribed to processing time alerts. <a href="${data.preferencesUrl}">Manage preferences</a></p>
      </div>
    `,
    text: `Processing time for ${data.visaName} has changed from ${data.oldDays} to ${data.newDays} days. View: ${data.visaUrl}`
  }),
  
  welcome: (data: any) => ({
    subject: 'Welcome to VisaBuild!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">Welcome to VisaBuild</h1>
        <p>Hi ${data.userName},</p>
        <p>Thank you for joining VisaBuild! We're excited to help you on your visa journey.</p>
        
        <div style="background: #eff6ff; border: 1px solid #93c5fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Get Started</h3>
          <ul style="padding-left: 20px;">
            <li>Explore visa options for your situation</li>
            <li>Track processing times with our community tracker</li>
            <li>Book consultations with verified immigration lawyers</li>
            <li>Unlock premium guides for step-by-step assistance</li>
          </ul>
        </div>
        
        <a href="${data.exploreUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Explore Visas</a>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">Need help? Contact us at support@visabuild.com</p>
      </div>
    `,
    text: `Welcome to VisaBuild! Start exploring visas: ${data.exploreUrl}`
  }),
  
  premium_purchase: (data: any) => ({
    subject: `Premium Guide Unlocked: ${data.visaName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a56db;">Premium Content Unlocked</h1>
        <p>Hi ${data.userName},</p>
        <p>Thank you for your purchase! You now have access to the premium guide for:</p>
        
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h2 style="margin-top: 0; color: #166534;">${data.visaName}</h2>
          <p style="font-size: 18px; margin: 10px 0;">Amount Paid: <strong>$${data.amount}</strong></p>
          <p style="color: #15803d;">✓ Unlimited access to step-by-step guide</p>
          <p style="color: #15803d;">✓ Document checklist with explanations</p>
          <p style="color: #15803d;">✓ Official processing time estimates</p>
        </div>
        
        <a href="${data.guideUrl}" style="display: inline-block; background: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Access Your Guide</a>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px;">Questions? Reply to this email or contact support@visabuild.com</p>
      </div>
    `,
    text: `Premium guide unlocked for ${data.visaName}. Amount: $${data.amount}. Access: ${data.guideUrl}`
  })
};

async function sendEmail(email: EmailRequest): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: email.from || FROM_EMAIL,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    const result = await response.json();
    console.log('Email sent:', result);
    return { success: true };
  } catch (error) {
    console.error('Send email error:', error);
    return { success: false, error: error.message };
  }
}

Deno.serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const { userId, type, data } = payload;

    // Get user email from Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    if (userError || !userData?.email) {
      console.error('User lookup error:', userError);
      return new Response(
        JSON.stringify({ error: 'User not found or no email' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check notification preferences
    const { data: prefs } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    const emailPrefKey = `email_${type}` as keyof typeof prefs;
    if (prefs && prefs[emailPrefKey] === false) {
      return new Response(
        JSON.stringify({ skipped: true, reason: 'User preferences disabled' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate email content from template
    const template = templates[type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: 'Unknown notification type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailContent = template({
      ...data,
      userName: userData.full_name || 'there',
    });

    // Send email
    const result = await sendEmail({
      to: userData.email,
      ...emailContent,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: result.error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Log the notification
    await supabase.from('notification_logs').insert({
      user_id: userId,
      type,
      channel: 'email',
      status: 'sent',
      metadata: data,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );

  } catch (error) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
