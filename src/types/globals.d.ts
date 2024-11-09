// Google language configuration
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
    google: unknown;  // You can narrow this type down further if needed
  }
}

export interface FormButtonProps {
  loading: boolean,
  text: string
}

export {};