<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class StatsController extends Controller
{
    private string $apiKey;
    private string $websiteId;
    private string $baseUrl = 'https://api.umami.is/v1';

    public function __construct()
    {
        $this->apiKey    = config('services.umami.api_key');
        $this->websiteId = config('services.umami.website_id');
    }

    private function headers(): array
    {
        return [
            'x-umami-api-key' => $this->apiKey,
            'Accept'          => 'application/json',
        ];
    }

    public function summary()
    {

        \Log::info('Umami key: ' . $this->apiKey);
        \Log::info('Umami website: ' . $this->websiteId);
        $end   = now()->timestamp * 1000;
        $start = now()->subDays(30)->timestamp * 1000;

        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/websites/{$this->websiteId}/stats", [
                'startAt' => $start,
                'endAt'   => $end,
            ]);

        return response()->json($response->json());
    }

    public function pageviews()
    {
        $end   = now()->timestamp * 1000;
        $start = now()->subDays(30)->timestamp * 1000;

        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/websites/{$this->websiteId}/pageviews", [
                'startAt' => $start,
                'endAt'   => $end,
                'unit'    => 'day',
                'timezone' => 'Europe/Paris',
            ]);

        return response()->json($response->json());
    }

    public function pages()
    {
        $end   = now()->timestamp * 1000;
        $start = now()->subDays(30)->timestamp * 1000;

        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/websites/{$this->websiteId}/metrics", [
                'startAt' => $start,
                'endAt'   => $end,
                'type'    => 'url',
                'limit'   => 10,
            ]);

        return response()->json($response->json());
    }

    public function devices()
    {
        $end   = now()->timestamp * 1000;
        $start = now()->subDays(30)->timestamp * 1000;

        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/websites/{$this->websiteId}/metrics", [
                'startAt' => $start,
                'endAt'   => $end,
                'type'    => 'device',
            ]);

        return response()->json($response->json());
    }

    public function countries()
    {
        $end   = now()->timestamp * 1000;
        $start = now()->subDays(30)->timestamp * 1000;

        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/websites/{$this->websiteId}/metrics", [
                'startAt' => $start,
                'endAt'   => $end,
                'type'    => 'country',
                'limit'   => 10,
            ]);

        return response()->json($response->json());
    }
}
