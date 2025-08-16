// Translation Service for English ↔ Tamil

export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  sourceLang: string;
  targetLang: string;
}

// Mock translation service - in production, integrate with Google Translate API or similar
export const translateText = async (
  text: string, 
  targetLang: 'ta' | 'en' = 'ta'
): Promise<TranslationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock translations for demo purposes
  const englishToTamilMap: { [key: string]: string } = {
    'RENTAL AGREEMENT': 'வாடகை ஒப்பந்தம்',
    'SERVICE AGREEMENT': 'சேவை ஒப்பந்தம்', 
    'NON-DISCLOSURE AGREEMENT': 'இரகசியத்தன்மை ஒப்பந்தம்',
    'SALE AGREEMENT': 'விற்பனை ஒப்பந்தம்',
    'CUSTOM AGREEMENT': 'தனிப்பயன் ஒப்பந்தம்',
    'TERMS AND CONDITIONS': 'விதிமுறைகள்',
    'SIGNATURES': 'கையெழுத்துகள்',
    'Date:': 'தேதி:',
    'Name:': 'பெயர்:',
    'Address:': 'முகவரி:',
    'Monthly Rent:': 'மாதாந்தர வாடகை:',
    'Security Deposit:': 'பாதுகாப்பு வைப்பு:',
    'LANDLORD': 'வீட்டு உரிமையாளர்',
    'TENANT': 'குத்தகைதாரர்',
    'CLIENT': 'வாடிக்கையாளர்',
    'SERVICE PROVIDER': 'சேவை வழங்குநர்',
    'GOVERNING LAW': 'நிர்வாக சட்டம்',
    'This agreement shall be governed by the laws of India': 'இந்த ஒப்பந்தம் இந்திய சட்டங்களால் நிர்வகிக்கப்படும்'
  };

  const tamilToEnglishMap: { [key: string]: string } = {};
  Object.entries(englishToTamilMap).forEach(([en, ta]) => {
    tamilToEnglishMap[ta] = en;
  });

  let translatedText: string;

  if (targetLang === 'ta') {
    // English to Tamil
    translatedText = text;
    Object.entries(englishToTamilMap).forEach(([english, tamil]) => {
      const regex = new RegExp(english, 'gi');
      translatedText = translatedText.replace(regex, tamil);
    });

    // If no specific translations found, provide a generic Tamil translation message
    if (translatedText === text) {
      translatedText = `தமிழ் மொழிபெயர்ப்பு:\n\n${text}\n\n(இது ஒரு மாதிரி மொழிபெயர்ப்பு. உற்பादனத்தில், Google Translate அல்லது தொழில்முறை மொழிபெயர்ப்பு சேவை பயன்படுத்தப்படும்)`;
    }
  } else {
    // Tamil to English
    translatedText = text;
    Object.entries(tamilToEnglishMap).forEach(([tamil, english]) => {
      const regex = new RegExp(tamil, 'gi');
      translatedText = translatedText.replace(regex, english);
    });

    // If no specific translations found, provide a generic English translation message
    if (translatedText === text) {
      translatedText = `English Translation:\n\n${text}\n\n(This is a demo translation. In production, Google Translate or professional translation service would be used)`;
    }
  }

  return {
    translatedText,
    originalText: text,
    sourceLang: targetLang === 'ta' ? 'en' : 'ta',
    targetLang
  };
};

export const detectLanguage = (text: string): 'en' | 'ta' | 'unknown' => {
  // Simple detection based on Unicode ranges
  const tamilRegex = /[\u0B80-\u0BFF]/;
  const englishRegex = /[a-zA-Z]/;

  if (tamilRegex.test(text)) {
    return 'ta';
  } else if (englishRegex.test(text)) {
    return 'en';
  } else {
    return 'unknown';
  }
};