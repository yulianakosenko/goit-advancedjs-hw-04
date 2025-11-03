import axios from 'axios';
export const PER_PAGE = 15;

const API_KEY = '53062520-ab6df8030023bb65348d73bcb'; //
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: PER_PAGE,
  };

  const { data } = await axios.get('', { params });
  // data: { total, totalHits, hits: [...] }
  return data;
}
