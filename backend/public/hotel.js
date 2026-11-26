const hotelData = { id: '', name: '', currency: 'SDG', rooms: [] };

const roomList = document.querySelector('#roomList');
const bookingForm = document.querySelector('#bookingForm');
const checkInInput = document.querySelector('#checkIn');
const checkOutInput = document.querySelector('#checkOut');
const guestCount = document.querySelector('#guestCount');
const phoneCountryCode = document.querySelector('#phoneCountryCode');
const phoneNumber = document.querySelector('#phoneNumber');
const toast = document.querySelector('#toast');
const bookingSuccessDialog = document.querySelector('#bookingSuccessDialog');
let toastTimer;

const formatPrice = (amount) => `${new Intl.NumberFormat('en-US').format(amount)} ${hotelData.currency}`;
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

function renderHotel(hotel) {
  hotelData.id = hotel.id ?? hotel.$id;
  hotelData.name = hotel.name || '';
  hotelData.currency = hotel.currency || 'SDG';
  document.title = `${hotelData.name} | إقامة`;
  document.querySelector('#hotelName').textContent = hotelData.name;
  document.querySelector('#hotelLocation').textContent = hotel.location || '';
  const locationLink = document.querySelector('#hotelLocationLink');
  try {
    const mapUrl = new URL(hotel.location_link);
    if (['http:', 'https:'].includes(mapUrl.protocol)) {
      locationLink.href = mapUrl.href;
      locationLink.hidden = false;
    }
  } catch {
    locationLink.hidden = true;
  }
  document.querySelector('#hotelDescription').textContent = hotel.description || '';
  document.querySelector('#hotelRatingValue').textContent = hotel.rating || '-';
  document.querySelector('#hotelReviewCount').textContent = `${new Intl.NumberFormat('ar').format(Number(hotel.number_of_reviews) || 0)} تقييماً`;
  document.querySelector('#hotelRating').setAttribute('aria-label', `التقييم ${hotel.rating || '-'} من 5`);

  const gallery = document.querySelector('#gallery');
  const images = [...new Set([hotel.main_image, ...(Array.isArray(hotel.images) ? hotel.images : [])].filter(Boolean))];
  if (!images.length) images.push('assets/hero%20background.jfif');
  gallery.innerHTML = images.slice(0, 4).map((image, index) => `
    <button class="${index === 0 ? 'gallery-main' : 'gallery-tile'} gallery-image" type="button" data-full-image="${escapeHtml(image)}" aria-label="تكبير صورة ${escapeHtml(hotelData.name)}">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(hotelData.name)}" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
      ${index === 0 ? `<span class="gallery-caption"><b>${escapeHtml(hotelData.name)}</b><small>${escapeHtml(hotel.location || '')}</small></span>` : ''}
      ${index === 3 ? '<span class="gallery-more">عرض الصور <b aria-hidden="true">↙</b></span>' : ''}
    </button>
  `).join('');
  gallery.querySelectorAll('img').forEach((image) => image.addEventListener('error', handleImageError));
}

function renderRooms() {
  if (!hotelData.rooms.length) {
    roomList.innerHTML = '<p class="section-note">لا توجد غرف مضافة لهذا الفندق حالياً.</p>';
    document.querySelector('.submit-button').disabled = true;
    return;
  }
  document.querySelector('.submit-button').disabled = false;
  roomList.innerHTML = hotelData.rooms.map((room, index) => `
    <label class="room-option${index === 0 ? ' selected' : ''}" data-room-id="${escapeHtml(room.id)}">
      <img src="${escapeHtml(room.image || 'assets/hero%20background.jfif')}" alt="${escapeHtml(room.name)}" loading="lazy">
      <div class="room-info">
        <div class="room-title-row"><h3>${escapeHtml(room.name)}</h3>${room.discountAvailable ? '<span class="room-offer">عرض خاص</span>' : ''}</div>
        <p>${escapeHtml(room.description)}</p>
        <div class="room-perks">${room.features.map((feature) => `<span>${escapeHtml(feature)}</span>`).join('')}</div>
      </div>
      <div class="room-price">
        ${room.discountAvailable ? `<del>${formatPrice(room.price)}</del>` : ''}
        <strong>${formatPrice(room.price)}</strong><small>لليلة الواحدة</small>
      </div>
      <input class="room-radio" type="radio" name="roomChoice" value="${escapeHtml(room.id)}" aria-label="اختيار ${escapeHtml(room.name)}"${index === 0 ? ' checked' : ''}>
    </label>
  `).join('');
  roomList.querySelectorAll('img').forEach((image) => image.addEventListener('error', handleImageError));
}

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toLocalDateString(date);
}

function getNightCount() {
  const [startYear, startMonth, startDay] = checkInInput.value.split('-').map(Number);
  const [endYear, endMonth, endDay] = checkOutInput.value.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  return Math.max(1, Math.round((end - start) / 86400000));
}

function updateBookingSummary() {
  if (!hotelData.rooms.length) return;
  const selectedId = bookingForm.querySelector('input[name="roomChoice"]:checked')?.value ?? hotelData.rooms[0].id;
  const selectedRoom = hotelData.rooms.find((room) => room.id === selectedId) ?? hotelData.rooms[0];
  const nights = getNightCount();
  document.querySelector('#selectedRoomName').textContent = selectedRoom.name;
  document.querySelector('#nightCount').textContent = new Intl.NumberFormat('ar').format(nights);
  document.querySelector('#nightlyPrice').textContent = formatPrice(selectedRoom.price);
  document.querySelector('#totalPrice').innerHTML = `${new Intl.NumberFormat('en-US').format(selectedRoom.price * nights)} <small>${hotelData.currency}</small>`;
  document.querySelectorAll('.room-option').forEach((option) => {
    option.classList.toggle('selected', option.dataset.roomId === selectedRoom.id);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

async function loadHotelAndRooms() {
  const queryHotelId = new URLSearchParams(window.location.search).get('id');
  const fragmentHotelId = new URLSearchParams(window.location.hash.slice(1)).get('hotelId');
  const hotelId = queryHotelId || fragmentHotelId;
  if (!hotelId) {
    document.querySelector('#hotelName').textContent = 'لم يتم تحديد الفندق';
    document.querySelector('#hotelDescription').textContent = 'ارجع إلى قائمة الفنادق واختر الفندق الذي ترغب في استعراضه.';
    roomList.innerHTML = '<p class="section-note">لا يوجد فندق محدد.</p>';
    document.querySelector('.submit-button').disabled = true;
    return;
  }

  try {
    const hotel = await IqamaApi.getHotel(hotelId);
    renderHotel(hotel);

    const rooms = await IqamaApi.getHotelRooms(hotelId);
    hotelData.rooms = rooms.map((room) => {
      const regularPrice = Number(room.price) || 0;
      const discountAvailable = room.discount_available === true || Number(room.price_after_discount) > 0;
      const discountedPrice = Number(room.price_after_discount);
      return {
        id: room.id ?? room.$id,
        name: room.name || 'غرفة',
        description: room.description || '',
        price: discountAvailable && Number.isFinite(discountedPrice) && discountedPrice > 0 ? discountedPrice : regularPrice,
        originalPrice: regularPrice,
        discountAvailable,
        image: room.image || room.image_url || '',
        features: Array.isArray(room.features) ? room.features : []
      };
    });
    renderRooms();
    if (hotelData.rooms.length) updateBookingSummary();
  } catch (error) {
    console.error('Unable to load hotel or rooms from Laravel API:', error);
    document.querySelector('#hotelName').textContent = 'تعذر تحميل بيانات الفندق';
    document.querySelector('#hotelDescription').textContent = error.message || 'تحقق من تشغيل Laravel API ومن صحة معرّف الفندق.';
    roomList.innerHTML = '<p class="section-note">تعذر تحميل أنواع الغرف. تحقق من تشغيل Laravel API وإعدادات CORS.</p>';
    document.querySelector('.submit-button').disabled = true;
  }
}

const today = new Date();
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
checkInInput.min = toLocalDateString(today);
checkInInput.value = toLocalDateString(tomorrow);
checkOutInput.min = addDays(checkInInput.value, 1);
checkOutInput.value = addDays(checkInInput.value, 2);
updateBookingSummary();

checkInInput.addEventListener('change', () => {
  checkOutInput.min = addDays(checkInInput.value, 1);
  if (!checkOutInput.value || checkOutInput.value <= checkInInput.value) {
    checkOutInput.value = checkOutInput.min;
  }
  updateBookingSummary();
});
checkOutInput.addEventListener('change', updateBookingSummary);
guestCount.addEventListener('input', () => {
  const guestNumber = Number(guestCount.value);
  if (guestNumber > 10) guestCount.value = '10';
});
function validatePhoneNumber() {
  const countryDigits = phoneCountryCode.value.replace('+', '');
  const nationalDigits = phoneNumber.value.trim().replace(/^0+/, '');
  const totalDigits = countryDigits.length + nationalDigits.length;
  const isValid = /^\d+$/.test(nationalDigits) && totalDigits >= 8 && totalDigits <= 15;
  phoneNumber.setCustomValidity(isValid ? '' : 'تحقق من الرقم ومفتاح الدولة، ويجب ألا يتجاوز الرقم 15 خانة.');
  return isValid;
}
phoneNumber.addEventListener('input', validatePhoneNumber);
phoneCountryCode.addEventListener('change', validatePhoneNumber);
roomList.addEventListener('change', updateBookingSummary);

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!hotelData.id || !hotelData.rooms.length) return;
  validatePhoneNumber();
  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const selectedRoom = hotelData.rooms.find((room) => room.id === formData.get('roomChoice')) ?? hotelData.rooms[0];
  const nationalPhone = String(formData.get('phone')).trim().replace(/^0+/, '');
  const fullName = String(formData.get('fullName')).trim();
  const phone = `${phoneCountryCode.value}${nationalPhone}`;
  const guests = Number(guestCount.value);
  const notes = String(formData.get('message') || '').trim();
  const email = String(formData.get('email') || '').trim();

  const booking = {
    full_name: fullName,
    customer_name: fullName,
    number_of_guests: guests,
    guests: guests,
    phone_number: phone,
    customer_phone: phone,
    notes: notes,
    arrive_date: checkInInput.value,
    check_in: checkInInput.value,
    leave_date: checkOutInput.value,
    check_out: checkOutInput.value,
    offer_title: selectedRoom.name,
    room_id: selectedRoom.id,
    hotel_id: hotelData.id,
    hotel_name: hotelData.name
  };
  if (email) {
    booking.email = email;
    booking.customer_email = email;
  }

  const submitButton = bookingForm.querySelector('.submit-button');
  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  try {
    await IqamaApi.createBooking(booking);
    bookingSuccessDialog.showModal();
    document.documentElement.classList.add('booking-modal-open');
    document.body.classList.add('booking-modal-open');
  } catch (error) {
    console.error('Unable to create booking through Laravel API:', error);
    showToast(error.message || 'تعذر إرسال طلب الحجز. تحقق من اتصالك وحاول مرة أخرى.');
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
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

const imageDialog = document.querySelector('#imageDialog');
const dialogImage = document.querySelector('#dialogImage');
document.querySelector('#gallery').addEventListener('click', (event) => {
  const button = event.target.closest('.gallery-image');
  if (!button) return;
  const image = button.querySelector('img');
  dialogImage.src = button.dataset.fullImage;
  dialogImage.alt = image.alt;
  imageDialog.showModal();
});
imageDialog.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', (event) => {
  if (event.target === imageDialog) imageDialog.close();
});
document.querySelector('#bookingSuccessClose').addEventListener('click', () => bookingSuccessDialog.close());
bookingSuccessDialog.addEventListener('close', () => {
  document.documentElement.classList.remove('booking-modal-open');
  document.body.classList.remove('booking-modal-open');
});
document.addEventListener('wheel', (event) => {
  if (bookingSuccessDialog.open) event.preventDefault();
}, { passive: false });

function handleImageError(event) {
  const image = event.currentTarget;
  if (!image.dataset.fallbackApplied) {
    image.dataset.fallbackApplied = 'true';
    image.src = 'assets/hero%20background.jfif';
  }
}
document.querySelectorAll('img').forEach((image) => image.addEventListener('error', handleImageError));

loadHotelAndRooms();