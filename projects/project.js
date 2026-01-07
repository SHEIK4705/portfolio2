// Scroll To Top Visibility + Smooth Scroll
const scrollBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 250) {
    scrollBtn.style.opacity = "1";
    scrollBtn.style.pointerEvents = "auto";
  } else {
    scrollBtn.style.opacity = "0";
    scrollBtn.style.pointerEvents = "none";
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// auto year
document.getElementById("year").textContent = new Date().getFullYear();

// ===== FOR IMAGE PREVIEW =====
// ===== LIGHTBOX SYSTEM =====
document.addEventListener("DOMContentLoaded", function () {
  const screenshots = document.querySelectorAll(
    ".section-light img, .section-default img, .card-hover img"
  );

  if (!screenshots.length) return;

  let lightbox;

  function createLightbox(src) {
    if (lightbox) lightbox.remove();

    lightbox = document.createElement("div");
    lightbox.className = "lightbox-overlay";

    lightbox.innerHTML = `
      <div class="lightbox-image-wrapper">
        <button class="lightbox-close">✕</button>
        <img src="${src}" alt="Screenshot preview" />
      </div>
    `;

    document.body.appendChild(lightbox);

    setTimeout(() => lightbox.classList.add("active"), 10);

    lightbox.querySelector(".lightbox-close").onclick = closeLightbox;

    lightbox.onclick = (e) => {
      if (e.target === lightbox) closeLightbox();
    };
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    setTimeout(() => lightbox.remove(), 250);
  }

  screenshots.forEach((img) => {
    const wrap = img.parentElement;
    wrap.style.position = "relative";

    const eye = document.createElement("div");
    eye.className = "screenshot-eye";
    eye.innerHTML = `<span>👁</span>`;
    wrap.appendChild(eye);

    img.style.cursor = "pointer";

    wrap.addEventListener("click", () => createLightbox(img.src));
  });
});
