'use client'
import React, { useEffect, useState } from 'react';

const Translator = () => {
  const [isClient, setIsClient] = useState(false); // State to check if we're on the client

  useEffect(() => {
    // This will run once the component has mounted on the client
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Skip logic if not mounted on the client-side

    // Check if the script is already present
    const existingScript = document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]');
    
    // If the script is not present, create and append it
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.type = 'text/javascript';
      script.async = true;
      document.head.appendChild(script);
    }

    // Flag to track if translation has been initialized
    let isInitialized = false;

    // Define the global callback function for when the script loads
    window.googleTranslateElementInit = () => {
      if (isInitialized) return;  // Prevent re-initialization

      console.log('Google Translate Initialized!');
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
      );
      isInitialized = true;  // Mark as initialized

      // Add an event listener to reload the page on language change
      const translateSelect = document.querySelector('.goog-te-combo'); // Google Translate select box class
      if (translateSelect) {
        translateSelect.addEventListener('change', () => {
          // Trigger a page reload whenever the language changes
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      }
    };

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.querySelector('script[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [isClient]); // This effect will run when the component is mounted on the client

  if (!isClient) return null; // Ensure the component doesn't render on SSR

  return (
    <div id="google_translate_element"></div>
  );
}

export default Translator;
