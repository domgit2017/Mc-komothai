/* Theme */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function updateTheme() {
  const light = html.getAttribute('data-theme') === 'light';

  if (themeToggle) {
    themeToggle.innerHTML = light
      ? '<i class="fa-solid fa-moon"></i> Dark Mode'
      : '<i class="fa-solid fa-sun"></i> Light Mode';
  }
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
}

updateTheme();

themeToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateTheme();
});

/* Lightbox */
const modal = document.getElementById('lightboxModal');
const modalBody = document.getElementById('modalBody');

function openLightbox(type, src) {
  if (!modal || !modalBody) return;

  modalBody.innerHTML = '';

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Gallery image';
    modalBody.appendChild(img);
  }

  if (type === 'video') {
    const iframe = document.createElement('iframe');

    iframe.src = `${src}?autoplay=1`;
    iframe.height = '450';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;

    modalBody.appendChild(iframe);
  }

  modal.classList.add('active');
}

function closeLightbox() {
  if (!modal || !modalBody) return;

  modal.classList.remove('active');
  modalBody.innerHTML = '';
}

modal?.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeLightbox();
  }
});

/* Booking */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const wrapper = document.getElementById('bookingFormWrapper');
  const contact = document.getElementById('contact');
  const triggers = document.querySelectorAll('.form-trigger, .email-trigger');

  if (!form || !wrapper) return;

  wrapper.classList.remove('active');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();

      wrapper.classList.add('active');

      setTimeout(() => {
        wrapper.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        document.getElementById('clientName')?.focus();
      }, 100);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = document.getElementById('sendBtn');
    const message = document.getElementById('formMessage');

    if (!button || !message) return;

    const originalButton = button.innerHTML;

    button.disabled = true;

    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    message.innerHTML = '';

    try {
      const formData = new FormData(form);

      formData.append('_subject', "New Booking Request - Komothai's Finest");

      formData.append('_captcha', 'false');

      const response = await fetch(
        'https://formsubmit.co/ajax/komothaifinest@gmail.com',
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      form.reset();

      message.innerHTML = `
        <div class="success-message">
          <i class="fa-solid fa-circle-check"></i>
          <strong>Booking request sent successfully!</strong>
          <span>
            Thank you for contacting Komothai's Finest.
            We will get back to you shortly.
          </span>
        </div>
      `;

      setTimeout(() => {
        message.innerHTML = '';
        wrapper.classList.remove('active');

        contact?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 5000);
    } catch (error) {
      message.innerHTML = `
        <div class="error-message">
          <i class="fa-solid fa-circle-exclamation"></i>
          <strong>Unable to send your inquiry.</strong>
          <span>
            Please call or WhatsApp 0721 353 818.
          </span>
        </div>
      `;
    }

    button.disabled = false;
    button.innerHTML = originalButton;
  });
});

/* Hero slider */
const slides = document.querySelectorAll('.hero-slider .slide');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  slides[index]?.classList.add('active');
}

function changeSlide(direction) {
  if (!slides.length) return;

  currentSlide = (currentSlide + direction + slides.length) % slides.length;

  showSlide(currentSlide);
}

if (slides.length) {
  showSlide(currentSlide);

  setInterval(() => {
    changeSlide(1);
  }, 5000);
}
