/* ============================================================
   FrontM — About page behaviour
   Contact form: accessible client-side validation only.

   CONTACT FORM HOLD: backend + privacy/legal pages required
   before activation. This form collects personal data (name,
   email, phone, company, message) and must NOT be wired to a
   live endpoint until the privacy notice + legal pages exist.
   ============================================================ */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var nameEl = document.getElementById('cf-name');
  var emailEl = document.getElementById('cf-email');
  var status = document.getElementById('cf-status');

  function setErr(input, errId, msg) {
    var err = document.getElementById(errId);
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      err.textContent = msg;
      err.hidden = false;
      return true;
    }
    input.removeAttribute('aria-invalid');
    err.hidden = true;
    return false;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // HOLD: no backend — never submits anywhere
    status.hidden = true;

    var bad = false;
    bad = setErr(nameEl, 'cf-name-err', nameEl.value.trim() ? '' : 'Enter your full name.') || bad;
    bad = setErr(emailEl, 'cf-email-err',
      !emailEl.value.trim() ? 'Enter a valid work email.' :
      (validEmail(emailEl.value) ? '' : 'Enter a valid work email.')) || bad;

    if (bad) {
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    /* Front-end confirmation only (matches homepage demo-modal pattern).
       Swap for a real request + the failure state
       ("We could not send your message just now. Try again in a moment.")
       once the backend exists. */
    status.textContent = 'Thanks — your message has been sent.';
    status.className = 'form-status ok';
    status.hidden = false;
    form.reset();
  });

  /* clear field error as the user fixes it */
  [['cf-name', 'cf-name-err'], ['cf-email', 'cf-email-err']].forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid')) setErr(el, pair[1], '');
    });
  });
})();
