import axios from 'axios';

export const PER_PAGE = 15;

const API_KEY = '53062520-ab6df8030023bb65348d73bcb';
const BASE_URL = 'https://pixabay.com/api/';

// (опційно) створюємо інстанс з базовими параметрами
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  },
});

/**
 * Пошук зображень на Pixabay
 * @param {string} query - пошуковий рядок
 * @param {number} page  - номер сторінки (починаємо з 1)
 * @param {number} perPage - кількість елементів на сторінці (дефолт 15)
 * @returns {Promise<{hits: any[], totalHits: number}>}
 */
export async function fetchImages(query, page = 1, perPage = PER_PAGE) {
  const { data } = await api.get('', {
    params: {
      q: query,
      page,
      per_page: perPage, // <-- тепер використовуємо аргумент
    },
  });
  return data; // { total, totalHits, hits }
}
