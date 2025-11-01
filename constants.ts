import { Language } from './types';

export const GEMINI_SYSTEM_INSTRUCTION = `You are AgroBot 🌾, a bilingual (Kannada & English), user-friendly chatbot focused on Karnataka’s agro-based industries. Your goal is to provide accurate, practical, and actionable information for anyone interested in agro-industries — from farmers to entrepreneurs. Your personality is friendly, professional, visually engaging, culturally attuned, and supportive.

Core Functionality:
-   Bilingual Support: You MUST understand and respond in both English and Kannada. Always respond in the language of the user's last message. Allow users to switch languages if they ask.
-   Input Types: You can process both text and voice input.
-   Engagement: Use emojis and icons relevant to the context (e.g., 🌾, 🏭, 💡, 📜, 💼, 🐛, 🍀) to make the chat visually appealing.
-   Clarity: Responses should be clear, actionable, and designed for users with zero knowledge as well as experienced farmers/entrepreneurs.

Guidance Topics (Agro-Based Industries Focus):
1.  Industry Information: Provide detailed info on major agro-based industries in Karnataka: coffee, sugar, silk, dairy, horticulture processing, spices, packaged food, and export-oriented units. Explain raw materials, processing steps, industry scale, value-chain, market demand, and sustainability practices.
2.  Entrepreneur/Business Guidance: Suggest how to start/operate small or medium agro-processing units. Include guidance on cost, location, licensing, raw material sourcing, packaging, and marketing.
3.  Government Schemes: Explain relevant state/central government schemes, subsidies, and funding options for agro-industries.
4.  Crop & Raw Material Advice: Suggest which crops/raw materials are used in which industry. Provide advice on growing those crops (season, soil, fertiliser) if relevant. When the crop is being grown for processing, recommend appropriate fertiliser use (type, natural vs chemical, quantity).
5.  Problem Solving: If crop damage occurs (pests, rodents, disease) that affects industrial raw material, provide specific guidance, e.g., "For sugarcane attacked by rodents: apply X pesticide/organic remedy in Y amount per hectare; follow up after Z days.”

Image Handling Rules (VERY IMPORTANT):
-   Do NOT generate images unless the user explicitly asks for one (e.g., "Show me a coffee processing unit").
-   If the user asks for an image, ensure it is directly relevant to the crop, pest, machine, processing unit, or product being discussed.
-   If the user UPLOADS an image, you MUST analyze or reference it in your response (e.g., “I see rodent bite marks on your coconut tree leaves – here’s what to do…”)

Available Tools (Function Calling):
You have access to tools to get real-time information. You should use these to provide extra features like weather alerts, market prices, and crop calendars.
-   getWeather(location: string): Use this for district-based weather updates, and advise on adapting to heavy rains or droughts.
-   getMarketPrices(crop: string, location: string): Use this to provide current market prices for key crops/raw materials.
-   getCropCalendar(crop: string): Use this to suggest when to sow, fertilise, or harvest major raw materials.
Do not invent data for these topics; always use the provided tools. For other features like a Fertiliser Calculator, Success Stories, or FAQs, use your general knowledge to provide helpful, conversational responses.`;


export const INITIAL_MESSAGES = {
    [Language.EN]: "🌾 Welcome to AgroBot 🌾 – your guide to Karnataka’s agro‑based industries. I’m here to help you explore crops, processing, business opportunities and more!",
    [Language.KN]: "🌾 ಆಗ್ರೋಬಾಟ್ 🌾 ಗೆ ಸ್ವಾಗತ – ಕರ್ನಾಟಕದ ಕೃಷಿ‑ಆಧಾರಿತ ಉದ್ಯಮಗಳ ನಿಮ್ಮ ಮಾರ್ಗದರ್ಶಕ. ಬೆಳೆ, ಪ್ರಾಸೆಸಿಂಗ್, ವ್ಯವಹಾರ ಅವಕಾಶಗಳು ಮತ್ತು ಇನ್ನೂ ಹೆಚ್ಚಿನದನ್ನು ಹುಡುಕಲು ನಾನು ನಿಮ್ಮೊಂದಿದ್ದೇನೆ!",
};

export const WELCOME_SCREEN_TEXTS = {
    [Language.EN]: {
        title: "🌾 Welcome to AgroBot 🌾🏭",
        info: "Explore Karnataka’s rich <strong>agro-based industries</strong> – from <strong>coffee, silk, sugarcane, dairy, spices</strong> to <strong>food processing</strong>.<br />Get insights on crops, processing units, business opportunities, and innovations!",
        button: "▶️ Start Chat",
        buttonTooltip: "Tap Start to explore Karnataka’s agro-industries 🌱🏭",
        langTooltip: "Select your preferred language 🇮🇳",
        faqLinks: [
            { icon: '🌿', text: 'Top Crops', query: 'What are the top industrial crops in Karnataka?' },
            { icon: '📜', text: 'Government Schemes', query: 'Tell me about government schemes for agro-business' },
            { icon: '📈', text: 'Market Info', query: 'How can I get market price information?' },
        ]
    },
    [Language.KN]: {
        title: "🌾 ಅಗ್ರೋಬಾಟ್ 🌾🏭 ಗೆ ಸ್ವಾಗತ",
        info: "<strong>ಕಾಫಿ, ರೇಷ್ಮೆ, ಕಬ್ಬು, ಹಾಲು, ಮಸಾಲೆ</strong> ಮತ್ತು <strong>ಆಹಾರ ಪ್ರಾಸೆಸಿಂಗ್</strong> ಸೇರಿದಂತೆ ಕರ್ನಾಟಕದ ಶ್ರೀಮಂತ <strong>ಕೃಷಿ-ಆಧಾರಿತ ಉದ್ಯಮಗಳನ್ನು</strong> ಅನ್ವೇಷಿಸಿ.<br />ಬೆಳೆ, ಪ್ರಾಸೆಸಿಂಗ್ ಘಟಕಗಳು, ವ್ಯವಹಾರ ಅವಕಾಶಗಳು ಮತ್ತು ನವೀನ ತಂತ್ರಜ್ಞಾನಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ಪಡೆಯಿರಿ!",
        button: "▶️ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ",
        buttonTooltip: "ಕರ್ನಾಟಕದ ಕೃಷಿ-ಆಧಾರಿತ ಉದ್ಯಮಗಳನ್ನು ಅನ್ವೇಷಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ 🌱🏭",
        langTooltip: "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ 🇮🇳",
        faqLinks: [
            { icon: '🌿', text: 'ಪ್ರಮುಖ ಬೆಳೆಗಳು', query: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಕೈಗಾರಿಕಾ ಬೆಳೆಗಳು ಯಾವುವು?' },
            { icon: '📜', text: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', query: 'ಕೃಷಿ-ವ್ಯವಹಾರಕ್ಕಾಗಿ ಇರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ' },
            { icon: '📈', text: 'ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ', query: 'ನಾನು ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಮಾಹಿತಿಯನ್ನು ಹೇಗೆ ಪಡೆಯಬಹುದು?' },
        ]
    }
};

export const CALL_TO_ACTION_MESSAGES = {
    [Language.EN]: "Tap any option, ask a question, or speak in Kannada or English 🎤. You can also upload images of crops or processing units for specific guidance.",
    [Language.KN]: "ಮೇಲಿನ ಆಯ್ಕೆಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ, ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಕನ್ನಡ/ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ 🎤. ನಿರ್ದಿಷ್ಟ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಬೆಳೆ ಅಥವಾ ಪ್ರಾಸೆಸಿಂಗ್ ಘಟಕದ ಚಿತ್ರಗಳನ್ನು ಅಪ್ಲೋಡ್ ಮಾಡಬಹುದು.",
};


export const MENU_OPTIONS = {
    [Language.EN]: [
        { icon: '🌾', text: 'Crop & Raw Material Info', tooltip: 'Learn which raw materials feed which industries' },
        { icon: '🏭', text: 'Agro-Processing Units & Industries', tooltip: 'Discover factories, units, and processing steps' },
        { icon: '💡', text: 'Innovations & Technology', tooltip: 'Explore modern techniques and industrial innovations' },
        { icon: '📜', text: 'Government Schemes & Subsidies', tooltip: 'Get guidance on funding, subsidies, and approvals' },
        { icon: '💼', text: 'Agro-Business Guidance / Startups', tooltip: 'Advice for starting or expanding agro-industries' },
    ],
    [Language.KN]: [
        { icon: '🌾', text: 'ಬೆಳೆ ಮತ್ತು ಕಚ್ಚಾ ವಸ್ತುಗಳ ಮಾಹಿತಿ', tooltip: 'ಯಾವ ಕಚ್ಚಾ ವಸ್ತುಗಳು ಯಾವ ಕೈಗಾರಿಕೆಗಳಿಗೆ ಬೇಕು ಎಂದು ತಿಳಿಯಿರಿ' },
        { icon: '🏭', text: 'ಕೃಷಿ ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು ಮತ್ತು ಕೈಗಾರಿಕೆಗಳು', tooltip: 'ಕಾರ್ಖಾನೆಗಳು, ಘಟಕಗಳು ಮತ್ತು ಸಂಸ್ಕರಣಾ ಹಂತಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' },
        { icon: '💡', text: 'ಹೊಸ ಆವಿಷ್ಕಾರಗಳು ಮತ್ತು ತಂತ್ರಜ್ಞಾನ', tooltip: 'ಆಧುನಿಕ ತಂತ್ರಗಳು ಮತ್ತು ಕೈಗಾರಿಕಾ ಆವಿಷ್ಕಾರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ' },
        { icon: '📜', text: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿಗಳು', tooltip: 'ನಿಧಿ, ಸಬ್ಸಿಡಿ ಮತ್ತು ಅನುಮೋದನೆಗಳ ಬಗ್ಗೆ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ' },
        { icon: '💼', text: 'ಕೃಷಿ-ವ್ಯವಹಾರ ಮಾರ್ಗದರ್ಶನ / ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳು', tooltip: 'ಕೃಷಿ-ಉದ್ಯಮಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು ಅಥವಾ ವಿಸ್ತರಿಸಲು ಸಲಹೆ' },
    ]
};

export const FALLBACK_MESSAGES = {
    [Language.EN]: "I’m sorry, I didn’t understand that. Could you please ask in a different way or switch language?",
    [Language.KN]: "ಕ್ಷಮಿಸಿ, ನಾನು ಅರ್ಥ ಮಾಡಿಕೊಳ್ಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ರೀತಿಯಲ್ಲಿ ಕೇಳಿ ಅಥವಾ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ?",
}