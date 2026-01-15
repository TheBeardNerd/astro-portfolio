/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Overpass', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"Overpass Mono"', 'monospace'],
        display: ['Palanquin Dark', 'sans-serif'],
      },
      animation: {
        'slide-delay-1': 'slidein 0.3s ease-in-out 1 .2s both',
        'slide-delay-2': 'slidein 0.3s ease-in-out 1 .4s both',
        'slide-delay-3': 'slidein 0.3s ease-in-out 1 .6s both',
        'slide-delay-4': 'slidein 0.3s ease-in-out 1 .8s both',
        'slide-delay-5': 'slidein 0.3s ease-in-out 1 1s both',
        slideout: 'slideout 0.3s ease-in-out 1 1s both',
      },
      keyframes: {
        slidein: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideout: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
