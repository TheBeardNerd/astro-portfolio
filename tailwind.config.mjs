/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        bp: {
          bg: '#0b0e11',
          card: '#111518',
          border: '#1E2730',
          amber: '#C9901A',
          'amber-light': '#E5A82A',
          steel: '#6B9FC8',
          text: '#F2EDE6',
        },
      },
      animation: {
        'slide-delay-1': 'slidein 0.3s ease-in-out 1 .08s both',
        'slide-delay-2': 'slidein 0.3s ease-in-out 1 .16s both',
        'slide-delay-3': 'slidein 0.3s ease-in-out 1 .24s both',
        'slide-delay-4': 'slidein 0.3s ease-in-out 1 .32s both',
        'slide-delay-5': 'slidein 0.3s ease-in-out 1 .40s both',
        slideout: 'slideout 0.3s ease-in-out 1 both',
      },
      keyframes: {
        slidein: {
          from: { translate: '-100%' },
          to: { translate: '0' },
        },
        slideout: {
          from: { translate: '0' },
          to: { translate: '-100%' },
        },
      },
    },
  },
  plugins: [],
}
