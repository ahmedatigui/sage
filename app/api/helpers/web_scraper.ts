export async function getWebData(query: string) {
  const params = new URLSearchParams({
    q: query,
    pageno: '1', // 2 page of results
    format: 'json',
    lang: 'auto',
  });

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
}
