/**
 * Single source of truth for site-wide identity and SEO metadata.
 *
 * Nick: the placeholder social links below are the ones shown in the footer.
 * When you have the real handles, replace the `#` values with full URLs
 * (e.g. https://www.instagram.com/your-handle). Any link still set to `#`
 * is automatically left out of the structured data / Google's "sameAs" list.
 */

export const SITE = {
  name: 'Tangata Counselling',
  legalName: 'Tangata Counselling',
  // Falls back to Astro.site in code, but kept here for convenience.
  url: 'https://tangata-counselling.co.uk',
  description:
    'BACP-accredited EMDR therapy and integrative counselling in Fishponds and central Bristol. A safe, confidential space to be heard.',
  locale: 'en_GB',
  email: 'nick@tangata-counselling.co.uk',
  telephone: '+44 7988 136267',
  // Shown in the browser tab / as the site logo in structured data.
  logo: '/favicon.svg',
  // 1200x630 image used when a page is shared on social media, unless a page
  // supplies its own. Lives in /public.
  ogImage: '/og-default.png',
  founder: {
    name: 'Nick Tuftnell',
    jobTitle: 'BACP-accredited counsellor & EMDR therapist',
    knowsAbout: ['EMDR therapy', 'Trauma and PTSD', 'Anxiety', 'Grief and bereavement', 'Integrative counselling'],
  },
  address: {
    locality: 'Bristol',
    region: 'Bristol',
    postalCode: 'BS16',
    country: 'GB',
  },
  areaServed: ['Bristol', 'Fishponds', 'Bristol city centre'],
  priceRange: '££',
};

// Order here is the order shown in the footer. Supported labels (each has an
// icon): Instagram, Facebook, LinkedIn, YouTube, TikTok, X. Add or remove rows
// to match the accounts Nick actually uses.
export const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'YouTube', href: '#' },
];

/** Real (non-placeholder) social URLs, for structured-data `sameAs`. */
export const sameAs = SOCIAL_LINKS.map((s) => s.href).filter((href) => href && href !== '#');

/** Resolve a possibly-relative path to an absolute URL string. */
export function absoluteUrl(path, base = SITE.url) {
  return new URL(path, base).href;
}

/** The organisation / local-business node. Referenced by @id elsewhere. */
export function organizationSchema(base = SITE.url) {
  const org = {
    '@type': 'ProfessionalService',
    '@id': `${base}/#practice`,
    name: SITE.name,
    description: SITE.description,
    url: base,
    email: SITE.email,
    telephone: SITE.telephone,
    image: absoluteUrl(SITE.ogImage, base),
    logo: absoluteUrl(SITE.logo, base),
    priceRange: SITE.priceRange,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    founder: { '@id': `${base}/#nick` },
    knowsAbout: SITE.founder.knowsAbout,
  };
  if (sameAs.length) org.sameAs = sameAs;
  return org;
}

/** The person node for Nick. */
export function personSchema(base = SITE.url) {
  const person = {
    '@type': 'Person',
    '@id': `${base}/#nick`,
    name: SITE.founder.name,
    jobTitle: SITE.founder.jobTitle,
    worksFor: { '@id': `${base}/#practice` },
    knowsAbout: SITE.founder.knowsAbout,
    url: base,
  };
  if (sameAs.length) person.sameAs = sameAs;
  return person;
}

/** The website node. */
export function websiteSchema(base = SITE.url) {
  return {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: SITE.name,
    description: SITE.description,
    inLanguage: 'en-GB',
    publisher: { '@id': `${base}/#practice` },
  };
}

/** Baseline nodes present on every page. */
export function baseGraph(base = SITE.url) {
  return [organizationSchema(base), personSchema(base), websiteSchema(base)];
}

/** A BreadcrumbList node from [{ name, path }] items (path relative or absolute). */
export function breadcrumbSchema(items, base = SITE.url) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, base),
    })),
  };
}
