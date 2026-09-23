import { LanguageCode } from '../types/language';

export interface SpeechLanguageConfig {
  code: LanguageCode;
  bcp47: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  listeningPrompt: string;
  sampleQueries: string[];
  voiceHint: string;
}

export const SPEECH_LANGUAGES: SpeechLanguageConfig[] = [
  {
    code: 'en-GB',
    bcp47: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English (UK)',
    flag: '🇬🇧',
    region: 'United Kingdom',
    listeningPrompt: 'Listening in British English...',
    voiceHint: 'Flight operations telemetry & ATC voice',
    sampleQueries: [
      'What is our current connection buffer in Singapore?',
      'Check Sydney 23:00 curfew risk assessment',
      'Will my baggage be transferred automatically to QF002?',
      'Why did the Planner select Singapore over Dubai?',
    ],
  },
  {
    code: 'en-US',
    bcp47: 'en-US',
    name: 'English (US)',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    region: 'United States',
    listeningPrompt: 'Listening in American English...',
    voiceHint: 'Executive concierge voice mode',
    sampleQueries: [
      'What is our connection buffer in minutes?',
      'Is there any risk for the Sydney curfew?',
      'What is our backup itinerary if Singapore is delayed?',
      'Confirm First Suite seat and luggage transfer status',
    ],
  },
  {
    code: 'en-IN',
    bcp47: 'en-IN',
    name: 'English (India)',
    nativeName: 'English (India)',
    flag: '🇮🇳',
    region: 'India / Commonwealth',
    listeningPrompt: 'Listening in Indian English...',
    voiceHint: 'Autonomous travel desk voice',
    sampleQueries: [
      'Check the transit connection buffer at Changi Airport',
      'What is the on-time performance for Doha vs Singapore?',
      'Confirm lounge access privileges for Elena Rostova',
      'Show the active agent execution decision log',
    ],
  },
  {
    code: 'fr',
    bcp47: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    region: 'France / Europe',
    listeningPrompt: 'À l’écoute en français...',
    voiceHint: 'Concierge aérien exécutif autonome',
    sampleQueries: [
      'Quelle est notre marge de correspondance à Singapour ?',
      'Vérifier le risque de couvre-feu à Sydney (23h00)',
      'Quel est le statut du transfert des bagages ?',
      'Pourquoi le couloir de Dubaï a-t-il été rejeté ?',
    ],
  },
  {
    code: 'es',
    bcp47: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    region: 'España / América Latina',
    listeningPrompt: 'Escuchando en español...',
    voiceHint: 'Conserje de operaciones aéreas en tiempo real',
    sampleQueries: [
      '¿Cuál es nuestro margen de conexión en Singapur?',
      'Verificar riesgo del toque de queda en Sídney a las 23:00',
      '¿Por qué se eligió el plan alternativo vía Doha?',
      'Confirmar estado de transferencia de equipaje para Elena',
    ],
  },
  {
    code: 'de',
    bcp47: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    region: 'Deutschland / Europa',
    listeningPrompt: 'Höre auf Deutsch zu...',
    voiceHint: 'Autonomer Executive Flug-Concierge',
    sampleQueries: [
      'Wie groß ist unser aktueller Umsteigepuffer in Minuten?',
      'Risiko für das Nachtflugverbot in Sydney um 23:00 prüfen',
      'Wie ist der Status der automatischen Gepäckweiterleitung?',
      'Warum hat der Planer Singapur gegenüber Dubai bevorzugt?',
    ],
  },
  {
    code: 'zh',
    bcp47: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    region: '中国 / 亚太',
    listeningPrompt: '正在用中文聆听...',
    voiceHint: '自主公务航空智能管家',
    sampleQueries: [
      '我们当前在新加坡的中转缓冲时间是多少？',
      '检查悉尼 23:00 夜间宵禁风险评估',
      '备降多哈改道方案的准点率如何？',
      '确认贵宾休息室与行李优先转运状态',
    ],
  },
  {
    code: 'ja',
    bcp47: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    region: '日本',
    listeningPrompt: '日本語で音声を認識中...',
    voiceHint: 'エグゼクティブ専用コンシェルジュ',
    sampleQueries: [
      '現在の乗継バッファ時間はどのくらいですか？',
      'シドニー夜間門限（23:00）のリスクを確認してください',
      '手荷物の自動転送ステータスはどうなっていますか？',
      'なぜドバイ経由ではなくシンガポールが選ばれましたか？',
    ],
  },
  {
    code: 'ko',
    bcp47: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    region: '대한민국',
    listeningPrompt: '한국어로 음성을 인식하는 중...',
    voiceHint: '자율 전용기 비행 컨시어지',
    sampleQueries: [
      '현재 싱가포르 환승 여유 시간이 얼마나 되나요?',
      '시드니 23:00 야간 통금 위험도를 확인해주세요',
      '수하물 우선 환승 처리가 정상적으로 완료되었나요?',
      '두바이 대신 싱가포르가 1순위로 선정된 이유는?',
    ],
  },
  {
    code: 'ar',
    bcp47: 'ar-AE',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
    region: 'الإمارات / الشرق الأوسط',
    listeningPrompt: 'جاري الاستماع باللغة العربية...',
    voiceHint: 'المساعد الذاتي لعمليات الطيران التنفيذي',
    sampleQueries: [
      'ما هو هامش وقت الترانزيت الحالي في سنغافورة؟',
      'تحقق من مخاطر حظر تجوال مطار سيدني الساعة 23:00',
      'ما هي خطة الطوارئ المعتمدة لإعادة التوجيه إلى الدوحة؟',
      'تأكيد حالة نقل الأمتعة ذات الأولوية للراكبة إلينا',
    ],
  },
  {
    code: 'ta',
    bcp47: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    region: 'தமிழ்நாடு / சிங்கப்பூர் / இலங்கை',
    listeningPrompt: 'தமிழில் கேட்கிறது... (Listening in Tamil)',
    voiceHint: 'தன்னாட்சி பிரத்யேக விமான உதவியாளர்',
    sampleQueries: [
      'எங்களின் தற்போதைய இணைப்பு இடைவெளி நேரம் எவ்வளவு?',
      'சிட்னி இரவு ஊரடங்கு அபாயத்தை சரிபார்க்கவும் (23:00)',
      'என் உடைமைகள் தானாக அடுத்த விமானத்திற்கு மாற்றப்படுமா?',
      'திட்டமிடுபவர் துபாயை விட சிங்கப்பூரை ஏன் தேர்வு செய்தார்?',
    ],
  },
];

export function getSpeechConfig(code: LanguageCode | string): SpeechLanguageConfig {
  const match = SPEECH_LANGUAGES.find((item) => item.code === code);
  return match || SPEECH_LANGUAGES[0];
}

export function getSpeechConfigByBcp47(bcp47: string): SpeechLanguageConfig {
  const match = SPEECH_LANGUAGES.find((item) => item.bcp47.toLowerCase() === bcp47.toLowerCase());
  return match || SPEECH_LANGUAGES[0];
}
