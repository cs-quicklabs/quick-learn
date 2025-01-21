export interface EmailPreviewData {
  subject: string;
  to: string;
  cc?: string;
  bcc?: string;
  html: string;
}

export function generatePreviewHTML(data: EmailPreviewData): string {
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Preview - ${data.subject}</title>
          <meta charset="utf-8">
          <style>
            .email-info {
              background: #f5f5f5;
              padding: 15px;
              margin-bottom: 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="email-info">
            <p><strong>To:</strong> ${data.to}</p>
            ${data.cc ? `<p><strong>CC:</strong> ${data.cc}</p>` : ''}
            ${data.bcc ? `<p><strong>BCC:</strong> ${data.bcc}</p>` : ''}
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          <div class="email-content">
            ${data.html}
          </div>
        </body>
      </html>
    `;
}
