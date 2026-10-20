export const localeCodes = ['en', 'es', 'es_419', 'pt_BR', 'pt_PT', 'fr', 'de', 'it', 'pl', 'nl', 'ru', 'zh_CN', 'zh_TW', 'zh_HK'];

// Chrome only has zh_CN / zh_TW catalogs. Hong Kong copy is an in-app variant.
export const chromeLocale = locale => locale === 'zh_HK' ? 'zh_TW' : locale;
export const messagesPath = locale => locale === 'zh_HK' ? 'translations/zh_HK.json' : `_locales/${locale}/messages.json`;

export function resolveLocale(language = 'en') {
  const normalized = language.replaceAll('_', '-').toLowerCase();
  const exact = localeCodes.find(code => code.replaceAll('_', '-').toLowerCase() === normalized);
  if (exact) return exact;
  const [base, region] = normalized.split('-');
  if (base === 'zh' || base === 'yue') {
    const parts = normalized.split('-');
    // An explicit script takes precedence over the region (e.g. zh-Hans-HK).
    if (parts.includes('hans')) return 'zh_CN';
    if (base === 'yue' || parts.includes('hk') || parts.includes('mo')) return 'zh_HK';
    if (parts.includes('hant') || parts.includes('tw')) return 'zh_TW';
    return 'zh_CN';
  }
  if (base === 'es' && ['ar','bo','cl','co','cr','cu','do','ec','gt','hn','mx','ni','pa','pe','pr','py','sv','us','uy','ve'].includes(region)) return 'es_419';
  if (base === 'pt') return 'pt_PT';
  return localeCodes.includes(base) ? base : 'en';
}

/** Keep the UI language authoritative; refine Chrome's shared Traditional locale. */
export function resolveUiLocale(uiLanguage = 'en', preferredLanguage = uiLanguage) {
  const locale = resolveLocale(uiLanguage);
  if (locale === 'zh_TW' && resolveLocale(preferredLanguage) === 'zh_HK') return 'zh_HK';
  return locale;
}
