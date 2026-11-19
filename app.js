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
  if (form) form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('status');
    const button = form.querySelector('button[type=submit]');
    const fields = Object.fromEntries(new FormData(form));
    if (fields._honey) return;
    delete fields._honey;
    button.disabled = true;
    status.textContent = 'Sending...';
    try {
      const response = await fetch('https://formsubmit.co/ajax/gallaghersw@gmail.com', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({...fields, _subject: 'New ideate inquiry from ' + fields.Name, _replyto: fields.Email, _template: 'table', _captcha: 'false'})
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false || result.success === 'false') throw new Error('send failed');
      form.reset();
      status.textContent = 'Thank you. Your note is on its way, and we will be in touch.';
    } catch {
      status.textContent = 'That did not send. Please try again, or email gallaghersw@gmail.com directly.';
    } finally {
      button.disabled = false;
    }
  });
})();
