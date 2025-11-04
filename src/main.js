import { fetchImages } from './js/pixabay-api.js';
import {
  buildCardsMarkup,
  drawGallery,
  clearGallery,
  toggleLoadMore,
  showLoader,
} from './js/render-functions.js';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.getElementById('search-form');
const loadMoreBtn = document.getElementById('load-more');

let query = '';
let page = 1;
const PER_PAGE = 15;
let totalHits = 0;
let lightbox = null;
let isLoading = false;

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements.query.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Увага',
      message: 'Введіть пошуковий запит!',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearGallery();
  toggleLoadMore(false);
  await loadImages();
}

async function onLoadMore() {
  if (isLoading) return;
  page += 1;
  await loadImages(true);
}

async function loadImages(isLoadMore = false) {
  isLoading = true;
  showLoader(true);
  loadMoreBtn.disabled = true;

  try {
    const data = await fetchImages(query, page, PER_PAGE);
    const hits = data?.hits ?? [];

    if (hits.length === 0 && page === 1) {
      iziToast.info({
        title: 'Упс!',
        message:
          'За цим запитом нічого не знайдено. Спробуйте інше ключове слово.',
        position: 'topRight',
      });
      toggleLoadMore(false);
      return; // <- важливо, але обов’язково сховати лоадер у finally
    }

    const markup = buildCardsMarkup(hits);
    drawGallery(markup);

    // SimpleLightbox
    if (!lightbox) {
      lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      });
    } else {
      lightbox.refresh();
    }

    totalHits = data?.totalHits ?? 0;
    const totalPages = Math.ceil(totalHits / PER_PAGE);

    // кнопка load more (показуємо тільки якщо ще є сторінки)
    toggleLoadMore(page < totalPages);

    if (page >= totalPages && page !== 1) {
      iziToast.info({
        title: 'Кінець колекції',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomCenter',
      });
    }

    if (isLoadMore) smoothScroll();
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: error?.message || 'Something went wrong',
      position: 'topRight',
    });
  } finally {
    showLoader(false);
    loadMoreBtn.disabled = false;
    isLoading = false;
  }
}

function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;
  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({ top: height * 2, behavior: 'smooth' });
}
