import { GoogleGenAI } from "@google/genai";

export type GrievanceAnalysis = {
  language: string;
  category: string;
  subcategory: string;
  department: string;
  authority_level: string;
  urgency_score: number;
  urgency: string;
  safety_risks: string[];
  summary: string;
  estimated_resolution: string;
  reasoning: string[];
};

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

/* -------------------------------------------------------------------------- */
/*                              Helper functions                              */
/* -------------------------------------------------------------------------- */

const hasAny = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword.toLowerCase()));

const clampScore = (score: number) =>
  Math.max(0, Math.min(100, Math.round(score)));

const getUrgencyLabel = (score: number) => {
  if (score >= 85) return "CRITICAL";
  if (score >= 65) return "HIGH";
  if (score >= 35) return "MEDIUM";
  return "LOW";
};

const shortSummary = (complaint: string) =>
  complaint.length > 180
    ? `${complaint.substring(0, 177)}...`
    : complaint;

/* -------------------------------------------------------------------------- */
/*                         Multilingual local classifier                      */
/* -------------------------------------------------------------------------- */

const fallbackAnalysis = (
  complaint: string,
  language: string
): GrievanceAnalysis => {
  const text = complaint.toLowerCase().trim();

  let category = "Civic Services";
  let subcategory = "General Public Issue";
  let department = "Municipal Administration";
  let authority_level = "Local Government";

  let urgency_score = 45;
  let urgency = "MEDIUM";

  const safety_risks: string[] = [];
  const reasoning: string[] = [];

  /* ---------------------------------------------------------------------- */
  /*                            EMERGENCY / FIRE                            */
  /* ---------------------------------------------------------------------- */

  const emergency = hasAny(text, [
    "emergency",
    "emergencies",
    "life threatening",
    "life-threatening",
    "critical emergency",
    "ambulance",
    "accident",
    "injured",
    "injury",
    "fire",
    "burning",
    "explosion",
    "blast",
    "rescue",

    "आपातकाल",
    "आपात",
    "आग",
    "दुर्घटना",
    "घायल",
    "एम्बुलेंस",

    "అత్యవసరం",
    "అత్యవసర",
    "అగ్ని",
    "ప్రమాదం",
    "గాయపడిన",
    "అంబులెన్స్",

    "அவசரம்",
    "தீ",
    "விபத்து",
    "காயம்",
    "ஆம்புலன்ஸ்",

    "ಅತ್ಯಾವಶ್ಯಕ",
    "ಬೆಂಕಿ",
    "ಅಪಘಾತ",
    "ಗಾಯ",
    "ಆಂಬ್ಯುಲೆನ್ಸ್",

    "আগুন",
    "দুর্ঘটনা",
    "জরুরি",
    "অ্যাম্বুলেন্স",

    "आग",
    "दुर्घटना",
    "आपत्कालीन",

    "आग",
    "दुर्घटना",
    "आपत्काल",
  ]);

  if (emergency) {
    category = "Emergency Services";
    subcategory = "Emergency / Immediate Public Safety";
    department = "Emergency Response Services";
    authority_level = "District / Emergency Authority";
    urgency_score = 92;
    urgency = "CRITICAL";

    safety_risks.push("Immediate public safety risk");

    reasoning.push(
      "The complaint contains indicators of an emergency, accident, injury, fire, or immediate danger."
    );

    reasoning.push(
      "The situation may require immediate attention from emergency authorities."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                               HEALTHCARE                               */
  /* ---------------------------------------------------------------------- */

  const healthcare = hasAny(text, [
    "hospital",
    "doctor",
    "health",
    "healthcare",
    "medical",
    "clinic",
    "medicine",
    "medicines",
    "patient",
    "treatment",
    "ambulance",
    "blood",
    "disease",
    "infection",

    "अस्पताल",
    "डॉक्टर",
    "स्वास्थ्य",
    "चिकित्सा",
    "दवा",
    "मरीज",
    "इलाज",
    "खून",

    "ఆసుపత్రి",
    "హాస్పిటల్",
    "డాక్టర్",
    "ఆరోగ్యం",
    "వైద్యం",
    "మందులు",
    "రోగి",
    "చికిత్స",
    "రక్తం",

    "மருத்துவமனை",
    "மருத்துவர்",
    "சுகாதாரம்",
    "மருத்துவம்",
    "மருந்து",
    "நோயாளி",
    "சிகிச்சை",

    "ಆಸ್ಪತ್ರೆ",
    "ವೈದ್ಯರು",
    "ಆರೋಗ್ಯ",
    "ವೈದ್ಯಕೀಯ",
    "ಔಷಧಿ",
    "ರೋಗಿ",
    "ಚಿಕಿತ್ಸೆ",

    "হাসপাতাল",
    "ডাক্তার",
    "স্বাস্থ্য",
    "চিকিৎসা",
    "ওষুধ",
    "রোগী",

    "દવાખાનું",
    "હોસ્પિટલ",
    "ડોક્ટર",
    "આરોગ્ય",
    "દવા",
    "દર્દી",

    "மருத்துவமனை",
    "മരുന്ന്",
    "ആശുപത്രി",
    "ഡോക്ടർ",
    "ആരോഗ്യം",
  ]);

  if (!emergency && healthcare) {
    category = "Healthcare";
    subcategory = "Public Health Service";
    department = "Health Department";
    authority_level = "District Health Authority";

    urgency_score = Math.max(70, urgency_score);
    urgency = getUrgencyLabel(urgency_score);

    reasoning.push(
      "The complaint contains healthcare or medical-service indicators."
    );

    reasoning.push(
      "Healthcare service issues may directly affect citizen wellbeing."
    );

    safety_risks.push("Potential health risk");
  }

  /* ---------------------------------------------------------------------- */
  /*                          ROAD / INFRASTRUCTURE                          */
  /* ---------------------------------------------------------------------- */

  const road = hasAny(text, [
    /* English */
    "road",
    "roads",
    "pothole",
    "potholes",
    "street is damaged",
    "road is damaged",
    "broken road",
    "road repair",
    "road damage",
    "road maintenance",
    "waterlogged road",
    "waterlogging",
    "traffic road",

    /* Hindi / Roman Hindi */
    "sadak",
    "sadke",
    "sadak kharab",
    "sadak toot",
    "sadak marammat",
    "sadak ki marammat",
    "gaddha",
    "gaddhe",
    "raasta",
    "rasta",
    "raaste",

    /* Telugu */
    "రోడ్డు",
    "రోడ్లు",
    "రోడ్",
    "గుంత",
    "గుంతలు",
    "రహదారి",
    "రహదారులు",

    /* Tamil */
    "சாலை",
    "சாலைகள்",
    "சாலை சேதம்",
    "குழி",

    /* Kannada */
    "ರಸ್ತೆ",
    "ರಸ್ತೆಗಳು",
    "ಗುಂಡಿ",
    "ರಸ್ತೆ ಹಾಳಾಗಿದೆ",

    /* Malayalam */
    "റോഡ്",
    "റോഡുകൾ",
    "കുഴി",
    "റോഡ് തകർന്നു",

    /* Bengali */
    "রাস্তা",
    "রাস্তাটা",
    "রাস্তায়",
    "রাস্তার",
    "গর্ত",

    /* Gujarati */
    "રસ્તો",
    "રસ્તા",
    "રસ્તાની",
    "ખાડો",
    "ખાડા",

    /* Marathi */
    "रस्ता",
    "रस्ते",
    "रस्त्याचा",
    "खड्डा",
    "खड्डे",

    /* Punjabi */
    "ਸੜਕ",
    "ਸੜਕਾਂ",
    "ਸੜਕ ਟੁੱਟੀ",
    "ਟੋਆ",
    "ਟੋਏ",

    /* Odia */
    "ରାସ୍ତା",
    "ରାସ୍ତାଟି",
    "ରାସ୍ତାର",
    "ଖାଲ",

    /* Assamese */
    "ৰাস্তা",
    "পথ",
    "ৰাস্তাৰ",
    "গাঁত",

    /* Nepali */
    "सडक",
    "बाटो",
    "खाल्डो",
    "सडक बिग्रिएको",

    /* Konkani / common Roman forms */
    "rasto",
    "rasta",
    "road kharab",

    /* Bodo / Romanized */
    "rastani",
    "rasta",
    "roadni",
  ]);

  if (!emergency && !healthcare && road) {
    category = "Roads & Infrastructure";
    subcategory = "Road Damage / Pothole";
    department = "Public Works / Roads";
    authority_level = "Local Government";

    urgency_score = 68;
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains indicators of road damage, potholes, road repair, or road infrastructure problems."
    );

    reasoning.push(
      "Road damage can create risks for pedestrians, cyclists, and vehicles."
    );

    safety_risks.push("Road safety risk");
  }

  /* ---------------------------------------------------------------------- */
  /*                         WATER / DRAINAGE / SEWAGE                       */
  /* ---------------------------------------------------------------------- */

  const drainage = hasAny(text, [
    "drain",
    "drainage",
    "sewage",
    "sewer",
    "sewerage",
    "blocked drain",
    "open drain",
    "drain overflow",
    "dirty water",
    "wastewater",
    "waterlogging",
    "stagnant water",

    "naali",
    "nali",
    "nali jam",
    "ganda pani",
    "ganda paani",

    "नाली",
    "नालियां",
    "सीवेज",
    "गंदा पानी",
    "जलभराव",

    "డ్రైనేజీ",
    "కాలువ",
    "మురుగు",
    "మురుగునీరు",
    "నీరు నిలిచిపోయింది",

    "வடிகால்",
    "கழிவுநீர்",
    "சாக்கடை",
    "தேங்கிய நீர்",

    "ಚರಂಡಿ",
    "ಒಳಚರಂಡಿ",
    "ಕೊಳಚೆ ನೀರು",

    "নর্দমা",
    "নিকাশি",
    "পয়ঃনিষ্কাশন",
    "জল জমে",

    "ડ્રેનેજ",
    "ગટર",
    "ગંદુ પાણી",
    "પાણી ભરાઈ",

    "नाला",
    "नाले",
    "सांडपाणी",

    "ନାଳ",
    "ଡ୍ରେନେଜ",
    "ମଇଳା ପାଣି",

    "ढल",
    "नाली",
  ]);

  if (!emergency && !healthcare && drainage) {
    category = "Water & Sanitation";
    subcategory = "Drainage / Sewage";
    department = "Water & Sanitation";
    authority_level = "Local Government";

    urgency_score = 72;
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains indicators of drainage, sewage, stagnant water, or sanitation problems."
    );

    reasoning.push(
      "Drainage and sewage problems can create public health and environmental risks."
    );

    safety_risks.push("Public health risk");
  }

  /* ---------------------------------------------------------------------- */
  /*                             GARBAGE / WASTE                             */
  /* ---------------------------------------------------------------------- */

  const garbage = hasAny(text, [
    "garbage",
    "trash",
    "waste",
    "rubbish",
    "litter",
    "solid waste",
    "garbage collection",
    "waste collection",

    "kachra",
    "kuda",
    "kuḍā",
    "kacharaa",
    "kachra jama",
    "kachra nahi uthaya",

    "कचरा",
    "कूड़ा",
    "कचरे",
    "कूड़े",

    "చెత్త",
    "వ్యర్థాలు",
    "చెత్త సేకరణ",

    "குப்பை",
    "கழிவு",
    "குப்பைகள்",

    "ಕಸ",
    "ತ್ಯಾಜ್ಯ",
    "ಕಸ ಸಂಗ್ರಹ",

    "আবর্জনা",
    "বর্জ্য",
    "আবর্জনা জমে",

    "કચરો",
    "કચરા",
    "કચરો ભરાયો",

    "कचरा",
    "कचरा साचले",

    "ਕੂੜਾ",
    "ਕੂੜੇ",

    "ଆବର୍ଜନା",
    "ବର୍ଜ୍ୟ",
    "ଅଳିଆ",

    "फोहोर",
    "फोहोरमैला",

    "rubbish",
    "aborjona",
    "aborgona",
  ]);

  if (!emergency && !healthcare && !drainage && garbage) {
    category = "Waste Management";
    subcategory = "Garbage / Waste Collection";
    department = "Municipal Sanitation";
    authority_level = "Local Government";

    urgency_score = 58;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to garbage, waste accumulation, or waste collection."
    );

    reasoning.push(
      "Accumulated waste can create sanitation and environmental concerns."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                              STREET LIGHTS                             */
  /* ---------------------------------------------------------------------- */

  const streetLight = hasAny(text, [
    "street light",
    "streetlight",
    "street lamp",
    "street lights",
    "public light",
    "road light",
    "lamp not working",

    "street light nahi",
    "streetlight kharab",
    "sadak ki light",
    "gali ki light",

    "स्ट्रीट लाइट",
    "सड़क की लाइट",
    "गली की लाइट",
    "बत्ती खराब",

    "స్ట్రీట్ లైట్",
    "వీధి దీపం",
    "లైట్ పనిచేయడం లేదు",

    "தெருவிளக்கு",
    "தெரு விளக்கு",
    "சாலை விளக்கு",

    "ಬೀದಿ ದೀಪ",
    "ರಸ್ತೆ ದೀಪ",

    "রাস্তার আলো",
    "স্ট্রিট লাইট",

    "રસ્તાની લાઈટ",
    "સ્ટ્રીટ લાઇટ",

    "रस्त्यावरील दिवा",
    "पथदिवा",

    "ਸੜਕ ਦੀ ਲਾਈਟ",
    "ਸਟ੍ਰੀਟ ਲਾਈਟ",

    "ରାସ୍ତା ଆଲୋକ",
    "ଷ୍ଟ୍ରିଟ୍ ଲାଇଟ",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    streetLight
  ) {
    category = "Public Infrastructure";
    subcategory = "Street Lighting";
    department = "Municipal Electrical Services";
    authority_level = "Local Government";

    urgency_score = 52;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to public street lighting."
    );

    reasoning.push(
      "Poor street lighting can reduce visibility and public safety."
    );

    safety_risks.push("Visibility / public safety concern");
  }

  /* ---------------------------------------------------------------------- */
  /*                              ELECTRICITY                               */
  /* ---------------------------------------------------------------------- */

  const electricity = hasAny(text, [
    "electricity",
    "electric",
    "power cut",
    "power outage",
    "power supply",
    "current",
    "transformer",
    "electric pole",
    "electric wire",
    "power line",

    "bijli",
    "bijlee",
    "light nahi",
    "current nahi",
    "bijli nahi",

    "बिजली",
    "विद्युत",
    "बिजली कटौती",
    "बिजली नहीं",

    "విద్యుత్",
    "కరెంట్",
    "కరెంట్ లేదు",
    "విద్యుత్ సరఫరా",

    "மின்சாரம்",
    "மின்தடை",

    "ವಿದ್ಯುತ್",
    "ಕರೆಂಟ್",
    "ವಿದ್ಯುತ್ ಕಡಿತ",

    "বিদ্যুৎ",
    "কারেন্ট",
    "বিদ্যুৎ নেই",

    "વીજળી",
    "વીજ પુરવઠો",
    "કરંટ",

    "वीज",
    "वीज पुरवठा",

    "ਬਿਜਲੀ",
    "ਕਰੰਟ",

    "ବିଦ୍ୟୁତ",
    "ବିଦ୍ୟୁତ କାଟ",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    electricity
  ) {
    category = "Electricity";
    subcategory = "Power Supply Issue";
    department = "Electricity Distribution";
    authority_level = "District / Local Utility";

    urgency_score = 65;
    urgency = "HIGH";

    reasoning.push(
      "The complaint appears related to electricity or power supply."
    );

    reasoning.push(
      "Electricity-related complaints may require timely technical attention."
    );

    safety_risks.push("Potential electrical safety concern");
  }

  /* ---------------------------------------------------------------------- */
  /*                              WATER SUPPLY                              */
  /* ---------------------------------------------------------------------- */

  const waterSupply = hasAny(text, [
    "water supply",
    "drinking water",
    "tap water",
    "water shortage",
    "no water",
    "water problem",
    "water not coming",
    "water connection",

    "pani nahi",
    "paani nahi",
    "pani supply",
    "paani supply",
    "nal ka pani",

    "पानी नहीं",
    "पानी की समस्या",
    "पानी की सप्लाई",
    "पेयजल",
    "नल का पानी",

    "నీటి సరఫరా",
    "నీరు రావడం లేదు",
    "తాగునీరు",
    "నీటి సమస్య",

    "குடிநீர்",
    "தண்ணீர் வரவில்லை",
    "தண்ணீர் பிரச்சனை",

    "ಕುಡಿಯುವ ನೀರು",
    "ನೀರು ಬರುತ್ತಿಲ್ಲ",
    "ನೀರಿನ ಸಮಸ್ಯೆ",

    "পানীয় জল",
    "জল আসছে না",
    "জলের সমস্যা",

    "પીવાનું પાણી",
    "પાણી આવતું નથી",
    "પાણીની સમસ્યા",

    "पिण्याचे पाणी",
    "पाणी येत नाही",

    "ਪੀਣ ਵਾਲਾ ਪਾਣੀ",
    "ਪਾਣੀ ਨਹੀਂ ਆ ਰਿਹਾ",

    "ପିଇବା ପାଣି",
    "ପାଣି ଆସୁନାହିଁ",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    waterSupply
  ) {
    category = "Water Supply";
    subcategory = "Drinking Water / Water Supply";
    department = "Water Supply Department";
    authority_level = "Local Government";

    urgency_score = 64;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to drinking water or public water supply."
    );

    reasoning.push(
      "Water supply problems can affect basic household and public needs."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                         TRAFFIC / TRANSPORT                             */
  /* ---------------------------------------------------------------------- */

  const traffic = hasAny(text, [
    "traffic",
    "traffic jam",
    "signal",
    "traffic signal",
    "traffic light",
    "illegal parking",
    "parking problem",
    "congestion",
    "bus service",
    "bus stop",
    "public transport",

    "yaatayat",
    "traffic jam",
    "signal kharab",

    "यातायात",
    "ट्रैफिक",
    "ट्रैफिक जाम",
    "सिग्नल",
    "अवैध पार्किंग",

    "ట్రాఫిక్",
    "ట్రాఫిక్ జామ్",
    "సిగ్నల్",
    "పార్కింగ్",

    "போக்குவரத்து",
    "போக்குவரத்து நெரிசல்",
    "சிக்னல்",

    "ಸಂಚಾರ",
    "ಟ್ರಾಫಿಕ್",
    "ಸಿಗ್ನಲ್",

    "ট্রাফিক",
    "যানজট",
    "সিগন্যাল",

    "ટ્રાફિક",
    "ટ્રાફિક જામ",
    "સિગ્નલ",

    "वाहतूक",
    "वाहतूक कोंडी",

    "ਟ੍ਰੈਫਿਕ",
    "ਜਾਮ",

    "ଯାତାୟାତ",
    "ଟ୍ରାଫିକ",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    !waterSupply &&
    traffic
  ) {
    category = "Traffic & Transport";
    subcategory = "Traffic / Public Transport Issue";
    department = "Traffic / Transport Authority";
    authority_level = "Local / District Authority";

    urgency_score = 62;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to traffic, road signals, parking, or public transport."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                            STRAY ANIMALS                               */
  /* ---------------------------------------------------------------------- */

  const animals = hasAny(text, [
    "stray dog",
    "stray dogs",
    "street dog",
    "stray animal",
    "animal attack",
    "dog bite",
    "dogs",

    "awara kutta",
    "kutta",
    "kutton",

    "आवारा कुत्ता",
    "आवारा पशु",
    "कुत्ता काटने",
    "कुत्ते",

    "వీధి కుక్క",
    "కుక్కలు",
    "వీధి జంతువులు",

    "தெரு நாய்",
    "நாய்கள்",

    "ಬೀದಿ ನಾಯಿ",
    "ನಾಯಿಗಳು",

    "রাস্তার কুকুর",
    "কুকুর",

    "રખડતા કૂતરા",
    "કૂતરા",

    "भटके कुत्रे",
    "कुत्रे",

    "ਆਵਾਰਾ ਕੁੱਤੇ",
    "ਕੁੱਤੇ",

    "ବୁଲା କୁକୁର",
    "କୁକୁର",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    !waterSupply &&
    !traffic &&
    animals
  ) {
    category = "Animal Control";
    subcategory = "Stray Animals";
    department = "Municipal Animal Control";
    authority_level = "Local Government";

    urgency_score = 60;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to stray animals or animal-control concerns."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                               POLLUTION                                */
  /* ---------------------------------------------------------------------- */

  const pollution = hasAny(text, [
    "pollution",
    "air pollution",
    "water pollution",
    "smoke pollution",
    "dirty air",
    "industrial pollution",
    "chemical waste",

    "pradushan",
    "वायु प्रदूषण",
    "जल प्रदूषण",
    "प्रदूषण",

    "కాలుష్యం",
    "వాయు కాలుష్యం",
    "నీటి కాలుష్యం",

    "மாசு",
    "காற்று மாசு",
    "நீர் மாசு",

    "ಮಾಲಿನ್ಯ",
    "ವಾಯು ಮಾಲಿನ್ಯ",

    "দূষণ",
    "বায়ু দূষণ",
    "জল দূষণ",

    "પ્રદૂષણ",
    "હવા પ્રદૂષણ",

    "प्रदूषण",
    "हवा प्रदूषण",

    "ਪ੍ਰਦੂਸ਼ਣ",
    "ਹਵਾ ਪ੍ਰਦੂਸ਼ਣ",

    "ପ୍ରଦୂଷଣ",
    "ବାୟୁ ପ୍ରଦୂଷଣ",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    !waterSupply &&
    !traffic &&
    !animals &&
    pollution
  ) {
    category = "Environment";
    subcategory = "Pollution";
    department = "Pollution Control / Environment";
    authority_level = "District / Local Authority";

    urgency_score = 63;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint contains indicators of environmental or pollution concerns."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                         PARKS / PUBLIC SPACES                          */
  /* ---------------------------------------------------------------------- */

  const parks = hasAny(text, [
    "park",
    "parks",
    "playground",
    "public park",
    "garden",
    "public space",
    "park maintenance",

    "udyan",
    "bagicha",

    "पार्क",
    "उद्यान",
    "बगीचा",
    "खेल का मैदान",

    "పార్క్",
    "ఉద్యానవనం",
    "ఆట స్థలం",

    "பூங்கா",
    "விளையாட்டு மைதானம்",

    "ಉದ್ಯಾನವನ",
    "ಆಟದ ಮೈದಾನ",

    "পার্ক",
    "উদ্যান",
    "খেলার মাঠ",

    "પાર્ક",
    "બગીચો",

    "उद्यान",
    "बाग",

    "ਪਾਰਕ",
    "ਬਾਗ",

    "ପାର୍କ",
    "ଉଦ୍ୟାନ",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    !waterSupply &&
    !traffic &&
    !animals &&
    !pollution &&
    parks
  ) {
    category = "Public Spaces";
    subcategory = "Parks / Playground Maintenance";
    department = "Municipal Parks Department";
    authority_level = "Local Government";

    urgency_score = 42;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to maintenance of public parks or recreational spaces."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                               EDUCATION                                */
  /* ---------------------------------------------------------------------- */

  const education = hasAny(text, [
    "school",
    "college",
    "education",
    "teacher",
    "classroom",
    "student",
    "school building",

    "school problem",
    "vidyalaya",

    "स्कूल",
    "विद्यालय",
    "शिक्षा",
    "शिक्षक",
    "छात्र",

    "పాఠశాల",
    "విద్య",
    "ఉపాధ్యాయుడు",
    "విద్యార్థి",

    "பள்ளி",
    "கல்வி",
    "ஆசிரியர்",
    "மாணவர்",

    "ಶಾಲೆ",
    "ಶಿಕ್ಷಣ",
    "ಶಿಕ್ಷಕ",
    "ವಿದ್ಯಾರ್ಥಿ",

    "স্কুল",
    "শিক্ষা",
    "শিক্ষক",
    "ছাত্র",

    "શાળા",
    "શિક્ષણ",
    "શિક્ષક",
    "વિદ્યાર્થી",

    "शाळा",
    "शिक्षण",
    "शिक्षक",
    "विद्यार्थी",

    "ਸਕੂਲ",
    "ਸਿੱਖਿਆ",
    "ਅਧਿਆਪਕ",
    "ਵਿਦਿਆਰਥੀ",

    "ସ୍କୁଲ",
    "ଶିକ୍ଷା",
    "ଶିକ୍ଷକ",
    "ଛାତ୍ର",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    !waterSupply &&
    !traffic &&
    !animals &&
    !pollution &&
    !parks &&
    education
  ) {
    category = "Education";
    subcategory = "Public Education Service";
    department = "Education Department";
    authority_level = "District Education Authority";

    urgency_score = 40;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to education services or public educational facilities."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                          ADMINISTRATION / CORRUPTION                    */
  /* ---------------------------------------------------------------------- */

  const corruption = hasAny(text, [
    "bribe",
    "bribery",
    "corruption",
    "corrupt",
    "illegal payment",
    "demanding money",
    "money demanded",
    "commission",
    "favor",

    "rishwat",
    "ghoos",
    "bhrashtachar",

    "रिश्वत",
    "घूस",
    "भ्रष्टाचार",

    "లంచం",
    "అవినీతి",

    "லஞ்சம்",
    "ஊழல்",

    "ಲಂಚ",
    "ಭ್ರಷ್ಟಾಚಾರ",

    "ঘুষ",
    "দুর্নীতি",

    "લાંચ",
    "ભ્રષ્ટાચાર",

    "लाच",
    "भ्रष्टाचार",

    "ਰਿਸ਼ਵਤ",
    "ਭ੍ਰਿਸ਼ਟਾਚਾਰ",

    "ଲାଞ୍ଚ",
    "ଦୁର୍ନୀତି",
  ]);

  if (
    !emergency &&
    !healthcare &&
    !drainage &&
    !garbage &&
    !streetLight &&
    !electricity &&
    !waterSupply &&
    !traffic &&
    !animals &&
    !pollution &&
    !parks &&
    !education &&
    corruption
  ) {
    category = "Public Administration";
    subcategory = "Corruption / Bribery Complaint";
    department = "Vigilance / Anti-Corruption Authority";
    authority_level = "District / State Authority";

    urgency_score = 70;
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains indicators of bribery, corruption, or improper payment demands."
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                            URGENCY ADJUSTMENT                          */
  /* ---------------------------------------------------------------------- */

  const trueUrgency = hasAny(text, [
    "immediate danger",
    "life in danger",
    "people are injured",
    "someone is injured",
    "children are in danger",
    "elderly people are in danger",
    "fire",
    "explosion",
    "electrical wire fallen",
    "live wire",
    "gas leak",
    "accident happening",

    "जान का खतरा",
    "लोग घायल",
    "बच्चों को खतरा",

    "ప్రాణాలకు ప్రమాదం",
    "ప్రజలు గాయపడ్డారు",
    "పిల్లలకు ప్రమాదం",

    "உயிருக்கு ஆபத்து",
    "மக்கள் காயம்",

    "ಜೀವಕ್ಕೆ ಅಪಾಯ",
    "ಜನರು ಗಾಯಗೊಂಡಿದ್ದಾರೆ",

    "জীবনের ঝুঁকি",
    "মানুষ আহত",

    "જીવનું જોખમ",
    "લોકો ઘાયલ",

    "जीवाला धोका",
    "लोक जखमी",

    "ਜਾਨ ਨੂੰ ਖਤਰਾ",
    "ਲੋਕ ਜ਼ਖਮੀ",

    "ଜୀବନ ପ୍ରତି ବିପଦ",
    "ଲୋକ ଆହତ",
  ]);

  if (trueUrgency && !emergency) {
    urgency_score = Math.max(urgency_score, 82);
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains a specific indicator of an immediate safety or wellbeing concern."
    );

    safety_risks.push("Immediate attention may be required");
  }

  /* ---------------------------------------------------------------------- */
  /*                           Final fallback reasoning                      */
  /* ---------------------------------------------------------------------- */

  if (reasoning.length === 0) {
    reasoning.push(
      "The complaint was analyzed using Jan-Seva's multilingual local fallback classifier."
    );

    reasoning.push(
      "No sufficiently specific routing category was detected, so a general civic-services route was selected."
    );
  }

  urgency_score = clampScore(urgency_score);
  urgency = getUrgencyLabel(urgency_score);

  return {
    language,
    category,
    subcategory,
    department,
    authority_level,
    urgency_score,
    urgency,
    safety_risks: [...new Set(safety_risks)],
    summary: shortSummary(complaint),
    estimated_resolution:
      urgency_score >= 75
        ? "Priority review recommended"
        : "Standard administrative review",
    reasoning: [...new Set(reasoning)],
  };
};

/* -------------------------------------------------------------------------- */
/*                              Gemini normalizer                             */
/* -------------------------------------------------------------------------- */

function normalizeAnalysis(
  value: Partial<GrievanceAnalysis>,
  language: string,
  complaint: string
): GrievanceAnalysis {
  let score = Number(value.urgency_score);

  if (!Number.isFinite(score)) {
    score = 50;
  }

  score = clampScore(score);

  let urgency = String(value.urgency || "").toUpperCase();

  /*
   * Prevent the model from turning ordinary "please fix quickly"
   * language into CRITICAL.
   */
  const lowerComplaint = complaint.toLowerCase();

  const containsOnlyNormalUrgency = hasAny(lowerComplaint, [
    "quickly",
    "soon",
    "please repair",
    "please fix",
    "taratari",
    "jaldi",
    "jald",
    "tvarit",
    "lavkar",
    "vegam",
    "soonest",
  ]);

  const containsRealEmergency = hasAny(lowerComplaint, [
    "accident",
    "injured",
    "injury",
    "fire",
    "explosion",
    "life in danger",
    "immediate danger",
    "ambulance",
    "emergency",
    "live wire",
    "gas leak",

    "दुर्घटना",
    "घायल",
    "आग",
    "आपातकाल",
    "जान का खतरा",

    "ప్రమాదం",
    "గాయపడ్డారు",
    "అత్యవసరం",
    "ప్రాణాలకు ప్రమాదం",

    "விபத்து",
    "காயம்",
    "அவசரம்",

    "ಅಪಘಾತ",
    "ಗಾಯ",
    "ಅತ್ಯಾವಶ್ಯಕ",

    "দুর্ঘটনা",
    "আহত",
    "জরুরি",
    "আগুন",

    "લગ અકસ્માત",
    "ઇજા",
    "કટોકટી",

    "अपघात",
    "जखमी",
    "आग",

    "ਹਾਦਸਾ",
    "ਜ਼ਖਮੀ",
    "ਐਮਰਜੈਂਸੀ",

    "ଦୁର୍ଘଟଣା",
    "ଆହତ",
    "ଜରୁରୀ",
  ]);

  if (containsOnlyNormalUrgency && !containsRealEmergency) {
    if (score >= 85) {
      score = 68;
    }

    if (urgency === "CRITICAL") {
      urgency = "HIGH";
    }
  }

  if (!["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(urgency)) {
    urgency = getUrgencyLabel(score);
  }

  /*
   * Hard safety guard:
   * CRITICAL should not be returned without an actual emergency indicator.
   */
  if (urgency === "CRITICAL" && !containsRealEmergency) {
    urgency = score >= 65 ? "HIGH" : "MEDIUM";
    score = Math.min(score, 79);
  }

  return {
    language: value.language || language,
    category: value.category || "Civic Services",
    subcategory: value.subcategory || "General Public Issue",
    department: value.department || "Municipal Administration",
    authority_level: value.authority_level || "Local Government",
    urgency_score: score,
    urgency,
    safety_risks: Array.isArray(value.safety_risks)
      ? value.safety_risks.map(String)
      : [],
    summary: value.summary || shortSummary(complaint),
    estimated_resolution:
      value.estimated_resolution ||
      (score >= 75
        ? "Priority review recommended"
        : "Standard administrative review"),
    reasoning: Array.isArray(value.reasoning)
      ? value.reasoning.map(String).slice(0, 4)
      : ["AI classification completed."],
  };
}

/* -------------------------------------------------------------------------- */
/*                              Main AI function                              */
/* -------------------------------------------------------------------------- */

export async function analyzeGrievance(
  complaint: string,
  language: string
): Promise<GrievanceAnalysis> {
  const fallback = fallbackAnalysis(complaint, language);

  if (!complaint.trim()) {
    return {
      ...fallback,
      category: "Civic Services",
      subcategory: "General Public Issue",
      department: "Municipal Administration",
      urgency_score: 20,
      urgency: "LOW",
      summary: "No complaint text was provided.",
      reasoning: ["No complaint text was available for classification."],
    };
  }

  /*
   * If Gemini key is missing, the application still works.
   */
  if (!apiKey) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are Jan-Seva AI, an AI-assisted multilingual public grievance routing system for India.

Your job is to understand a citizen complaint and identify the most appropriate government-service routing category.

IMPORTANT:
The citizen may write in ANY of India's 22 Scheduled Languages.
The complaint may use:
1. Native script.
2. Romanized Indian language.
3. A mixture of English and an Indian language.
4. Informal spelling.
5. Local/common vocabulary.

Citizen-selected language:
${language}

Citizen complaint:
${complaint}

Return ONLY valid JSON.

Use exactly this structure:

{
  "language": "detected or selected language",
  "category": "specific government service category",
  "subcategory": "specific issue",
  "department": "responsible department category",
  "authority_level": "appropriate authority level",
  "urgency_score": 0,
  "urgency": "LOW | MEDIUM | HIGH | CRITICAL",
  "safety_risks": [],
  "summary": "short summary preserving the citizen's meaning",
  "estimated_resolution": "reasonable administrative review expectation",
  "reasoning": [
    "reason 1",
    "reason 2"
  ]
}

CLASSIFICATION RULES:

1. Understand the meaning of the complaint, not just individual keywords.

2. Preserve the citizen's intended meaning even if grammar, spelling, transliteration, or wording is imperfect.

3. The citizen-selected language is a strong signal, but use the actual complaint text to understand the issue.

4. Prefer a specific category over "General Public Issue" whenever the complaint clearly identifies a problem.

5. Road examples:
   - damaged road
   - pothole
   - broken road
   - road repair
   - waterlogged road
   should normally map to:
   category = "Roads & Infrastructure"
   subcategory = "Road Damage / Pothole"
   department = "Public Works / Roads"

6. Garbage examples:
   - garbage
   - waste
   - rubbish
   - accumulated garbage
   - waste collection
   should normally map to:
   category = "Waste Management"
   subcategory = "Garbage / Waste Collection"
   department = "Municipal Sanitation"

7. Drainage examples:
   - blocked drain
   - sewage
   - open drain
   - stagnant water
   - wastewater
   should normally map to:
   category = "Water & Sanitation"
   subcategory = "Drainage / Sewage"
   department = "Water & Sanitation"

8. Street-light examples should normally map to:
   category = "Public Infrastructure"
   subcategory = "Street Lighting"
   department = "Municipal Electrical Services"

9. Electricity supply examples should normally map to:
   category = "Electricity"
   subcategory = "Power Supply Issue"
   department = "Electricity Distribution"

10. Drinking-water supply examples should normally map to:
    category = "Water Supply"
    subcategory = "Drinking Water / Water Supply"
    department = "Water Supply Department"

11. Healthcare complaints should normally map to:
    category = "Healthcare"
    subcategory = "Public Health Service"
    department = "Health Department"

12. Traffic, signal, congestion, parking, or public transport complaints should normally map to:
    category = "Traffic & Transport"
    subcategory = "Traffic / Public Transport Issue"
    department = "Traffic / Transport Authority"

13. Stray animal complaints should normally map to:
    category = "Animal Control"
    subcategory = "Stray Animals"
    department = "Municipal Animal Control"

14. Pollution complaints should normally map to:
    category = "Environment"
    subcategory = "Pollution"
    department = "Pollution Control / Environment"

15. Education complaints should normally map to:
    category = "Education"
    subcategory = "Public Education Service"
    department = "Education Department"

16. Bribery/corruption complaints should normally map to:
    category = "Public Administration"
    subcategory = "Corruption / Bribery Complaint"
    department = "Vigilance / Anti-Corruption Authority"

URGENCY RULES:

17. urgency_score must be an integer from 0 to 100.

18. CRITICAL must NOT be used simply because the citizen asks for fast, quick, urgent, or immediate action.

19. Words equivalent to:
    "quickly", "soon", "taratari", "jaldi", "immediately", "as soon as possible"
    do NOT by themselves mean CRITICAL.

20. CRITICAL should generally require clear evidence of an immediate serious threat such as:
    - fire
    - explosion
    - major accident
    - serious injury
    - immediate threat to life
    - live electrical wire creating immediate danger
    - gas leak
    - active emergency
    - similarly severe imminent danger

21. HIGH should be used for significant public safety, health, sanitation, infrastructure, or service problems that need prompt attention but are not necessarily life-threatening.

22. MEDIUM should be used for ordinary civic complaints requiring administrative action.

23. LOW should be used for minor, informational, or low-impact issues.

24. Do not invent:
    - accidents
    - injuries
    - deaths
    - fires
    - threats
    - medical emergencies
    - government officers
    - live government integrations

25. Do not claim that this prototype is directly connected to a real government department.

26. Use generalized department and authority categories.

27. Keep reasoning concise, factual, and explainable.

28. Return no markdown and no code fences. Return JSON only.
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const rawText = response.text?.trim();

    if (!rawText) {
      return fallback;
    }

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return normalizeAnalysis(parsed, language, complaint);
  } catch (error) {
    console.warn(
      "Gemini unavailable. Using local multilingual fallback classifier.",
      error
    );

    return fallback;
  }
}