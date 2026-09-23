export type LocationType = 'airport' | 'rail' | 'port' | 'ferry' | 'city' | 'country' | 'custom';

export interface WorldwideLocation {
  id: string;
  name: string;
  code?: string;
  city: string;
  country: string;
  region: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Global';
  type: LocationType;
  coordinates: { lat: number; lng: number };
  flag: string;
  aliases?: string[];
}

export interface ExampleJourney {
  id: string;
  title: string;
  originText: string;
  destinationText: string;
  regionPair: string;
  description: string;
}

// 12 Highlighted valid worldwide journeys from user specification
export const EXAMPLE_WORLDWIDE_JOURNEYS: ExampleJourney[] = [
  {
    id: 'journey-1',
    title: 'Chennai, India → Tokyo, Japan',
    originText: 'Chennai, India (MAA)',
    destinationText: 'Tokyo, Japan (HND)',
    regionPair: 'Asia → Asia (Subcontinental to Far East)',
    description: 'Direct trans-Asia flight corridor or via Singapore / Bangkok hub.',
  },
  {
    id: 'journey-2',
    title: 'Mumbai, India → Paris, France',
    originText: 'Mumbai, India (BOM)',
    destinationText: 'Paris, France (CDG)',
    regionPair: 'Asia → Europe',
    description: 'East-West intercontinental corridor via Dubai or direct European link.',
  },
  {
    id: 'journey-3',
    title: 'Singapore → Sydney, Australia',
    originText: 'Singapore (SIN)',
    destinationText: 'Sydney, Australia (SYD)',
    regionPair: 'Asia → Oceania',
    description: 'Equatorial trans-hemisphere corridor with overnight flight window.',
  },
  {
    id: 'journey-4',
    title: 'Dubai, UAE → Toronto, Canada',
    originText: 'Dubai, UAE (DXB)',
    destinationText: 'Toronto, Canada (YYZ)',
    regionPair: 'Middle East → North America',
    description: 'Transpolar / Atlantic high-altitude long-haul corridor.',
  },
  {
    id: 'journey-5',
    title: 'London, United Kingdom → New York, United States',
    originText: 'London, United Kingdom (LHR)',
    destinationText: 'New York, United States (JFK)',
    regionPair: 'Europe → North America',
    description: 'Flagship North Atlantic supersonic airway track.',
  },
  {
    id: 'journey-6',
    title: 'São Paulo, Brazil → Johannesburg, South Africa',
    originText: 'São Paulo, Brazil (GRU)',
    destinationText: 'Johannesburg, South Africa (JNB)',
    regionPair: 'South America → Africa',
    description: 'South Atlantic trans-oceanic airway via Southern hemisphere corridor.',
  },
  {
    id: 'journey-7',
    title: 'Nairobi, Kenya → Istanbul, Türkiye',
    originText: 'Nairobi, Kenya (NBO)',
    destinationText: 'Istanbul, Türkiye (IST)',
    regionPair: 'Africa → Europe / Transcontinental',
    description: 'Pan-African & Mediterranean aerial gateway.',
  },
  {
    id: 'journey-8',
    title: 'Auckland, New Zealand → Los Angeles, United States',
    originText: 'Auckland, New Zealand (AKL)',
    destinationText: 'Los Angeles, United States (LAX)',
    regionPair: 'Oceania → North America',
    description: 'Trans-Pacific deep oceanic route crossing the International Date Line.',
  },
  {
    id: 'journey-9',
    title: 'Bangkok, Thailand → Seoul, South Korea',
    originText: 'Bangkok, Thailand (BKK)',
    destinationText: 'Seoul, South Korea (ICN)',
    regionPair: 'Southeast Asia → East Asia',
    description: 'High-density Asia-Pacific business trunk route.',
  },
  {
    id: 'journey-10',
    title: 'Cairo, Egypt → Rome, Italy',
    originText: 'Cairo, Egypt (CAI)',
    destinationText: 'Rome, Italy (FCO)',
    regionPair: 'Africa → Europe',
    description: 'Trans-Mediterranean historic aviation corridor.',
  },
  {
    id: 'journey-11',
    title: 'Mexico City, Mexico → Madrid, Spain',
    originText: 'Mexico City, Mexico (MEX)',
    destinationText: 'Madrid, Spain (MAD)',
    regionPair: 'North America → Europe',
    description: 'Ibero-American nonstop transatlantic corridor.',
  },
  {
    id: 'journey-12',
    title: 'Buenos Aires, Argentina → Lima, Peru',
    originText: 'Buenos Aires, Argentina (EZE)',
    destinationText: 'Lima, Peru (LIM)',
    regionPair: 'South America → South America',
    description: 'Trans-Andean high-altitude mountain corridor.',
  },
];

// Rich worldwide directory spanning Asia, Europe, North America, South America, Africa, Oceania
// Plus railway stations, seaports, ferry terminals, and major metropolitan centres
export const WORLDWIDE_LOCATIONS: WorldwideLocation[] = [
  // ==================== ASIA ====================
  // India
  {
    id: 'in-maa',
    name: 'Chennai International Airport (Meenambakkam)',
    code: 'MAA',
    city: 'Chennai',
    country: 'India',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 12.9941, lng: 80.1709 },
    flag: '🇮🇳',
    aliases: ['Madras', 'Meenambakkam', 'Tamil Nadu'],
  },
  {
    id: 'in-mas-rail',
    name: 'Chennai Central Railway Station (Puratchi Thalaivar Dr. M.G.R. Central)',
    code: 'MAS',
    city: 'Chennai',
    country: 'India',
    region: 'Asia',
    type: 'rail',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    flag: '🇮🇳',
    aliases: ['Chennai Rail', 'Madras Central', 'Vande Bharat Station'],
  },
  {
    id: 'in-maa-port',
    name: 'Port of Chennai & Passenger Terminal',
    city: 'Chennai',
    country: 'India',
    region: 'Asia',
    type: 'port',
    coordinates: { lat: 13.0844, lng: 80.2974 },
    flag: '🇮🇳',
    aliases: ['Chennai Harbour', 'Coromandel Port'],
  },
  {
    id: 'in-bom',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    code: 'BOM',
    city: 'Mumbai',
    country: 'India',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 19.0896, lng: 72.8656 },
    flag: '🇮🇳',
    aliases: ['Bombay', 'Sahar'],
  },
  {
    id: 'in-csmt-rail',
    name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
    code: 'CSMT',
    city: 'Mumbai',
    country: 'India',
    region: 'Asia',
    type: 'rail',
    coordinates: { lat: 18.9401, lng: 72.8353 },
    flag: '🇮🇳',
    aliases: ['Victoria Terminus', 'VT Station'],
  },
  {
    id: 'in-del',
    name: 'Indira Gandhi International Airport',
    code: 'DEL',
    city: 'New Delhi',
    country: 'India',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 28.5562, lng: 77.1000 },
    flag: '🇮🇳',
    aliases: ['Delhi', 'Palam'],
  },
  {
    id: 'in-blr',
    name: 'Kempegowda International Airport',
    code: 'BLR',
    city: 'Bengaluru',
    country: 'India',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 13.1986, lng: 77.7066 },
    flag: '🇮🇳',
    aliases: ['Bangalore', 'Devenahalli'],
  },

  // Japan
  {
    id: 'jp-hnd',
    name: 'Tokyo Haneda International Airport',
    code: 'HND',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 35.5494, lng: 139.7798 },
    flag: '🇯🇵',
    aliases: ['Tokyo Intl', 'Haneda'],
  },
  {
    id: 'jp-nrt',
    name: 'Narita International Airport',
    code: 'NRT',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 35.7720, lng: 140.3929 },
    flag: '🇯🇵',
    aliases: ['Narita', 'New Tokyo'],
  },
  {
    id: 'jp-tyo-rail',
    name: 'Tokyo Station (Shinkansen Bullet Train Terminal)',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    type: 'rail',
    coordinates: { lat: 35.6812, lng: 139.7671 },
    flag: '🇯🇵',
    aliases: ['Tokyo Eki', 'Marunouchi Station'],
  },
  {
    id: 'jp-kix',
    name: 'Kansai International Airport',
    code: 'KIX',
    city: 'Osaka / Kyoto',
    country: 'Japan',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 34.4320, lng: 135.2304 },
    flag: '🇯🇵',
    aliases: ['Osaka', 'Kyoto Gate'],
  },

  // China
  {
    id: 'cn-pek',
    name: 'Beijing Capital International Airport',
    code: 'PEK',
    city: 'Beijing',
    country: 'China',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 40.0799, lng: 116.6031 },
    flag: '🇨🇳',
    aliases: ['Beijing', 'Peking'],
  },
  {
    id: 'cn-pkx',
    name: 'Beijing Daxing International Airport',
    code: 'PKX',
    city: 'Beijing',
    country: 'China',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 39.5098, lng: 116.4105 },
    flag: '🇨🇳',
    aliases: ['Daxing Star'],
  },
  {
    id: 'cn-pvg',
    name: 'Shanghai Pudong International Airport',
    code: 'PVG',
    city: 'Shanghai',
    country: 'China',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 31.1443, lng: 121.8083 },
    flag: '🇨🇳',
    aliases: ['Pudong'],
  },
  {
    id: 'cn-hkg',
    name: 'Hong Kong International Airport (Chek Lap Kok)',
    code: 'HKG',
    city: 'Hong Kong',
    country: 'China (Hong Kong SAR)',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 22.3080, lng: 113.9185 },
    flag: '🇭🇰',
    aliases: ['Chek Lap Kok', 'HKG Terminal'],
  },

  // Singapore
  {
    id: 'sg-sin',
    name: 'Singapore Changi Airport',
    code: 'SIN',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 1.3644, lng: 103.9915 },
    flag: '🇸🇬',
    aliases: ['Changi', 'Jewel Changi'],
  },
  {
    id: 'sg-cruise-port',
    name: 'Marina Bay Cruise Centre & Singapore Seaport',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    type: 'port',
    coordinates: { lat: 1.2705, lng: 103.8601 },
    flag: '🇸🇬',
    aliases: ['Marina Bay Cruise', 'Singapore Ferry Terminal'],
  },

  // United Arab Emirates
  {
    id: 'ae-dxb',
    name: 'Dubai International Airport',
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 25.2532, lng: 55.3657 },
    flag: '🇦🇪',
    aliases: ['Dubai Terminal 3', 'Emirates Hub'],
  },
  {
    id: 'ae-auh',
    name: 'Zayed International Airport (Abu Dhabi)',
    code: 'AUH',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 24.4330, lng: 54.6511 },
    flag: '🇦🇪',
    aliases: ['Abu Dhabi Terminal A', 'Etihad Hub'],
  },

  // Qatar
  {
    id: 'qa-doh',
    name: 'Hamad International Airport',
    code: 'DOH',
    city: 'Doha',
    country: 'Qatar',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 25.2731, lng: 51.6081 },
    flag: '🇶🇦',
    aliases: ['Hamad', 'Doha Qsuite Terminal'],
  },

  // South Korea
  {
    id: 'kr-icn',
    name: 'Seoul Incheon International Airport',
    code: 'ICN',
    city: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 37.4602, lng: 126.4407 },
    flag: '🇰🇷',
    aliases: ['Incheon', 'Seoul Gate'],
  },

  // Thailand
  {
    id: 'th-bkk',
    name: 'Suvarnabhumi International Airport',
    code: 'BKK',
    city: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 13.6900, lng: 100.7501 },
    flag: '🇹🇭',
    aliases: ['Bangkok Intl', 'Suvarnabhumi'],
  },

  // Malaysia
  {
    id: 'my-kul',
    name: 'Kuala Lumpur International Airport',
    code: 'KUL',
    city: 'Kuala Lumpur',
    country: 'Malaysia',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 2.7456, lng: 101.7099 },
    flag: '🇲🇾',
    aliases: ['KLIA', 'Sepang'],
  },

  // Indonesia
  {
    id: 'id-cgk',
    name: 'Soekarno-Hatta International Airport',
    code: 'CGK',
    city: 'Jakarta',
    country: 'Indonesia',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: -6.1275, lng: 106.6537 },
    flag: '🇮🇩',
    aliases: ['Jakarta', 'Cengkareng'],
  },
  {
    id: 'id-dps',
    name: 'I Gusti Ngurah Rai International Airport (Bali)',
    code: 'DPS',
    city: 'Denpasar / Bali',
    country: 'Indonesia',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: -8.7482, lng: 115.1672 },
    flag: '🇮🇩',
    aliases: ['Bali Airport', 'Denpasar'],
  },

  // Saudi Arabia
  {
    id: 'sa-ruh',
    name: 'King Khalid International Airport',
    code: 'RUH',
    city: 'Riyadh',
    country: 'Saudi Arabia',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 24.9576, lng: 46.6988 },
    flag: '🇸🇦',
    aliases: ['Riyadh'],
  },
  {
    id: 'sa-jed',
    name: 'King Abdulaziz International Airport',
    code: 'JED',
    city: 'Jeddah',
    country: 'Saudi Arabia',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 21.6796, lng: 39.1565 },
    flag: '🇸🇦',
    aliases: ['Jeddah', 'Hajj Terminal'],
  },

  // Türkiye (Transcontinental)
  {
    id: 'tr-ist',
    name: 'Istanbul Airport',
    code: 'IST',
    city: 'Istanbul',
    country: 'Türkiye',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 41.2753, lng: 28.7519 },
    flag: '🇹🇷',
    aliases: ['Istanbul New', 'Turkish Airlines Mega Hub', 'Turkey'],
  },
  {
    id: 'tr-ist-port',
    name: 'Galataport Cruise Terminal & Bosphorus Ferry Port',
    city: 'Istanbul',
    country: 'Türkiye',
    region: 'Europe',
    type: 'port',
    coordinates: { lat: 41.0253, lng: 28.9839 },
    flag: '🇹🇷',
    aliases: ['Galataport', 'Karakoy Port'],
  },

  // Vietnam
  {
    id: 'vn-sgn',
    name: 'Tan Son Nhat International Airport',
    code: 'SGN',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 10.8185, lng: 106.6519 },
    flag: '🇻🇳',
    aliases: ['Saigon'],
  },

  // Philippines
  {
    id: 'ph-mnl',
    name: 'Ninoy Aquino International Airport',
    code: 'MNL',
    city: 'Manila',
    country: 'Philippines',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 14.5086, lng: 121.0194 },
    flag: '🇵🇭',
    aliases: ['Manila'],
  },

  // Sri Lanka & Maldives
  {
    id: 'lk-cmb',
    name: 'Bandaranaike International Airport',
    code: 'CMB',
    city: 'Colombo',
    country: 'Sri Lanka',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 7.1808, lng: 79.8841 },
    flag: '🇱🇰',
    aliases: ['Katunayake', 'Colombo'],
  },
  {
    id: 'mv-mle',
    name: 'Velana International Airport & Seaplane Terminal',
    code: 'MLE',
    city: 'Malé',
    country: 'Maldives',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 4.1918, lng: 73.5291 },
    flag: '🇲🇻',
    aliases: ['Male Seaplane', 'Hulhule'],
  },

  // Pakistan, Bangladesh, Nepal
  {
    id: 'pk-khi',
    name: 'Jinnah International Airport',
    code: 'KHI',
    city: 'Karachi',
    country: 'Pakistan',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 24.9065, lng: 67.1608 },
    flag: '🇵🇰',
    aliases: ['Karachi'],
  },
  {
    id: 'bd-dac',
    name: 'Hazrat Shahjalal International Airport',
    code: 'DAC',
    city: 'Dhaka',
    country: 'Bangladesh',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 23.8433, lng: 90.3978 },
    flag: '🇧🇩',
    aliases: ['Dhaka'],
  },
  {
    id: 'np-ktm',
    name: 'Tribhuvan International Airport',
    code: 'KTM',
    city: 'Kathmandu',
    country: 'Nepal',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 27.6966, lng: 85.3591 },
    flag: '🇳🇵',
    aliases: ['Kathmandu', 'Himalayas'],
  },

  // Central Asia & Caucasus (Kazakhstan, Uzbekistan, Georgia, Azerbaijan)
  {
    id: 'kz-ala',
    name: 'Almaty International Airport',
    code: 'ALA',
    city: 'Almaty',
    country: 'Kazakhstan',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 43.3521, lng: 77.0405 },
    flag: '🇰🇿',
    aliases: ['Almaty'],
  },
  {
    id: 'uz-tas',
    name: 'Tashkent International Airport',
    code: 'TAS',
    city: 'Tashkent',
    country: 'Uzbekistan',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 41.2579, lng: 69.2812 },
    flag: '🇺🇿',
    aliases: ['Tashkent'],
  },
  {
    id: 'ge-tbs',
    name: 'Shota Rustaveli Tbilisi International Airport',
    code: 'TBS',
    city: 'Tbilisi',
    country: 'Georgia',
    region: 'Asia',
    type: 'airport',
    coordinates: { lat: 41.6692, lng: 44.9547 },
    flag: '🇬🇪',
    aliases: ['Tbilisi'],
  },

  // ==================== EUROPE ====================
  // United Kingdom
  {
    id: 'gb-lhr',
    name: 'London Heathrow Airport',
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 51.4700, lng: -0.4543 },
    flag: '🇬🇧',
    aliases: ['Heathrow', 'London T2 T3 T5'],
  },
  {
    id: 'gb-lgw',
    name: 'London Gatwick Airport',
    code: 'LGW',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 51.1537, lng: -0.1821 },
    flag: '🇬🇧',
    aliases: ['Gatwick'],
  },
  {
    id: 'gb-stp-rail',
    name: 'St Pancras International Railway Station (Eurostar)',
    code: 'STP',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'rail',
    coordinates: { lat: 51.5314, lng: -0.1261 },
    flag: '🇬🇧',
    aliases: ['St Pancras', 'Eurostar London', 'King Cross'],
  },
  {
    id: 'gb-dover-port',
    name: 'Port of Dover & Ferry Terminal',
    city: 'Dover',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'ferry',
    coordinates: { lat: 51.1279, lng: 1.3134 },
    flag: '🇬🇧',
    aliases: ['Dover Ferry', 'English Channel Ferry'],
  },

  // France
  {
    id: 'fr-cdg',
    name: 'Paris Charles de Gaulle Airport',
    code: 'CDG',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 49.0097, lng: 2.5479 },
    flag: '🇫🇷',
    aliases: ['Roissy', 'Charles de Gaulle'],
  },
  {
    id: 'fr-gdn-rail',
    name: 'Gare du Nord Railway Station',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    type: 'rail',
    coordinates: { lat: 48.8809, lng: 2.3553 },
    flag: '🇫🇷',
    aliases: ['Paris North Station', 'TGV Terminal'],
  },
  {
    id: 'fr-nce',
    name: 'Nice Côte d\'Azur Airport & Monaco Helipad Gateway',
    code: 'NCE',
    city: 'Nice / Cannes',
    country: 'France',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 43.6584, lng: 7.2159 },
    flag: '🇫🇷',
    aliases: ['Nice Airport', 'French Riviera'],
  },

  // Germany
  {
    id: 'de-fra',
    name: 'Frankfurt Airport',
    code: 'FRA',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 50.0379, lng: 8.5622 },
    flag: '🇩🇪',
    aliases: ['Frankfurt am Main', 'Lufthansa Mega Hub'],
  },
  {
    id: 'de-muc',
    name: 'Munich Franz Josef Strauss Airport',
    code: 'MUC',
    city: 'Munich',
    country: 'Germany',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 48.3537, lng: 11.7750 },
    flag: '🇩🇪',
    aliases: ['Munich', 'Bavaria'],
  },
  {
    id: 'de-ber-rail',
    name: 'Berlin Hauptbahnhof (Central Station)',
    city: 'Berlin',
    country: 'Germany',
    region: 'Europe',
    type: 'rail',
    coordinates: { lat: 52.5251, lng: 13.3694 },
    flag: '🇩🇪',
    aliases: ['Berlin Hbf', 'Berlin Central'],
  },

  // Italy
  {
    id: 'it-fco',
    name: 'Rome Leonardo da Vinci-Fiumicino Airport',
    code: 'FCO',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 41.8003, lng: 12.2389 },
    flag: '🇮🇹',
    aliases: ['Fiumicino', 'Roma'],
  },
  {
    id: 'it-ter-rail',
    name: 'Roma Termini Railway Station',
    city: 'Rome',
    country: 'Italy',
    region: 'Europe',
    type: 'rail',
    coordinates: { lat: 41.9014, lng: 12.5018 },
    flag: '🇮🇹',
    aliases: ['Rome Termini', 'Frecciarossa Hub'],
  },
  {
    id: 'it-mxp',
    name: 'Milan Malpensa Airport',
    code: 'MXP',
    city: 'Milan',
    country: 'Italy',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 45.6301, lng: 8.7255 },
    flag: '🇮🇹',
    aliases: ['Malpensa', 'Milano'],
  },

  // Spain & Portugal
  {
    id: 'es-mad',
    name: 'Adolfo Suárez Madrid-Barajas Airport',
    code: 'MAD',
    city: 'Madrid',
    country: 'Spain',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 40.4839, lng: -3.5680 },
    flag: '🇪🇸',
    aliases: ['Barajas', 'Madrid T4'],
  },
  {
    id: 'es-bcn',
    name: 'Josep Tarradellas Barcelona-El Prat Airport',
    code: 'BCN',
    city: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 41.2974, lng: 2.0833 },
    flag: '🇪🇸',
    aliases: ['El Prat', 'Barcelona'],
  },
  {
    id: 'es-bcn-port',
    name: 'Port of Barcelona Cruise & Ferry Terminal',
    city: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    type: 'port',
    coordinates: { lat: 41.3653, lng: 2.1734 },
    flag: '🇪🇸',
    aliases: ['Barcelona Port', 'Moll Adossat'],
  },
  {
    id: 'pt-lis',
    name: 'Humberto Delgado Airport (Lisbon)',
    code: 'LIS',
    city: 'Lisbon',
    country: 'Portugal',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 38.7742, lng: -9.1342 },
    flag: '🇵🇹',
    aliases: ['Portela', 'Lisboa'],
  },

  // Netherlands, Belgium, Switzerland, Austria
  {
    id: 'nl-ams',
    name: 'Amsterdam Airport Schiphol',
    code: 'AMS',
    city: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 52.3105, lng: 4.7683 },
    flag: '🇳🇱',
    aliases: ['Schiphol', 'KLM Hub'],
  },
  {
    id: 'nl-rot-port',
    name: 'Port of Rotterdam & Ferry Terminal',
    city: 'Rotterdam',
    country: 'Netherlands',
    region: 'Europe',
    type: 'port',
    coordinates: { lat: 51.9244, lng: 4.4777 },
    flag: '🇳🇱',
    aliases: ['Rotterdam Harbour', 'Europort'],
  },
  {
    id: 'ch-zrh',
    name: 'Zurich Airport',
    code: 'ZRH',
    city: 'Zurich',
    country: 'Switzerland',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 47.4582, lng: 8.5555 },
    flag: '🇨🇭',
    aliases: ['Kloten', 'Swiss Hub'],
  },
  {
    id: 'at-vie',
    name: 'Vienna International Airport',
    code: 'VIE',
    city: 'Vienna',
    country: 'Austria',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 48.1103, lng: 16.5697 },
    flag: '🇦🇹',
    aliases: ['Schwechat', 'Wien'],
  },

  // Nordics: Sweden, Norway, Denmark, Finland, Iceland
  {
    id: 'se-arn',
    name: 'Stockholm Arlanda Airport',
    code: 'ARN',
    city: 'Stockholm',
    country: 'Sweden',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 59.6498, lng: 17.9238 },
    flag: '🇸🇪',
    aliases: ['Arlanda', 'Stockholm'],
  },
  {
    id: 'no-osl',
    name: 'Oslo Airport (Gardermoen)',
    code: 'OSL',
    city: 'Oslo',
    country: 'Norway',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 60.1976, lng: 11.1004 },
    flag: '🇳🇴',
    aliases: ['Gardermoen', 'Oslo'],
  },
  {
    id: 'dk-cph',
    name: 'Copenhagen Airport (Kastrup)',
    code: 'CPH',
    city: 'Copenhagen',
    country: 'Denmark',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 55.6180, lng: 12.6508 },
    flag: '🇩🇰',
    aliases: ['Kastrup', 'Kobenhaven'],
  },
  {
    id: 'fi-hel',
    name: 'Helsinki-Vantaa Airport',
    code: 'HEL',
    city: 'Helsinki',
    country: 'Finland',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 60.3172, lng: 24.9633 },
    flag: '🇫🇮',
    aliases: ['Vantaa', 'Finnair Polar Hub'],
  },
  {
    id: 'is-kef',
    name: 'Keflavík International Airport',
    code: 'KEF',
    city: 'Reykjavik',
    country: 'Iceland',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 63.9850, lng: -22.6056 },
    flag: '🇮🇸',
    aliases: ['Reykjavik Airport', 'Keflavik'],
  },

  // Greece, Ireland, Poland, Czechia, Hungary
  {
    id: 'gr-ath',
    name: 'Athens International Airport (Eleftherios Venizelos)',
    code: 'ATH',
    city: 'Athens',
    country: 'Greece',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 37.9364, lng: 23.9445 },
    flag: '🇬🇷',
    aliases: ['Venizelos', 'Athens'],
  },
  {
    id: 'gr-pir-port',
    name: 'Port of Piraeus (Aegean Ferry Terminal)',
    city: 'Athens / Piraeus',
    country: 'Greece',
    region: 'Europe',
    type: 'ferry',
    coordinates: { lat: 37.9429, lng: 23.6469 },
    flag: '🇬🇷',
    aliases: ['Piraeus Port', 'Greek Island Ferries'],
  },
  {
    id: 'ie-dub',
    name: 'Dublin Airport',
    code: 'DUB',
    city: 'Dublin',
    country: 'Ireland',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 53.4264, lng: -6.2499 },
    flag: '🇮🇪',
    aliases: ['Dublin Terminal 2', 'US Preclearance'],
  },
  {
    id: 'pl-waw',
    name: 'Warsaw Chopin Airport',
    code: 'WAW',
    city: 'Warsaw',
    country: 'Poland',
    region: 'Europe',
    type: 'airport',
    coordinates: { lat: 52.1672, lng: 20.9679 },
    flag: '🇵🇱',
    aliases: ['Okęcie', 'Warsaw'],
  },

  // ==================== NORTH AMERICA ====================
  // United States
  {
    id: 'us-jfk',
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    city: 'New York',
    country: 'United States',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 40.6413, lng: -73.7781 },
    flag: '🇺🇸',
    aliases: ['Kennedy', 'JFK New York'],
  },
  {
    id: 'us-ewr',
    name: 'Newark Liberty International Airport',
    code: 'EWR',
    city: 'New York / Newark',
    country: 'United States',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 40.6895, lng: -74.1745 },
    flag: '🇺🇸',
    aliases: ['Newark', 'NYC United Hub'],
  },
  {
    id: 'us-gct-rail',
    name: 'Grand Central Terminal & Moynihan Train Hall',
    city: 'New York',
    country: 'United States',
    region: 'North America',
    type: 'rail',
    coordinates: { lat: 40.7527, lng: -73.9772 },
    flag: '🇺🇸',
    aliases: ['Grand Central', 'Penn Station NYC', 'Amtrak Acela'],
  },
  {
    id: 'us-lax',
    name: 'Los Angeles International Airport',
    code: 'LAX',
    city: 'Los Angeles',
    country: 'United States',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 33.9416, lng: -118.4085 },
    flag: '🇺🇸',
    aliases: ['Tom Bradley Terminal', 'LAX'],
  },
  {
    id: 'us-sfo',
    name: 'San Francisco International Airport',
    code: 'SFO',
    city: 'San Francisco',
    country: 'United States',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 37.6213, lng: -122.3790 },
    flag: '🇺🇸',
    aliases: ['Bay Area', 'SFO'],
  },
  {
    id: 'us-ord',
    name: 'Chicago O\'Hare International Airport',
    code: 'ORD',
    city: 'Chicago',
    country: 'United States',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 41.9742, lng: -87.9073 },
    flag: '🇺🇸',
    aliases: ['OHare', 'Chicago'],
  },
  {
    id: 'us-mia',
    name: 'Miami International Airport & Port of Miami',
    code: 'MIA',
    city: 'Miami',
    country: 'United States',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 25.7959, lng: -80.2870 },
    flag: '🇺🇸',
    aliases: ['Miami Gateway', 'PortMiami Cruise Hub'],
  },

  // Canada
  {
    id: 'ca-yyz',
    name: 'Toronto Pearson International Airport',
    code: 'YYZ',
    city: 'Toronto',
    country: 'Canada',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 43.6777, lng: -79.6248 },
    flag: '🇨🇦',
    aliases: ['Pearson', 'Toronto'],
  },
  {
    id: 'ca-union-rail',
    name: 'Union Station Toronto (VIA Rail / UP Express)',
    city: 'Toronto',
    country: 'Canada',
    region: 'North America',
    type: 'rail',
    coordinates: { lat: 43.6453, lng: -79.3806 },
    flag: '🇨🇦',
    aliases: ['Toronto Union', 'VIA Rail Terminal'],
  },
  {
    id: 'ca-yvr',
    name: 'Vancouver International Airport',
    code: 'YVR',
    city: 'Vancouver',
    country: 'Canada',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 49.1967, lng: -123.1815 },
    flag: '🇨🇦',
    aliases: ['Vancouver', 'Pacific Gateway'],
  },
  {
    id: 'ca-yul',
    name: 'Montréal-Trudeau International Airport',
    code: 'YUL',
    city: 'Montréal',
    country: 'Canada',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 45.4706, lng: -73.7408 },
    flag: '🇨🇦',
    aliases: ['Dorval', 'Montreal'],
  },

  // Mexico & Central America & Caribbean
  {
    id: 'mx-mex',
    name: 'Mexico City Benito Juárez International Airport',
    code: 'MEX',
    city: 'Mexico City',
    country: 'Mexico',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 19.4363, lng: -99.0721 },
    flag: '🇲🇽',
    aliases: ['Benito Juarez', 'CDMX'],
  },
  {
    id: 'mx-cun',
    name: 'Cancún International Airport',
    code: 'CUN',
    city: 'Cancún',
    country: 'Mexico',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 21.0365, lng: -86.8771 },
    flag: '🇲🇽',
    aliases: ['Riviera Maya', 'Cancun'],
  },
  {
    id: 'pa-pty',
    name: 'Tocumen International Airport (Hub of the Americas)',
    code: 'PTY',
    city: 'Panama City',
    country: 'Panama',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 9.0714, lng: -79.3835 },
    flag: '🇵🇦',
    aliases: ['Tocumen', 'Copa Hub', 'Panama Canal'],
  },
  {
    id: 'cr-sjo',
    name: 'Juan Santamaría International Airport',
    code: 'SJO',
    city: 'San José',
    country: 'Costa Rica',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 9.9939, lng: -84.2088 },
    flag: '🇨🇷',
    aliases: ['San Jose', 'Costa Rica'],
  },
  {
    id: 'jm-kin',
    name: 'Norman Manley International Airport',
    code: 'KIN',
    city: 'Kingston',
    country: 'Jamaica',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 17.9357, lng: -76.7875 },
    flag: '🇯🇲',
    aliases: ['Kingston', 'Jamaica'],
  },
  {
    id: 'bs-nas',
    name: 'Lynden Pindling International Airport',
    code: 'NAS',
    city: 'Nassau',
    country: 'Bahamas',
    region: 'North America',
    type: 'airport',
    coordinates: { lat: 25.0390, lng: -77.4662 },
    flag: '🇧🇸',
    aliases: ['Nassau', 'Bahamas Cruise Gate'],
  },

  // ==================== SOUTH AMERICA ====================
  // Brazil
  {
    id: 'br-gru',
    name: 'São Paulo/Guarulhos–Governador André Franco Montoro International Airport',
    code: 'GRU',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: -23.4356, lng: -46.4731 },
    flag: '🇧🇷',
    aliases: ['Guarulhos', 'Sao Paulo'],
  },
  {
    id: 'br-gig',
    name: 'Rio de Janeiro/Galeão International Airport',
    code: 'GIG',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: -22.8089, lng: -43.2436 },
    flag: '🇧🇷',
    aliases: ['Galeao', 'Rio'],
  },

  // Argentina, Chile, Peru, Colombia
  {
    id: 'ar-eze',
    name: 'Ministro Pistarini International Airport (Ezeiza)',
    code: 'EZE',
    city: 'Buenos Aires',
    country: 'Argentina',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: -34.8222, lng: -58.5358 },
    flag: '🇦🇷',
    aliases: ['Ezeiza', 'Buenos Aires'],
  },
  {
    id: 'cl-scl',
    name: 'Arturo Merino Benítez International Airport',
    code: 'SCL',
    city: 'Santiago',
    country: 'Chile',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: -33.3930, lng: -70.7858 },
    flag: '🇨🇱',
    aliases: ['Pudahuel', 'Santiago de Chile'],
  },
  {
    id: 'pe-lim',
    name: 'Jorge Chávez International Airport',
    code: 'LIM',
    city: 'Lima',
    country: 'Peru',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: -12.0219, lng: -77.1143 },
    flag: '🇵🇪',
    aliases: ['Callao', 'Lima Gate'],
  },
  {
    id: 'co-bog',
    name: 'El Dorado International Airport',
    code: 'BOG',
    city: 'Bogotá',
    country: 'Colombia',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: 4.7016, lng: -74.1469 },
    flag: '🇨🇴',
    aliases: ['El Dorado', 'Bogota'],
  },
  {
    id: 'ec-uio',
    name: 'Mariscal Sucre International Airport',
    code: 'UIO',
    city: 'Quito',
    country: 'Ecuador',
    region: 'South America',
    type: 'airport',
    coordinates: { lat: -0.1292, lng: -78.3575 },
    flag: '🇪🇨',
    aliases: ['Quito', 'Ecuador'],
  },

  // ==================== AFRICA ====================
  // South Africa
  {
    id: 'za-jnb',
    name: 'O. R. Tambo International Airport',
    code: 'JNB',
    city: 'Johannesburg',
    country: 'South Africa',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -26.1367, lng: 28.2411 },
    flag: '🇿🇦',
    aliases: ['Jan Smuts', 'Johannesburg', 'OR Tambo'],
  },
  {
    id: 'za-cpt',
    name: 'Cape Town International Airport & Port of Cape Town',
    code: 'CPT',
    city: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -33.9715, lng: 18.6021 },
    flag: '🇿🇦',
    aliases: ['Cape Town', 'V&A Waterfront'],
  },

  // Egypt
  {
    id: 'eg-cai',
    name: 'Cairo International Airport',
    code: 'CAI',
    city: 'Cairo',
    country: 'Egypt',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: 30.1219, lng: 31.4056 },
    flag: '🇪🇬',
    aliases: ['Heliopolis', 'Cairo'],
  },
  {
    id: 'eg-aly-port',
    name: 'Port of Alexandria & Mediterranean Terminal',
    city: 'Alexandria',
    country: 'Egypt',
    region: 'Africa',
    type: 'port',
    coordinates: { lat: 31.1969, lng: 29.8789 },
    flag: '🇪🇬',
    aliases: ['Alexandria Port', 'Nile Delta Port'],
  },

  // Kenya & East Africa
  {
    id: 'ke-nbo',
    name: 'Jomo Kenyatta International Airport',
    code: 'NBO',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -1.3192, lng: 36.9278 },
    flag: '🇰🇪',
    aliases: ['Embakasi', 'Nairobi'],
  },
  {
    id: 'tz-dar',
    name: 'Julius Nyerere International Airport & Zanzibar Ferry',
    code: 'DAR',
    city: 'Dar es Salaam / Zanzibar',
    country: 'Tanzania',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -6.8781, lng: 39.2026 },
    flag: '🇹🇿',
    aliases: ['Zanzibar Port', 'Dar es Salaam Ferry'],
  },
  {
    id: 'et-add',
    name: 'Addis Ababa Bole International Airport',
    code: 'ADD',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: 8.9779, lng: 38.7993 },
    flag: '🇪🇹',
    aliases: ['Bole', 'Ethiopian Airlines Hub'],
  },
  {
    id: 'rw-kgl',
    name: 'Kigali International Airport',
    code: 'KGL',
    city: 'Kigali',
    country: 'Rwanda',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -1.9686, lng: 30.1395 },
    flag: '🇷🇼',
    aliases: ['Kanombe', 'Kigali'],
  },

  // North Africa & West Africa
  {
    id: 'ma-cmn',
    name: 'Mohammed V International Airport',
    code: 'CMN',
    city: 'Casablanca',
    country: 'Morocco',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: 33.3675, lng: -7.5899 },
    flag: '🇲🇦',
    aliases: ['Casablanca', 'Nouasseur'],
  },
  {
    id: 'ng-los',
    name: 'Murtala Muhammed International Airport',
    code: 'LOS',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: 6.5774, lng: 3.3212 },
    flag: '🇳🇬',
    aliases: ['Ikeja', 'Lagos'],
  },
  {
    id: 'gh-acc',
    name: 'Kotoka International Airport',
    code: 'ACC',
    city: 'Accra',
    country: 'Ghana',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: 5.6052, lng: -0.1668 },
    flag: '🇬🇭',
    aliases: ['Accra', 'Kotoka'],
  },
  {
    id: 'sn-dss',
    name: 'Blaise Diagne International Airport',
    code: 'DSS',
    city: 'Dakar',
    country: 'Senegal',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: 14.6711, lng: -17.0733 },
    flag: '🇸🇳',
    aliases: ['Dakar', 'Diass'],
  },

  // Island Nations (Mauritius, Seychelles)
  {
    id: 'mu-mru',
    name: 'Sir Seewoosagur Ramgoolam International Airport',
    code: 'MRU',
    city: 'Port Louis / Plaine Magnien',
    country: 'Mauritius',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -20.4302, lng: 57.6836 },
    flag: '🇲🇺',
    aliases: ['Plaisance', 'Mauritius'],
  },
  {
    id: 'sc-sez',
    name: 'Seychelles International Airport',
    code: 'SEZ',
    city: 'Victoria / Mahé',
    country: 'Seychelles',
    region: 'Africa',
    type: 'airport',
    coordinates: { lat: -4.6743, lng: 55.5219 },
    flag: '🇸🇨',
    aliases: ['Pointe Larue', 'Seychelles'],
  },

  // ==================== OCEANIA ====================
  // Australia
  {
    id: 'au-syd',
    name: 'Sydney Kingsford Smith Airport',
    code: 'SYD',
    city: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -33.9461, lng: 151.1772 },
    flag: '🇦🇺',
    aliases: ['Kingsford Smith', 'Mascot', 'Sydney T1'],
  },
  {
    id: 'au-syd-ferry',
    name: 'Circular Quay Passenger Ferry Terminal & Sydney Harbour',
    city: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    type: 'ferry',
    coordinates: { lat: -33.8614, lng: 151.2108 },
    flag: '🇦🇺',
    aliases: ['Circular Quay', 'Sydney Harbour Wharf'],
  },
  {
    id: 'au-mel',
    name: 'Melbourne Tullamarine Airport',
    code: 'MEL',
    city: 'Melbourne',
    country: 'Australia',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -37.6690, lng: 144.8410 },
    flag: '🇦🇺',
    aliases: ['Tullamarine', 'Melbourne'],
  },
  {
    id: 'au-bne',
    name: 'Brisbane Airport',
    code: 'BNE',
    city: 'Brisbane',
    country: 'Australia',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -27.3942, lng: 153.1218 },
    flag: '🇦🇺',
    aliases: ['Brisbane', 'Queensland Gate'],
  },
  {
    id: 'au-per',
    name: 'Perth Airport',
    code: 'PER',
    city: 'Perth',
    country: 'Australia',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -31.9403, lng: 115.9668 },
    flag: '🇦🇺',
    aliases: ['Perth', 'Western Australia'],
  },

  // New Zealand & Pacific
  {
    id: 'nz-akl',
    name: 'Auckland Airport',
    code: 'AKL',
    city: 'Auckland',
    country: 'New Zealand',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -37.0082, lng: 174.7850 },
    flag: '🇳🇿',
    aliases: ['Mangere', 'Auckland'],
  },
  {
    id: 'nz-wlg',
    name: 'Wellington International Airport',
    code: 'WLG',
    city: 'Wellington',
    country: 'New Zealand',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -41.3276, lng: 174.8076 },
    flag: '🇳🇿',
    aliases: ['Rongotai', 'Wellington'],
  },
  {
    id: 'fj-nan',
    name: 'Nadi International Airport',
    code: 'NAN',
    city: 'Nadi',
    country: 'Fiji',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -17.7554, lng: 177.4434 },
    flag: '🇫🇯',
    aliases: ['Nadi', 'Fiji Airways Gateway'],
  },
  {
    id: 'pg-pom',
    name: 'Jacksons International Airport',
    code: 'POM',
    city: 'Port Moresby',
    country: 'Papua New Guinea',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -9.4442, lng: 147.2199 },
    flag: '🇵🇬',
    aliases: ['Port Moresby', 'PNG'],
  },
  {
    id: 'ws-apw',
    name: 'Faleolo International Airport',
    code: 'APW',
    city: 'Apia',
    country: 'Samoa',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -13.8299, lng: -171.9984 },
    flag: '🇼🇸',
    aliases: ['Apia', 'Samoa'],
  },
  {
    id: 'to-tbu',
    name: 'Fuaʻamotu International Airport',
    code: 'TBU',
    city: 'Nukuʻalofa',
    country: 'Tonga',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -21.2407, lng: -175.1399 },
    flag: '🇹🇴',
    aliases: ['Nukualofa', 'Tonga'],
  },
  {
    id: 'vu-vli',
    name: 'Bauerfield International Airport',
    code: 'VLI',
    city: 'Port Vila',
    country: 'Vanuatu',
    region: 'Oceania',
    type: 'airport',
    coordinates: { lat: -17.6993, lng: 168.3199 },
    flag: '🇻🇺',
    aliases: ['Port Vila', 'Vanuatu'],
  },
];

// Search worldwide locations with fuzzy matching across name, code, city, country, region, type, aliases
export function searchWorldwideLocations(query: string, limit = 10): WorldwideLocation[] {
  if (!query || query.trim() === '') {
    return WORLDWIDE_LOCATIONS.slice(0, limit);
  }

  const clean = query.trim().toLowerCase();
  const matched: { loc: WorldwideLocation; score: number }[] = [];

  for (const loc of WORLDWIDE_LOCATIONS) {
    let score = 0;

    // Code exact or starts with
    if (loc.code && loc.code.toLowerCase() === clean) score += 100;
    else if (loc.code && loc.code.toLowerCase().startsWith(clean)) score += 60;

    // City exact or starts with
    if (loc.city.toLowerCase() === clean) score += 80;
    else if (loc.city.toLowerCase().startsWith(clean)) score += 50;
    else if (loc.city.toLowerCase().includes(clean)) score += 30;

    // Country match
    if (loc.country.toLowerCase() === clean) score += 70;
    else if (loc.country.toLowerCase().startsWith(clean)) score += 40;
    else if (loc.country.toLowerCase().includes(clean)) score += 20;

    // Name match
    if (loc.name.toLowerCase().startsWith(clean)) score += 45;
    else if (loc.name.toLowerCase().includes(clean)) score += 25;

    // Region match
    if (loc.region.toLowerCase().includes(clean)) score += 15;

    // Aliases
    if (loc.aliases) {
      for (const alias of loc.aliases) {
        if (alias.toLowerCase() === clean) score += 75;
        else if (alias.toLowerCase().includes(clean)) score += 25;
      }
    }

    if (score > 0) {
      matched.push({ loc, score });
    }
  }

  matched.sort((a, b) => b.score - a.score);
  return matched.slice(0, limit).map((m) => m.loc);
}

// Convert user manual text or match into a WorldwideLocation object
// NEVER rejects or overrides custom input: if no match found, creates a custom worldwide location
export function resolveLocationFromInput(input: string, fallbackRegion?: WorldwideLocation['region']): WorldwideLocation {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    // Return default London Heathrow
    return WORLDWIDE_LOCATIONS[0];
  }

  // Check direct exact match by code, id, or exact name
  const exactMatch = WORLDWIDE_LOCATIONS.find(
    (l) => 
      l.code?.toLowerCase() === trimmed.toLowerCase() ||
      l.id.toLowerCase() === trimmed.toLowerCase() ||
      l.name.toLowerCase() === trimmed.toLowerCase() ||
      l.city.toLowerCase() === trimmed.toLowerCase()
  );
  if (exactMatch) return exactMatch;

  // Check search matches
  const searchResults = searchWorldwideLocations(trimmed, 1);
  if (searchResults.length > 0) {
    const top = searchResults[0];
    // If the input closely matches (e.g. contains city or code)
    if (
      trimmed.toLowerCase().includes(top.city.toLowerCase()) || 
      (top.code && trimmed.toUpperCase().includes(top.code)) ||
      trimmed.toLowerCase().includes(top.country.toLowerCase())
    ) {
      return top;
    }
  }

  // IMPORTANT: User has entered a custom location worldwide!
  // Preserve the exact location entered by the user.
  const parts = trimmed.split(',').map((p) => p.trim());
  const primaryName = parts[0] || trimmed;
  const secondaryName = parts[1] || '';
  const isPort = /port|ferry|harbour|dock|cruise/i.test(trimmed);
  const isRail = /station|rail|train|terminal|gare|hbf|gare/i.test(trimmed);
  const isAirport = /airport|aeropuerto|flughafen|airfield|aeroport/i.test(trimmed);

  const locType: LocationType = isPort ? 'port' : isRail ? 'rail' : isAirport ? 'airport' : 'custom';

  // Compute a deterministic pseudo-coordinate based on string hash for distance calculations
  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash << 5) - hash + trimmed.charCodeAt(i);
    hash |= 0;
  }
  const pseudoLat = ((Math.abs(hash) % 12000) / 100) - 60; // -60 to +60
  const pseudoLng = ((Math.abs(hash >> 3) % 36000) / 100) - 180; // -180 to +180

  return {
    id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: trimmed,
    code: primaryName.slice(0, 3).toUpperCase(),
    city: secondaryName || primaryName,
    country: secondaryName ? secondaryName : 'Worldwide Territory',
    region: fallbackRegion || 'Global',
    type: locType,
    coordinates: { lat: pseudoLat, lng: pseudoLng },
    flag: '🌐',
    aliases: [trimmed],
  };
}

// Calculate Great Circle Distance (Haversine formula in Nautical Miles)
export function calculateDistanceNm(
  c1: { lat: number; lng: number },
  c2: { lat: number; lng: number }
): number {
  const R = 3440.065; // Earth radius in nautical miles
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLng = ((c2.lng - c1.lng) * Math.PI) / 180;
  const lat1 = (c1.lat * Math.PI) / 180;
  const lat2 = (c2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c);
  return Math.max(250, dist);
}
