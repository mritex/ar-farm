<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>AR Green Plant</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/main.jsx'])
    </head>
    <body class="antialiased">
        <div id="root"></div>
    </body>
</html>
