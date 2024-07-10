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
    const res = await fetch(`${process.env.TAVILY_API_ENDPOINT}`, {
      method: 'POST',
      body: JSON.stringify(reqbody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    console.log(data);
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error));
  }

  //   return new Response(
  //     JSON.stringify({
  //       answer: 'Your search result answer',
  //       query: 'Your search query',
  //       response_time: 'Your search result response time',
  //       follow_up_questions: [
  //         'follow up question 1',
  //         'follow up question 2',
  //         '...',
  //       ],
  //       images: ['image url 1', '...'],
  //       results: [
  //         {
  //           title: "website's title",
  //           url: 'https://your-search-result-url.com',
  //           content: "website's content",
  //           raw_content: "website's parsed raw content",
  //           score: "tavily's smart relevance score",
  //         },
  //         {},
  //         {},
  //         {},
  //       ],
  //     })
  //   );
}
