const resizeFactor = 2;

function storeOriginalSizes(images) {
  images.forEach(image => {
    if (!image.dataset.origW) {
      image.dataset.origW = image.naturalWidth;
    }
  });
}

function resizeImages(images) {
  console.log('Resizing images');

  images.forEach(image => {
    const origW = image.dataset.origW;

    if (origW) {
      image.style.width  = (origW / resizeFactor) + 'px';
    }
  });
}

function observeImages(images) {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  images.forEach(image => observer.observe(image));
}

window.addEventListener('load', function () {
  const images = document.querySelectorAll('img.scaled');

  storeOriginalSizes(images);
  resizeImages(images);
  observeImages(images);
});
