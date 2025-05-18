const resizeFactor = 2;

function storeOriginalSizes(images) {
  images.forEach(image => {
    if (!image.dataset.origW) {
      image.dataset.origW = image.naturalWidth;
    }
  });
}

function resizeImages(images) {
  images.forEach(image => {
    const origW = image.dataset.origW;
    const origH = image.naturalHeight;
    
    if (origW && origH) {
      image.style.width  = (origW / resizeFactor) + 'px';

      const cropClass = [...image.classList].find(c => /^crop(\d+)$/.test(c));
    
      if (cropClass) {
        const pct = parseInt(cropClass.replace('crop', ''), 10);
        const visible = 100.0 - 2 * pct;
        const newH = (origH * 1.0 / resizeFactor) * (visible / 100.0);

        image.style.height = newH + 'px';
        image.style.objectFit = 'cover';    // fills width, lets height crop
        image.style.objectPosition = 'center';   // trim evenly top & bottom
      }
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