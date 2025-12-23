/* =====================================================
   app.js — Subtle GSAP Animations (Trust-Focused)
   ===================================================== */
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

window.addEventListener("scroll", () => {
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
});

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
 * GSAP Animations
 * ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. GLOBAL GSAP SETUP
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (!prefersReducedMotion.matches) {
    // Default animation properties
    const defaultScrollTrigger = {
      start: "top 85%",
      toggleActions: "play none none none",
      once: true,
    };

    // Use autoAlpha for opacity and visibility
    gsap.set(["#hero .cta a", ".timeline-dot"], { autoAlpha: 0 });

    // 2. HERO SECTION (FIXED)
    const heroTl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
    });
    heroTl
      .from("#hero h1", { autoAlpha: 0, y: 16 })
      .from(
        ["#hero .loader", "#hero p"],
        { autoAlpha: 0, y: 16, stagger: 0.2 },
        "-=0.7"
      )
      .to(
        // Use a .to() tween to ensure visibility
        "#hero .cta a",
        { autoAlpha: 1, scale: 1, stagger: 0.15 },
        "-=0.6"
      );

    // 3. NAVBAR
    // gsap.from("header", {
    //   y: -100,
    //   autoAlpha: 0,
    //   duration: 1,
    //   ease: "power3.out",
    //   delay: 0.5,
    // });

    // 4. ABOUT SECTION
    gsap.from("#about h2", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#about h2" },
      autoAlpha: 0,
      y: 20,
    });
    gsap.from("#about .img-border", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#about .img-border" },
      autoAlpha: 0,
      scale: 0.96,
    });
    gsap.from("#about .space-y-6 > *", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#about .space-y-6" },
      autoAlpha: 0,
      y: 15,
      stagger: 0.2,
    });

    // 4.5 CV + CONTACT LINKS SECTION (NEW)
    gsap.from("#links .container > *", {
      scrollTrigger: {
        ...defaultScrollTrigger,
        trigger: "#links",
      },
      autoAlpha: 0,
      y: 20,
      stagger: 0.2,
    });

    // 5. SERVICES SECTION
    gsap.from("#services h2", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#services h2" },
      autoAlpha: 0,
      y: 20,
    });
    gsap.from(".service-card", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: ".service-card" },
      autoAlpha: 0,
      y: 30,
      stagger: 0.15,
    });

    // 6. PROJECTS SECTION (FIXED - CSS CONFLICT REMOVED)
    gsap.from("#projects h2", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#projects h2" },
      autoAlpha: 0,
      y: 20,
    });
    gsap.from(".project-card", {
      scrollTrigger: {
        ...defaultScrollTrigger,
        trigger: "#projects .grid",
      },
      autoAlpha: 0,
      y: 20,
      scale: 0.97,
      stagger: 0.2,
      ease: "power3.out",
    });

    // 7. SKILLS SECTION (FIXED - CSS CONFLICT REMOVED)
    gsap.from("#skills h2", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#skills h2" },
      autoAlpha: 0,
      y: 20,
    });
    gsap.from(".skill-card", {
      scrollTrigger: {
        ...defaultScrollTrigger,
        trigger: "#skills .grid",
      },
      autoAlpha: 0,
      y: 30,
      stagger: 0.15,
    });

    // 8. PROCESS TIMELINE (FIXED)
    const timelineTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".timeline-wrapper",
        start: "top 70%",
        toggleActions: "play none none none",
        once: true,
      },
    });

    timelineTl.from(".timeline-line", {
      scaleY: 0,
      duration: 1,
      ease: "power2.out",
    });

    document.querySelectorAll(".timeline-item").forEach((item) => {
      timelineTl.to(
        item.querySelector(".timeline-dot"),
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      );
      timelineTl.from(
        item.querySelector(".timeline-card"),
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );
    });

    // 9. FAQ SECTION (Interaction)
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      const icon = item.querySelector(".faq-icon");

      gsap.set(answer, { height: 0, autoAlpha: 0, marginTop: 0 });

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active");
            gsap.to(otherItem.querySelector(".faq-answer"), {
              height: 0,
              autoAlpha: 0,
              marginTop: 0,
              duration: 0.4,
              ease: "power3.inOut",
            });
            gsap.to(otherItem.querySelector(".faq-icon"), {
              rotation: 0,
              duration: 0.4,
            });
          }
        });

        if (!isActive) {
          item.classList.add("active");
          gsap.to(answer, {
            height: "auto",
            autoAlpha: 1,
            marginTop: "1rem",
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(icon, { rotation: 45, duration: 0.4 });
        } else {
          item.classList.remove("active");
          gsap.to(answer, {
            height: 0,
            autoAlpha: 0,
            marginTop: 0,
            duration: 0.4,
            ease: "power3.inOut",
          });
          gsap.to(icon, { rotation: 0, duration: 0.4 });
        }
      });
    });

    // 10. CONTACT SECTION
    gsap.from("#contact h2", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "#contact h2" },
      autoAlpha: 0,
      y: 20,
    });
    gsap.from("form.contact-card", {
      scrollTrigger: { ...defaultScrollTrigger, trigger: "form.contact-card" },
      autoAlpha: 0,
      x: -50,
      duration: 1,
    });
    gsap.from(".contact-card + .space-y-6", {
      scrollTrigger: {
        ...defaultScrollTrigger,
        trigger: "form.contact-card",
      },
      autoAlpha: 0,
      x: 50,
      duration: 1,
    });

    // 11. FOOTER
    gsap.from("footer", {
      scrollTrigger: {
        trigger: "footer",
        start: "top 98%",
        toggleActions: "play none none none",
        once: true,
      },
      autoAlpha: 0,
      y: 20,
    });
  } else {
    // Fallback for reduced motion
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.style.display = "none";
      const p = loader.nextElementSibling;
      if (p) p.style.margin = "0";
    }
  }
});
/* ===================================================== */
