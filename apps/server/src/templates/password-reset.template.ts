export default function passwordResetHtml({
  resetLink,
  title,
  subtitle,
  description,
}: {
  resetLink: string;
  title: string;
  subtitle: string;
  description: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    html, body { margin: 0; padding: 0; }
    body {
      background-color: #f6f8fb;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
      color: #0f172a;
    }
    .wrapper { width: 100%; background: #f6f8fb; padding: 24px 0; }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
    }
    .brand-bar { background: #0ea5e9; height: 4px; }
    .header { padding: 24px; text-align: center; }
    .title { margin: 0; font-size: 22px; line-height: 28px; font-weight: 700; }
    .subtitle { margin: 8px 0 0; font-size: 14px; color: #334155; }
    .content { padding: 0 24px 24px; }
    .lead { font-size: 15px; line-height: 22px; color: #334155; margin: 0 0 16px; }
    .cta {
      display: inline-block;
      background: #0ea5e9;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 8px;
    }
    .muted { color: #64748b; font-size: 12px; }
    .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
    @media (prefers-color-scheme: dark) {
      body { background: #0b1220; color: #e2e8f0; }
      .wrapper { background: #0b1220; }
      .container { background: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
      .subtitle, .lead { color: #cbd5e1; }
      .muted { color: #94a3b8; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="brand-bar"></div>
      <div class="header">
        <h1 class="title">${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
      <div class="content">
        <p class="lead">${description}</p>
        <div>
          <a class="cta" href="${resetLink}" target="_blank" rel="noopener">Reset your password</a>
        </div>
        <p class="muted">If you did not request a password reset, ignore this email.</p>
      </div>
      <div class="footer">
        <div>Sent by ${process.env.CLIENT_HOST}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
