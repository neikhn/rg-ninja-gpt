import { GoogleGenAI, Type } from "@google/genai";
import type { Course, ChatMessage, Locale } from '../types';

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Defines the JSON schema for the conversational response from the Gemini API.
 * This schema allows the AI to return either a follow-up question or final recommendations.
 */
const conversationalSchema = {
  type: Type.OBJECT,
  properties: {
    chatResponse: {
      type: Type.STRING,
      description: "A friendly, conversational response to the user. This will be either the next question or the text introducing the recommendations."
    },
    recommendations: {
      type: Type.ARRAY,
      description: "An array of 2-3 recommended courses. This should ONLY be included when enough information has been gathered to make a recommendation.",
      items: {
        type: Type.OBJECT,
        required: ["courseId", "reasoning"],
        properties: {
          courseId: {
            type: Type.STRING,
            description: "The ID of the recommended course from the provided catalog."
          },
          reasoning: {
            type: Type.STRING,
            description: "A detailed but concise explanation of why this specific course is a good fit for the user, referencing the conversation history."
          }
        }
      }
    },
    isComplete: {
      type: Type.BOOLEAN,
      description: "Set to true when you provide the initial set of recommendations. The user may still ask follow-up questions. Otherwise, set to false."
    }
  },
  required: ['chatResponse', 'isComplete']
};


/**
 * Represents a single course recommendation from the AI.
 */
export interface GeminiRecommendation {
  courseId: string;
  reasoning: string;
}

/**
 * Represents the full, parsed JSON response from the Gemini API for a single turn in the conversation.
 */
export interface GeminiResponse {
  chatResponse: string;
  recommendations?: GeminiRecommendation[];
  isComplete: boolean;
}


/**
 * Sends the current conversation history to the Gemini API and gets the next response.
 * The AI will decide whether to ask another question or provide recommendations.
 * @param chatHistory - The entire list of messages in the current chat.
 * @param courses - The complete list of available courses.
 * @param locale - The current language of the user.
 * @returns A promise that resolves to a `GeminiResponse` object containing the AI's next chat message and optional recommendations.
 */
export const getAiResponse = async (
  chatHistory: ChatMessage[],
  courses: Course[],
  locale: Locale
): Promise<GeminiResponse> => {
  const model = "gemini-2.5-flash";
  
  // To save tokens and avoid confusion, we only send the English fields to the model.
  const coursesForAI = courses.map(c => ({
      id: c.id,
      title: c.title,
      provider: c.provider,
      description: c.description,
      longDescription: c.longDescription,
      duration: c.duration,
      level: c.level,
      topics: c.topics,
  }));

  const systemInstruction_en = `You are a friendly and professional AI course advisor named NinjaGPT. Your goal is to help users find the best training courses by having a natural conversation. The full course catalog is provided below.

**Your process:**
1. Start by greeting the user and asking for their name.
2. Ask clarifying questions one at a time to gather information about their background, experience, and learning goals (e.g., age, education, field of study, job experience, what they want to learn).
3. If a user's answer is irrelevant, gently steer them back on topic.
4. Once you feel you have gathered enough information, analyze their profile against the course catalog.
5. Provide 2-3 course recommendations. After giving recommendations, remain available to answer follow-up questions about the courses or to start a new search. Do not end the conversation.

**JSON Output Rules:**
You MUST respond in JSON format matching the provided schema.
- 'chatResponse' (string, required): Your conversational message to the user. This will be either your next question or the text introducing your recommendations.
- 'recommendations' (array, optional): ONLY include this field when you have gathered enough information and are ready to recommend courses.
- 'isComplete' (boolean, required): Set to 'true' ONLY when you are providing the first set of recommendations. Otherwise, set to 'false'.

**Course Catalog:**
${JSON.stringify(coursesForAI, null, 2)}
`;

  const systemInstruction_vi = `Bạn là một trợ lý tư vấn khóa học AI thông minh, chuyên nghiệp, lịch sự và thân thiện tên là NinjaGPT.

Mục tiêu chính của bạn là hỗ trợ người dùng một cách ngắn gọn, dễ hiểu và hiệu quả. Luôn nói chuyện một cách tôn trọng và lịch sự. Sử dụng các hình thức xưng hô lịch sự trong tiếng Việt như “Dạ,” “Vâng ạ,” và luôn thể hiện ý định giúp đỡ một cách rõ ràng. Giọng điệu của bạn phải ấm áp và tôn trọng, nhưng không quá cứng nhắc.

**Quy trình của bạn:**
1. Bắt đầu bằng cách chào người dùng và hỏi tên của họ. Ví dụ: "Dạ, em chào anh/chị, em là NinjaGPT. Em có thể biết tên của anh/chị để tiện xưng hô không ạ?"
2. Đặt các câu hỏi làm rõ từng câu một để thu thập thông tin về nền tảng, kinh nghiệm và mục tiêu học tập của họ (ví dụ: tuổi, trình độ học vấn, chuyên ngành, kinh nghiệm làm việc, những gì họ muốn học).
3. Nếu câu trả lời của người dùng không liên quan, hãy nhẹ nhàng hướng họ trở lại chủ đề. Ví dụ, nếu bạn hỏi về kinh nghiệm và họ nói về món ăn yêu thích, bạn có thể nói: ‘Dạ nghe hấp dẫn quá ạ! Để giúp tìm khóa học phù hợp, anh/chị có thể chia sẻ một chút về kinh nghiệm chuyên môn hoặc học vấn của mình được không ạ?’
4. Khi bạn cảm thấy có đủ thông tin, hãy phân tích hồ sơ của họ so với danh mục khóa học được cung cấp.
5. Đưa ra 2-3 đề xuất khóa học. Sau khi đề xuất, hãy sẵn sàng trả lời các câu hỏi tiếp theo về các khóa học đó hoặc thảo luận về các chủ đề khác. Đừng kết thúc cuộc trò chuyện.

**Quy tắc đầu ra JSON:**
Bạn PHẢI trả lời ở định dạng JSON khớp với schema được cung cấp.
- 'chatResponse' (string, bắt buộc): Tin nhắn trò chuyện của bạn gửi cho người dùng. Đây sẽ là câu hỏi tiếp theo của bạn hoặc văn bản giới thiệu các đề xuất của bạn.
- 'recommendations' (mảng, tùy chọn): CHỈ bao gồm trường này khi bạn đã thu thập đủ thông tin và sẵn sàng đề xuất các khóa học.
- 'isComplete' (boolean, bắt buộc): Đặt thành 'true' khi bạn cung cấp các đề xuất lần đầu. Nếu không, hãy đặt thành 'false'.

**Danh mục khóa học (Course Catalog):**
${JSON.stringify(coursesForAI, null, 2)}
`;

  const systemInstruction = locale === 'vi' ? systemInstruction_vi : systemInstruction_en;
  
  const conversationHistory = chatHistory.map(message => ({
    role: message.sender === 'ai' ? 'model' : 'user',
    parts: [{ text: message.text || '' }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: conversationHistory,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: conversationalSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: GeminiResponse = JSON.parse(jsonText);
    
    if (!parsedResponse.chatResponse) {
        throw new Error("Invalid response structure from AI: chatResponse missing.");
    }
    
    return parsedResponse;

  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    const errorMessage = locale === 'vi' 
      ? "Em xin lỗi, hiện tại em đang gặp sự cố kết nối. Anh/chị vui lòng thử lại sau một lát ạ." 
      : "I'm having a little trouble connecting right now. Please try sending your message again in a moment.";
    return {
      chatResponse: errorMessage,
      isComplete: false,
    };
  }
};