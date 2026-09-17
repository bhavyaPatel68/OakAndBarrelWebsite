// Oak & Barrel — small interaction script
// Mobile nav toggle, auto footer year, and Formspree contact form handling.
// No tracking, no third-party analytics.

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close the mobile menu after a nav link is tapped
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.setAttribute('aria-label', 'Open menu');
        }
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ================================================================
     CONTACT FORM (Formspree)
     ----------------------------------------------------------------
     This submits the form in the background so the visitor stays on
     the page and sees a message under the button, instead of being
     bounced to a Formspree confirmation page.

     You do NOT need to edit anything in here. The only setup step is
     putting your Formspree form ID into the form's action attribute
     in index.html — see the comment block above the form there.

     If JavaScript is disabled in the visitor's browser, this code
     never runs and the form submits normally to Formspree, which
     shows its own thank-you page. Either way the message arrives.
     ================================================================ */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('contactSubmit');

  if (form && status) {

    form.addEventListener('submit', function (event) {

      // If the form ID hasn't been filled in yet, don't pretend it worked.
      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        event.preventDefault();
        showStatus('This form isn\u2019t connected yet. Please call or visit the store.', 'error');
        console.warn('Formspree form ID missing: replace YOUR_FORM_ID in the form action in index.html.');
        return;
      }

      event.preventDefault();

      var data = new FormData(form);

      setSending(true);
      showStatus('Sending\u2026', 'success');

      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            showStatus('Thanks — your message has been sent. We\u2019ll get back to you soon.', 'success');
          } else {
            // Formspree returns details about what went wrong (e.g. the form
            // isn't confirmed yet, or the monthly limit was reached).
            return response.json().then(function (body) {
              var msg = 'Something went wrong. Please try again later.';
              if (body && body.errors && body.errors.length) {
                msg = body.errors.map(function (e) { return e.message; }).join(', ');
              }
              showStatus(msg, 'error');
            });
          }
        })
        .catch(function () {
          showStatus('Couldn\u2019t send your message — please check your connection and try again.', 'error');
        })
        .then(function () {
          setSending(false);
        });
    });
  }

  function showStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    status.classList.add('is-visible', kind === 'error' ? 'is-error' : 'is-success');
  }

  function setSending(isSending) {
    if (!submitBtn) return;
    submitBtn.disabled = isSending;
    submitBtn.textContent = isSending ? 'Sending…' : 'Send Message';
  }

});