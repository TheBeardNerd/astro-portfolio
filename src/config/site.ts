export const SITE_URL = 'https://traviswindsor.com'
export const SITE_NAME = 'Travis Windsor-Cummings'

export const DEFAULT_PAGE_TITLE = 'Software Engineer | Memphis Grizzlies'
export const DEFAULT_PAGE_DESCRIPTION =
  "Hello, I'm Travis — Software Engineer at the Memphis Grizzlies, Memphis-born maker, and lifelong problem-solver."

export const HEADSHOT_PATH = '/images/travis_headshot.webp'
export const HEADSHOT_URL = `${SITE_URL}${HEADSHOT_PATH}`

export const SOCIAL_LINKS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/TheBeardNerd',
    icon: 'twitter',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/traviswindsorcummings/',
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/TheBeardNerd',
    icon: 'github',
  },
  {
    label: 'CodePen',
    href: 'https://codepen.io/TravisWindsor-Cummings',
    icon: 'codepen',
  },
] as const

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  url: SITE_URL,
  givenName: 'Travis',
  familyName: 'Windsor-Cummings',
  jobTitle: 'Software Engineer',
  email: 'travis@windsor-cummings.com',
  birthDate: '1987-07-26T10:00:00.000Z',
  nationality: 'United States of America',
  knowsLanguage: 'English',
  homeLocation: {
    '@type': 'PostalAddress',
    addressLocality: 'Memphis',
    addressRegion: 'TN',
  },
  gender: 'Male',
  alumniOf: {
    '@type': 'Organization',
    name: 'Tech901',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Memphis',
      addressRegion: 'Tennessee',
      postalCode: '38104',
      streetAddress: '1350 Concourse Ave. Suite 375',
    },
  },
  sameAs: SOCIAL_LINKS.map((link) => link.href),
} as const
