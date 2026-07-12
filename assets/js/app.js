const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileNav = document.getElementById('mobileNav');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const backToTop = document.querySelector('.back-to-top');
const themeIcon = document.querySelectorAll('.theme-toggle i');
const navLinks = document.querySelectorAll('.mobile-nav a, .desktop-nav a');
const faqButtons = document.querySelectorAll('.faq-question');
const sliderTrack = document.querySelector('.testimonial-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const reveals = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('[data-target]');

let currentSlide = 0;
const totalSlides = testimonialCards.length;

// --- Theme ---
const themeKey = 'pulse-theme';
const storedTheme = localStorage.getItem(themeKey);
const getPreferredTheme = () => storedTheme ? storedTheme : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

const applyTheme = (theme) => {
    body.classList.toggle('light-theme', theme === 'light');
    themeIcon.forEach(icon => {
        icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
    localStorage.setItem(themeKey, theme);
};
applyTheme(getPreferredTheme());

const toggleTheme = () => applyTheme(body.classList.contains('light-theme') ? 'dark' : 'light');
themeToggle.addEventListener('click', toggleTheme);

// --- Mobile Nav Toggle ---
mobileMenuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.style.display === 'flex';
    if (isOpen) {
        mobileNav.style.display = 'none';
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    } else {
        mobileNav.style.display = 'flex';
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
});

// Close on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 821) {
            mobileNav.style.display = 'none';
            mobileNav.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });
});

// --- Scroll ---
window.addEventListener('scroll', () => {
    const threshold = 280;
    backToTop.classList.toggle('show', window.scrollY > threshold);
    revealOnScroll();
});

backToTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Reveal ---
const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.85;
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < trigger) el.classList.add('visible');
    });
};

// --- Stats ---
const animateStats = () => {
    statNumbers.forEach(el => {
        const update = () => {
            const target = +el.dataset.target;
            const current = +el.textContent;
            const increment = Math.ceil(target / 90);
            if (current < target) {
                el.textContent = Math.min(current + increment, target);
                requestAnimationFrame(update);
            }
        };
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && el.textContent === '0') {
            update();
        }
    });
};
window.addEventListener('scroll', animateStats, { passive: true });

// --- Slider (معكوس منطقياً ليتناسب مع RTL) ---
if (sliderTrack && totalSlides > 0) {
    const updateSlider = () => {
        // نستخدم translateX موجب للتحرك لليمين في RTL
        sliderTrack.style.transform = `translateX(${currentSlide * 100}%)`;
    };

    // عكس الأزرار: السهم الأيسر (prev) يتحرك للأمام، والأيمن (next) للخلف
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    // تبديل تلقائي كل 7 ثواني (يتحرك للأمام)
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 7000);

    updateSlider();
}

// --- FAQ ---
faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        faqButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
        document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = '0');
        if (!expanded) {
            button.setAttribute('aria-expanded', 'true');
            const answer = button.nextElementSibling;
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// --- Init ---
window.addEventListener('load', () => {
    document.querySelector('.page-loader').classList.add('hidden');
    setTimeout(() => document.querySelector('.page-loader').remove(), 700);
    revealOnScroll();
    animateStats();
    if (sliderTrack && totalSlides > 0) {
        const updateSlider = () => {
            sliderTrack.style.transform = `translateX(${currentSlide * 100}%)`;
        };
        updateSlider();
    }
});