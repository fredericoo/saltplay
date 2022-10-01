const fetcher = (url: string) => fetch(url).then(r => r.json());

export const createFetcher =
  <T extends object>(url: string) =>
  () =>
    fetch(url).then(r => r.json()) as T;

export default fetcher;
