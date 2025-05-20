const resizeFactor = 2;

function storeScaled(scaled) {
  scaled.forEach(image => {
    if (!image.dataset.origW) {
      image.dataset.origW = image.naturalWidth;
    }
  });
}

function resizeScaled(scaled) {
  scaled.forEach(image => {
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

function observeVisualized(visualized) {
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
  visualized.forEach(image => observer.observe(image));
}

window.addEventListener('load', function () {
  const scaled = document.querySelectorAll('.scaled');

  storeScaled(scaled);
  resizeScaled(scaled);

  const visualized = document.querySelectorAll('.visualized');
  observeVisualized(visualized);
});