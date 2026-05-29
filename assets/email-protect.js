// Email protection and simple client-side form safeguards
// - Reveals email links created as <a class="email-link" data-user="..." data-domain="...">
// - Adds a honeypot field and a simple math captcha to forms with id="contact-form"
document.addEventListener('DOMContentLoaded', function () {
  // Reveal obfuscated email links
  document.querySelectorAll('.email-link').forEach(function (el) {
    var user = el.getAttribute('data-user');
    var domain = el.getAttribute('data-domain');
    if (user && domain) {
      var email = user + '@' + domain;
      el.setAttribute('href', 'mailto:' + email);
      if (!el.textContent || el.textContent.trim() === '') el.textContent = email;
    }
  });

  // Simple honeypot + math captcha for client-side filtering (not a replacement for server-side checks)
  var form = document.getElementById('contact-form');
  if (!form) return;

  // Honeypot: hidden input named hp_field should be empty
  var hp = form.querySelector('input[name="hp_field"]');
  if (!hp) {
    hp = document.createElement('input');
    hp.type = 'text';
    hp.name = 'hp_field';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.style.position = 'absolute';
    hp.style.left = '-9999px';
    form.appendChild(hp);
  }

  // Math captcha UI
  var captchaWrap = document.getElementById('math-captcha');
  if (!captchaWrap) {
    captchaWrap = document.createElement('div');
    captchaWrap.id = 'math-captcha';
    captchaWrap.className = 'space-y-2';
    var label = document.createElement('label');
    label.className = 'block text-sm font-medium text-slate-700';
    label.textContent = 'Simple verification: solve to enable submit';
    var q = document.createElement('div');
    q.className = 'flex items-center gap-3';
    var num1 = Math.floor(Math.random() * 8) + 1;
    var num2 = Math.floor(Math.random() * 8) + 1;
    var question = document.createElement('div');
    question.textContent = num1 + ' + ' + num2 + ' =';
    question.className = 'text-lg font-semibold';
    var ans = document.createElement('input');
    ans.type = 'number';
    ans.id = 'captcha-answer';
    ans.className = 'p-2 border rounded';
    ans.setAttribute('aria-label', 'captcha answer');
    var submit = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submit) submit.disabled = true;
    q.appendChild(question);
    q.appendChild(ans);
    captchaWrap.appendChild(label);
    captchaWrap.appendChild(q);
    form.appendChild(captchaWrap);

    form.addEventListener('input', function () {
      var val = parseInt(ans.value, 10);
      var ok = val === (num1 + num2) && hp.value === '';
      if (submit) submit.disabled = !ok;
    });

    // Final check on submit
    form.addEventListener('submit', function (e) {
      var val = parseInt(ans.value, 10);
      if (hp.value !== '' || val !== (num1 + num2)) {
        e.preventDefault();
        alert('Verification failed. Please try again.');
      }
    });
  }
});
