<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h1 {
            font-size: 24px;
            color: #555;
        }
        p {
            margin-bottom: 10px;
        }
        strong {
            color: #000;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Nouveau message depuis votre site web</h1>
        <p>Vous avez reçu une nouvelle demande de contact :</p>
        <ul>
            <li><strong>Nom :</strong> {{ $formData['name'] }}</li>
            <li><strong>Email :</strong> {{ $formData['email'] }}</li>
            <li><strong>Téléphone :</strong> {{ $formData['phone'] }}</li>
        </ul>
        <h2>Message :</h2>
        <p>
            {{ nl2br(e($formData['message'])) }}
        </p>
        <div class="footer">
            <p>Cet e-mail a été envoyé depuis le formulaire de contact de votre site rachelle-arts-visuels.fr.</p>
        </div>
    </div>
</body>
</html>
