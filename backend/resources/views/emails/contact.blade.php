<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Message de contact — GW2Nexus</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f0f0f; color: #e8e0d0; padding: 32px 16px;
        }
        .wrapper { max-width: 600px; margin: 0 auto; }

        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #141414 100%);
            border: 1px solid rgba(201,168,76,0.25);
            border-bottom: 2px solid #C9A84C;
            padding: 28px 32px; text-align: center;
        }
        .header-title { font-size: 22px; font-weight: 700; color: #C9A84C; letter-spacing: 2px; text-transform: uppercase; }
        .header-subtitle { font-size: 12px; color: rgba(232,224,208,0.4); letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; }

        .body {
            background: #141414;
            border: 1px solid rgba(201,168,76,0.1); border-top: none;
            padding: 32px;
        }

        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
        .meta-table tr { border-bottom: 1px solid rgba(201,168,76,0.06); }
        .meta-table tr:last-child { border-bottom: none; }
        .meta-label { padding: 10px 0; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(201,168,76,0.55); width: 120px; vertical-align: top; }
        .meta-value { padding: 10px 0; font-size: 14px; color: rgba(232,224,208,0.8); }
        .meta-value a { color: #C9A84C; text-decoration: none; }

        .subject-badge { display: inline-block; padding: 3px 10px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); color: #C9A84C; font-size: 11px; letter-spacing: 1px; }

        .message-block { background: rgba(0,0,0,0.3); border-left: 3px solid #C9A84C; padding: 20px 20px 20px 24px; margin-top: 8px; }
        .message-block p { font-size: 14px; line-height: 1.8; color: rgba(232,224,208,0.7); white-space: pre-wrap; }

        .footer { background: #111111; border: 1px solid rgba(201,168,76,0.08); border-top: none; padding: 18px 32px; text-align: center; }
        .footer p { font-size: 11px; color: rgba(232,224,208,0.25); letter-spacing: 1px; }
        .footer a { color: rgba(201,168,76,0.45); text-decoration: none; }

        .divider { height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent); margin: 24px 0; }
        .section-title { font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: rgba(201,168,76,0.5); margin-bottom: 12px; }
    </style>
</head>
<body>
    <div class="wrapper">

        <div class="header">
            <div class="header-title">GW2Nexus</div>
            <div class="header-subtitle">Nouveau message de contact</div>
        </div>

        <div class="body">
            <div class="section-title">Expéditeur</div>
            <table class="meta-table">
                <tr>
                    <td class="meta-label">Nom</td>
                    <td class="meta-value">{{ $senderName }}</td>
                </tr>
                <tr>
                    <td class="meta-label">Email</td>
                    <td class="meta-value">
                        <a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a>
                    </td>
                </tr>
                <tr>
                    <td class="meta-label">Sujet</td>
                    <td class="meta-value">
                        <span class="subject-badge">{{ $contactSubject }}</span>
                    </td>
                </tr>
                <tr>
                    <td class="meta-label">Reçu le</td>
                    <td class="meta-value">{{ now()->format('d/m/Y à H:i') }}</td>
                </tr>
            </table>

            <div class="divider"></div>

            <div class="section-title">Message</div>
            <div class="message-block">
                <p>{{ $messageContent }}</p>
            </div>
        </div>

        <div class="footer">
            <p>
                Email généré automatiquement par
                <a href="{{ config('app.url') }}">GW2Nexus</a>
                — Répondre à : <a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a>
            </p>
        </div>

    </div>
</body>
</html>