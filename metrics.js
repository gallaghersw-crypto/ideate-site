(() => {
  const counters = [...document.querySelectorAll('[data-count-to]')];
  if (!counters.length) return;
  const section = counters[0].closest('.numbers-section');
  const toggle = section.querySelector('.counter-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const format = new Intl.NumberFormat('en-US');
  const models = counters.map(counter => ({
    visual: counter.querySelector('.counter-visual'),
    target: Number(counter.dataset.countTo),
    duration: Number(counter.dataset.duration || 12000),
    hold: Number(counter.dataset.hold || 5000),
    linear: counter.dataset.easing === 'linear',
    reels: [], comma: null, lastValue: -1, lastPaint: -Infinity
  }));
  let visible = false;
  let paused = false;
  let frame = 0;
  let elapsed = 0;
  let previousTime = null;

  function buildReels(model) {
    model.visual.replaceChildren();
    model.reels = [];
    model.comma = null;
    for (let place = String(model.target).length - 1; place >= 0; place--) {
      const digitWindow = document.createElement('span');
      digitWindow.className = 'digit-window';
      const track = document.createElement('span');
      track.className = 'digit-track';
      for (let n = 0; n < 20; n++) {
        const digit = document.createElement('span');
        digit.textContent = n % 10;
        track.append(digit);
      }
      digitWindow.append(track);
      model.visual.append(digitWindow);
      model.reels.push({window: digitWindow, track, place, position: 0});
      if (place === 3) {
        model.comma = document.createElement('span');
        model.comma.className = 'counter-comma';
        model.comma.textContent = ',';
        model.visual.append(model.comma);
      }
    }
  }

  function paint(model, value, instant = false) {
    if (value === model.lastValue && !instant) return;
    for (const reel of model.reels) {
      reel.window.hidden = reel.place > 0 && value < 10 ** reel.place;
      const digit = Math.floor(value / 10 ** reel.place) % 10;
      const advance = (digit - reel.position % 10 + 10) % 10;
      if (instant || reel.position + advance > 19) {
        reel.track.style.transition = 'none';
        reel.position = instant ? digit : reel.position % 10;
        reel.track.style.transform = `translateY(-${reel.position}em)`;
        void reel.track.offsetHeight;
        reel.track.style.transition = '';
      }
      if (!instant) reel.position += advance;
      reel.track.style.transform = `translateY(-${reel.position}em)`;
    }
    if (model.comma) model.comma.hidden = value < 1000;
    model.lastValue = value;
  }

  function shouldRun() {
    return visible && !paused && !motion.matches && !document.hidden;
  }

  function tick(now) {
    frame = 0;
    if (!shouldRun()) { previousTime = null; return; }
    if (previousTime !== null) elapsed += now - previousTime;
    previousTime = now;
    for (const model of models) {
      const phase = elapsed % (model.duration + model.hold);
      const progress = Math.max(0, Math.min(1, phase / model.duration));
      const amount = model.linear ? progress : 1 - (1 - progress) ** 2;
      const value = model.linear ? Math.floor(model.target * amount) : Math.round(model.target * amount);
      if (now - model.lastPaint >= 80 || value === model.target || value < model.lastValue) {
        paint(model, value, value < model.lastValue);
        model.lastPaint = now;
      }
    }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = null;
    if (shouldRun()) frame = requestAnimationFrame(tick);
  }

  function configureMotion() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    elapsed = 0;
    for (const model of models) {
      model.lastValue = -1;
      model.lastPaint = -Infinity;
      if (motion.matches) {
        model.visual.textContent = format.format(model.target);
      } else {
        buildReels(model);
        paint(model, model.target, true);
      }
    }
    toggle.hidden = motion.matches;
    sync();
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.classList.toggle('is-paused', paused);
    const label = paused ? 'Resume animations' : 'Pause animations';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', configureMotion);
  configureMotion();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, {threshold: 0.15}).observe(section);
  } else {
    visible = true;
    sync();
  }
})();
