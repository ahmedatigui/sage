export async function getWebData(query: string) {
  const params = new URLSearchParams({
    q: query,
    pageno: '1', // 2 page of results
    format: 'json',
    lang: 'auto',
  });

  try {
    if (!process.env.SEARXNG_URL) {
      throw new Error('SEARXNG_URL is not set');
    }

    const apiUrl = `${process.env.SEARXNG_URL}?${params.toString()}`;

    const resp = await fetch(apiUrl, {
      method: 'POST',
      body: '',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await resp.json();

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return error.message;
    }
  }
}
