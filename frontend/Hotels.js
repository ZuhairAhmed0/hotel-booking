const cities = [
  {
    name: 'بورتسودان',
    region: 'شرق السودان · عروس البحر الأحمر',
    description: 'إقامة ساحلية ومشاهد البحر الأحمر.',
    photos: [
      { src: 'https://media-cdn.tripadvisor.com/media/photo-s/06/de/91/ff/sanganeb-national-park.jpg', alt: 'الشعاب المرجانية في البحر الأحمر', label: 'البحر الأحمر' },
      { src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80', alt: 'أمواج البحر على الساحل', label: 'الساحل' },
      { src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80', alt: 'شاطئ رملي هادئ', label: 'الشاطئ' }
    ],
  },
  {
    name: 'الخرطوم',
    region: 'العاصمة · ملتقى النيلين',
    description: 'خيارات إقامة وسط العاصمة وأحيائها الحيوية.',
    photos: [
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvupAXX70YB_cQwaTD5ubrMM_I59YXbkuWWTl5ZmtdTg&s=10', alt: 'مشهد من مدينة الخرطوم', label: 'الخرطوم' },
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnv-AvQyiN0hSW-bDoFujaDemfmjAQLgCLYsbOjbBkCw&s=10', alt: 'أفق مدينة عند الغروب', label: 'أفق المدينة' },
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxhi4z6oMH0e8p_tLULDPRvU1a3KbsyiCuldhQbSYnyA&s=10', alt: 'أضواء المدينة ليلاً', label: 'المدينة ليلاً' }
    ],
  },
  {
    name: 'أمدرمان',
    region: 'وسط السودان · مدينة التاريخ والثقافة',
    description: 'اكتشف أمدرمان وأسواقها ومعالمها التاريخية.',
    photos: [
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH_BmMPxLpEB6u7BzkL-ycsLypckv6BSIw4DaU5bPMMg&s=10', alt: 'مشهد لمدينة سودانية', label: 'أمدرمان' },
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3APN7Txt7gYTPoT8HqJdCVdI-APRxTxRteLrR_0Du-g&s=10', alt: 'مبانٍ وأسواق المدينة', label: 'المدينة القديمة' },
      { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFBqNltVGbUQIKTSm3OtZKZPrS92oS7tQZJKMiHnphCw&s=10', alt: 'أضواء المدينة عند المساء', label: 'أمسيات أمدرمان' }
    ],
  }
];

const citySections = document.querySelector('#citySections');
const hotelSearch = document.querySelector('#hotelSearch');
const cityTabs = document.querySelector('#cityTabs');
const emptyState = document.querySelector('#emptyState');
const hotelCount = document.querySelector('#hotelCount');
let hotelRows = [];
let activeCity = 'all';

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function renderHotel(hotel) {
  const hotelId = hotel.id ?? hotel.$id;
  const image = hotel.main_image || hotel.images?.[0] || 'assets/hero%20background.jfif';
  const reviews = Number(hotel.number_of_reviews) || 0;
  return `
    <article class="hotel-card">
      <div class="hotel-image">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(hotel.name)}" loading="lazy">
        <span class="hotel-tag">${escapeHtml(hotel.location)}</span>
      </div>
      <div class="hotel-details">
        <div class="hotel-details-top">
          <div><span class="hotel-location">${escapeHtml(hotel.location)}</span><h4>${escapeHtml(hotel.name)}</h4></div>
          <span class="rating" aria-label="التقييم ${escapeHtml(hotel.rating)} من 5">★ ${escapeHtml(hotel.rating)}</span>
        </div>
        <div class="hotel-meta"><span>${escapeHtml(hotel.description)}</span><strong>${new Intl.NumberFormat('ar').format(reviews)} <small>تقييم</small></strong></div>
        <a class="hotel-link" href="hotel.html?id=${encodeURIComponent(hotelId)}#hotelId=${encodeURIComponent(hotelId)}">التفاصيل <b aria-hidden="true">←</b></a>
      </div>
    </article>
  `;
}

function renderCity(city, hotels) {
  const photos = (city.photos || []).map((photo) => `
    <div class="city-photo"><img src="${photo.src}" alt="${photo.alt}" loading="lazy"><span>${photo.label}</span></div>
  `).join('');
  return `
    <section class="city-section" aria-labelledby="city-${escapeHtml(city.name)}">
      <div class="city-heading">
        <div><span class="eyebrow muted">${escapeHtml(city.region)}</span><h3 id="city-${escapeHtml(city.name)}">${escapeHtml(city.name)}</h3></div>
        <p>${escapeHtml(city.description)}</p>
        <span>${new Intl.NumberFormat('ar').format(hotels.length)} فنادق</span>
      </div>
      ${photos ? `<div class="city-photo-strip" aria-label="صور من ${escapeHtml(city.name)}">${photos}</div>` : ''}
      <div class="city-hotels-heading" style = "margin-top: 5rem; margin-bottom: 1rem;">
        <div><span class="eyebrow muted">خيارات الإقامة</span><h4>فنادق ${escapeHtml(city.name)}</h4></div>
        <span>${new Intl.NumberFormat('ar').format(hotels.length)} فنادق متاحة</span>
      </div>
      ${hotels.length ? `<div class="hotel-grid">${hotels.map(renderHotel).join('')}</div>` : '<div class="empty-state city-empty"><span class="empty-icon" aria-hidden="true">⌂</span><h3>لا توجد فنادق مضافة في هذه المدينة حالياً</h3><p>نعمل على إضافة خيارات إقامة جديدة قريباً.</p></div>'}
    </section>
  `;
}

function renderDirectory() {
  const query = hotelSearch.value.trim().toLocaleLowerCase('ar');
  const matchingRows = hotelRows.filter((hotel) => {
    const city = String(hotel.location || '');
    const searchable = [hotel.name, hotel.location, hotel.description].join(' ').toLocaleLowerCase('ar');
    return (activeCity === 'all' || city === activeCity) && (!query || searchable.includes(query));
  });
  const locations = [...new Set(matchingRows.map((hotel) => hotel.location || 'غير محدد'))];
  const groups = locations.map((location) => {
    const city = cities.find((item) => item.name === location) || {
      name: location,
      region: 'السودان',
      description: `خيارات إقامة في ${location}.`,
      photos: []
    };
    return { city, hotels: matchingRows.filter((hotel) => (hotel.location || 'غير محدد') === location) };
  });

  citySections.innerHTML = groups.map(({ city, hotels }) => renderCity(city, hotels)).join('');
  emptyState.hidden = matchingRows.length > 0;
  hotelCount.textContent = `${new Intl.NumberFormat('ar').format(matchingRows.length)} فنادق متاحة`;
  citySections.querySelectorAll('img').forEach((image) => {
    image.addEventListener('error', () => {
      if (!image.dataset.fallbackApplied) {
        image.dataset.fallbackApplied = 'true';
        image.src = 'assets/hero%20background.jfif';
      }
    });
  });
}

function renderCityTabs() {
  const locations = [...new Set(hotelRows.map((hotel) => hotel.location || 'غير محدد'))];
  cityTabs.innerHTML = [
    `<button class="city-tab${activeCity === 'all' ? ' active' : ''}" type="button" data-city="all" aria-pressed="${activeCity === 'all'}">كل المدن <span>${new Intl.NumberFormat('ar').format(hotelRows.length)}</span></button>`,
    ...locations.map((location) => {
      const count = hotelRows.filter((hotel) => (hotel.location || 'غير محدد') === location).length;
      const isActive = activeCity === location;
      return `<button class="city-tab${isActive ? ' active' : ''}" type="button" data-city="${escapeHtml(location)}" aria-pressed="${isActive}">${escapeHtml(location)} <span>${new Intl.NumberFormat('ar').format(count)}</span></button>`;
    })
  ].join('');

  cityTabs.querySelectorAll('.city-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCity = tab.dataset.city;
      renderCityTabs();
      renderDirectory();
    });
  });
}

hotelSearch.addEventListener('input', renderDirectory);
document.querySelector('#clearFilters').addEventListener('click', () => {
  activeCity = 'all';
  hotelSearch.value = '';
  renderCityTabs();
  renderDirectory();
  hotelSearch.focus();
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    hotelSearch.focus();
  }
});

const siteHeader = document.querySelector('.site-header');
function updateHeaderOnScroll() {
  siteHeader.classList.toggle('scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#mainNav');
const navBackdrop = document.querySelector('.nav-backdrop');
function setNavigationOpen(isOpen) {
  mainNav.classList.toggle('open', isOpen);
  navBackdrop.classList.toggle('open', isOpen);
  document.body.classList.toggle('nav-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
}
menuToggle.addEventListener('click', () => setNavigationOpen(!mainNav.classList.contains('open')));
document.querySelector('.nav-close').addEventListener('click', () => setNavigationOpen(false));
navBackdrop.addEventListener('click', () => setNavigationOpen(false));
mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  setNavigationOpen(false);
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mainNav.classList.contains('open')) setNavigationOpen(false);
});

async function loadHotels() {
  try {
    hotelRows = await IqamaApi.getHotels();

    renderCityTabs();
    renderDirectory();
  } catch (error) {
    console.error('Unable to load hotels from Laravel API:', error);
    hotelCount.textContent = 'تعذر الاتصال';
    citySections.innerHTML = '<div class="empty-state" role="alert"><h3>تعذر تحميل الفنادق</h3><p>تحقق من تشغيل Laravel API ومن قيمة API_BASE_URL وإعدادات CORS.</p></div>';
  }
}

loadHotels();