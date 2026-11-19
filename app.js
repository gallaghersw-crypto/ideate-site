(() => {
  function revealService() {
    const raw = location.hash.slice(1);
    if (!raw) return;
    let id;
    try { id = decodeURIComponent(raw); } catch { return; }
    const section = document.getElementById(id);
    const panel = section?.querySelector('.service-panel');
    if (panel) {
      panel.open = true;
      requestAnimationFrame(() => section.scrollIntoView({block:'start'}));
    }
  }
  revealService();
  window.addEventListener('hashchange', revealService);

  const select = document.getElementById('interest');
  const interest = new URLSearchParams(location.search).get('interest');
  if (select && interest && [...select.options].some(o => o.value === interest)) select.value = interest;
  const context = new URLSearchParams(location.search).get('context');
  const message = document.getElementById('message');
  if (message && context) message.value = context;
  const form = document.querySelector('form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const content = [...new FormData(form)].map(([key,value]) => `${key}: ${value}`).join('\n\n');
    const url = URL.createObjectURL(new Blob([content], {type:'text/plain'}));
    const download = document.createElement('a');
    download.href = url;
    download.download = 'ideate-inquiry.txt';
    download.click();
    document.getElementById('status').textContent = 'Your inquiry has been downloaded. Sending will be connected before launch.';
    setTimeout(() => URL.revokeObjectURL(url),1000);
  });
})();
