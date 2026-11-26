const $ = (selector) => document.querySelector(selector);
const toast = $('#toast');
let toastTimer;
function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove('show'), 3200);
}

// Mobile navigation
const menuToggle = $('.menu-toggle');
const mainNav = $('#mainNav');
const navBackdrop = $('.nav-backdrop');
function setNavigationOpen(isOpen) {
  mainNav.classList.toggle('open', isOpen);
  navBackdrop.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}
menuToggle.addEventListener('click',()=>setNavigationOpen(!mainNav.classList.contains('open')));
$('.nav-close').addEventListener('click',()=>setNavigationOpen(false));
navBackdrop.addEventListener('click',()=>setNavigationOpen(false));
mainNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setNavigationOpen(false)));
document.addEventListener('keydown',event=>{
  if(event.key === 'Escape' && mainNav.classList.contains('open')) setNavigationOpen(false);
});

// Favorite buttons
document.querySelectorAll('.favorite').forEach(button=>{
  button.addEventListener('click',()=>{
    button.classList.toggle('is-favorite');
    button.textContent = button.classList.contains('is-favorite') ? '♥' : '♡';
    showToast(button.classList.contains('is-favorite') ? 'أُضيف الفندق إلى قائمتك المفضلة.' : 'تمت إزالة الفندق من المفضلة.');
  });
});

// Destination controls gently shift focus between cards on smaller screens.
const destGrid = $('#destinationGrid');
const nextDest = $('#nextDest');
const prevDest = $('#prevDest');
nextDest?.addEventListener('click',()=>destGrid.scrollBy({left:-destGrid.clientWidth,behavior:'smooth'}));
prevDest?.addEventListener('click',()=>destGrid.scrollBy({left:destGrid.clientWidth,behavior:'smooth'}));

$('#newsletterForm')?.addEventListener('submit',event=>{
  event.preventDefault();
  const email = event.currentTarget.querySelector('input').value.trim();
  if(email) showToast('شكراً لاشتراكك! سنرسل إليك أحدث العروض قريباً.');
  event.currentTarget.reset();
});

// Add a blurred backdrop to the whole navbar after leaving the hero.
const siteHeader = $('.site-header');
const heroSection = $('.hero');
function updateHeaderOnScroll(){
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

const homeHotelGrid = $('#hotels .hotel-grid');
const homeEscapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

async function loadHomeHotels() {
  try {
    const hotels = (await IqamaApi.getHotels()).slice(0, 5);

    if (!hotels.length) {
      homeHotelGrid.innerHTML = '<p class="hotel-loading">لا توجد فنادق مضافة حالياً.</p>';
      return;
    }

    homeHotelGrid.innerHTML = hotels.map((hotel) => {
      const hotelId = hotel.id ?? hotel.$id;
      const image = hotel.main_image || hotel.images?.[0] || 'assets/hero%20background.jfif';
      const reviews = new Intl.NumberFormat('ar').format(Number(hotel.number_of_reviews) || 0);
      return `
        <a class="hotel-card" href="hotel.html?id=${encodeURIComponent(hotelId)}#hotelId=${encodeURIComponent(hotelId)}">
          <div class="hotel-image">
            <img src="${homeEscapeHtml(image)}" alt="${homeEscapeHtml(hotel.name)}" loading="lazy">
            <span class="hotel-tag">${homeEscapeHtml(hotel.location)}</span>
          </div>
          <div class="hotel-details">
            <div><span class="hotel-location">${homeEscapeHtml(hotel.location)}</span><h3>${homeEscapeHtml(hotel.name)}</h3></div>
            <span class="rating">★ ${homeEscapeHtml(hotel.rating)}</span>
            <div class="hotel-meta"><span>${homeEscapeHtml(hotel.description)}</span><strong>${reviews} <small>تقييم</small></strong></div>
          </div>
        </a>
      `;
    }).join('');

    homeHotelGrid.querySelectorAll('img').forEach((image) => {
      image.addEventListener('error', () => {
        if (!image.dataset.fallbackApplied) {
          image.dataset.fallbackApplied = 'true';
          image.src = 'assets/hero%20background.jfif';
        }
      });
    });
  } catch (error) {
    console.error('Unable to load homepage hotels from Laravel API:', error);
    homeHotelGrid.innerHTML = '<p class="hotel-loading">تعذر تحميل الفنادق. تصفح <a href="Hotels.html">قائمة الفنادق</a>.</p>';
  }
}

loadHomeHotels();
