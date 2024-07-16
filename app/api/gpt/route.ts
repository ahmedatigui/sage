import { HfInference } from '@huggingface/inference';

export function GET() {
  return new Response(
    JSON.stringify({
      path: '/gpt',
      message: 'Hello GPT!',
    })
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);

  const query = body;
  console.log('query: ', body);
  try {
    const inference = new HfInference(process.env.INFERENCE_API_TOKEN);

    const response = await inference.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{ role: 'user', content: `${query}` }],
      max_tokens: 500,
      temperature: 0.1,
      seed: 0,
    });

    console.log('GPT response: ', response);
    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}
