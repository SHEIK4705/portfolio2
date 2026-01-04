/* NabBar open close */
const toggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

toggle.addEventListener("change", () => {
  sidebar.classList.toggle("-translate-x-full");
  overlay.classList.toggle("hidden");
});

overlay.addEventListener("click", () => {
  toggle.checked = false;
  sidebar.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
});

/* Highlight the Nav Bar */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link, .mobile-link");

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function handleScroll() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", throttle(handleScroll, 200));

/* when user click nav link side bar should close */
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    toggle.checked = false;
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  });
});
/* Nav bar open close */

/* scroll to top */

const btn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  btn.style.display = window.scrollY > 400 ? "flex" : "none";
});

btn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// auto year
document.getElementById("year").textContent = new Date().getFullYear();

/* =====================================================
 * FAQ Interaction
 * ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    // Initially close all FAQs
    answer.style.maxHeight = "0";
    answer.style.paddingBottom = "0";

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector(".faq-answer").style.maxHeight = "0";
          otherItem.querySelector(".faq-answer").style.paddingBottom = "0";
          otherItem.querySelector(".faq-icon").style.transform = "rotate(0deg)";
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove("active");
        answer.style.maxHeight = "0";
        answer.style.paddingBottom = "0";
        icon.style.transform = "rotate(0deg)";
      } else {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.style.paddingBottom = "1rem";
        icon.style.transform = "rotate(45deg)";
      }
    });
  });
});

/* ================= HERO CANVAS (MOUSE REACTIVE) ================= */

const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

let w, h;
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Track mouse (subtle)
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle
class Particle {
  constructor() {
    this.baseX = Math.random() * w;
    this.baseY = Math.random() * h;

    this.x = this.baseX;
    this.y = this.baseY;

    this.r = Math.random() * 2.2 + 0.8;

    // brighter & more visible
    this.opacity = Math.random() * 0.45 + 0.1;

    // gentle vertical drift
    this.speedY = Math.random() * 0.05 + 0.02;

    // subtle horizontal drift
    this.speedX = (Math.random() - 0.5) * 0.03;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    // slightly brighter violet
    ctx.fillStyle = `rgba(179, 153, 255,${this.opacity})`;
    ctx.fill();
  }

  update() {
    /* Natural slow drift */
    this.y += this.speedY;
    this.x += this.speedX;

    // wrap around screen
    if (this.y > h + 20) this.y = -20;
    if (this.x > w + 20) this.x = -20;
    if (this.x < -20) this.x = w + 20;

    /* Mouse interaction (still subtle) */
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 140) {
        this.x -= dx * 0.0025;
        this.y -= dy * 0.0025;
      }
    }

    /* Ease back slightly to original lane */
    this.x += (this.baseX - this.x) * 0.0008;
    this.y += (this.baseY - this.y) * 0.0008;

    this.draw();
  }
}

// Init
function initParticles(count = 120) {
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}
initParticles();
// Slowly spawn new particles (controlled)
setInterval(() => {
  if (particles.length < 160) {
    particles.push(new Particle());
  }
}, 2500);

// Animate
function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p) => p.update());
  requestAnimationFrame(animate);
}
animate();
