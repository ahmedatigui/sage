import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { system_instructions } from './instructions';

export async function generateText(model: string, prompt: string) {
  if (model === 'gemini-1.5-flash') {
    console.log('G: ', model, prompt);

    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set');
      }
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const gModel = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: system_instructions,
      });

      const result = await gModel.generateContent(JSON.stringify(prompt));
      const response = result.response;
      const data = response.text();

      console.log(response, data);
      return data;
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return error.message;
      }
    }
  } else {
    try {
      if (!process.env.INFERENCE_API_TOKEN) {
        throw new Error('INFERENCE_API_TOKEN is not set');
      }
      const inference = new HfInference(process.env.INFERENCE_API_TOKEN);

      const body = {
        model: model,
        messages: [
          { role: 'system', content: system_instructions },
          { role: 'user', content: JSON.stringify(prompt) },
        ],
        max_tokens: 5000,
        temperature: 0.01,
        seed: 0,
      };

      const response = await inference.chatCompletion(body);
      return response.choices[0].message.content;
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return error.message;
      }
    }
  }
}
