export function buildCardsMarkup(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${escapeHtml(
        tags
      )}" loading="lazy" />
        </a>
        <ul class="meta">
          <li><b>Likes:</b> ${likes}</li>
          <li><b>Views:</b> ${views}</li>
          <li><b>Comments:</b> ${comments}</li>
          <li><b>Downloads:</b> ${downloads}</li>
        </ul>
      </li>`
    )
    .join('');
}

export function drawGallery(markup) {
  document.querySelector('#gallery').insertAdjacentHTML('beforeend', markup);
}

export function clearGallery() {
  document.querySelector('#gallery').innerHTML = '';
}

export function toggleLoadMore(show) {
  const btn = document.querySelector('#load-more');
  btn.hidden = !show;
  btn.disabled = false;
}

export function showLoader(show) {
  const spinner = document.querySelector('#loader');
  spinner.hidden = !show;
}

// утиліта безпеки для alt/текстів
function escapeHtml(s = '') {
  return s.replace(
    /[&<>"']/g,
    c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[
        c
      ])
  );
}
