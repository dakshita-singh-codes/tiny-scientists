import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Smart bilingual science fallback for high-demand or error states
function getSmartScienceFallback(message: string): string {
  const msg = message.toLowerCase();
  
  // Detect Hindi characters
  const isHindi = /[\u0900-\u097F]/.test(message) || msg.includes('kaise') || msg.includes('kyun') || msg.includes('kya');

  if (isHindi) {
    if (msg.includes('sky') || msg.includes('blue') || msg.includes('आसमान') || msg.includes('नीला')) {
      return `आसमान नीला इसलिए दिखाई देता है क्योंकि जब सूर्य का प्रकाश पृथ्वी के वायुमंडल में प्रवेश करता है, तो हवा में मौजूद धूल और गैस के कण प्रकाश को चारों ओर बिखेर देते हैं! 🌈✨\n\nइसे **रैले स्कैटरिंग (Rayleigh Scattering)** कहते हैं। नीला प्रकाश तरंग दैर्ध्य (wavelength) छोटा होने के कारण सबसे अधिक बिखरता है, जिससे हमें आसमान नीला दिखाई देता है! 🪐`;
    }
    if (msg.includes('plant') || msg.includes('eat') || msg.includes('grow') || msg.includes('पौध') || msg.includes('खाना') || msg.includes('प्रकाश संश्लेषण')) {
      return `पौधों को भोजन बनाने के लिए सूर्य के प्रकाश, पानी और कार्बन डाइऑक्साइड की आवश्यकता होती है! 🍃☀️\n\nइस जादुई प्रक्रिया को **प्रकाश संश्लेषण (Photosynthesis)** कहा जाता है। पौधे अपनी पत्तियों में मौजूद 'क्लोरोफिल' की मदद से भोजन बनाते हैं, जिससे वे ऑक्सीजन भी छोड़ते हैं जो हमारे सांस लेने के काम आती है! 🌱🎒`;
    }
    if (msg.includes('gravity') || msg.includes('fall') || msg.includes('earth') || msg.includes('गुरुत्वाकर्षण') || msg.includes('गिर')) {
      return `गुरुत्वाकर्षण (Gravity) ब्रह्मांड का एक अदृश्य खींचाव बल है! 🌍⚡\n\nसर आइजैक न्यूटन ने इसकी खोज तब की जब उन्होंने एक सेब को पेड़ से गिरते देखा। पृथ्वी का विशाल द्रव्यमान हर वस्तु को अपने केंद्र की ओर खींचता है, यही कारण है कि हम जमीन पर टिके रहते हैं और आसमान में नहीं उड़ जाते! 🍎🤖`;
    }
    if (msg.includes('magnet') || msg.includes('push') || msg.includes('attract') || msg.includes('चुंबक') || msg.includes('लोहा')) {
      return `चुंबक में दो ध्रुव होते हैं - उत्तरी ध्रुव (North Pole) और दक्षिणी ध्रुव (South Pole)! 🧲🎒\n\nसमान ध्रुव (जैसे North और North) एक-दूसरे को ढकेलते हैं (Repel), जबकि विपरीत ध्रुव (जैसे North और South) आपस में चिपक जाते हैं (Attract)! यह उनके अदृश्य चुंबकीय क्षेत्र के कारण होता है। ⚡👾`;
    }
    if (msg.includes('seed') || msg.includes('breathe') || msg.includes('mud') || msg.includes('बीज') || msg.includes('सांस') || msg.includes('मिट्टी')) {
      return `मिट्टी के नीचे दबे होने पर भी बीज सांस लेते हैं! 🌾🌱\n\nमिट्टी के छोटे-छोटे कणों के बीच **हवा की सूक्ष्म थैलियां (tiny air pockets)** होती हैं। बीज इन थैलियों से ऑक्सीजन लेते हैं और कार्बन डाइऑक्साइड छोड़ते हैं। इसे कोशिकीय श्वसन (cellular respiration) कहते हैं! 🧪🔬`;
    }
    if (msg.includes('water') || msg.includes('rain') || msg.includes('cloud') || msg.includes('cycle') || msg.includes('पानी') || msg.includes('बारिश') || msg.includes('बादल') || msg.includes('चक्र')) {
      return `यह सब **जल चक्र (Water Cycle)** का कमाल है! 🌧️🌦️\n\nसूरज की गर्मी से नदियों और समुद्र का पानी भाप बनकर ऊपर उड़ता है (वाष्पीकरण), ऊपर जाकर यह ठंडा होकर बादल बनता है (संघनन), और फिर बारिश के रूप में वापस जमीन पर गिरता है! यह चक्र लगातार चलता रहता है। 💧🚀`;
    }
    if (msg.includes('atom') || msg.includes('molecule') || msg.includes('matter') || msg.includes('अणु') || msg.includes('परमाणु') || msg.includes('तत्व')) {
      return `इस दुनिया की हर चीज़ - आपकी पेंसिल, पानी, और खुद आप भी - बहुत छोटे कणों से बनी है जिन्हें **परमाणु (Atoms)** कहते हैं! ⚛️🔬\n\nपरमाणु इतने छोटे होते हैं कि इन्हें साधारण आँखों से नहीं देखा जा सकता। जब कई परमाणु आपस में जुड़ते हैं, तो वे **अणु (Molecules)** बनाते हैं! 🪐🤖`;
    }
    if (msg.includes('electricity') || msg.includes('circuit') || msg.includes('wire') || msg.includes('बिजली') || msg.includes('तार') || msg.includes('बल्ब')) {
      return `बिजली (Electricity) छोटे कणों, जिन्हें इलेक्ट्रॉन्स कहते हैं, के बहने का प्रवाह है! ⚡🔌\n\nयह प्रवाह केवल तभी काम करता है जब उसे एक पूरा बंद रास्ता मिले, जिसे **विद्युत परिपथ (Electrical Circuit)** कहते हैं। जैसे ही स्विच ऑन होता है, सर्किट पूरा होता है और बल्ब जल उठता है! 💡🎒`;
    }
    
    // Default Hindi fallback
    return `वाह! क्या शानदार वैज्ञानिक सवाल है! 🚀✨\n\nवर्तमान में मेरे वास्तविक समय के कृत्रिम मेधा (AI) मस्तिष्क में उच्च मांग के कारण थोड़ा दबाव है, लेकिन विज्ञान कभी नहीं रुकता! आइए एक प्रयोग करें: क्या आप जानते हैं कि जब आप पानी में नमक मिलाते हैं, तो वह बर्फ को तेजी से पिघला देता है? 🧪❄️\n\nचैट बॉक्स के नीचे दिए गए विज्ञान प्रश्नों को टैप करके देखें और नए प्रयोग सीखें! 🤖🌱`;
  } else {
    // English fallbacks
    if (msg.includes('sky') || msg.includes('blue')) {
      return `The sky is blue because of a science magic called **Rayleigh Scattering**! 🌈✨\n\nWhen sunlight enters Earth's atmosphere, it hits gases and dust particles in the air. Sunlight is made of all colors, but blue light travels in smaller, shorter waves, so it gets scattered/bounced around in every direction much more than other colors! That is why the sky looks blue to us! 🪐🤖`;
    }
    if (msg.includes('plant') || msg.includes('eat') || msg.includes('grow')) {
      return `Plants don't have kitchens, but they make their own food using sunlight, water, and carbon dioxide! 🍃☀️\n\nThis super cool process is called **Photosynthesis**. Inside their leaves, they have a green pigment called 'chlorophyll' which traps sunlight to cook their food, and in return, they give us fresh Oxygen to breathe! 🌱🎒`;
    }
    if (msg.includes('gravity') || msg.includes('fall') || msg.includes('earth')) {
      return `Gravity is the invisible superpower of the universe! It is an attractive force that pulls objects toward each other. 🌍⚡\n\nEarth is huge, so it has a massive gravity pull that holds you, the oceans, and the atmosphere down. Without gravity, we would all float away into space! Sir Isaac Newton discovered it when an apple fell on his head! 🍎🤖`;
    }
    if (msg.includes('magnet') || msg.includes('push') || msg.includes('attract')) {
      return `Magnets are super fun! Every magnet has two ends called the **North Pole** and the **South Pole**. 🧲🎒\n\nIf you bring same poles together (like North and North), they push each other away (Repelling!). But if you bring opposite poles together (North and South), they pull and snap together (Attracting!). This is due to their invisible magnetic field. ⚡👾`;
    }
    if (msg.includes('seed') || msg.includes('breathe') || msg.includes('mud')) {
      return `Yes! Seeds are alive and they breathe even under heavy mud! 🌾🌱\n\nBetween the dirt particles, there are **tiny air pockets** filled with oxygen. The buried seed uses this oxygen to perform 'cellular respiration' to get energy and grow its tiny roots! 🧪🔬`;
    }
    if (msg.includes('water') || msg.includes('rain') || msg.includes('cloud') || msg.includes('cycle')) {
      return `It is all part of the magical **Water Cycle**! 🌧️🌦️\n\n1. **Evaporation**: The Sun heats water from rivers and oceans, turning it into vapor.\n2. **Condensation**: The vapor rises, cools down, and forms fluffy clouds.\n3. **Precipitation**: When clouds get too heavy, water falls back as rain or snow! And the cycle starts again! 💧🚀`;
    }
    if (msg.includes('atom') || msg.includes('molecule') || msg.includes('matter')) {
      return `Everything in the universe - your notebook, the water you drink, and even YOU - is made of tiny building blocks called **Atoms**! ⚛️🔬\n\nThey are so small that billions of them can fit on the head of a pin. When atoms join together, they form **Molecules** (like water, which is H₂O)! 🪐🤖`;
    }
    if (msg.includes('electricity') || msg.includes('circuit') || msg.includes('wire')) {
      return `Electricity is the flow of tiny charged particles called electrons moving through a wire! ⚡🔌\n\nFor electricity to flow, it needs a continuous closed loop path called an **Electrical Circuit**. If there is any break (like turning off a switch), the flow stops instantly! 💡🎒`;
    }

    // Default English fallback
    return `Whoa! What a brilliant scientific question! 🚀✨\n\nMy real-time supercomputing brain is currently experiencing high demand from young scientists all over the country, but science never sleeps! Let's explore: Did you know that space is completely silent because there is no air for sound to travel? 🌌✨\n\nTry tapping any of the fun scientific questions below our chat to learn more cool science facts! 🤖🌱`;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for SciBuddy AI Tutor Chat
  app.post("/api/chat", async (req, res) => {
    const { messages } = req.body; // Array of { role: 'user'|'model', text: string }
    const lastUserMsgObj = messages && messages.slice().reverse().find((m: any) => m.role === 'user');
    const userQuery = lastUserMsgObj ? lastUserMsgObj.text : "";

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
       
        return res.json({
          text: "SciBuddy is here! 🤖✨ Right now, I'm exploring in offline adventure mode! You can still play all the games, try all the cool lab experiments, and read our amazing stories. \n\n(Ask your teacher or parent to add a real Gemini API Key in the panel to unlock my super-intelligent AI chatbot!)"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
         headers: {
  'User-Agent': 'tiny-scientists-app',
}
        }
      });

      
      const contents = messages.map((m: any) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const systemInstruction = `You are "SciBuddy", a friendly robot science tutor mascot for children in Classes 4-8 (studying in Indian government schools).
Your STRICT rules are:
1. Answer ONLY science-related questions. For any non-science, unrelated, or out-of-scope query, you MUST reply ONLY with: "I'm not fully sure. Let's explore together! / मुझे पूरी तरह से यकीन नहीं है। आइए मिलकर खोजें!"
2. Keep your explanation extremely short, direct, and energetic. Your answer MUST be under 100 words.
3. Use a clear, logical step-by-step thinking format (e.g. Step 1, Step 2, Step 3) to guide the child's understanding.
4. No hallucination. Stick only to true, proven science facts.
5. Use English, Hindi, or Hinglish depending on how the child asks. Keep it simple and natural.
6. Relate concepts to everyday Indian surroundings (e.g., cricket spins, hot chapatis, matka clay pots, street lamps, swing rides).
7. Use bold keywords and cute emojis 🚀🌱⚡🧲🌋.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      // Provide an amazing, highly intelligent offline science response instead of breaking
      const fallbackText = getSmartScienceFallback(userQuery);
      res.json({ text: fallbackText });
    }
  });

  // Serve Vite in dev, static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
