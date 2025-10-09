<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Client; // Import nécessaire pour configurer le client HTTP

class SocialiteController extends Controller
{
    /**
     * Redirige l'utilisateur vers le fournisseur d'authentification externe
     */
    public function redirect(string $provider)
    {
        // Démmrre la redirection
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Gère le callback du fournisseur
     */
    public function callback(string $provider)
    {
        try {
            // 1. Initialiser le driver
            $socialiteDriver = Socialite::driver($provider);
            
            // 2. CORRECTION CRITIQUE SSL : Si nous sommes en local et que c'est Google,
            // nous forçons Guzzle à ne pas vérifier le certificat (résout cURL error 60).
            if (app()->isLocal() && $provider === 'google') {
                $socialiteDriver->setHttpClient(
                    new Client([
                        'verify' => false, // Désactive la vérification SSL
                    ])
                );
            }
            
            // 3. Récupérer les infos de l'utilisateur depuis le fournisseur
            // La méthode user() utilise maintenant le client Guzzle configuré ci-dessus.
            $socialiteUser = $socialiteDriver->user();

        } catch (\Exception $e) {
            // Loguer l'erreur pour le debug sans bloquer l'application
            \Log::error("Socialite Callback failed: " . $e->getMessage());

            // Redirection vers la page d'inscription en cas d'échec
            return redirect()->route('signup')->with('error', "Échec de l'authentification via {$provider}. Veuillez réessayer.");
        }

        // Vérification et connexion/création de l'utilisateur
        $user = User::where('email', $socialiteUser->getEmail())->first();

        if ($user) {
            // L'utilisateur existe, le connecter
            Auth::login($user);
            return redirect()->intended('dashboard');
        } else {
            // L'utilisateur n'existe pas, le créer
            $newUser = User::create([
                'name' => $socialiteUser->getName(),
                'email' => $socialiteUser->getEmail(),
                'password' => bcrypt(bin2hex(random_bytes(16))),
            ]);

            Auth::login($newUser);
            return redirect()->intended('dashboard');
        }
    }
}
