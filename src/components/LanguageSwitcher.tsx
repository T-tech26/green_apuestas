'use client';
import { useEffect, useState } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { GoogleTranslationConfig } from '@/types/globals';

// The following cookie name is important because it's Google-predefined for the translation engine purpose
const COOKIE_NAME = 'googtrans';

const LanguageSwitcher = () => {

    const [currentLanguage, setCurrentLanguage] = useState<string>('');
    const [languageConfig, setLanguageConfig] = useState<GoogleTranslationConfig>();

    // Initialize translation engine
    useEffect(() => {
        // 1. Read the cookie
        const cookies = parseCookies();
        const existingLanguageCookieValue = cookies[COOKIE_NAME];

        let languageValue: string | undefined;

        if (existingLanguageCookieValue) {
            // 2. If the cookie is defined, extract a language nickname from there.
            const sp = existingLanguageCookieValue.split('/');
            if (sp.length > 2) {
                languageValue = sp[2];
            }
        }

        // 3. If __GOOGLE_TRANSLATION_CONFIG__ is defined and we still don't have a languageValue - use default one
        if (typeof global !== 'undefined' && global.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
            languageValue = global.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage;
        }

        // 4. Set the current language if we have a related decision.
        if (languageValue) {
            setCurrentLanguage(languageValue);
        }

        // 5. Set the language config if available
        if (typeof global !== 'undefined' && global.__GOOGLE_TRANSLATION_CONFIG__) {
            setLanguageConfig(global.__GOOGLE_TRANSLATION_CONFIG__);
        }
    }, []);

    // Don't display anything if current language information is unavailable.
    if (!currentLanguage || !languageConfig) {
        return null;
    }



    const deleteCookie = (cookieName: string) => {
        const cookies = parseCookies(); // Get current cookies
        if (cookies[cookieName]) { // Check if the cookie exists
            destroyCookie(null, cookieName, {
                path: '/',
                domain: '.greenapuestas.com',
                sameSite: 'none',
                secure: true, // Secure cookie for HTTPS
            });
        }
    };


    const setLanguageCookie = (lang: string) => {
        deleteCookie(COOKIE_NAME); // Delete old cookie

        console.log(lang)
        // setCookie(null, COOKIE_NAME, '/auto/' + lang, {
        //     path: '/',
        //     domain: '.greenapuestas.com',
        //     sameSite: 'none',
        //     secure: true, // Use secure cookies for HTTPS
        // });
    };


    const switchLanguage = (lang: string) => {
        deleteCookie(COOKIE_NAME); // Delete old cookie
        setLanguageCookie(lang);   // Set the new cookie

        setCurrentLanguage(lang);

        // Optional: Trigger page reload to apply translation
        window.location.reload();
    };


    return (
        <div>
            <select
                value={currentLanguage}
                onChange={(e) => switchLanguage(e.target.value)}
                className="custom-select"
                translate='no'
            >
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
