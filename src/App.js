import React, { useState, useEffect } from 'react';
import './App.css';
import apiService from './services/simpleApi';
import { useApi, usePaginatedApi, useSearch } from './hooks/useApi';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks for data fetching - using simple functions
  const { data: universityStats, loading: statsLoading, error: statsError } = useApi(apiService.getUniversityStats);
  const { data: newsData, loading: newsLoading, error: newsError, refresh: refreshNews } = usePaginatedApi(apiService.getNews, 1, 4);
  const { data: contactInfo, loading: contactLoading, error: contactError } = useApi(apiService.getContactInfo);
  
  // Search functionality
  const { results: searchResults, loading: searchLoading, search } = useSearch(apiService.search);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            
            <img className="logo-image" src="lk.png" alt="Logo" />
            <span className="logo-text">BUXORO<br/>DAVLAT<br/>UNIVERSITETI</span>
          </div>
          
          <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <a href="#university" onClick={() => setIsMobileMenuOpen(false)}>UNIVERSITET</a>
            <a href="#structure" onClick={() => setIsMobileMenuOpen(false)}>TUZILMA</a>
            <a href="#activity" onClick={() => setIsMobileMenuOpen(false)}>FAOLIYAT</a>
            <a href="#students" onClick={() => setIsMobileMenuOpen(false)}>TALABALARGA</a>
            <a href="#admission" onClick={() => setIsMobileMenuOpen(false)}>QABUL</a>
            <a href="#news" onClick={() => setIsMobileMenuOpen(false)}>YANGILIKLAR</a>
            <a className="sa" href="#open-data" onClick={() => setIsMobileMenuOpen(false)}>OCHIQ MA'LUMOTLAR</a>
          </nav>
          
          <div className="header-right">
            <div className="language-dropdown" id="languageDropdown">
              <button className="language-btn" onClick={() => {
                const dropdown = document.getElementById('languageDropdown');
                dropdown.classList.toggle('open');
              }}>
                <img src="image.png" className="current-flag" alt="Current Language" />
                <span className="dropdown-arrow">▼</span>
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-item active" onClick={() => {
                  document.querySelector('.current-flag').src = 'image.png';
                  document.getElementById('languageDropdown').classList.remove('open');
                }}>
                  <img src="image.png" className="dropdown-flag" alt="UZ" />
                  <span className="dropdown-text">O'zbekcha</span>
                </div>
                <div className="dropdown-item" onClick={() => {
                  document.querySelector('.current-flag').src = 'logo.png';
                  document.getElementById('languageDropdown').classList.remove('open');
                }}>
                  <img src="logo.png" className="dropdown-flag" alt="EN" />
                  <span className="dropdown-text">English</span>
                </div>
                <div className="dropdown-item" onClick={() => {
                  document.querySelector('.current-flag').src = 'favicon.ico';
                  document.getElementById('languageDropdown').classList.remove('open');
                }}>
                  <img src="favicon.ico" className="dropdown-flag" alt="RU" />
                  <span className="dropdown-text">Русский</span>
                </div>
              </div>
            </div>
            <div className="search-icon" onClick={() => document.getElementById('searchModal').style.display = 'block'}>
              <div className="search"></div>
            </div>
            <button 
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src="logo.png" alt="Buxoro Davlat Universiteti" />
        </div>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>BUXORO DAVLAT UNIVERSITETI</h1>
            <p>Buxoro davlat universiteti O'zbekiston Respublikasining yirik oliy ta'lim muassasalaridan biri bo'lib, uning ta'lim va ilm-fan sohasidagi xizmatlari keng e'tirof etilgan.</p>
            <button className="hero-btn">BATAFSIL</button>
          </div>
        </div>
      </section>

      {/* Employees Section */}
      <section className="employees" id="employees">
        <div className="container">
          <div className="section-header">
            <h2>Xodimlar</h2>
            <a href="#all-employees" onClick={(e)=>{
              e.preventDefault();
              // Open modal with all employees
              document.getElementById('employeesModal').style.display = 'block';
            }}>Barchasini ko'rish</a>
          </div>

          <EmployeesPreview />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {statsLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="stat-card loading">
                  <div className="stat-icon">
                    <div className="loading-skeleton"></div>
                  </div>
                  <div className="stat-number">
                    <div className="loading-skeleton"></div>
                  </div>
                  <div className="stat-label">
                    <div className="loading-skeleton"></div>
                  </div>
                </div>
              ))
            ) : statsError ? (
              // Error state
              <div className="error-message">
                <p>Ma'lumotlarni yuklashda xatolik yuz berdi</p>
                <button onClick={() => window.location.reload()}>Qayta urinish</button>
              </div>
            ) : (
              // Real data from API
              universityStats ? (
                <>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div className="stat-number">{universityStats.founded_year ? `${new Date().getFullYear() - universityStats.founded_year}+` : '25+'}</div>
                    <div className="stat-label">Yillik tajriba</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3 4v2h2l2.54-3.4L16.5 18H20z"/>
                      </svg>
                    </div>
                    <div className="stat-number">{universityStats.total_students ? `${universityStats.total_students}+` : '15000+'}</div>
                    <div className="stat-label">Talabalar</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                    <div className="stat-number">{universityStats.total_faculties || '12'}</div>
                    <div className="stat-label">Fakultetlar</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                    <div className="stat-number">{universityStats.total_programs ? `${universityStats.total_programs}+` : '50+'}</div>
                    <div className="stat-label">Mutaxassisliklar</div>
                  </div>
                </>
              ) : (
                // Fallback data
                <>
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="stat-number">25+</div>
              <div className="stat-label">Yillik tajriba</div>
            </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3 4v2h2l2.54-3.4L16.5 18H20z"/>
                      </svg>
                    </div>
                    <div className="stat-number">15000+</div>
                    <div className="stat-label">Talabalar</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                    <div className="stat-number">12</div>
                    <div className="stat-label">Fakultetlar</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                      </svg>
                    </div>
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Mutaxassisliklar</div>
                  </div>
                </>
              )
            )}
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2 1l-3 4v2h2l2.54-3.4L16.5 18H20z"/>
                </svg>
              </div>
              <div className="stat-number">15000+</div>
              <div className="stat-label">Talabalar</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                </svg>
              </div>
              <div className="stat-number">12</div>
              <div className="stat-label">Fakultetlar</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Mutaxassisliklar</div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="news">
        <div className="container">
          <div className="section-header">
            <h2>Yangiliklar</h2>
            <a href="#all-news">Barchasini ko'rish</a>
          </div>
          
          <div className="news-grid">
            {newsLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <article key={index} className="news-card loading">
                  <div className="loading-skeleton" style={{ height: '220px', width: '100%' }}></div>
                  <div className="news-content">
                    <div className="loading-skeleton" style={{ height: '20px', width: '80px', marginBottom: '10px' }}></div>
                    <div className="loading-skeleton" style={{ height: '60px', width: '100%' }}></div>
                  </div>
                </article>
              ))
            ) : newsError ? (
              // Error state
              <div className="error-message">
                <p>Yangiliklarni yuklashda xatolik yuz berdi</p>
                <button onClick={refreshNews}>Qayta urinish</button>
              </div>
            ) : newsData && newsData.length > 0 ? (
              // Real data from API
              newsData.map((news, index) => (
                <article key={news.id || index} className="news-card">
                  <img 
                    src={news.image || news.thumbnail || 'logo.png'} 
                    alt={news.title || 'News'} 
                    onError={(e) => {
                      e.target.src = 'logo.png';
                    }}
                  />
                  <div className="news-content">
                    <span className="news-date">
                      {news.published_date ? 
                        new Date(news.published_date).toLocaleDateString('uz-UZ', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 
                        'Yaqinda'
                      }
                    </span>
                    <h3>{news.title || 'Yangilik sarlavhasi'}</h3>
                    {news.excerpt && <p className="news-excerpt">{news.excerpt}</p>}
                  </div>
                </article>
              ))
            ) : (
              // Fallback data
              <>
            <article className="news-card">
              <img src="logo.png" alt="News" />
              <div className="news-content">
                <span className="news-date">2-aprel, 2025</span>
                <h3>Buxoro davlat universiteti kengashining 2024/2025 o'quv yili 8-yig'ilishi bo'lib o'tdi.</h3>
              </div>
            </article>
            
            <article className="news-card">
              <img src="logo.png" alt="News" />
              <div className="news-content">
                <span className="news-date">2-aprel, 2025</span>
                <h3>BuxDUda taniqli kino arboblari ishtirokida ijodiy uchrashuv bo'lib o'tdi.</h3>
              </div>
            </article>
            
            <article className="news-card">
              <img src="logo.png" alt="News" />
              <div className="news-content">
                <span className="news-date">22-mart, 2025</span>
                <h3>BuxDUda "Qadriyatlaring boqiy bo'lsin, Navro'z!" sayli</h3>
              </div>
            </article>
            
            <article className="news-card">
              <img src="logo.png" alt="News" />
              <div className="news-content">
                <span className="news-date">28-mart, 2025</span>
                <h3>Buxoro davlat universitetida "Kelajakka qadam" dasturi bo'yicha bitiruvchi-yoshlar bilan...</h3>
              </div>
            </article>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources">
        <div className="container">
          <h2>Resurslar</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>Bitiruvchilar</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>IT-xizmatlari</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>Ilmiy maqolalar</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>Vakant lavozimlar</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>O'quv resurslar</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>Korrupsiyaga qarshi kurashish</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>Universitet jurnallari</h3>
              </div>
            </div>
            <div className="resource-card">
              <img src="logo.png" alt="Resource" />
              <div className="resource-overlay">
                <h3>Avtorefaratlar, MDlar, BMIlar</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Systems Section */}
      <section className="info-systems">
        <div className="info-systems-bg">
          <img src="logo.png" alt="Background" />
        </div>
        <div className="info-systems-overlay"></div>
        <div className="container">
          <h2>Axborot tizimlari</h2>
          <div className="systems-grid">
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Masofaviy ta'lim</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Elektron kutubxona</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Ilmiy resurslar</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Ilmiy maqolalar</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>HEMIS Student axborot tizimi</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>O'quv resurslari</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Elektron pochta</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>HEMIS OTM axborot tizimi</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Video darslar</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Moodle tizimi</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>Sport inshootlari</span>
            </div>
            <div className="system-item">
              <div className="system-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <span>"Uniwork" axborot tizimi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <Announcements />

      {/* Links Section */}
      <section className="links">
        <div className="container">
          <h2>Foydali havolalar</h2>
          <div className="links-grid">
            <div className="link-card">
              <div className="link-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <h3>O'zbekiston Respublikasi hukumat portali</h3>
              <span className="link-url">gov.uz</span>
            </div>
            <div className="link-card">
              <div className="link-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <h3>O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligi</h3>
              <span className="link-url">edu.uz</span>
            </div>
            <div className="link-card">
              <div className="link-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <h3>O'zbekiston Respublikasi Qonunchilik ma'lumotlari milliy bazasi</h3>
              <span className="link-url">lex.uz</span>
            </div>
            <div className="link-card">
              <div className="link-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <h3>O'zbekiston Respublikasi milliy huquqiy internet portali</h3>
              <span className="link-url">huquqiyportal.uz</span>
            </div>
            <div className="link-card">
              <div className="link-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <h3>Yagona interaktiv davlat xizmatlari portali</h3>
              <span className="link-url">my.gov.uz</span>
            </div>
            <div className="link-card">
              <div className="link-icon">
                <img src="logo.png" alt="Icon" />
              </div>
              <h3>O'zbekiston Respublikasi ochiq ma'lumotlar portali</h3>
              <span className="link-url">data.egov.uz</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
              <img  src="lk.png" alt="Logo" />
              </div>
              <h3>Bog'lanish</h3>
              {contactLoading ? (
                <div className="loading-skeleton" style={{ height: '20px', width: '200px', marginBottom: '10px' }}></div>
              ) : contactError ? (
                <>
                  <p>(+998) 65 221-30-46</p>
                  <p>(+998) 65 221-29-06</p>
                  <p>buxdu_rektor@buxdu.uz</p>
                  <p>Buxoro sh. M.Iqbol ko'chasi 11-uy</p>
                </>
              ) : contactInfo ? (
                <>
                  <p>{contactInfo.phone_1 || '(+998) 65 221-30-46'}</p>
                  <p>{contactInfo.phone_2 || '(+998) 65 221-29-06'}</p>
                  <p>{contactInfo.email || 'buxdu_rektor@buxdu.uz'}</p>
                  <p>{contactInfo.address || 'Buxoro sh. M.Iqbol ko\'chasi 11-uy'}</p>
                </>
              ) : (
                <>
              <p>(+998) 65 221-30-46</p>
              <p>(+998) 65 221-29-06</p>
              <p>buxdu_rektor@buxdu.uz</p>
              <p>Buxoro sh. M.Iqbol ko'chasi 11-uy</p>
                </>
              )}
            </div>
            
            <div className="footer-section">
              <h3>Rekvizitlar</h3>
              <p>Moliya vazirligi g'aznachiligi Hisob raqami: 23402000300100001010</p>
              <p>MFO: 00014 INN: 201122919</p>
              <p>Markaziy bank HKKM Toshkent sh. (BuxDu: 400910860064017094100350004)</p>
              <p>INN: 201504275</p>
              <p>To'lov maqsadida FIO (unikal kod yoziladi)</p>
            </div>
            
            <div className="footer-section">
              <div className="footer-social">
                <div className="social-icon telegram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div className="social-icon instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="social-icon facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="social-icon youtube">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </div>
              <img src="logo.png" alt="Map" />
            </div>
          </div>
        </div>
      </footer>

      {/* Employees Modal */}
      <EmployeesModal />

      {/* Search Modal */}
      <div id="searchModal" className="search-modal" style={{ display: 'none' }}>
        <div className="search-modal-content">
          <div className="search-modal-header">
            <h2>Qidiruv</h2>
            <span className="close" onClick={() => document.getElementById('searchModal').style.display = 'none'}>&times;</span>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Qidiruv so'zini kiriting..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-submit-btn">
                {searchLoading ? 'Qidirilmoqda...' : 'Qidirish'}
              </button>
            </div>
          </form>
          
          {searchResults && searchResults.length > 0 && (
            <div className="search-results">
              <h3>Qidiruv natijalari:</h3>
              {searchResults.map((result, index) => (
                <div key={index} className="search-result-item">
                  <h4>{result.title || result.name}</h4>
                  <p>{result.excerpt || result.description}</p>
                  <span className="result-type">{result.type || 'Ma\'lumot'}</span>
                </div>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults && searchResults.length === 0 && !searchLoading && (
            <div className="no-results">
              <p>Hech qanday natija topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Employees preview (first 24)
function EmployeesPreview() {
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const { results } = await apiService.getEmployeesPage(1, 24);
        if (isMounted) setEmployees(results);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="employees-grid">
      {loading && Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="employee-card loading">
          <div className="avatar loading-skeleton" />
          <div className="info">
            <div className="loading-skeleton" style={{ height: '16px', width: '70%' }} />
            <div className="loading-skeleton" style={{ height: '14px', width: '50%', marginTop: '8px' }} />
          </div>
        </div>
      ))}
      {!loading && !error && employees.map((e, i) => (
        <div key={e.id || i} className="employee-card">
          <img className="avatar" src={e.image || 'logo.png'} alt={e.full_name || 'Xodim'} onError={(evt)=>{evt.target.src='logo.png';}} />
          <div className="info">
            <h4 className="name">{e.full_name || e.name}</h4>
            <p className="position">{e.position || 'Lavozim'}</p>
            {e.department && <p className="department">{e.department}</p>}
          </div>
        </div>
      ))}
      {error && (
        <div className="error-message" style={{ gridColumn: '1 / -1' }}>
          <p>Xodimlar yuklashda xatolik yuz berdi</p>
        </div>
      )}
    </div>
  );
}

// Employees modal (all)
function EmployeesModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    window.showEmployeesModal = async () => {
      setIsOpen(true);
      if (employees.length === 0 && !loading) {
        try {
          setLoading(true);
          const all = await apiService.getAllEmployees(100);
          setEmployees(all);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };
    return () => { delete window.showEmployeesModal; };
  }, [employees.length, loading]);

  const close = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div id="employeesModal" className="search-modal" style={{ display: 'block' }}>
      <div className="search-modal-content">
        <div className="search-modal-header">
          <h2>Barcha xodimlar</h2>
          <span className="close" onClick={close}>&times;</span>
        </div>
        <div className="employees-grid">
          {loading && Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="employee-card loading">
              <div className="avatar loading-skeleton" />
              <div className="info">
                <div className="loading-skeleton" style={{ height: '16px', width: '70%' }} />
                <div className="loading-skeleton" style={{ height: '14px', width: '50%', marginTop: '8px' }} />
              </div>
            </div>
          ))}
          {!loading && !error && employees.map((e, i) => (
            <div key={e.id || i} className="employee-card">
              <img className="avatar" src={e.image || 'logo.png'} alt={e.full_name || 'Xodim'} onError={(evt)=>{evt.target.src='logo.png';}} />
              <div className="info">
                <h4 className="name">{e.full_name || e.name}</h4>
                <p className="position">{e.position || 'Lavozim'}</p>
                {e.department && <p className="department">{e.department}</p>}
              </div>
            </div>
          ))}
          {error && (
            <div className="error-message" style={{ gridColumn: '1 / -1' }}>
              <p>Xodimlar yuklashda xatolik yuz berdi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Announcements with cards, modal and load-all
function Announcements() {
  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [active, setActive] = React.useState(null);

  const pageSize = 10;

  const loadPage = React.useCallback(async (p) => {
    try {
      setLoading(true);
      const { results, next } = await apiService.getAnnouncementsPage(p, pageSize);
      setItems(prev => p === 1 ? results : [...prev, ...results]);
      setHasMore(Boolean(next));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadPage(1); }, [loadPage]);

  const loadAll = async () => {
    if (!hasMore) return;
    let p = page + 1;
    while (true) {
      const { results, next } = await apiService.getAnnouncementsPage(p, pageSize);
      setItems(prev => [...prev, ...results]);
      setPage(p);
      if (!next) { setHasMore(false); break; }
      p += 1;
    }
  };

  return (
    <section className="announcements">
      <div className="container">
        <div className="section-header">
          <h2>E'lonlar</h2>
          <a href="#all-announcements" onClick={(e)=>{e.preventDefault(); loadAll();}}>Barchasini ko'rish</a>
        </div>

        <div className="announcements-list">
          {loading && items.length === 0 && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="announcement-item loading">
              <div className="loading-skeleton" style={{ width: '107px', height: '107px', borderRadius: '50%' }}></div>
              <div className="announcement-content">
                <div className="loading-skeleton" style={{ height: '20px', width: '120px', marginBottom: '10px' }}></div>
                <div className="loading-skeleton" style={{ height: '40px', width: '100%', marginBottom: '10px' }}></div>
                <div className="loading-skeleton" style={{ height: '20px', width: '150px' }}></div>
              </div>
            </div>
          ))}

          {!loading && !error && items.map((a, i) => (
            <article key={a.id || i} className="announcement-card" onClick={()=>setActive(a)}>
              <img src={a.img || a.image || 'logo.png'} alt={a.author || 'Muallif'} onError={(e)=>{e.target.src='logo.png';}} />
              <div className="content">
                <span className="date">{a.created_at ? 'Yaqinda' : 'Yaqinda'}</span>
                <button className="btn" onClick={(e)=>{e.stopPropagation(); setActive(a);}} aria-label={`Batafsil: ${a.title}`}>Batafsil</button>
              </div>
            </article>
          ))}

          {error && (
            <div className="error-message" style={{ gridColumn: '1 / -1' }}>
              <p>E'lonlarni yuklashda xatolik yuz berdi</p>
            </div>
          )}
        </div>

        {hasMore && !loading && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn" onClick={()=>{ setPage(prev=>prev+1); loadPage(page+1); }}>Yana yuklash</button>
          </div>
        )}
      </div>

      {active && (
        <div className="search-modal" style={{ display: 'block', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, overflowY: 'auto' }}>
          <div className="search-modal-content" style={{ maxWidth: '900px', margin: '60px auto', background: '#fff', borderRadius: '10px', padding: '20px', position: 'relative' }}>
            <div className="search-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <h2 style={{ marginRight: '32px' }}>{active.title}</h2>
              <button aria-label="Yopish" onClick={()=>setActive(null)} style={{ background: 'transparent', border: 'none', fontSize: '28px', lineHeight: '1', cursor: 'pointer', color: '#111', position: 'absolute', right: '16px', top: '16px' }}>&times;</button>
            </div>
            <div className="announcement-detail">
              <img src={active.img || active.image || 'logo.png'} alt={active.author || 'Muallif'} onError={(e)=>{e.target.src='logo.png';}} style={{ maxWidth: '100%', borderRadius: '8px' }} />
              <p className="date">{active.created_at ? new Date(active.created_at).toLocaleDateString('uz-UZ') : 'Yaqinda'}</p>
              <div className="text" dangerouslySetInnerHTML={{ __html: active.text || '' }} />
              {active.author && <p className="author">Muallif: {active.author}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
