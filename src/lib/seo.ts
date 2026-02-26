import {
  DEFAULT_PAGE_DESCRIPTION,
  DEFAULT_PAGE_TITLE,
  HEADSHOT_URL,
  PERSON_JSON_LD,
  SITE_NAME,
  SITE_URL,
} from '../config/site'

interface BuildSeoMetadataOptions {
  title?: string
  description?: string
}

export function buildSeoMetadata(options: BuildSeoMetadataOptions = {}) {
  const title = options.title ?? DEFAULT_PAGE_TITLE
  const description = options.description ?? DEFAULT_PAGE_DESCRIPTION

  return {
    title,
    description,
    fullTitle: `${SITE_NAME} | ${title}`,
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    imageUrl: HEADSHOT_URL,
  }
}

export function getPersonJsonLd() {
  return PERSON_JSON_LD
}
