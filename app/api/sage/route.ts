import { getWebData } from '../helpers/web_scraper';
import { generateText } from '../helpers/llm_api';

export function GET() {
  return new Response(
    JSON.stringify({
      path: '/sage',
      message: 'Hello Sage!',
    })
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const webData = await getWebData(body.query);
    console.log('Web Data: ', webData);

    const gptData = await generateText(body.model, webData);
    console.log('Gpt Data: ', gptData);

    // Prepare response object
    const response = {
      query: webData.query,
      answer: gptData,
      sources: webData.results,
      questions: webData.follow_up_questions,
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    //return new Response(JSON.stringify(error));
    return new Response('Error generating content', { status: 500 });
  }
}
