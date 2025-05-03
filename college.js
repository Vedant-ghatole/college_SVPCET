document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Helper: set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeIcon.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        localStorage.setItem('theme', theme);
    }

    // Helper: get theme
    function getTheme() {
        return localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    }

    // Smooth transition
    function addTransition() {
        document.documentElement.style.transition = 'background 0.3s, color 0.3s';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 400);
    }

    // Initialize
    setTheme(getTheme());

    // Toggle handler
    themeToggle.addEventListener('click', () => {
        addTransition();
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});

let slideIndex = 0;
const slides = document.querySelectorAll(".slides img");
const dots = document.querySelectorAll(".dot");
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active"));
    slides[index].style.display = "block";
    dots[index].classList.add("active");
}

function changeSlide(n) {
    clearInterval(slideInterval);
    slideIndex = (slideIndex + n + slides.length) % slides.length;
    showSlide(slideIndex);
    startAutoSlide();
}

function setSlide(n) {
    clearInterval(slideInterval);
    slideIndex = n;
    showSlide(slideIndex);
    startAutoSlide();
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlide(slideIndex);
    }, 5000);
}

document.addEventListener("visibilitychange", () => {
    document.hidden ? clearInterval(slideInterval) : startAutoSlide();
});

showSlide(slideIndex);
startAutoSlide();
