(() => {
  const baseUrl = String(window.API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '');

  async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const validationMessage = payload?.errors
        ? Object.values(payload.errors).flat().join(' ')
        : '';
      throw new Error(validationMessage || payload?.message || `API request failed (${response.status})`);
    }

    return payload;
  }

  function collection(payload, resourceKey) {
    const result = payload?.[resourceKey] ?? payload?.data ?? payload;
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    return [];
  }

  function resource(payload, resourceKey) {
    return payload?.[resourceKey] ?? payload?.data ?? payload;
  }

  window.IqamaApi = {
    getHotels: async () => collection(await request('/hotels'), 'hotels'),
    getHotel: async (id) => resource(await request(`/hotels/${encodeURIComponent(id)}`), 'hotel'),
    getHotelRooms: async (hotelId) => collection(
      await request(`/hotels/${encodeURIComponent(hotelId)}/rooms`),
      'rooms'
    ),
    createBooking: async (booking) => request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    })
  };
})();