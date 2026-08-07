// Theme toggle
const themeToggleBtn = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function updateThemeButton() {
  const currentTheme = htmlElement.getAttribute('data-theme');

  themeToggleBtn.innerHTML =
    currentTheme === 'light'
      ? '<i class="fa-solid fa-moon"></i> <span>Dark Mode</span>'
      : '<i class="fa-solid fa-sun"></i> <span>Light Mode</span>';
}

updateThemeButton();

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  htmlElement.setAttribute(
    'data-theme',
    currentTheme === 'dark' ? 'light' : 'dark',
  );
  updateThemeButton();
});

// Light box
const modal = document.getElementById('lightboxModal');
const modalBody = document.getElementById('modalBody');

function openLightbox(type, src) {
  modalBody.innerHTML = '';

  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    modalBody.appendChild(img);
  } else if (type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src = src + '?autoplay=1';
    iframe.height = '450';
    iframe.style.border = 'none';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    modalBody.appendChild(iframe);
  }

  modal.classList.add('active');
}

function closeLightbox() {
  modal.classList.remove('active');
  modalBody.innerHTML = '';
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeLightbox();
});

// Formsubmit ajax
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = this;
    const button = document.getElementById('sendBtn');
    const message = document.getElementById('formMessage');

    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

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
          <div id="successPopup" style="
            background:#10b981;
            color:#fff;
            padding:15px;
            border-radius:8px;
            text-align:center;
            font-weight:600;
            opacity:1;
            transition:opacity .5s ease;">
            ✅ Thank you for contacting Komothai's Finest.<br>
            Your booking inquiry has been sent successfully.<br>
            We will get back to you shortly.
          </div>
        `;

      setTimeout(() => {
        const popup = document.getElementById('successPopup');

        if (popup) {
          popup.style.opacity = '0';

          setTimeout(() => {
            message.innerHTML = '';
          }, 500);
        }
      }, 3000);
    } catch (error) {
      message.innerHTML = `
          <div style="
            background:#ef4444;
            color:#fff;
            padding:15px;
            border-radius:8px;
            text-align:center;
            font-weight:600;">
            ❌ Unable to send your inquiry.<br>
            Please call or WhatsApp 0721 353 818.
          </div>
        `;
    }

    button.disabled = false;
    button.innerHTML =
      '<i class="fa-solid fa-paper-plane"></i> <span>Send Booking Request</span>';
  });
}

const slides = document.querySelectorAll('.hero-slider .slide');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide) => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function changeSlide(direction) {
  currentSlide += direction;

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  showSlide(currentSlide);
}

// Auto-slide every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);
