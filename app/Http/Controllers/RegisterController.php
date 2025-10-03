<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Affiche le formulaire d'inscription
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Auth/Register', [
            'auth' => auth()->user(),
            'flash' => session()->all(),
        ]);
    }

    /**
     * Gère la soumission du formulaire d'inscription et crée un nouvel utilisateur
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        // Valider les données entrantes
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ],
        // Messages d'erreur personnalisés
        [
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => "L'adresse e-mail est obligatoire.",
            'email.email' => "L'adresse e-mail doit être valide.",
            'email.unique' => "Cette adresse e-mail est déjà utilisée.",
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        // Créer un nouvel utilisateur
        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Rediriger vers la page de connexion avec un message de succès
        return redirect()->route('login')->with('success', "Inscription réussie ! Vous pouvez maintenant vous connecter.");
    }
}