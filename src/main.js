import './css/styles.css';

import { fetchImages, PER_PAGE } from './js/pixabay-api.js';
import {
  buildCardsMarkup,
  drawGallery,
  clearGallery,
  toggleLoadMore,
  showLoader,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loadMoreBtn = document.querySelector('#load-more');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// ---- Глобальний стан для пагінації ----
let currentQuery = '';
let page = 1;
let totalHits = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  const query = e.currentTarget.elements.query.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  // Скидаємо пагінацію та попередній результат
  currentQuery = query;
  page = 1;
  totalHits = 0;
  clearGallery();
  toggleLoadMore(false);

  showLoader(true);

  try {
    const data = await fetchImages(currentQuery, page);
    showLoader(false);

    const hits = data?.hits ?? [];
    totalHits = data?.totalHits ?? 0;

    if (hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    const markup = buildCardsMarkup(hits);
    drawGallery(markup);
    lightbox.refresh();

    // Показуємо Load more, якщо ще є сторінки попереду
    if (page * PER_PAGE < totalHits) {
      toggleLoadMore(true);
    } else {
      toggleLoadMore(false);
    }
  } catch (err) {
    showLoader(false);
    iziToast.error({
      title: 'Error',
      message: `Something went wrong (${err.message})`,
      position: 'topRight',
    });
  } finally {
    form.reset();
  }
}

async function onLoadMore() {
  loadMoreBtn.disabled = true;
  showLoader(true);

  try {
    page += 1;
    const data = await fetchImages(currentQuery, page);

    const hits = data?.hits ?? [];
    const markup = buildCardsMarkup(hits);
    drawGallery(markup);
    lightbox.refresh();

    // Плавний скрол на 2 висоти картки
    smoothScrollByCardHeight();

    // Якщо кінець колекції — ховаємо кнопку + показуємо повідомлення
    if (page * PER_PAGE >= totalHits) {
      toggleLoadMore(false);
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.disabled = false;
    }
  } catch (err) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong (${err.message})`,
      position: 'topRight',
    });
    loadMoreBtn.disabled = false;
  } finally {
    showLoader(false);
  }
}

function smoothScrollByCardHeight() {
  const firstCard = gallery.querySelector('.gallery-item');
  if (!firstCard) return;
  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({
    top: height * 2,
    left: 0,
    behavior: 'smooth',
  });
}
