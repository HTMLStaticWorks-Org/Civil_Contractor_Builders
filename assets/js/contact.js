/* ==========================================================================
   CONTACT US PAGE (contact.html) — Quotation Form Validation (Frontend Demo)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initQuoteFormValidation();
});

function initQuoteFormValidation() {
  const form = document.getElementById('quoteRequestForm');
  if (!form) return;

  const submitBtn = document.getElementById('quoteSubmitBtn');
  const feedbackBox = document.getElementById('quoteFormFeedback');

  const validators = {
    fullName: (val) => val.trim().length >= 2,
    phoneNumber: (val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 7 && digits.length <= 15;
    },
    emailAddress: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    projectType: (val) => val.trim() !== '',
    projectLocation: (val) => val.trim().length >= 2,
    projectMessage: (val) => val.trim().length >= 10,
  };

  const validateField = (field) => {
    const fn = validators[field.id];
    if (!fn) return true;
    const isValid = fn(field.value);
    field.classList.toggle('is-invalid', !isValid);
    field.setAttribute('aria-invalid', !isValid ? 'true' : 'false');
    return isValid;
  };

  // Live validation on blur/input
  Object.keys(validators).forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(el));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) {
        validateField(el);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalid = null;

    Object.keys(validators).forEach((id) => {
      const el = document.getElementById(id);
      if (el && !validateField(el)) {
        allValid = false;
        if (!firstInvalid) firstInvalid = el;
      }
    });

    if (!allValid) {
      if (firstInvalid) firstInvalid.focus();
      if (feedbackBox) {
        feedbackBox.className = 'alert alert-danger mt-4';
        feedbackBox.textContent = 'Please review and complete the highlighted required fields before submitting.';
      }
      return;
    }

    // Structured payload ready for future backend integration (e.g., fetch(form.dataset.endpoint))
    const payload = Object.fromEntries(new FormData(form).entries());

    // Loading state
    const originalHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Validating Request...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }

      if (feedbackBox) {
        feedbackBox.className = 'alert alert-success mt-4';
        feedbackBox.innerHTML = `
          <strong>Thank you, ${escapeHtml(payload.fullName || 'Client')}!</strong> Your quotation request for
          <strong>${escapeHtml(payload.projectType || 'Construction')}</strong> at
          <strong>${escapeHtml(payload.projectLocation || 'your site')}</strong> has been submitted.
          <span class="d-block small mt-1">Our civil engineering desk will review your requirements and reach out within 1 business day.</span>
        `;
      }

      form.reset();
      Object.keys(validators).forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.remove('is-invalid');
          el.setAttribute('aria-invalid', 'false');
        }
      });
    }, 650);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
