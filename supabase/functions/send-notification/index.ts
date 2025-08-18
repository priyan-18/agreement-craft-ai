import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to: string;
  type: 'invitation' | 'signature_request' | 'completed';
  agreementTitle: string;
  senderName: string;
  agreementId: string;
  inviteLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, agreementTitle, senderName, agreementId, inviteLink }: NotificationRequest = await req.json();

    const getEmailContent = (type: string) => {
      switch (type) {
        case 'invitation':
          return {
            subject: `Agreement Invitation: ${agreementTitle}`,
            html: `
              <h2>You've been invited to review and sign an agreement</h2>
              <p><strong>${senderName}</strong> has shared the agreement "<strong>${agreementTitle}</strong>" with you for review and signature.</p>
              
              <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #007bff;">Next Steps:</h3>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>Click the link below to review the agreement</li>
                  <li>Carefully read through all terms and conditions</li>
                  <li>Provide your digital consent to proceed</li>
                </ol>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Review Agreement
                </a>
              </div>

              <p style="color: #6c757d; font-size: 14px;">
                This invitation is secure and can only be accessed by the intended recipient. 
                If you believe you received this in error, please contact the sender directly.
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 12px;">
                This is an automated message from the Agreement Generator platform. 
                Agreement ID: ${agreementId}
              </p>
            `
          };
        case 'signature_request':
          return {
            subject: `Signature Required: ${agreementTitle}`,
            html: `
              <h2>Your signature is required</h2>
              <p>The agreement "<strong>${agreementTitle}</strong>" is ready for your final signature.</p>
              <p>All parties have reviewed the document, and we're now collecting final signatures.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Sign Agreement
                </a>
              </div>
              
              <p style="color: #6c757d; font-size: 14px;">
                Please complete your signature as soon as possible to finalize this agreement.
              </p>
            `
          };
        case 'completed':
          return {
            subject: `Agreement Completed: ${agreementTitle}`,
            html: `
              <h2>🎉 Agreement Successfully Completed</h2>
              <p>Great news! The agreement "<strong>${agreementTitle}</strong>" has been signed by all parties.</p>
              
              <div style="margin: 30px 0; padding: 20px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #155724;">Agreement Status: Completed ✅</h3>
                <p style="margin: 0; color: #155724;">All parties have provided their consent and the document is now legally binding.</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteLink}" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  View Final Document
                </a>
              </div>

              <p style="color: #6c757d; font-size: 14px;">
                You can access the completed agreement and download a PDF copy from your dashboard at any time.
              </p>
            `
          };
        default:
          return {
            subject: `Agreement Notification: ${agreementTitle}`,
            html: `<p>You have a new notification regarding the agreement "${agreementTitle}".</p>`
          };
      }
    };

    const emailContent = getEmailContent(type);

    const emailResponse = await resend.emails.send({
      from: "Agreement Generator <noreply@resend.dev>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`Email sent successfully:`, emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);