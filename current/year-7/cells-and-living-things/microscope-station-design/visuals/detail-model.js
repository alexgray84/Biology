const prediction = document.querySelector('#prediction');
const zoom = document.querySelector('#zoom');
const capture = document.querySelector('#capture');
const picture = document.querySelector('#comparison');
const status = document.querySelector('#status');
const explanation = document.querySelector('#explanation');

let enlarged = false;
let clearer = false;
let observedEnlargement = false;
let observedClearerCapture = false;

function renderComparison() {
  zoom.disabled = !prediction.checked;
  capture.disabled = !prediction.checked;
  zoom.setAttribute('aria-pressed', String(enlarged));
  capture.setAttribute('aria-pressed', String(clearer));
  const source = clearer ? 'cell-boundaries.jpg' : 'cell-boundaries-blurred.jpg';
  if (picture.getAttribute('src') !== source) picture.src = source;
  picture.dataset.enlarged = String(enlarged);
  const size = enlarged ? 'enlarged' : 'at the starting display size';
  status.textContent = (clearer ? 'Clearer capture, ' : 'Starting image, ') + size + '.';
  picture.alt = clearer
    ? 'Onion-cell micrograph ' + size + '. Darker joined edges are visible between adjacent pale cells.'
    : 'Softened onion-cell micrograph ' + size + '. Several edges merge near the centre.';
  explanation.hidden = !prediction.checked || !observedEnlargement || !observedClearerCapture;
}

prediction.addEventListener('change', () => {
  if (!prediction.checked) {
    enlarged = false;
    clearer = false;
    observedEnlargement = false;
    observedClearerCapture = false;
  }
  renderComparison();
});

zoom.addEventListener('click', () => {
  enlarged = !enlarged;
  if (!clearer && enlarged) observedEnlargement = true;
  renderComparison();
});

capture.addEventListener('click', () => {
  clearer = !clearer;
  if (clearer) observedClearerCapture = true;
  renderComparison();
});

renderComparison();
