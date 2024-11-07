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
    <div className="text-center notranslate">

      <label htmlFor="language-select" className="sr-only">Select Language</label>

      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => switchLanguage(e.target.value)}
        className="text-center text-gray-700 bg-white border border-gray-300 rounded-md p-2"
      >
        {/* First option shows default language when currentLanguage is 'auto' */}
        <option value="auto" disabled>
          {currentLanguage === 'auto' || !currentLanguage
            ? languageConfig.languages.find(ld => ld.code === languageConfig.defaultLanguage)?.title || 'Select a language'
            : 'Select Language'
          }
        </option>

        {/* Render all available language options */}
        {languageConfig.languages.map((ld) => (
          <option
            key={`l_s_${ld.code}`}
            value={ld.code}
            // Here we add a condition to handle default language selection when 'auto' is used
          >
            {ld.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export { LanguageSwitcher, COOKIE_NAME };


// 'use client';
// import { useEffect, useState } from 'react';
// import { parseCookies, setCookie } from 'nookies';
// import { GoogleTranslationConfig } from '@/types/globals';


// // The following cookie name is important because it's Google-predefined for the translation engine purpose
// const COOKIE_NAME = 'googtrans';

// const LanguageSwitcher = () => {

//     const [currentLanguage, setCurrentLanguage] = useState<string>();
//     const [languageConfig, setLanguageConfig] = useState<GoogleTranslationConfig | null>(null);

//     // Initialize translation engine
//     useEffect(() => {
//         // 1. Read the cookie
//         const cookies = parseCookies();
//         const existingLanguageCookieValue = cookies[COOKIE_NAME];

//         let languageValue;

//         if (existingLanguageCookieValue) {
//             // 2. If the cookie is defined, extract a language nickname from there.
//             const sp = existingLanguageCookieValue.split('/');
//             if (sp.length > 2) {
//                 languageValue = sp[2];
//             }
//         }

//         // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still not decided about languageValue - use default one
//         if (window.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
//             languageValue = window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
//         }

//         if (languageValue) {
//             // 4. Set the current language if we have a related decision.
//             setCurrentLanguage(languageValue);
//         }

//         // 5. Set the language config.
//         if (window.__GOOGLE_TRANSLATION_CONFIG__) {
//             setLanguageConfig(window.__GOOGLE_TRANSLATION_CONFIG__);
//         }
//     }, []);

//     // Don't display anything if current language information is unavailable.
//     if (!currentLanguage || !languageConfig) {
//         return null;
//     }

//     // The following function switches the current language
//     const switchLanguage = (lang: string) => () => {
//         // We just need to set the related cookie and reload the page
//         // "/auto/" prefix is Google's definition as far as a cookie name
//         setCookie(null, COOKIE_NAME, '/auto/' + lang);
//         window.location.reload();
//     };

//     return (
//         <div className="text-center notranslate">
//             {languageConfig.languages.map((ld, i: number) => (
//                 <>
//                     {currentLanguage === ld.code ||
//                     (currentLanguage === 'auto' && languageConfig.defaultLanguage === ld.code) ? (
//                         <span key={`l_s_${ld}`} className="mx-3 text-orange-300">
//                             {ld.title}
//                         </span>
//                     ) : (
//                         <a
//                             key={`l_s_${ld}`}
//                             onClick={switchLanguage(ld.code)}
//                             className="mx-3 text-blue-300 cursor-pointer hover:underline"
//                         >
//                             {ld.title}
//                         </a>
//                     )}
//                 </>
//             ))}
//         </div>
//     );
// };

// export { LanguageSwitcher, COOKIE_NAME };
