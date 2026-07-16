import { ScienceTopic } from '../types';

export const scienceTopics: ScienceTopic[] = [
  {
    id: "solar_system",
    category: "earth",
    icon: "🪐",
    color: "indigo",
    titleEn: "🌍 Solar System Odyssey",
    titleHi: "🌍 सौर मंडल की यात्रा",
    summaryEn: "Voyage through the cosmic playground of our eight planetary neighbors and the Sun!",
    summaryHi: "हमारे आठ ग्रहीय पड़ोसियों और सूर्य के ब्रह्मांडीय खेल के मैदान की यात्रा करें!",
    lesson: {
      storyEn: "Imagine you are riding a rocket zooming through space! The Sun is our giant fiery engine in the center. Eight amazing planets are dancing around the Sun in paths called orbits. From roasting Mercury to icy Neptune, each planet has its own magic. Let's touch them to hear their cosmic songs!",
      storyHi: "कल्पना करें कि आप अंतरिक्ष में उड़ते हुए एक रॉकेट की सवारी कर रहे हैं! केंद्र में सूर्य हमारा विशाल उग्र इंजन है। आठ अद्भुत ग्रह सूर्य के चारों ओर 'कक्षा' (orbit) नामक रास्तों पर नृत्य कर रहे हैं। भुनते हुए बुध से लेकर बर्फीले नेपच्यून तक, हर ग्रह का अपना जादू है। उनके ब्रह्मांडीय गीतों को सुनने के लिए उन्हें स्पर्श करें!",
      factsEn: [
        "The Sun is so huge that 1.3 million Earths could fit inside it!",
        "Jupiter is the king of planets and is twice as big as all other planets combined.",
        "Saturn has thousands of beautiful rings made of sparkling ice and dust."
      ],
      factsHi: [
        "सूर्य इतना विशाल है कि इसमें 13 लाख पृथ्वी समा सकती हैं!",
        "बृहस्पति सभी ग्रहों का राजा है और अन्य सभी ग्रहों के कुल आकार से दोगुना बड़ा है।",
        "शनि के चारों ओर चमकीली बर्फ और धूल से बने हजारों सुंदर छल्ले हैं।"
      ],
      vocab: [
        {
          wordEn: "Orbit",
          wordHi: "कक्षा (Orbit)",
          defEn: "The fixed path a planet takes to travel around the Sun.",
          defHi: "वह निश्चित मार्ग जिस पर कोई ग्रह सूर्य के चारों ओर यात्रा करता है।"
        },
        {
          wordEn: "Gravity",
          wordHi: "गुरुत्वाकर्षण (Gravity)",
          defEn: "The invisible pulling force that keeps planets circling the Sun.",
          defHi: "वह अदृश्य खिंचाव बल जो ग्रहों को सूर्य के चक्कर लगाने के लिए रोके रखता है।"
        }
      ],
      examplesEn: [
        "Just like a merry-go-round rotates around the center, planets circle the Sun!",
        "A string tied to a ball swinging in circles acts like gravity holding planets in orbits."
      ],
      examplesHi: [
        "जैसे मैरी-गो-राउंड झूले केंद्र के चारों ओर घूमते हैं, वैसे ही ग्रह सूर्य के चक्कर लगाते हैं!",
        "एक गेंद से बंधी हुई रस्सी जिसे आप गोल-गोल घुमाते हैं, वह गुरुत्वाकर्षण की तरह काम करती है।"
      ],
      miniChallengeEn: "Look up at the night sky tonight! Can you spot a bright, non-twinkling dot? That might be Venus or Jupiter!",
      miniChallengeHi: "आज रात आसमान की ओर देखें! क्या आपको एक चमकीली, न टिमटिमाती हुई बिंदु दिखाई देती है? वह शुक्र या बृहस्पति ग्रह हो सकता है!",
      quiz: [
        {
          questionEn: "Which is the largest planet in our solar system?",
          questionHi: "हमारे सौर मंडल का सबसे बड़ा ग्रह कौन सा है?",
          optionsEn: ["Earth", "Mars", "Jupiter", "Saturn"],
          optionsHi: ["पृथ्वी", "मंगल", "बृहस्पति", "शनि"],
          correctIndex: 2,
          explanationEn: "Jupiter is the biggest planet in the solar system! It is a gas giant with a Great Red Spot.",
          explanationHi: "बृहस्पति सौर मंडल का सबसे बड़ा ग्रह है! यह एक विशाल गैस का गोला है जिसमें एक विशाल लाल धब्बा है।"
        },
        {
          questionEn: "What is the invisible pulling force that keeps us on the ground and planets in orbit?",
          questionHi: "वह अदृश्य खिंचाव बल क्या है जो हमें जमीन पर रखता है और ग्रहों को अपनी कक्षा में रखता है?",
          optionsEn: ["Electricity", "Gravity", "Magnetism", "Wind"],
          optionsHi: ["बिजली", "गुरुत्वाकर्षण", "चुंबकत्व", "हवा"],
          correctIndex: 1,
          explanationEn: "Gravity pulls everything towards the center of massive objects, keeping planets orbiting the Sun.",
          explanationHi: "गुरुत्वाकर्षण सभी वस्तुओं को विशाल पिंडों के केंद्र की ओर खींचता है, जिससे ग्रह सूर्य की परिक्रमा करते रहते हैं।"
        }
      ]
    }
  },
  {
    id: "water_cycle",
    category: "earth",
    icon: "🌦",
    color: "sky",
    titleEn: "🌦 Infinite Water Cycle",
    titleHi: "🌦 अनंत जल चक्र",
    summaryEn: "Follow the magical transformation of a tiny water droplet flying to the sky and falling as rain!",
    summaryHi: "आसमान में उड़ने वाली और बारिश के रूप में गिरने वाली पानी की एक छोटी बूंद के जादुई बदलाव को देखें!",
    lesson: {
      storyEn: "Did you know the water you drink today is the same water dinosaurs drank millions of years ago? Water is a shapeshifting wizard! It evaporates from rivers to become gas, condenses in cold air to form clouds, and falls back down as fresh rain or snow! Let's help puddle water fly to the clouds!",
      storyHi: "क्या आप जानते हैं कि आज जो पानी आप पीते हैं, वही पानी करोड़ों साल पहले डायनासोर ने भी पिया था? पानी एक रूप बदलने वाला जादूगर है! यह नदियों से भाप (वाष्पीकरण) बनकर उड़ता है, ठंडी हवा में बादलों (संघनन) का रूप लेता है, और वापस बारिश बनकर गिरता है! चलो पानी की बूंद को उड़ने में मदद करें!",
      factsEn: [
        "Water is the only substance on Earth that naturally exists in three states: solid, liquid, and gas!",
        "Clouds look light, but a single medium fluffy cloud can weigh as much as 100 elephants!",
        "Only 1% of the world's water is fresh water we can drink."
      ],
      factsHi: [
        "पानी पृथ्वी पर एकमात्र ऐसा पदार्थ है जो प्राकृतिक रूप से तीन रूपों में मौजूद है: ठोस, तरल और गैस!",
        "बादल हल्के दिखते हैं, लेकिन एक सामान्य बादल का वजन 100 हाथियों के बराबर हो सकता है!",
        "दुनिया का केवल 1% पानी ही मीठा और पीने लायक पानी है।"
      ],
      vocab: [
        {
          wordEn: "Evaporation",
          wordHi: "वाष्पीकरण (Evaporation)",
          defEn: "When liquid water heats up and turns into an invisible gas called water vapor.",
          defHi: "जब पानी गर्म होकर अदृश्य गैस (जल वाष्प) में बदल जाता है।"
        },
        {
          wordEn: "Condensation",
          wordHi: "संघनन (Condensation)",
          defEn: "When water vapor cools down and turns back into tiny liquid droplets, forming clouds.",
          defHi: "जब जल वाष्प ठंडा होकर वापस पानी की छोटी बूंदों में बदल जाता है, जिससे बादल बनते हैं।"
        },
        {
          wordEn: "Precipitation",
          wordHi: "वर्षण (Precipitation)",
          defEn: "Water falling from the clouds to the Earth as rain, hail, or snow.",
          defHi: "बादलों से पृथ्वी पर बारिश, ओले या बर्फ के रूप में गिरने वाला पानी।"
        }
      ],
      examplesEn: [
        "When wet clothes dry in the sun, water evaporates into the air!",
        "Droplets of water forming on the outside of a cold metal glass are made of condensed air vapor."
      ],
      examplesHi: [
        "जब गीले कपड़े धूप में सूखते हैं, तो पानी हवा में वाष्पीकृत होकर उड़ जाता है!",
        "ठंडे स्टील के गिलास के बाहर बनने वाली पानी की बूंदें संघनन का उदाहरण हैं।"
      ],
      miniChallengeEn: "Put a tiny bowl of water in the sunny courtyard. Check after a few hours - has some water disappeared into the air?",
      miniChallengeHi: "धूप वाले आंगन में एक छोटी कटोरी पानी रखें। कुछ घंटों बाद देखें - क्या कुछ पानी हवा में गायब हो गया है?",
      quiz: [
        {
          questionEn: "What is it called when water heats up and turns into vapor?",
          questionHi: "जब पानी गर्म होकर भाप में बदल जाता है तो उसे क्या कहते हैं?",
          optionsEn: ["Condensation", "Evaporation", "Freezing", "Precipitation"],
          optionsHi: ["संघनन", "वाष्पीकरण", "जमना", "वर्षण"],
          correctIndex: 1,
          explanationEn: "Evaporation is when heat from the Sun turns liquid water into gas vapor.",
          explanationHi: "वाष्पीकरण वह प्रक्रिया है जिसमें सूर्य की गर्मी तरल पानी को गैस वाष्प में बदल देती है।"
        },
        {
          questionEn: "How are clouds formed in the water cycle?",
          questionHi: "जल चक्र में बादलों का निर्माण कैसे होता है?",
          optionsEn: ["By Evaporation", "By Melting", "By Condensation", "By Filtration"],
          optionsHi: ["वाष्पीकरण द्वारा", "पिघलने द्वारा", "संघनन द्वारा", "छानने द्वारा"],
          correctIndex: 2,
          explanationEn: "Condensation occurs when rising water vapor cools down and clusters together as tiny liquid drops, making clouds.",
          explanationHi: "संघनन तब होता है जब ऊपर उठती जल वाष्प ठंडी हो जाती है और पानी की बूंदों के रूप में जमा होकर बादल बनाती है।"
        }
      ]
    }
  },
  {
    id: "plant_growth",
    category: "life",
    icon: "🌱",
    color: "green",
    titleEn: "🌱 Secret Life of Plants",
    titleHi: "🌱 पौधों का गुप्त जीवन",
    summaryEn: "Water a sleeping seed, feed it golden sunlight, and witness the miracle of photosynthesis!",
    summaryHi: "एक सोए हुए बीज को पानी दें, उसे सुनहरी धूप खिलाएं, और प्रकाश संश्लेषण के चमत्कार को देखें!",
    lesson: {
      storyEn: "Inside every tiny seed is a sleeping baby plant waiting for a wake-up call! When you water the soil, the seed drinks up, splits its jacket, and shoots roots down to search for food. Then, it pushes a green sprout up to greet the Sun! Using magical sunlight, it cooks its own yummy food in leaves. Let's feed our sprout!",
      storyHi: "हर छोटे बीज के अंदर एक सोया हुआ नन्हा पौधा होता है जो जागने की प्रतीक्षा करता है! जब आप मिट्टी को सींचते हैं, तो बीज पानी पीता है, अपना छिलका खोलता है, और भोजन की तलाश में जड़ों को नीचे भेजता है। फिर, यह सूरज का स्वागत करने के लिए एक हरी कोपल ऊपर उठाता है! धूप का उपयोग करके, यह अपनी पत्तियों में भोजन बनाता है।",
      factsEn: [
        "Plants talk to each other underground using fungal networks connected to their roots!",
        "Banana plants are not actually trees; they are giant herbaceous plants!",
        "Bamboo is the fastest-growing woody plant on Earth; it can grow 3 feet in a single day!"
      ],
      factsHi: [
        "पौधे अपनी जड़ों से जुड़े फंगल नेटवर्क के जरिए जमीन के अंदर एक-दूसरे से बात करते हैं!",
        "केले के पौधे वास्तव में पेड़ नहीं हैं; वे विशाल जड़ी-बूटी वाले पौधे हैं!",
        "बांस पृथ्वी पर सबसे तेजी से बढ़ने वाला पौधा है; यह एक दिन में 3 फीट तक बढ़ सकता है!"
      ],
      vocab: [
        {
          wordEn: "Germination",
          wordHi: "अंकुरण (Germination)",
          defEn: "The process of a seed waking up and beginning to sprout into a plant.",
          defHi: "बीज के जागने और पौधे के रूप में अंकुरित होने की प्रक्रिया।"
        },
        {
          wordEn: "Photosynthesis",
          wordHi: "प्रकाश संश्लेषण (Photosynthesis)",
          defEn: "How green leaves cook food using water, carbon dioxide, and sunlight energy.",
          defHi: "हरी पत्तियां पानी, कार्बन डाइऑक्साइड और सूर्य के प्रकाश की ऊर्जा का उपयोग करके भोजन कैसे बनाती हैं।"
        }
      ],
      examplesEn: [
        "Leaves act like solar panels, capturing sunlight to generate energy for the whole plant!",
        "Roots act like drinking straws, sucking up fresh minerals and water from deep inside the mud."
      ],
      examplesHi: [
        "पत्तियां सोलर पैनल की तरह काम करती हैं, जो पूरे पौधे के लिए ऊर्जा उत्पन्न करने हेतु सूर्य के प्रकाश को पकड़ती हैं!",
        "जड़ें पानी पीने वाली स्ट्रॉ की तरह काम करती हैं, जो मिट्टी के अंदर से खनिजों और पानी को चूसती हैं।"
      ],
      miniChallengeEn: "Soak 3 chana (chickpea) seeds in a wet cotton ball in a plastic cup. Watch them sprout over 3 days!",
      miniChallengeHi: "एक कटोरी में भीगे हुए कपास पर 3 चने के बीज रखें। 3 दिनों में उन्हें अंकुरित होते देखें!",
      quiz: [
        {
          questionEn: "What chemical in leaves makes them green and absorbs sunlight?",
          questionHi: "पत्तियों में कौन सा रसायन उन्हें हरा बनाता है और सूर्य के प्रकाश को अवशोषित करता है?",
          optionsEn: ["Oxygen", "Chlorophyll", "Glucose", "Water"],
          optionsHi: ["ऑक्सीजन", "क्लोरोफिल", "ग्लूकोज", "पानी"],
          correctIndex: 1,
          explanationEn: "Chlorophyll is the green pigment in leaves that absorbs sunlight energy for photosynthesis.",
          explanationHi: "क्लोरोफिल पत्तियों में पाया जाने वाला हरा रंगद्रव्य है जो प्रकाश संश्लेषण के लिए सूर्य के प्रकाश की ऊर्जा को सोखता है।"
        },
        {
          questionEn: "What do plants release into the air that humans need to breathe?",
          questionHi: "पौधे हवा में क्या छोड़ते हैं जिसकी मनुष्यों को सांस लेने के लिए आवश्यकता होती है?",
          optionsEn: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Water Vapor"],
          optionsHi: ["कार्बन डाइऑक्साइड", "नाइट्रोजन", "ऑक्सीजन", "जल वाष्प"],
          correctIndex: 2,
          explanationEn: "Plants breathe in carbon dioxide and breathe out pure Oxygen, which is vital for human life!",
          explanationHi: "पौधे कार्बन डाइऑक्साइड लेते हैं और शुद्ध ऑक्सीजन छोड़ते हैं, जो मानव जीवन के लिए बहुत आवश्यक है!"
        }
      ]
    }
  },
  {
    id: "human_body",
    category: "life",
    icon: "🫀",
    color: "rose",
    titleEn: "🫀 Incredible Human Machine",
    titleHi: "🫀 अद्भुत मानव मशीन",
    summaryEn: "Listen to the steady beat of your heart, watch oxygen travel to your lungs, and map your inner biology!",
    summaryHi: "अपने दिल की धड़कन सुनें, ऑक्सीजन को फेफड़ों तक जाते देखें, और अपनी आंतरिक जीवविज्ञान को समझें!",
    lesson: {
      storyEn: "Your body is the most advanced biological machine on Earth! Every second, your heart is pumping red blood, delivering oxygen throughout your body. Your lungs expand like balloons when you inhale, and your brain is a super-computer sending instant electrical commands to your hands! Let's examine our vital organs!",
      storyHi: "आपका शरीर पृथ्वी पर सबसे उन्नत जैविक मशीन है! हर सेकंड, आपका दिल लाल रक्त पंप करता है, जिससे आपके पूरे शरीर में ऑक्सीजन पहुंचती है। जब आप सांस लेते हैं तो आपके फेफड़े गुब्बारों की तरह फैलते हैं, और आपका मस्तिष्क एक सुपर-कंप्यूटर है जो आपके हाथों को निर्देश भेजता है!",
      factsEn: [
        "Your heart beats about 100,000 times every day without rest!",
        "The small intestine is actually 20 feet long, tightly coiled inside your belly!",
        "Our brain uses as much electrical power as a 20-watt light bulb!"
      ],
      factsHi: [
        "आपका दिल बिना आराम किए हर दिन लगभग 1,00,000 बार धड़कता है!",
        "छोटी आंत वास्तव में 20 फीट लंबी होती है, जो आपके पेट के अंदर कसकर लिपटी होती है!",
        "हमारा दिमाग 20 वॉट के बिजली के बल्ब जितनी बिजली का इस्तेमाल करता है!"
      ],
      vocab: [
        {
          wordEn: "Arteries",
          wordHi: "धमनियाँ (Arteries)",
          defEn: "Highways that carry clean oxygen-rich blood away from the heart to your body parts.",
          defHi: "वे वाहिकाएं जो हृदय से साफ ऑक्सीजन युक्त रक्त को शरीर के अन्य अंगों तक ले जाती हैं।"
        },
        {
          wordEn: "Neurons",
          wordHi: "न्यूरॉन्स (Neurons)",
          defEn: "Special cells in your brain that send super-fast messages across your nervous system.",
          defHi: "आपके मस्तिष्क की विशेष कोशिकाएं जो आपके तंत्रिका तंत्र में बहुत तेज़ संदेश भेजती हैं।"
        }
      ],
      examplesEn: [
        "Your heart acts like a double water pump pushing water through household pipes.",
        "Your skeleton is like the steel pillars inside a building that keep it standing tall!"
      ],
      examplesHi: [
        "आपका दिल एक पानी के पंप की तरह काम करता है जो नलों में पानी धकेलता है।",
        "आपका कंकाल एक इमारत के अंदर के लोहे के खंभों की तरह है जो इसे सीधा रखता है!"
      ],
      miniChallengeEn: "Place two fingers gently on your wrist. Can you feel your heartbeat? Count how many times it beats in one minute!",
      miniChallengeHi: "अपनी कलाई पर दो उंगलियां धीरे से रखें। क्या आप अपनी धड़कन महसूस कर सकते हैं? एक मिनट में यह कितनी बार धड़कता है, गिनें!",
      quiz: [
        {
          questionEn: "Which organ pumps blood throughout the human body?",
          questionHi: "कौन सा अंग मानव शरीर में रक्त पंप करता है?",
          optionsEn: ["Brain", "Lungs", "Heart", "Stomach"],
          optionsHi: ["मस्तिष्क", "फेफड़े", "दिल", "पेट"],
          correctIndex: 2,
          explanationEn: "The heart is a muscular pump that beats continuously to circulate blood to every cell.",
          explanationHi: "दिल एक पेशी पंप है जो प्रत्येक कोशिका में रक्त संचारित करने के लिए लगातार धड़कता है।"
        },
        {
          questionEn: "What happens to your lungs when you take a deep breath in?",
          questionHi: "जब आप गहरी सांस लेते हैं तो आपके फेफड़ों का क्या होता है?",
          optionsEn: ["They shrink", "They expand like balloons", "They change color", "Nothing happens"],
          optionsHi: ["वे सिकुड़ते हैं", "वे गुब्बारों की तरह फैलते हैं", "वे रंग बदलते हैं", "कुछ नहीं होता"],
          correctIndex: 1,
          explanationEn: "Your lungs expand with air as they absorb oxygen from the atmosphere into your bloodstream.",
          explanationHi: "फेफड़े हवा से भर जाते हैं और हवा से ऑक्सीजन सोखकर आपके रक्त प्रवाह में मिला देते हैं।"
        }
      ]
    }
  },
  {
    id: "electricity",
    category: "physics",
    icon: "⚡",
    color: "amber",
    titleEn: "⚡ Sparky Circuits",
    titleHi: "⚡ बिजली और सर्किट",
    summaryEn: "Connect copper wires, flip the circuit switch, and light up SciBuddy's glowing brain bulb!",
    summaryHi: "तांबे के तारों को जोड़ें, सर्किट स्विच दबाएं, और साई-बडी के चमकते हुए मस्तिष्क बल्ब को जलाएं!",
    lesson: {
      storyEn: "Electricity is the flow of millions of tiny, energetic runners called electrons! They love sprinting through copper roads called wires. But they can only run when the loop is completely closed without any gaps. If you break the road (open the switch), the runners stop, and the light bulb goes dark. Let's make a complete loop!",
      storyHi: "बिजली लाखों छोटे, ऊर्जावान धावकों का प्रवाह है जिन्हें इलेक्ट्रॉन कहा जाता है! वे तांबे की सड़कों (तारों) पर दौड़ना पसंद करते हैं। लेकिन वे केवल तभी दौड़ सकते हैं जब उनका रास्ता बिना किसी अंतर के पूरी तरह से बंद (closed loop) हो। यदि आप रास्ता तोड़ते हैं (स्विच खोलते हैं), तो धावक रुक जाते हैं और बल्ब बुझ जाता है।",
      factsEn: [
        "A single bolt of lightning contains enough electrical energy to toast 100,000 slices of bread!",
        "Electric eels can generate a shock of up to 600 volts to hunt or defend themselves!",
        "Our heart uses its own tiny electrical currents to coordinate its rhythmic beats."
      ],
      factsHi: [
        "बिजली के एक झटके (आकाशीय बिजली) में इतनी बिजली होती है कि 1,00,000 ब्रेड के टुकड़े सेंके जा सकते हैं!",
        "इलेक्ट्रिक ईल मछली शिकार करने या खुद को बचाने के लिए 600 वोल्ट तक का झटका पैदा कर सकती है!",
        "हमारा दिल अपनी लयबद्ध धड़कनों के तालमेल के लिए अपने छोटे विद्युत प्रवाह का उपयोग करता है।"
      ],
      vocab: [
        {
          wordEn: "Conductor",
          wordHi: "चालक (Conductor)",
          defEn: "Materials like metal that allow electricity to flow through them easily.",
          defHi: "ऐसी धातुएं या वस्तुएं जो बिजली को आसानी से बहने देती हैं।"
        },
        {
          wordEn: "Insulator",
          wordHi: "कुचालक (Insulator)",
          defEn: "Materials like plastic and rubber that block the flow of electricity.",
          defHi: "प्लास्टिक और रबर जैसी चीजें जो बिजली के प्रवाह को रोकती हैं।"
        }
      ],
      examplesEn: [
        "Copper wires are wrapped in plastic coats so you don't get a shock when you touch them!",
        "Water is a conductor, which is why you must never touch electrical appliances with wet hands."
      ],
      examplesHi: [
        "तांबे के तारों पर प्लास्टिक की परत चढ़ाई जाती है ताकि छूने पर झटका न लगे!",
        "पानी बिजली का सुचालक है, इसलिए गीले हाथों से बिजली के उपकरणों को कभी नहीं छूना चाहिए।"
      ],
      miniChallengeEn: "Rub a plastic scale on your dry hair for 30 seconds. Hover it over tiny bits of paper - do they jump up and stick?",
      miniChallengeHi: "अपने सूखे बालों पर प्लास्टिक के स्केल को 30 सेकंड तक रगड़ें। इसे कागज के छोटे टुकड़ों के ऊपर रखें - क्या वे कूदकर चिपक जाते हैं?",
      quiz: [
        {
          questionEn: "Which of the following materials is an excellent conductor of electricity?",
          questionHi: "निम्नलिखित में से कौन सा पदार्थ बिजली का बहुत अच्छा चालक है?",
          optionsEn: ["Wood", "Plastic", "Copper Metal", "Rubber"],
          optionsHi: ["लकड़ी", "प्लास्टिक", "तांबा धातु", "रबर"],
          correctIndex: 2,
          explanationEn: "Copper is a metal with free electrons, making it an excellent conductor used in household wires.",
          explanationHi: "तांबा एक धातु है जिसमें स्वतंत्र इलेक्ट्रॉन होते हैं, जिससे यह घरेलू तारों के लिए एक उत्कृष्ट सुचालक बनता है।"
        },
        {
          questionEn: "Why is wire wrapped in rubber or plastic coating?",
          questionHi: "तारों पर रबर या प्लास्टिक की परत क्यों चढ़ाई जाती है?",
          optionsEn: ["To make them pretty", "To prevent electric shocks", "To make them heavy", "To heat them up"],
          optionsHi: ["उन्हें सुंदर बनाने के लिए", "बिजली के झटके से बचाने के लिए", "उन्हें भारी बनाने के लिए", "उन्हें गर्म करने के लिए"],
          correctIndex: 1,
          explanationEn: "Rubber and plastic are insulators that block electricity, protecting us from dangerous shocks.",
          explanationHi: "रबर और प्लास्टिक कुचालक हैं जो बिजली के प्रवाह को रोकते हैं, जिससे हम खतरनाक झटकों से बचते हैं।"
        }
      ]
    }
  },
  {
    id: "magnets",
    category: "physics",
    icon: "🧲",
    color: "orange",
    titleEn: "🧲 Magnetic Magic",
    titleHi: "🧲 चुम्बकीय जादू",
    summaryEn: "Explore the invisible force fields of North and South poles, attracting iron and repelling friends!",
    summaryHi: "उत्तरी और दक्षिणी ध्रुवों के अदृश्य बलों को जानें, जो लोहे को आकर्षित और अपोजिट पोल्स को रिपेल करते हैं!",
    lesson: {
      storyEn: "Magnets possess an invisible superpower called magnetism! Every magnet has two heads: a North Pole and a South Pole. When they meet, opposites attract! North loves South and pulls close. But put North with North, and they will push each other away like angry kittens! Let's play with these invisible push-and-pull shields!",
      storyHi: "चुंबकों के पास एक अदृश्य महाशक्ति होती है जिसे चुंबकत्व कहते हैं! प्रत्येक चुंबक के दो सिरे होते हैं: एक उत्तरी ध्रुव और एक दक्षिणी ध्रुव। जब वे मिलते हैं, तो विपरीत आकर्षित होते हैं! लेकिन उत्तर को उत्तर के साथ रखें, तो वे एक-दूसरे को धक्का देंगे (repel करेंगे)। आओ इस अदृश्य धक्के और खिंचाव के साथ खेलें!",
      factsEn: [
        "The Earth itself is a giant magnet! That's why compass needles always point to the North Pole.",
        "Maglev trains in Japan float on magnets, flying at super speeds of 600 km/h without touching the rails!",
        "Some birds and turtles have tiny magnetic crystals in their brains to help navigate across oceans!"
      ],
      factsHi: [
        "पृथ्वी स्वयं एक विशाल चुंबक है! इसीलिए कम्पास की सुई हमेशा उत्तरी ध्रुव की ओर इशारा करती है।",
        "जापान में मैगलेव ट्रेनें चुंबक पर तैरती हैं, जो पटरियों को छुए बिना 600 किमी/घंटे की सुपर गति से उड़ती हैं!",
        "कुछ पक्षियों और कछुओं के मस्तिष्क में छोटे चुंबकीय क्रिस्टल होते हैं जो उन्हें महासागरों को पार करने में मदद करते हैं!"
      ],
      vocab: [
        {
          wordEn: "Attraction",
          wordHi: "आकर्षण (Attraction)",
          defEn: "The pulling force that brings opposite magnetic poles together.",
          defHi: "वह खिंचाव बल जो विपरीत चुंबकीय ध्रुवों को एक साथ लाता है।"
        },
        {
          wordEn: "Repulsion",
          wordHi: "प्रतिकर्षण (Repulsion)",
          defEn: "The pushing force that drives similar magnetic poles apart.",
          defHi: "वह धक्का देने वाला बल जो समान चुंबकीय ध्रुवों को एक-दूसरे से दूर ले जाता है।"
        }
      ],
      examplesEn: [
        "Refrigerator door magnets hold up your drawing sheets without any tape!",
        "Compass devices use small magnetic needles that spin freely to show travelers which way is north."
      ],
      examplesHi: [
        "रेफ्रिजरेटर के दरवाजे के चुंबक बिना किसी टेप के आपके चित्रों को चिपकाए रखते हैं!",
        "कम्पास उपकरण यात्रियों को उत्तर दिशा दिखाने के लिए स्वतंत्र रूप से घूमने वाली चुंबकीय सुई का उपयोग करते हैं।"
      ],
      miniChallengeEn: "Find a refrigerator magnet. Test it on iron keys, plastic pens, steel spoons, and wooden doors. Which ones stick?",
      miniChallengeHi: "एक फ्रिज का चुंबक लें। इसे चाबियों, पेन, स्टील के चम्मच और लकड़ी के दरवाजे पर आज़माएं। कौन से चिपकते हैं?",
      quiz: [
        {
          questionEn: "What happens when you bring two North Poles of a magnet close to each other?",
          questionHi: "जब आप दो चुंबकीय उत्तरी ध्रुवों को एक-दूसरे के करीब लाते हैं तो क्या होता है?",
          optionsEn: ["They attract", "They repel (push apart)", "They catch fire", "Nothing happens"],
          optionsHi: ["वे आकर्षित होते हैं", "वे प्रतिकर्षित (दूर धकेलते) हैं", "वे आग पकड़ लेते हैं", "कुछ नहीं होता"],
          correctIndex: 1,
          explanationEn: "Like poles (North-North or South-South) repel each other and push apart with invisible magnetic pressure.",
          explanationHi: "समान ध्रुव (उत्तर-उत्तर या दक्षिण-दक्षिण) एक-दूसरे को प्रतिकर्षित करते हैं और अदृश्य बल से दूर धकेलते हैं।"
        },
        {
          questionEn: "Which metal are magnets strongly attracted to?",
          questionHi: "चुंबक किस धातु की ओर दृढ़ता से आकर्षित होते हैं?",
          optionsEn: ["Gold", "Aluminum", "Iron", "Copper"],
          optionsHi: ["सोना", "एल्युमिनियम", "लोहा", "तांबा"],
          correctIndex: 2,
          explanationEn: "Iron, Nickel, and Cobalt are magnetic materials that get strongly attracted to magnets.",
          explanationHi: "लोहा, निकल और कोबाल्ट चुंबकीय पदार्थ हैं जो चुंबक की ओर अत्यधिक आकर्षित होते हैं।"
        }
      ]
    }
  }
];
