
const SERVER = '/api'

export default async function api({
  url,
  data = null,
  auth = null,
  json = true,
  response = false,
  params = {}
}) {

  const res = await fetch(
    `${SERVER}${url}`, {
      method: data ? 'POST' : 'GET',
      cache: 'no-cache',
      headers: {
        ...auth && { 'Authorization': `Bearer ${auth}` },
        ...data && { 'Content-Type': 'application/json' },
      },
      body: data ? JSON.stringify(data) : null,
      redirect: 'manual',
      ...params,
    }
  );

  if (response) {
    return res;
  }

  if (json) {
    return await res.json();
  } else {
    return await res.body();
  }
}
