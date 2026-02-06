import { Resend } from 'resend';

// Lazy initialization to avoid build-time errors
let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'MedMatch <noreply@medmatch.nl>';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const resend = getResend();

  if (!resend) {
    console.warn('RESEND_API_KEY not set, skipping email');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email error:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

// Email templates

export function newRequestNotification(params: {
  agencyName: string;
  organizationName: string;
  requestTitle: string;
  functionRequired: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  requestUrl: string;
}) {
  return {
    subject: `Nieuwe aanvraag: ${params.requestTitle} - ${params.organizationName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066CC; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .details { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: 600; width: 140px; }
            .button { display: inline-block; background: #0066CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Nieuwe Aanvraag</h1>
            </div>
            <div class="content">
              <p>Beste ${params.agencyName},</p>
              <p><strong>${params.organizationName}</strong> heeft een nieuwe personeelsaanvraag geplaatst.</p>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Functie:</span>
                  <span>${params.functionRequired}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Periode:</span>
                  <span>${params.startDate} - ${params.endDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Uren per week:</span>
                  <span>${params.hoursPerWeek} uur</span>
                </div>
              </div>

              <a href="${params.requestUrl}" class="button">Bekijk Aanvraag</a>
            </div>
            <div class="footer">
              <p>Dit is een automatisch bericht van MedMatch.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function submissionReceivedNotification(params: {
  organizationName: string;
  agencyName: string;
  candidateName: string;
  requestTitle: string;
  proposedRate: string;
  submissionsUrl: string;
}) {
  return {
    subject: `Nieuwe kandidaat ingediend: ${params.candidateName} voor ${params.requestTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .details { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: 600; width: 140px; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Nieuwe Kandidaat</h1>
            </div>
            <div class="content">
              <p>Beste ${params.organizationName},</p>
              <p><strong>${params.agencyName}</strong> heeft een kandidaat ingediend voor uw aanvraag.</p>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Aanvraag:</span>
                  <span>${params.requestTitle}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Kandidaat:</span>
                  <span>${params.candidateName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Uurtarief:</span>
                  <span>${params.proposedRate}</span>
                </div>
              </div>

              <a href="${params.submissionsUrl}" class="button">Bekijk Inzendingen</a>
            </div>
            <div class="footer">
              <p>Dit is een automatisch bericht van MedMatch.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function submissionStatusNotification(params: {
  agencyName: string;
  candidateName: string;
  requestTitle: string;
  organizationName: string;
  status: 'accepted' | 'rejected';
  message?: string;
  dashboardUrl: string;
}) {
  const isAccepted = params.status === 'accepted';
  const statusText = isAccepted ? 'Geaccepteerd' : 'Afgewezen';
  const headerColor = isAccepted ? '#059669' : '#DC2626';

  return {
    subject: `Kandidaat ${statusText}: ${params.candidateName} - ${params.requestTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${headerColor}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .details { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .message { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 6px; margin: 16px 0; }
            .button { display: inline-block; background: #0066CC; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Kandidaat ${statusText}</h1>
            </div>
            <div class="content">
              <p>Beste ${params.agencyName},</p>
              <p>Uw kandidaat <strong>${params.candidateName}</strong> voor de aanvraag "${params.requestTitle}" bij ${params.organizationName} is <strong>${statusText.toLowerCase()}</strong>.</p>

              ${params.message ? `
              <div class="message">
                <strong>Bericht van ${params.organizationName}:</strong>
                <p style="margin: 8px 0 0 0;">${params.message}</p>
              </div>
              ` : ''}

              ${isAccepted ? `
              <p>De opdrachtbevestiging wordt nu aangemaakt. U ontvangt hiervan bericht.</p>
              ` : ''}

              <a href="${params.dashboardUrl}" class="button">Naar Dashboard</a>
            </div>
            <div class="footer">
              <p>Dit is een automatisch bericht van MedMatch.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function hoursSubmittedNotification(params: {
  organizationName: string;
  agencyName: string;
  candidateName: string;
  periodStart: string;
  periodEnd: string;
  totalHours: number;
  hoursUrl: string;
}) {
  return {
    subject: `Uren ter goedkeuring: ${params.candidateName} - ${params.periodStart} t/m ${params.periodEnd}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #7C3AED; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .details { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: 600; width: 140px; }
            .button { display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Uren Goedkeuren</h1>
            </div>
            <div class="content">
              <p>Beste ${params.organizationName},</p>
              <p><strong>${params.agencyName}</strong> heeft uren ingediend ter goedkeuring.</p>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Medewerker:</span>
                  <span>${params.candidateName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Periode:</span>
                  <span>${params.periodStart} - ${params.periodEnd}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Totaal uren:</span>
                  <span>${params.totalHours} uur</span>
                </div>
              </div>

              <a href="${params.hoursUrl}" class="button">Bekijk & Goedkeuren</a>
            </div>
            <div class="footer">
              <p>Dit is een automatisch bericht van MedMatch.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}

export function invoiceGeneratedNotification(params: {
  organizationName: string;
  agencyName: string;
  invoiceNumber: string;
  totalAmount: string;
  dueDate: string;
  invoiceUrl: string;
}) {
  return {
    subject: `Nieuwe factuur: ${params.invoiceNumber} - ${params.totalAmount}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0891B2; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .details { background: white; padding: 16px; border-radius: 8px; margin: 16px 0; }
            .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: 600; width: 140px; }
            .amount { font-size: 24px; font-weight: bold; color: #0891B2; }
            .button { display: inline-block; background: #0891B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Nieuwe Factuur</h1>
            </div>
            <div class="content">
              <p>Beste ${params.organizationName},</p>
              <p>Er staat een nieuwe factuur van <strong>${params.agencyName}</strong> klaar.</p>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Factuurnummer:</span>
                  <span>${params.invoiceNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Bedrag:</span>
                  <span class="amount">${params.totalAmount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Vervaldatum:</span>
                  <span>${params.dueDate}</span>
                </div>
              </div>

              <a href="${params.invoiceUrl}" class="button">Bekijk Factuur</a>
            </div>
            <div class="footer">
              <p>Dit is een automatisch bericht van MedMatch.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
