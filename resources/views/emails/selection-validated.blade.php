<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouvelle sélection validée</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #AA11DD, #13D4F5); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .body { padding: 30px; color: #333; }
        .body p { line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        table td { padding: 12px 15px; border: 1px solid #e0e0e0; }
        table tr:nth-child(even) { background-color: #f9f9f9; }
        table td:first-child { font-weight: bold; color: #AA11DD; width: 40%; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #AA11DD, #9333ea); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: bold; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #888; font-size: 13px; border-top: 1px solid #eee; }
        .badge { display: inline-block; background: rgba(170,17,221,0.1); color: #AA11DD; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ Nouvelle sélection validée !</h1>
        </div>
        <div class="body">
            <p>Bonjour Rachelle,</p>
            <p>
                Bonne nouvelle ! <strong>{{ $client }}</strong> vient de valider sa sélection de photos
                pour la galerie <strong>« {{ $title }} »</strong>.
            </p>

            <table>
                <tr>
                    <td>Galerie</td>
                    <td>{{ $title }}</td>
                </tr>
                <tr>
                    <td>Client</td>
                    <td>{{ $client }}</td>
                </tr>
                <tr>
                    <td>Photos sélectionnées</td>
                    <td><span class="badge">{{ $count }} photo(s)</span></td>
                </tr>
            </table>

            <p>Vous pouvez consulter la sélection complète (avec les notes de retouche) directement depuis votre espace admin.</p>

            <div class="btn-container">
                <a href="{{ url('/admin/galleries') }}" class="btn">
                    Voir la sélection dans l'admin →
                </a>
            </div>

            <p>Bonne continuation !</p>
        </div>
        <div class="footer">
            <strong>Rachelle Arts Visuels</strong><br>
            Ce message a été envoyé automatiquement depuis votre site.
        </div>
    </div>
</body>
</html>
