// globals.d.ts or src/types/globals.d.ts

export interface LanguageDescriptor {
  title: string,
  code: string,
}

export interface GoogleTranslationConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
}

// Augment the global `window` object
declare global {
  interface Window {
    __GOOGLE_TRANSLATION_CONFIG__: GoogleTranslationConfig;
    google: any;  // You can narrow this type down further if needed
  }
}

// Ensure the file is treated as a module
export {};