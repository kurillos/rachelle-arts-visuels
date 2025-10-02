<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function create()
    {
        return Inertia::render('Contact', [
            'auth' => auth()->user(),
            'flash' => session()->all(),
        ]);
    }

    /**
     * Gère la soumission du formulaire de contact et l'envoi de mail
     * 
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function send(Request $request)
    {
        // Valider les données entrantes
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

            Mail::to('rachelle.artsvisuels@gmail.com')->send(new ContactMail($validated));

            // Retourner une réponse JSON de succès
            return back()->with('success', 'Votre message a été envoyé avec succès.');
        }
    }