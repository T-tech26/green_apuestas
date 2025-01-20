function TranslateInit() {
    // Check if the Google Translate configuration exists
    if (!window.__GOOGLE_TRANSLATION_CONFIG__) {
        console.warn("Google Translate configuration is not available.");
        return;
    }
    
    // Check if the google object is available globally
    if (typeof window.google === "undefined" || !window.google.translate) {
        console.error("Google Translate API is not loaded.");
        return;
    }

    // Initialize the Google Translate widget using the provided default language
    new window.google.translate.TranslateElement({
        pageLanguage: window.__GOOGLE_TRANSLATION_CONFIG__.defaultLanguage,
    });
}
