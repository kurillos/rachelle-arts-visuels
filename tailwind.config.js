import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#AA11DD', // violet
                secondary: '#13D4F5', // cyan
            },
            fontFamily: {
                charm: ['Charm', 'sans-serif'],
                cursive: ['Charmonman', 'cursive'],
            },
        },
    },
    plugins: [],
};