// =====================================================
// NAVBAR SCROLL
// =====================================================
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// =====================================================
// LIGHTBOX GALERÍA (Imágenes + Video en navegación)
// =====================================================
const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = lightbox.querySelector('.close');
const prevBtn = lightbox.querySelector('.prev');
const nextBtn = lightbox.querySelector('.next');

// Crear elemento de video dentro del lightbox
let lightboxVideo = document.createElement('video');
lightboxVideo.controls = true;
lightboxVideo.style.display = 'none';
lightboxVideo.style.maxWidth = '90%';
lightboxVideo.style.maxHeight = '90%';
lightbox.appendChild(lightboxVideo);

let currentIndex = 0;

// 🔹 Abrir galería (imagen o video)
galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => {
    currentIndex = idx;
    openItem(idx);
  });
});

// 🔹 Función para abrir el item actual
function openItem(index) {
  const item = galleryItems[index];
  const type = item.dataset.type;

  lightbox.style.display = 'flex';

  if (type === 'video') {
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'block';
    lightboxVideo.src = item.dataset.src;
    lightboxVideo.play();
  } else {
    lightboxVideo.pause();
    lightboxVideo.style.display = 'none';
    lightboxImg.style.display = 'block';
    lightboxImg.src = item.dataset.src;
  }
}

// 🔹 Cerrar lightbox
closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxVideo.pause();
  lightboxVideo.currentTime = 0;
});

// 🔹 Navegar entre elementos
function showItem(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  openItem(currentIndex);
}

prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
nextBtn.addEventListener('click', () => showItem(currentIndex + 1));

// 🔹 Navegación con teclado
window.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "Escape") {
      lightbox.style.display = "none";
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0;
    } else if (e.key === "ArrowLeft") {
      showItem(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      showItem(currentIndex + 1);
    }
  }
});


// =====================================================
// ZOOM MAPA (Lightbox con botones, scroll, arrastre y ESC para cerrar)
// =====================================================
const mapContainer = document.getElementById('map-container');
const zoomLightbox = document.getElementById('zoom-lightbox');
const zoomImg = document.getElementById('zoom-img');
const zoomClose = document.getElementById('zoom-close');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');

mapContainer.addEventListener('click', () => {
  zoomLightbox.style.display = 'flex';
  resetZoom();
});
zoomClose.addEventListener('click', () => zoomLightbox.style.display = 'none');

let scale = 1;
let posX = 0, posY = 0;
let isDragging = false;
let startX, startY, initialX = 0, initialY = 0;

// 🔹 Reset al abrir
function resetZoom() {
  scale = 1;
  posX = 0;
  posY = 0;
  initialX = 0;
  initialY = 0;
  zoomImg.style.transform = `translate(0px, 0px) scale(1)`;
}

// 🔹 Zoom con botones
zoomInBtn.addEventListener('click', () => { 
  scale += 0.2; 
  zoomImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`; 
});
zoomOutBtn.addEventListener('click', () => { 
  scale = Math.max(1, scale - 0.2); 
  zoomImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`; 
});

// 🔹 Zoom con scroll dentro del lightbox
zoomLightbox.addEventListener("wheel", e => {
  e.preventDefault();
  const zoomIntensity = 0.1;
  if (e.deltaY < 0) {
    scale += zoomIntensity; 
  } else {
    scale = Math.max(1, scale - zoomIntensity); 
  }
  zoomImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

// 🔹 Arrastrar dentro del lightbox
zoomImg.addEventListener('mousedown', (e) => { 
  isDragging = true; 
  startX = e.clientX; 
  startY = e.clientY; 
});
window.addEventListener('mouseup', () => { 
  isDragging = false; 
  initialX = posX; 
  initialY = posY; 
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  posX = initialX + dx;
  posY = initialY + dy;
  zoomImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

// 🔹 Cerrar con tecla ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && zoomLightbox.style.display === "flex") {
    zoomLightbox.style.display = "none";
  }
});


