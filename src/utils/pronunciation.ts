// Phonetic guides and pronunciations for chemical elements

export interface ElementPronunciation {
  thaiPhonetic: string;
  englishPhonetic: string;
}

export const PRONUNCIATIONS: Record<number, ElementPronunciation> = {
  1: { thaiPhonetic: 'ไฮ-โดร-เจน', englishPhonetic: '/ˈhaɪ.drə.dʒən/ (ไฮ-ดระ-เจิน)' },
  2: { thaiPhonetic: 'ฮี-เลียม', englishPhonetic: '/ˈhiː.li.əm/ (ฮี-ลี-อึม)' },
  3: { thaiPhonetic: 'ลิ-เทียม', englishPhonetic: '/ˈlɪθ.i.əm/ (ลิธ-ธี-อึม)' },
  4: { thaiPhonetic: 'เบ-ริล-เลียม', englishPhonetic: '/bəˈrɪl.i.əm/ (เบอะ-ริล-ลี-อึม)' },
  5: { thaiPhonetic: 'โบ-รอน', englishPhonetic: '/ˈbɔː.rɒn/ (บอ-รอน)' },
  6: { thaiPhonetic: 'คาร์-บอน', englishPhonetic: '/ˈkɑːr.bən/ (คาร์-เบิน)' },
  7: { thaiPhonetic: 'ไน-โตร-เจน', englishPhonetic: '/ˈnaɪ.trə.dʒən/ (ไน-ตระ-เจิน)' },
  8: { thaiPhonetic: 'ออก-ซิ-เจน', englishPhonetic: '/ˈɒk.sɪ.dʒən/ (อ็อก-ซิ-เจิน)' },
  9: { thaiPhonetic: 'ฟลู-ออ-รีน', englishPhonetic: '/ˈflʊə.riːn/ (ฟลู-เออะ-รีน)' },
  10: { thaiPhonetic: 'นี-ออน', englishPhonetic: '/ˈniː.ɒn/ (นี-ออน)' },
  11: { thaiPhonetic: 'โซ-เดียม', englishPhonetic: '/ˈsəʊ.di.əm/ (โซ-ดี-อึม)' },
  12: { thaiPhonetic: 'แมก-นี-เซียม', englishPhonetic: '/mæɡˈniː.zi.əm/ (แม็ก-นี-ซี-อึม)' },
  13: { thaiPhonetic: 'อะ-ลู-มิ-เนียม', englishPhonetic: '/ˌæl.jəˈmɪn.i.əm/ (แอล-ยู-มิน-นี-อึม)' },
  14: { thaiPhonetic: 'ซิ-ลิ-คอน', englishPhonetic: '/ˈsɪl.ɪ.kən/ (ซิ-ลิ-เคิน)' },
  15: { thaiPhonetic: 'ฟอส-ฟอ-รัส', englishPhonetic: '/ˈfɒs.fər.əs/ (ฟอส-เฟอะ-เริส)' },
  16: { thaiPhonetic: 'กำ-มะ-ถัน (ซัล-เฟอร์)', englishPhonetic: '/ˈsʌl.fər/ (ซัล-เฟอร์)' },
  17: { thaiPhonetic: 'คลอ-รีน', englishPhonetic: '/ˈklɔː.riːn/ (คลอ-รีน)' },
  18: { thaiPhonetic: 'อาร์-กอน', englishPhonetic: '/ˈɑːr.ɡɒn/ (อาร์-กอน)' },
  19: { thaiPhonetic: 'โพ-แทส-เซียม', englishPhonetic: '/pəˈtæs.i.əm/ (เพอะ-แทส-ซี-อึม)' },
  20: { thaiPhonetic: 'แคล-เซียม', englishPhonetic: '/ˈkæl.si.əm/ (แคล-ซี-อึม)' },
  21: { thaiPhonetic: 'สแคน-เดียม', englishPhonetic: '/ˈskæn.di.əm/ (สแกน-ดี-อึม)' },
  22: { thaiPhonetic: 'ไท-เท-เนียม', englishPhonetic: '/taɪˈteɪ.ni.əm/ (ไท-เทย์-นี-อึม)' },
  23: { thaiPhonetic: 'วา-เน-เดียม', englishPhonetic: '/vəˈneɪ.di.əm/ (เวอะ-เนย์-ดี-อึม)' },
  24: { thaiPhonetic: 'โคร-เมียม', englishPhonetic: '/ˈkrəʊ.mi.əm/ (โคร-มี-อึม)' },
  25: { thaiPhonetic: 'แมง-กา-นีส', englishPhonetic: '/ˈmæŋ.ɡə.niːz/ (แมง-เกอะ-นีซ)' },
  26: { thaiPhonetic: 'เหล็ก (ไอ-เอิร์น)', englishPhonetic: '/ˈaɪ.ən/ (อาย-เอิน)' },
  27: { thaiPhonetic: 'โค-บอลต์', englishPhonetic: '/ˈkəʊ.bɒlt/ (โค-บอลต์)' },
  28: { thaiPhonetic: 'นิก-เกิล', englishPhonetic: '/ˈnɪk.əl/ (นิค-เคิล)' },
  29: { thaiPhonetic: 'ทอง-แดง (คอป-เปอร์)', englishPhonetic: '/ˈkɒp.ər/ (ค็อป-เปอร์)' },
  30: { thaiPhonetic: 'สังกะสี (ซิงก์)', englishPhonetic: '/zɪŋk/ (ซิงก์)' },
  31: { thaiPhonetic: 'แกล-เลียม', englishPhonetic: '/ˈɡæl.i.əm/ (แกล-ลี-อึม)' },
  32: { thaiPhonetic: 'เจอร์-เม-เนียม', englishPhonetic: '/dʒɜːˈmeɪ.ni.əm/ (เจอร์-เมย์-นี-อึม)' },
  33: { thaiPhonetic: 'สารหนู (อาร์-เซ-นิก)', englishPhonetic: '/ˈɑːs.nɪk/ (อาร์ส-นิค)' },
  34: { thaiPhonetic: 'ซี-ลี-เนียม', englishPhonetic: '/sɪˈliː.ni.əm/ (ซิ-ลี-นี-อึม)' },
  35: { thaiPhonetic: 'โบร-มีน', englishPhonetic: '/ˈbrəʊ.miːn/ (โบร-มีน)' },
  36: { thaiPhonetic: 'คริป-ทอน', englishPhonetic: '/ˈkrɪp.tɒn/ (คริป-ทอน)' },
  37: { thaiPhonetic: 'รู-บิ-เดียม', englishPhonetic: '/ruːˈbɪd.i.əm/ (รู-บิด-ดี-อึม)' },
  38: { thaiPhonetic: 'สตรอน-เชียม', englishPhonetic: '/ˈstrɒn.ti.əm/ (สตรอน-ที-อึม)' },
  39: { thaiPhonetic: 'อิต-เทรียม', englishPhonetic: '/ˈɪt.ri.əm/ (อิต-ทรี-อึม)' },
  40: { thaiPhonetic: 'เซอร์-โค-เนียม', englishPhonetic: '/zɜːˈkəʊ.ni.əm/ (เซอร์-โค-นี-อึม)' },
  47: { thaiPhonetic: 'เงิน (ซิล-เวอร์)', englishPhonetic: '/ˈsɪl.vər/ (ซิล-เวอร์)' },
  50: { thaiPhonetic: 'ดีบุก (ทิน)', englishPhonetic: '/tɪn/ (ทิน)' },
  53: { thaiPhonetic: 'ไอ-โอ-ดีน', englishPhonetic: '/ˈaɪ.ə.diːn/ (ไอ-เออะ-ดีน)' },
  54: { thaiPhonetic: 'ซี-นอน', englishPhonetic: '/ˈzen.ɒn/ (เซน-นอน)' },
  74: { thaiPhonetic: 'ทังสเตน', englishPhonetic: '/ˈtʌŋ.stən/ (ทัง-สเติน)' },
  78: { thaiPhonetic: 'แพลทินัม (ทองคำขาว)', englishPhonetic: '/ˈplæt.ɪ.nəm/ (แพลท-ทิ-เนิม)' },
  79: { thaiPhonetic: 'ทองคำ (โกลด์)', englishPhonetic: '/ɡəʊld/ (โกลด์)' },
  80: { thaiPhonetic: 'ปรอท (เมอร์-คิว-รี)', englishPhonetic: '/ˈmɜː.kjə.ri/ (เมอร์-คิว-รี)' },
  82: { thaiPhonetic: 'ตะกั่ว (เลด)', englishPhonetic: '/led/ (เล็ด)' },
  92: { thaiPhonetic: 'ยู-เร-เนียม', englishPhonetic: '/jʊəˈreɪ.ni.əm/ (ยู-เรย์-นี-อึม)' },
  94: { thaiPhonetic: 'พลู-โท-เนียม', englishPhonetic: '/pluːˈtəʊ.ni.əm/ (พลู-โท-นี-อึม)' },
};

/**
 * Get pronunciation helper for an element
 */
export function getElementPronunciation(atomicNumber: number, nameTh: string, nameEn: string): ElementPronunciation {
  if (PRONUNCIATIONS[atomicNumber]) {
    return PRONUNCIATIONS[atomicNumber];
  }
  // Generic clean format
  return {
    thaiPhonetic: nameTh,
    englishPhonetic: `${nameEn}`,
  };
}

/**
 * Speak text with guaranteed language and clear voice
 */
export function speakText(
  text: string,
  lang: 'th-TH' | 'en-US',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = lang;
    utterance.rate = 0.85; // Slightly slower than 1.0 for high clarity
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (lang === 'th-TH') {
        const thaiVoice = voices.find((v) => v.lang.startsWith('th') || v.name.includes('Thai'));
        if (thaiVoice) utterance.voice = thaiVoice;
      } else {
        const engVoice = voices.find(
          (v) =>
            (v.lang === 'en-US' || v.lang === 'en-GB' || v.lang.startsWith('en')) &&
            (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || !v.localService)
        ) || voices.find((v) => v.lang.startsWith('en'));
        if (engVoice) utterance.voice = engVoice;
      }
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    if (onError) onError();
    return false;
  }
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
