const html = document.documentElement;
const header = document.getElementById('site-header');
const menuButton = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('i');
const backToTop = document.getElementById('back-to-top');
const bookingForm = document.getElementById('booking-form');
const eventDate = document.getElementById('event-date');

let savedTheme = null;

try {
  savedTheme = localStorage.getItem('mc-theme');
} catch {
  savedTheme = null;
}

html.setAttribute('data-theme', savedTheme || 'dark');

function updateThemeIcon() {
  if (!themeIcon) return;

  const theme = html.getAttribute('data-theme');

  themeIcon.className =
    theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  themeToggle?.setAttribute(
    'aria-label',
    theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
  );
}

updateThemeIcon();

themeToggle?.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  html.setAttribute('data-theme', newTheme);

  try {
    localStorage.setItem('mc-theme', newTheme);
  } catch {
    // Ignore storage errors.
  }

  updateThemeIcon();
});

function closeMobileMenu() {
  if (!navMenu) return;

  navMenu.classList.remove('open');

  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');

  const icon = menuButton?.querySelector('i');

  if (icon) {
    icon.className = 'fa-solid fa-bars';
  }
}

menuButton?.addEventListener('click', () => {
  if (!navMenu) return;

  const isOpen = navMenu.classList.toggle('open');

  menuButton.setAttribute('aria-expanded', String(isOpen));

  menuButton.setAttribute(
    'aria-label',
    isOpen ? 'Close navigation' : 'Open navigation',
  );

  const icon = menuButton.querySelector('i');

  if (icon) {
    icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  }
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

function handleScroll() {
  const scrollPosition = window.scrollY;

  header?.classList.toggle('scrolled', scrollPosition > 40);

  backToTop?.classList.toggle('visible', scrollPosition > 600);
}

window.addEventListener('scroll', handleScroll, {
  passive: true,
});

handleScroll();

backToTop?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/* Active navigation */

const sections = document.querySelectorAll('main section[id]');
const navigationLinks = document.querySelectorAll('.main-nav a');

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navigationLinks.forEach((link) => {
          const targetId = link.getAttribute('href');

          link.classList.toggle('active', targetId === `#${entry.target.id}`);
        });
      });
    },
    {
      rootMargin: '-35% 0px -55% 0px',
    },
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

/* Reveal animations */

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add('visible');
  });
}

/* FAQ */

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question) => {
  question.setAttribute('aria-expanded', 'false');

  question.addEventListener('click', () => {
    const currentItem = question.closest('.faq-item');

    if (!currentItem) return;

    document.querySelectorAll('.faq-item.open').forEach((item) => {
      if (item === currentItem) return;

      item.classList.remove('open');

      item
        .querySelector('.faq-question')
        ?.setAttribute('aria-expanded', 'false');
    });

    const isOpen = currentItem.classList.toggle('open');

    question.setAttribute('aria-expanded', String(isOpen));
  });
});

/* Gallery */

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentGalleryIndex = 0;

const galleryData = Array.from(galleryItems)
  .map((item) => ({
    image: item.dataset.image,
    caption: item.dataset.caption || '',
  }))
  .filter((item) => item.image);

function showGalleryImage(index) {
  if (!galleryData.length || !lightboxImage) return;

  currentGalleryIndex = (index + galleryData.length) % galleryData.length;

  const item = galleryData[currentGalleryIndex];

  lightboxImage.src = item.image;
  lightboxImage.alt = item.caption;

  if (lightboxCaption) {
    lightboxCaption.textContent = item.caption;
  }
}

function openLightbox(index) {
  if (!lightbox || !galleryData.length) return;

  showGalleryImage(index);

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');

  document.body.classList.add('lightbox-open');

  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('lightbox-open');

  lightboxImage?.removeAttribute('src');
}

galleryItems.forEach((item, index) => {
  item.setAttribute('tabindex', '0');

  item.addEventListener('click', () => {
    openLightbox(index);
  });

  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose?.addEventListener('click', closeLightbox);

lightboxPrev?.addEventListener('click', () => {
  showGalleryImage(currentGalleryIndex - 1);
});

lightboxNext?.addEventListener('click', () => {
  showGalleryImage(currentGalleryIndex + 1);
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('open')) return;

  if (event.key === 'Escape') {
    closeLightbox();
    return;
  }

  if (event.key === 'ArrowLeft') {
    showGalleryImage(currentGalleryIndex - 1);
  }

  if (event.key === 'ArrowRight') {
    showGalleryImage(currentGalleryIndex + 1);
  }
});

/* Booking date */

if (eventDate) {
  const today = new Date();

  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split('T')[0];

  eventDate.min = localDate;
}

/* Booking form */

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);

  const name = formData.get('name')?.toString().trim() || '';
  const phone = formData.get('phone')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';
  const eventType = formData.get('event-type')?.toString().trim() || '';
  const date = formData.get('event-date')?.toString().trim() || '';
  const location = formData.get('location')?.toString().trim() || '';
  const guests = formData.get('guests')?.toString().trim() || '';
  const message = formData.get('message')?.toString().trim() || '';

  let formattedDate = 'Not specified';

  if (date) {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (!Number.isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  const whatsappText = [
    'Hello, I would like to enquire about booking you as an MC.',
    '',
    `Name: ${name || 'Not provided'}`,
    `Phone: ${phone || 'Not provided'}`,
    `Email: ${email || 'Not provided'}`,
    `Event: ${eventType || 'Not specified'}`,
    `Date: ${formattedDate}`,
    `Location: ${location || 'Not specified'}`,
    `Expected Guests: ${guests || 'Not specified'}`,
    `Additional Details: ${message || 'None'}`,
  ].join('\n');

  const whatsappNumber = '254721353818';

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=` + encodeURIComponent(whatsappText);

  const whatsappWindow = window.open(
    whatsappUrl,
    '_blank',
    'noopener,noreferrer',
  );

  if (!whatsappWindow) {
    window.location.href = whatsappUrl;
    return;
  }

  bookingForm.reset();
});

/* Smooth links */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');

    if (!targetId || targetId === '#') return;

    let target;

    try {
      target = document.querySelector(targetId);
    } catch {
      return;
    }

    if (!target) return;

    event.preventDefault();

    closeMobileMenu();

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
});

/* Current year */

const yearElement = document.getElementById('current-year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
