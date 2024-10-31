import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { system_instructions } from './instructions';

export async function generateText(model: string, prompt: string) {
  if (model === 'gemini-1.5-flash') {
    console.log("G: ", model, prompt);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const gModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: system_instructions });

    const result = await gModel.generateContent(JSON.stringify(prompt));
    const response = await result.response;
    const data = await response.text();

    console.log(response, data);
    return data;

  } else {
    console.log("F: ", model, prompt);
    const inference = new HfInference(process.env.INFERENCE_API_TOKEN);

    const body = {
      model: model,
      messages: [
        { role: 'system', content: system_instructions },
        { role: 'user', content: JSON.stringify(prompt) },
      ],
      max_tokens: 5000,
      temperature: 0.1,
      seed: 0,
    };

    const response = await inference.chatCompletion(body);
    // const data: ChatCompletionResponse = await response.json();
    return response.choices[0].message.content;
  }
}
