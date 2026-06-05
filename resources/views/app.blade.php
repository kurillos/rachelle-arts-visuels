<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8"> 
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>Rachelle Conception Visuelle et Photographie</title>

        {{-- Preconnect fonts --}}
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>

        {{-- Preload image LCP (première image du carousel) --}}
        @if(!empty($page['props']['carousels'][0]['image_url']))
        <link rel="preload" as="image" href="{{ $page['props']['carousels'][0]['image_url'] }}" fetchpriority="high">
        @endif

        {{-- Fonts avec display=swap pour éviter le blocage --}}
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" media="print" onload="this.media='all'">

        {{-- Bootstrap Icons --}}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" media="print" onload="this.media='all'">

        @routes
        @viteReactRefresh
        @vite(['resources/sass/app.scss', 'resources/js/app.tsx'])
        @inertiaHead
        {{-- Analytics Umami (sans cookie) --}}
        <script defer src="https://cloud.umami.is/script.js" data-website-id="6ceef766-4fe4-44d7-878c-0d76a6b00e16"></script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>

