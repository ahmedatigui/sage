

export function GET(){
    return new Response(JSON.stringify({
        path: '/sage',
        message: 'Hello Sage!'
    }));
}


export async function POST(request: Request){
    const body = await request.json();
    console.log(body);

    // fetch this `${process.env.TAVILY_API_ENDPOINT}`
    // const params = new URLSearchParams();
    // if (process.env.TAVILY_API_KEY) params.append('api_key', process.env.TAVILY_API_KEY);
    // if (body.query) params.append('query', body.query);
    // if (body.search_depth) params.append('search_depth', body.search_depth);
    // if (body.include_images) params.append('include_images', body.include_images.toString());
    // if (body.include_answer) params.append('include_answer', body.include_answer.toString());
    // if (body.max_results) params.append('max_results', body.max_results.toString());
    // if (body.include_domains) params.append('include_domains', body.include_domains);
    // if (body.exclude_domains) params.append('exclude_domains', body.exclude_domains);

    // console.log("ready: ", `${process.env.TAVILY_API_ENDPOINT}?${params.toString()}`);

    const reqbody = {...body, api_key: process.env.TAVILY_API_KEY};
    console.log("reqbody: ", reqbody);

    // try {
    //     const res = await fetch(`${process.env.TAVILY_API_ENDPOINT}?${params.toString()}`, {
    //         method: 'POST',
    //         body: JSON.stringify(body),
    //     });
    //     const dt = await res.json();
    //     console.log(dt);
    //     return new Response(JSON.stringify(dt));
    // } catch (error) {
    //     console.error(error);
    // }

    // return new Response(JSON.stringify({
    //     path: '/sage',
    //     url: `${process.env.TAVILY_API_ENDPOINT}?${params.toString()}`,
    //     message: body,
    // }));

    return new Response(JSON.stringify({
        "answer": "Your search result answer",
        "query": "Your search query",
        "response_time": "Your search result response time",
        "follow_up_questions": [
            "follow up question 1",
            "follow up question 2",
            "..."
        ],
        "images": [
          "image url 1",
          "..."
        ],
        "results": [
            {
                "title": "website's title",
                "url": "https://your-search-result-url.com",
                "content": "website's content",
                "raw_content": "website's parsed raw content",
                "score": "tavily's smart relevance score"
            },{},{},{}
        ]
    }));
}
