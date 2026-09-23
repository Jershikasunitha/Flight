export type LanguageCode = 
  | 'en-GB' // 1. English (UK)
  | 'en-US' // 2. English (US)
  | 'en-IN' // 3. English (India)
  | 'fr'    // 4. French (Français)
  | 'es'    // 5. Spanish (Español)
  | 'de'    // 6. German (Deutsch)
  | 'zh'    // 7. Chinese (中文 Simplified)
  | 'ja'    // 8. Japanese (日本語)
  | 'ko'    // 9. Korean (한국어)
  | 'ar'    // 10. Arabic (العربية)
  | 'ta';   // Tamil (தமிழ்)

export interface LanguageOption {
  code: LanguageCode;
  number?: number;
  flag: string;
  name: string;
  nativeName: string;
  region: string;
  direction?: 'ltr' | 'rtl';
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en-GB',
    number: 1,
    flag: '🇬🇧',
    name: 'English',
    nativeName: 'English (UK)',
    region: 'United Kingdom',
    direction: 'ltr',
  },
  {
    code: 'en-US',
    number: 2,
    flag: '🇺🇸',
    name: 'English',
    nativeName: 'English (US)',
    region: 'United States',
    direction: 'ltr',
  },
  {
    code: 'en-IN',
    number: 3,
    flag: '🇮🇳',
    name: 'English',
    nativeName: 'English (India)',
    region: 'India',
    direction: 'ltr',
  },
  {
    code: 'fr',
    number: 4,
    flag: '🇫🇷',
    name: 'French',
    nativeName: 'Français',
    region: 'France',
    direction: 'ltr',
  },
  {
    code: 'es',
    number: 5,
    flag: '🇪🇸',
    name: 'Spanish',
    nativeName: 'Español',
    region: 'Spain / Latin America',
    direction: 'ltr',
  },
  {
    code: 'de',
    number: 6,
    flag: '🇩🇪',
    name: 'German',
    nativeName: 'Deutsch',
    region: 'Germany / Europe',
    direction: 'ltr',
  },
  {
    code: 'zh',
    number: 7,
    flag: '🇨🇳',
    name: 'Chinese',
    nativeName: '中文 (Simplified)',
    region: 'China',
    direction: 'ltr',
  },
  {
    code: 'ja',
    number: 8,
    flag: '🇯🇵',
    name: 'Japanese',
    nativeName: '日本語',
    region: 'Japan',
    direction: 'ltr',
  },
  {
    code: 'ko',
    number: 9,
    flag: '🇰🇷',
    name: 'Korean',
    nativeName: '한국어',
    region: 'South Korea',
    direction: 'ltr',
  },
  {
    code: 'ar',
    number: 10,
    flag: '🇦🇪',
    name: 'Arabic',
    nativeName: 'العربية',
    region: 'United Arab Emirates / Middle East',
    direction: 'rtl',
  },
  {
    code: 'ta',
    flag: '🇮🇳',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu / Singapore / Sri Lanka',
    direction: 'ltr',
  },
];
