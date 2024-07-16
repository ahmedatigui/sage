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
  console.log(body);

  const reqbody = { ...body, api_key: process.env.TAVILY_API_KEY };
  console.log('reqbody: ', reqbody);

  try {
    // Handle Tavily API call
    const tavily = await fetch(`${process.env.TAVILY_API_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify(reqbody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const tavilyData = await tavily.json();
    console.log('tavilyData: ', tavilyData);

    // Prepare GPT prompt
    const prompt = prepareGPTPrompt(tavilyData);

    // Handle GPT API call
    const gpt = await fetch('http://localhost:3000/api/gpt', {
      method: 'POST',
      body: JSON.stringify(prompt),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const gptData = await gpt.json();
    console.log('SAGE response: ', gptData);

    // Prepare response object
    const response = {
      query: tavilyData.query,
      answer: gptData.choices[0].message.content,
      sources: tavilyData.results,
      questions: tavilyData.follow_up_questions,
    };

    return new Response(JSON.stringify(response));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }
}

function prepareGPTPrompt(tavilyData: any) {
  let query = tavilyData?.query ?? '';
  let answer = tavilyData?.answer ?? '';
  let sources = tavilyData?.results ?? '';

  const prompt =
    'You are a helpful assistant. You are given a query and answer and source of the answer. Create a paragraph based on that.\n\nQuery:\n' +
    query +
    '\nAnswer:\n' +
    answer +
    '\nSources:\n' +
    JSON.stringify(sources);
  return prompt;
}
