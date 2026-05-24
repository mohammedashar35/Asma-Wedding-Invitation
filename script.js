/* 
=========================================
PREMIUM ISLAMIC WEDDING INVITATION SCRIPTS
=========================================
Features: Canvas Particle Glow, Falling Petals, Scroll Reveal, Audio Playback
*/

document.addEventListener("DOMContentLoaded", () => {
  // Clean fake checkerboards from images before animation starts
  initImageCleanup();

  // Initialize Scroll Reveal Elements using IntersectionObserver
  initScrollReveal();

  // Initialize Canvas Gold Glowing Particles
  initGoldParticles();

  // Initialize Falling Flower Petals around Couple
  initFallingPetals();

  // Initialize Ambient Audio Player
  initAudioPlayer();
});

/* =========================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-fade-up, .reveal-zoom-in");
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* =========================================
   CANVAS GOLD PARTICLES
   ========================================= */
function initGoldParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 22000)); // Mobile friendly count

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Start at random height initially
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 80;
      this.size = Math.random() * 2.8 + 0.6;
      this.speedY = -(Math.random() * 0.7 + 0.2);
      this.speedX = Math.random() * 0.4 - 0.2;
      this.alpha = Math.random() * 0.6 + 0.15;
      this.decay = Math.random() * 0.005 + 0.001;
      this.glowingFactor = Math.random() * 0.02 + 0.005;
      this.glowDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Glow pulse animation
      this.alpha += this.glowingFactor * this.glowDir;
      if (this.alpha > 0.8) {
        this.alpha = 0.8;
        this.glowDir = -1;
      } else if (this.alpha < 0.1) {
        this.alpha = 0.1;
        this.glowDir = 1;
      }

      // Reset when particle goes off screen
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      // Draw glow ring
      ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 162, 90, ${this.alpha * 0.25})`;
      ctx.fill();

      // Draw core particle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(246, 230, 205, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Populate particles list
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();

  // Resize canvas event handler
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

/* =========================================
   FALLING PETALS ( around du couple )
   ========================================= */
function initFallingPetals() {
  const container = document.getElementById("petals-container");
  if (!container) return;

  const petalCount = 18; // Elegant, soft falling density
  const styles = [
    { borderRadius: "150px 10px 150px 10px", bg: "radial-gradient(circle, #fff0ea 0%, #fcdfd2 70%, #f5c4b1 100%)" }, // Soft pink
    { borderRadius: "10px 150px 10px 150px", bg: "radial-gradient(circle, #fffae8 0%, #faecd1 70%, #e2cd9c 100%)" }, // Cream-gold petal
    { borderRadius: "120px 20px 150px 10px", bg: "radial-gradient(circle, #fff6f3 0%, #fcdcd0 75%, #eca990 100%)" }  // Richer peach-rose
  ];

  for (let i = 0; i < petalCount; i++) {
    createPetal(container, styles, false);
  }
}

function createPetal(container, styles, isReplacement = true) {
  const petal = document.createElement("div");
  petal.className = "petal";

  // Select a random petal shape and color palette style
  const style = styles[Math.floor(Math.random() * styles.length)];
  petal.style.borderRadius = style.borderRadius;
  petal.style.background = style.bg;

  // Randomize sizing, speeds, and timing
  const size = Math.random() * 12 + 8; // width between 8px and 20px
  petal.style.width = `${size}px`;
  petal.style.height = `${size * (Math.random() * 0.4 + 0.9)}px`; // slight oval shapes

  // Position
  petal.style.left = `${Math.random() * 100}%`;
  
  // If we are spawning initially, stagger the start points
  if (!isReplacement) {
    petal.style.top = `${Math.random() * 100 - 100}%`;
  } else {
    petal.style.top = `-40px`;
  }

  // Animation settings
  const duration = Math.random() * 8 + 8; // 8s to 16s fall speed
  const delay = Math.random() * 10;
  petal.style.animationDuration = `${duration}s`;
  petal.style.animationDelay = `${isReplacement ? 0 : delay}s`;

  // Custom horizontal drift amplitude using custom variables
  const drift = Math.random() * 180 - 90; // Drift -90px to +90px
  petal.style.setProperty('--drift-x', `${drift}px`);

  container.appendChild(petal);

  // Re-spawn petal once animation finishes to prevent DOM buildup
  petal.addEventListener("animationend", () => {
    petal.remove();
    createPetal(container, styles, true);
  });
}

/* =========================================
   AMBIENT AUDIO PLAYER
   ========================================= */
function initAudioPlayer() {
  const toggleBtn = document.getElementById("music-toggle");
  if (!toggleBtn) return;

  // Soft premium romantic wedding instrumental background track (royalty free preview)
  const audioUrl = "https://assets.mixkit.co/music/preview/mixkit-romantic-ambiance-2895.mp3";
  const audio = new Audio(audioUrl);
  audio.loop = true;
  audio.volume = 0.55;

  let isPlaying = false;

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      toggleBtn.classList.remove("playing");
      toggleBtn.innerHTML = '<i class="fas fa-music"></i>';
      isPlaying = false;
    } else {
      audio.play().then(() => {
        toggleBtn.classList.add("playing");
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
      }).catch(err => {
        console.warn("Audio autoplay blocked by browser policy. Interaction needed.");
      });
    }
  };

  toggleBtn.addEventListener("click", togglePlay);

  // Prompt soft ambient audio once user interacts with the page for the first time
  const autoPlayOnFirstTouch = () => {
    if (!isPlaying) {
      togglePlay();
    }
    // Remove listeners so they don't trigger repeatedly
    document.removeEventListener("click", autoPlayOnFirstTouch);
    document.removeEventListener("touchstart", autoPlayOnFirstTouch);
  };

  document.addEventListener("click", autoPlayOnFirstTouch);
  document.addEventListener("touchstart", autoPlayOnFirstTouch);
}

/* =========================================
   DYNAMIC IMAGE BACKGROUND & CHECKERBOARD CLEANER
   ========================================= */
function initImageCleanup() {
  const imagesToClean = document.querySelectorAll(".floral-corner, .floral-bed-img, .couple-img, .mosque-moon-img");
  
  imagesToClean.forEach(img => {
    if (img.complete) {
      cleanImageBackground(img);
    } else {
      img.addEventListener("load", () => {
        cleanImageBackground(img);
      });
      // Fallback in case load listener missed it
      setTimeout(() => {
        if (!img.dataset.cleaned) cleanImageBackground(img);
      }, 500);
    }
  });
}

function cleanImageBackground(imgElement) {
  if (imgElement.dataset.cleaned === "true") return;
  
  const tempImg = new Image();
  // Set crossOrigin to avoid potential canvas taint issues
  tempImg.crossOrigin = "anonymous";
  tempImg.src = imgElement.src;
  
  tempImg.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = tempImg.width;
    canvas.height = tempImg.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(tempImg, 0, 0);
    
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Scans pixels to turn white background & gray checkerboard squares transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // 1. Detect bright/pure white square pixels
        const isWhite = (r > 240 && g > 240 && b > 240);
        
        // 2. Detect neutral gray square pixels of the standard checkerboard pattern
        const diffRG = Math.abs(r - g);
        const diffGB = Math.abs(g - b);
        const diffRB = Math.abs(r - b);
        
        // Checkerboard light grays usually fall in the 185-225 range, with near-identical RGB values
        const isGray = (diffRG < 4 && diffGB < 4 && diffRB < 4 && r > 180 && r < 228);
        
        if (isWhite || isGray) {
          data[i+3] = 0; // 100% transparent alpha channel
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      imgElement.src = canvas.toDataURL("image/png");
      imgElement.dataset.cleaned = "true";
      
      // Trigger a style recalculation to force rendering update
      imgElement.style.display = 'none';
      imgElement.offsetHeight; // force reflow
      imgElement.style.display = '';
    } catch (e) {
      console.warn("Failed to dynamically clear checkerboard background: ", e);
    }
  };
}
