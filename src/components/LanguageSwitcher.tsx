'use client';
import { useEffect, useState } from 'react';
import { parseCookies, setCookie } from 'nookies';
import { GoogleTranslationConfig } from '@/types/globals';

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = 'googtrans';

const LanguageSwitcher = () => {

  const [currentLanguage, setCurrentLanguage] = useState<string>();
  const [languageConfig, setLanguageConfig] = useState<GoogleTranslationConfig | null>(null);

  // Initialize translation engine
  useEffect(() => {
    // 1. Read the cookie
    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue;

    if (existingLanguageCookieValue) {
      // 2. If the cookie is defined, extract a language nickname from there.
      const sp = existingLanguageCookieValue.split('/');
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }

    // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still not decided about languageValue - use default one
    if (window.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
    }

    if (languageValue) {
      // 4. Set the current language if we have a related decision.
      setCurrentLanguage(languageValue);
    }

    // 5. Set the language config.
    if (window.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(window.__GOOGLE_TRANSLATION_CONFIG__);
    }
  }, []);

  // Don't display anything if current language information is unavailable.
  if (!currentLanguage || !languageConfig) {
    return null;
  }

  // The following function switches the current language
  const switchLanguage = (lang: string) => {
    // We just need to set the related cookie and reload the page
    // "/auto/" prefix is Google's definition as far as a cookie name
    setCookie(null, COOKIE_NAME, '/auto/' + lang);
    window.location.reload();
  };

  return (
    <div>
      <select
        value={currentLanguage}
        onChange={(e) => switchLanguage(e.target.value)}
        className="custom-select"
      >
        {/* Render all available language options */}
        {languageConfig.languages.map((ld) => (
          <option
            key={`l_s_${ld.code}`}
            value={ld.code}
          >
            {ld.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };
