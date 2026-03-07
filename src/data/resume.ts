export interface ResumeEntry {
  role?: string
  roleClass?: string
  date?: string
  dateClass?: string
  description?: string
  descriptionClass?: string
  bullets?: string[]
  link?: {
    href: string
    label: string
  }
}

export interface ResumeItemData {
  organization: string
  logo?: {
    src: string
    alt: string
    class?: string
    /** Dark-background variant. When provided, renders directly without the white container fallback. */
    darkSrc?: string
  }
  divideEntries?: boolean
  entries: ResumeEntry[]
}

export interface ResumeSectionData {
  title: string
  bodyClass?: string
  items: ResumeItemData[]
}

export const RESUME_SECTIONS: ResumeSectionData[] = [
  {
    title: 'Experience',
    items: [
      {
        organization: 'Memphis Grizzlies',
        logo: {
          src: '/images/logos/MG_PrimaryIcon_RGB_FullColor.png',
          alt: 'Memphis Grizzlies Logo',
          class: 'object-contain w-32 h-16 mb-6 sm:mb-0 sm:mr-8',
        },
        entries: [
          {
            role: 'Software Engineer',
            date: 'April 2022 — Present',
            bullets: [
              'ensuring continuity and stability across a growing volume of ticketing, marketing, community, and live entertainment initiatives.',
              'Supported marketing campaigns across landing pages, data extensions, automations, forms, QR codes, and advertising placements, while keeping the underlying technical foundation reliable and scalable as demand and complexity have increased.',
              'Partnered closely with Marketing, Partnerships, Community, and Live Entertainment to translate evolving business needs into practical technical solutions, with consistent attention to data accuracy, accessibility, compliance, and delivery timelines.',
              'Continuing education in current and future technologies that could benefit the company.',
              'HTML, CSS, JavaScript, React, React Native, Next.js, SQL (Various Flavors), Salesforce Marketing Cloud, AWS Services',
            ],
          },
        ],
      },
      {
        organization: 'Elite Deals',
        logo: {
          src: '/images/logos/ED-circle-logo.png',
          alt: 'Elite Deals Logo',
          class: 'object-contain w-32 h-16 mb-6 sm:mb-0 sm:mr-8',
        },
        entries: [
          {
            role: 'Front End Developer',
            date: 'July 2019 — April 2022',
            bullets: [
              "Build and maintain the company's visual front-end elements and web assets according to internal design specifications and project requirements.",
              'Continuing education in current and future technologies that could benefit the company.',
              'HTML, CSS, JavaScript, Vue.js, jQuery, Bootstrap, PHP, Laravel',
            ],
          },
        ],
      },
      {
        organization: 'Estes Express Lines',
        logo: {
          src: '/images/logos/estes-yellow-logo.png',
          alt: 'Estes Express Lines Logo',
          class: 'object-contain w-32 h-16 mb-2 mr-8 sm:mb-0',
        },
        entries: [
          {
            role: 'Hostler',
            date: 'July 2014 — July 2019',
            bullets: [
              'Safely and efficiently plan work and equipment to fit the needs of available freight.',
              'Proficient with backing, hooking and unhooking trailers of various lengths utilizing a yard truck.',
            ],
          },
        ],
      },
      {
        organization: 'AT&T Uverse',
        logo: {
          src: '/images/logos/att-uverse-logo.png',
          alt: 'AT&T Uverse Logo',
          class: 'object-contain w-32 h-16 mb-4 mr-8 sm:mb-0',
        },
        entries: [
          {
            role: 'Wire Technician',
            date: 'December 2010 — February 2013',
            bullets: [
              'Verified, established, and maintained IP based internet, television, and phone services.',
              'Guided customers in the operation of applicable user interfaces.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Education',
    items: [
      {
        organization: 'Tech901',
        logo: {
          src: '/images/logos/tech901-power-logo.png',
          alt: 'Tech901 Logo',
          class: 'object-contain w-32 h-16 mb-2 mr-8',
        },
        divideEntries: true,
        entries: [
          {
            role: 'Code 1.0',
            date: 'September 2018 — December 2018',
          },
          {
            role: 'IT Project',
            date: 'October 2019 — December 2019',
          },
        ],
      },
    ],
  },
  {
    title: 'Certifications',
    items: [
      {
        organization: 'CompTIA',
        logo: {
          src: '/images/logos/comptia-project-plus-logo.svg',
          alt: 'CompTIA Project+ Logo',
          class: 'object-contain w-32 h-32 mr-8',
        },
        entries: [
          {
            role: 'Project +',
            date: 'December 14, 2019',
          },
        ],
      },
    ],
  },
  {
    title: 'Projects',
    items: [
      {
        organization: 'Faith Presbyterian Germantown',
        logo: {
          src: '/images/logos/faith-pres-gtown-logo.svg',
          alt: 'Faith Presbyterian Germantown Logo',
          class: 'object-contain w-32 h-24 mb-3 mr-8',
        },
        entries: [
          {
            role: 'Website Implementation',
            roleClass: 'mb-2',
            description:
              'Design and implementation of a new, modern website using web-based design tools from Squarespace.com.',
            descriptionClass: 'mb-2',
            link: {
              href: 'http://faithgermantown.com',
              label: 'http://faithgermantown.com',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Community Service',
    items: [
      {
        organization: 'Faith Presbyterian Germantown',
        logo: {
          src: '/images/logos/faith-pres-gtown-logo.svg',
          alt: 'Faith Presbyterian Germantown Logo',
          class: 'object-contain w-32 h-24 mb-3 mr-8',
        },
        divideEntries: true,
        entries: [
          {
            role: 'Youth Ministry Leader',
            date: 'September 2017 — March 2020',
            dateClass: 'mb-2',
            bullets: [
              'Assist the Youth and Student Ministries Director with planning, and executing events on a weekly, monthly, and yearly basis.',
              'Mentoring youth and college students by helping them through life with a faith-focused mission.',
            ],
          },
          {
            role: 'Audio / Video Technician',
            date: 'September 2017 — March 2020',
            dateClass: 'mb-2',
            bullets: [
              'Manage audio and video equipment, such as a mixing board, projector, presentation software, instrument interfaces, and microphones.',
              'Responsible for sound checks, equipment placement, volume, and quality of sound.',
            ],
          },
        ],
      },
    ],
  },
]
