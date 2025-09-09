// Use proxy on Netlify (`/api`) and full URL locally
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://buxdu.uz/api';

// Helper function to make API calls
const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      console.warn(`API Error for ${endpoint}: HTTP error! status: ${response.status}`);
      return getFallbackData(endpoint);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API Error for ${endpoint}:`, error.message);
    return getFallbackData(endpoint);
  }
};

// Fallback data for when API calls fail
const getFallbackData = (endpoint) => {
  const fallbackData = {
    '/uz/elon/list/': {
      count: 5,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          title: "Temirov Farrux Umedovichning tarix fanlari doktori (DSc) dissertatsiya ishi himoyasi to'g'risida",
          text: "Sadriddin Ayniyning Turkiston mintaqasidagi ijtimoiy-madaniy hayotda tutgan o'rni va ilmiy merosi mavzusida Temirov Farrux Umedovichning 07.00.01 – O'zbekiston tarixi ixtisosligi bo'yicha dissertatsiya ishi himoyasi Buxoro davlat universiteti huzuridagi Ilmiy kengashning 2025-yil 13-sentyabr kuni soat 10:00 dagi majlisida bo'lib o'tadi.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg"
        },
        {
          id: 2,
          title: "Pedagogika fanlari doktori (DSc) dissertatsiya ishi himoyasi to'g'risida",
          text: "Ahmadov Olimjon Shodmonovichning pedagogika fanlari doktori (DSc) dissertatsiya ishi himoyasi to'g'risida e'lon.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg"
        },
        {
          id: 3,
          title: "Filologiya fanlari bo'yicha falsafa doktori (PhD) dissertatsiya ishi himoyasi",
          text: "Radjabova Dildora Raximovnaning filologiya fanlari bo'yicha falsafa doktori (PhD) dissertatsiya ishi himoyasi to'g'risida e'lon.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg"
        },
        {
          id: 4,
          title: "Jurayev Bobomurod Tojiyevichning dissertatsiya ishi himoyasi",
          text: "Pedagogika fanlari doktori (DSc) dissertatsiya ishi himoyasi to'g'risida e'lon.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg"
        },
        {
          id: 5,
          title: "Adizova Nigora Baxtiyorovnaning dissertatsiya ishi himoyasi",
          text: "Pedagogika fanlari doktori (DSc) dissertatsiya ishi himoyasi to'g'risida e'lon.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg"
        }
      ]
    },
    '/uz/news/list/': {
      count: 4,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          title: "Buxoro davlat universiteti kengashining 2024/2025 o'quv yili 8-yig'ilishi bo'lib o'tdi",
          text: "Buxoro davlat universiteti kengashining 2024/2025 o'quv yili 8-yig'ilishi bo'lib o'tdi. Yig'ilishda universitetning o'tgan davrdagi faoliyati va kelajakdagi rejalari muhokama qilindi.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg",
          published_date: "2025-04-02"
        },
        {
          id: 2,
          title: "BuxDUda taniqli kino arboblari ishtirokida ijodiy uchrashuv bo'lib o'tdi",
          text: "Buxoro davlat universitetida taniqli kino arboblari ishtirokida ijodiy uchrashuv bo'lib o'tdi. Uchrashuvda kino san'ati va ta'lim sohasidagi hamkorlik masalalari muhokama qilindi.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg",
          published_date: "2025-04-02"
        },
        {
          id: 3,
          title: "BuxDUda 'Qadriyatlaring boqiy bo'lsin, Navro'z!' sayli",
          text: "Buxoro davlat universitetida 'Qadriyatlaring boqiy bo'lsin, Navro'z!' sayli bo'lib o'tdi. Saylida an'anaviy o'zbek madaniyati va milliy qadriyatlar namoyish etildi.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg",
          published_date: "2025-03-22"
        },
        {
          id: 4,
          title: "Buxoro davlat universitetida 'Kelajakka qadam' dasturi bo'yicha bitiruvchi-yoshlar bilan uchrashuv",
          text: "Buxoro davlat universitetida 'Kelajakka qadam' dasturi bo'yicha bitiruvchi-yoshlar bilan uchrashuv bo'lib o'tdi. Uchrashuvda yoshlarning kasbiy yo'nalishlari va kelajakdagi rejalari muhokama qilindi.",
          image: "https://buxdu.uz/media/article/images/photo_2025-09-06_18-39-20.jpg",
          published_date: "2025-03-28"
        }
      ]
    }
  };

  return fallbackData[endpoint] || { count: 0, next: null, previous: null, results: [] };
};

// API functions
export const getUniversityStats = async () => {
  return {
    founded_year: 1991,
    total_students: 15000,
    total_faculties: 12,
    total_programs: 50
  };
};

export const getNews = async (page = 1, limit = 4) => {
  const data = await fetchData(`/uz/news/list/?page=${page}&limit=${limit}`);
  return data.results || [];
};

export const getAnnouncements = async (page = 1, limit = 5) => {
  const data = await fetchData(`/uz/elon/list/?page=${page}&limit=${limit}`);
  return data.results || [];
};

export const getAnnouncementsPage = async (page = 1, limit = 10) => {
  const data = await fetchData(`/uz/elon/list/?page=${page}&limit=${limit}`);
  return {
    results: data.results || [],
    count: typeof data.count === 'number' ? data.count : (data.results ? data.results.length : 0),
    next: data.next || null
  };
};

export const getAllAnnouncements = async (batchSize = 50) => {
  let page = 1;
  const all = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { results, next } = await getAnnouncementsPage(page, batchSize);
    all.push(...results);
    if (!next) break;
    page += 1;
  }
  return all;
};

// Employees (xodimlar)
export const getEmployeesPage = async (page = 1, limit = 24) => {
  const data = await fetchData(`/uz/xodim/list/?page=${page}&limit=${limit}`);
  return {
    results: data.results || [],
    count: typeof data.count === 'number' ? data.count : (data.results ? data.results.length : 0),
    next: data.next || null
  };
};

export const getAllEmployees = async (batchSize = 100) => {
  let page = 1;
  const all = [];
  // Fetch in batches until no next
  // Try to request larger pages to minimize requests
  // If server ignores limit, we'll still paginate by page
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Some backends use `page` only; we still pass limit for optimization
    const { results, next } = await getEmployeesPage(page, batchSize);
    all.push(...results);
    if (!next) break;
    page += 1;
  }
  return all;
};

export const getFaculties = async () => {
  return [
    { id: 1, name: "Filologiya fakulteti" },
    { id: 2, name: "Tarix fakulteti" },
    { id: 3, name: "Matematika fakulteti" },
    { id: 4, name: "Fizika fakulteti" },
    { id: 5, name: "Kimyo fakulteti" },
    { id: 6, name: "Biologiya fakulteti" },
    { id: 7, name: "Geografiya fakulteti" },
    { id: 8, name: "Pedagogika fakulteti" },
    { id: 9, name: "Psixologiya fakulteti" },
    { id: 10, name: "Jurnalistika fakulteti" },
    { id: 11, name: "Xorijiy tillar fakulteti" },
    { id: 12, name: "San'at fakulteti" }
  ];
};

export const getContactInfo = async () => {
  return {
    phone_1: "(+998) 65 221-30-46",
    phone_2: "(+998) 65 221-29-06",
    email: "buxdu_rektor@buxdu.uz",
    address: "Buxoro sh. M.Iqbol ko'chasi 11-uy"
  };
};

export const search = async (query) => {
  // Simple search implementation
  const results = [];
  
  // Search in news
  const newsData = await getNews(1, 10);
  const newsResults = newsData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.text.toLowerCase().includes(query.toLowerCase())
  );
  results.push(...newsResults.map(item => ({ ...item, type: 'Yangilik' })));
  
  // Search in announcements
  const announcementsData = await getAnnouncements(1, 10);
  const announcementResults = announcementsData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.text.toLowerCase().includes(query.toLowerCase())
  );
  results.push(...announcementResults.map(item => ({ ...item, type: 'E\'lon' })));
  
  return results;
};

const apiService = {
  getUniversityStats,
  getNews,
  getAnnouncements,
  getAnnouncementsPage,
  getAllAnnouncements,
  getEmployeesPage,
  getAllEmployees,
  getFaculties,
  getContactInfo,
  search
};

export default apiService;
