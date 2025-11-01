import { GoogleGenAI, GenerateContentResponse, FunctionDeclaration, Type, Part, Content } from "@google/genai";
import { GEMINI_SYSTEM_INSTRUCTION } from '../constants';
import { Message, Sender } from '../types';

// Mock functions for tools
const getMarketPrices = (crop: string, location: string) => ({
    crop,
    location,
    price: `₹${(Math.random() * 500 + 2000).toFixed(2)} per quintal`,
    lastUpdated: new Date().toLocaleDateString(),
    trend: Math.random() > 0.5 ? 'up' : 'down',
});

const getWeather = (location: string) => ({
    location,
    temperature: `${(Math.random() * 10 + 25).toFixed(1)}°C`,
    condition: ['Sunny', 'Partly Cloudy', 'Chance of Rain'][Math.floor(Math.random() * 3)],
    humidity: `${Math.floor(Math.random() * 40 + 50)}%`,
});

const getCropCalendar = (crop: string) => ({
    crop,
    planting_season: 'June - July (Kharif)',
    harvesting_season: 'October - November',
    key_activities: [
        'Seed treatment before sowing.',
        'Weeding required after 20-25 days.',
        'Requires moderate irrigation during dry spells.',
    ],
});


const tools: FunctionDeclaration[] = [
    {
        name: 'getWeather',
        parameters: {
            type: Type.OBJECT,
            description: 'Get the current weather forecast for a specific location.',
            properties: {
                location: { type: Type.STRING, description: 'The city or district in Karnataka, e.g., Bengaluru.' },
            },
            required: ['location'],
        },
    },
    {
        name: 'getMarketPrices',
        parameters: {
            type: Type.OBJECT,
            description: 'Get the latest market prices for a specific crop in a given location.',
            properties: {
                crop: { type: Type.STRING, description: 'The agricultural crop, e.g., Ragi, Coffee.' },
                location: { type: Type.STRING, description: 'The market location, e.g., Mysuru.' },
            },
            required: ['crop', 'location'],
        },
    },
    {
        name: 'getCropCalendar',
        parameters: {
            type: Type.OBJECT,
            description: 'Get the sowing, harvesting, and care calendar for a specific crop.',
            properties: {
                crop: { type: Type.STRING, description: 'The agricultural crop, e.g., Sugarcane.' },
            },
            required: ['crop'],
        },
    }
];


const getAI = () => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getAgriBotResponse = async (
  prompt: string,
  history: Message[],
  image?: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const ai = getAI();

    const formattedHistory: Content[] = history.map(msg => ({
      role: msg.sender === Sender.User ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    
    const userParts: Part[] = [{ text: prompt }];
    if (image) {
        // Add image part first for multimodal understanding
        userParts.unshift({
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            },
        });
    }

    const contents: Content[] = [...formattedHistory, { role: 'user', parts: userParts }];

    // First API call to check for tool usage
    let response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
            systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
            tools: [{ functionDeclarations: tools }]
        }
    });
    
    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0]; // Process one function call for simplicity
        console.log("Executing tool:", call);

        let toolResult;
        if (call.name === 'getWeather') {
            toolResult = getWeather(call.args.location as string);
        } else if (call.name === 'getMarketPrices') {
            toolResult = getMarketPrices(call.args.crop as string, call.args.location as string);
        } else if (call.name === 'getCropCalendar') {
            toolResult = getCropCalendar(call.args.crop as string);
        } else {
            throw new Error(`Unknown function call: ${call.name}`);
        }

        // Second API call with the tool's result to get a natural language response
        const contentsWithToolResponse: Content[] = [
            ...contents,
            { role: 'model', parts: [{ functionCall: call }] },
            {
                role: 'user',
                parts: [{
                    functionResponse: {
                        name: call.name,
                        response: { result: JSON.stringify(toolResult) },
                    }
                }]
            }
        ];
        
        response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contentsWithToolResponse,
            config: {
                systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
            }
        });
    }

    return response.text;

  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    if (error instanceof Error) {
        return `An error occurred: ${error.message}. Please check the console for more details.`;
    }
    return "An unknown error occurred while processing your request. Please try again.";
  }
};
