document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Ahmed Wazir Website Script Loaded');

  // ════════════════════════════════════════════════════════════════════
  //  FULL DASHBOARD SYNC ENGINE
  //  Reads all `aw_dashboard_*` data saved from admin.html
  //  and seamlessly updates the live website (index.html)
  // ════════════════════════════════════════════════════════════════════
  function getDashboardData(key) {
    try {
      const s = localStorage.getItem('aw_dashboard_' + key);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  function syncWebsiteFromDashboard() {
    // 0. THEME & COLORS
    const theme = getDashboardData('theme');
    if (theme && theme.primary && theme.secondary && window.applyWebsiteTheme) {
      window.applyWebsiteTheme(theme.primary, theme.secondary);
    }

    // 1. SETTINGS & BRANDING
    const settings = getDashboardData('settings');
    if (settings) {
      if (settings.title) document.title = settings.title;
      if (settings.meta) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = settings.meta;
      }
    }

    // 2. HERO SECTION
    const hero = getDashboardData('hero');
    if (hero) {
      if (hero.title) {
        const heroTitle = document.querySelector('#hero h1');
        if (heroTitle) {
          heroTitle.innerHTML = hero.title.replace(/\n/g, '<br/>');
        }
      }
      if (hero.subtitle) {
        const heroSub = document.querySelector('#hero p.text-slate-400');
        if (heroSub) heroSub.textContent = hero.subtitle;
      }
      if (hero.cta) {
        const ctaBtn = document.querySelector('#hero a[href*="wa.me"] span');
        if (ctaBtn) ctaBtn.textContent = hero.cta;
      }
      if (hero.whatsapp) {
        const cleanWa = hero.whatsapp.replace(/\D/g, '');
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
          try {
            const url = new URL(a.href);
            const text = url.searchParams.get('text') || 'Hi Ahmed!';
            a.href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`;
          } catch (e) {
            a.href = `https://wa.me/${cleanWa}`;
          }
        });
      }
      const heroCounters = document.querySelectorAll('.stat-counter');
      if (heroCounters.length >= 3) {
        if (hero.projects) heroCounters[0].setAttribute('data-target', hero.projects);
        if (hero.clients) heroCounters[1].setAttribute('data-target', hero.clients);
        if (hero.years) heroCounters[2].setAttribute('data-target', hero.years);
      }
    }

    // 3. ABOUT SECTION
    const about = getDashboardData('about');
    if (about) {
      if (about.photo) {
        const aboutImg = document.querySelector('#about img');
        if (aboutImg) aboutImg.src = about.photo;
      }
      if (about.name) {
        const aboutName = document.querySelector('#about .text-xl.font-bold.text-white');
        if (aboutName) aboutName.textContent = about.name;
        const frameName = document.querySelector('#about h4');
        if (frameName) frameName.textContent = about.name.toUpperCase();
      }
      if (about.title) {
        const aboutRole = document.querySelector('#about .text-sm.font-semibold.text-\\[\\#00D4FF\\]');
        if (aboutRole) aboutRole.textContent = about.title;
      }
      if (about.bio) {
        const bioParas = document.querySelectorAll('#about p.text-\\[\\#A4ACBA\\]');
        const paragraphs = about.bio.split('\n\n').filter(p => p.trim());
        if (paragraphs[0] && bioParas[0]) bioParas[0].textContent = paragraphs[0];
        if (paragraphs[1] && bioParas[1]) bioParas[1].textContent = paragraphs[1];
      }
      if (about.skills) {
        const skillsContainer = document.querySelector('#about .pt-2.flex.flex-wrap.gap-2');
        if (skillsContainer) {
          const skillsList = about.skills.split(',').map(s => s.trim()).filter(Boolean);
          skillsContainer.innerHTML = skillsList.map(s =>
            `<span class="px-3 py-1 rounded-lg bg-[#08090D] border border-slate-800 text-xs text-white font-medium">${s}</span>`
          ).join('');
        }
      }
    }

    // 4. SERVICES SECTION
    const services = getDashboardData('services');
    if (services && Array.isArray(services) && services.length > 0) {
      const servicesGrid = document.querySelector('#services .grid');
      if (servicesGrid) {
        const colorMap = {
          blue: { border: 'hover:border-[#3978FF]/60 hover:shadow-[#3978FF]/15', bg: 'bg-blue-500/10 border-blue-500/30 text-[#3978FF] group-hover:bg-[#3978FF]', text: 'group-hover:text-[#00D4FF]' },
          emerald: { border: 'hover:border-emerald-500/60 hover:shadow-emerald-500/15', bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-600', text: 'group-hover:text-emerald-400' },
          indigo: { border: 'hover:border-indigo-500/60 hover:shadow-indigo-500/15', bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600', text: 'group-hover:text-indigo-400' },
          purple: { border: 'hover:border-purple-500/60 hover:shadow-purple-500/15', bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400 group-hover:bg-purple-600', text: 'group-hover:text-purple-400' },
          amber: { border: 'hover:border-amber-500/60 hover:shadow-amber-500/15', bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:bg-amber-600', text: 'group-hover:text-amber-400' },
          orange: { border: 'hover:border-orange-500/60 hover:shadow-orange-500/15', bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400 group-hover:bg-orange-600', text: 'group-hover:text-orange-400' },
          teal: { border: 'hover:border-teal-500/60 hover:shadow-teal-500/15', bg: 'bg-teal-500/10 border-teal-500/30 text-teal-400 group-hover:bg-teal-600', text: 'group-hover:text-teal-400' },
          rose: { border: 'hover:border-rose-500/60 hover:shadow-rose-500/15', bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400 group-hover:bg-rose-600', text: 'group-hover:text-rose-400' },
          sky: { border: 'hover:border-sky-500/60 hover:shadow-sky-500/15', bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400 group-hover:bg-sky-600', text: 'group-hover:text-sky-400' },
          cyan: { border: 'hover:border-cyan-500/60 hover:shadow-cyan-500/15', bg: 'bg-cyan-500/10 border-cyan-500/30 text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-black', text: 'group-hover:text-[#00D4FF]' },
          violet: { border: 'hover:border-violet-500/60 hover:shadow-violet-500/15', bg: 'bg-violet-500/10 border-violet-500/30 text-violet-400 group-hover:bg-violet-600', text: 'group-hover:text-violet-400' }
        };

        servicesGrid.innerHTML = services.map(s => {
          const theme = colorMap[s.color] || colorMap.blue;
          return `
          <div class="glass-card p-7 sm:p-8 rounded-2xl group border border-slate-800 ${theme.border} hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div class="w-14 h-14 rounded-2xl ${theme.bg} border flex items-center justify-center text-2xl mb-6 group-hover:text-white transition-all">
                <i class="${s.icon || 'fa-solid fa-code'}"></i>
              </div>
              <h3 class="text-xl font-bold text-white mb-2.5 ${theme.text} transition">${s.title}</h3>
              <p class="text-[#A4ACBA] text-sm leading-relaxed mb-6">${s.description}</p>
            </div>
            <a href="#contact" class="text-[#00D4FF] font-semibold text-sm inline-flex items-center gap-2 group-hover:translate-x-1.5 transition-transform">
              Get Started <i class="fa-solid fa-arrow-right text-xs"></i>
            </a>
          </div>`;
        }).join('');
      }
    }

    // 5. PORTFOLIO SECTION
    const portfolio = getDashboardData('portfolio');
    if (portfolio && Array.isArray(portfolio) && portfolio.length > 0) {
      const portfolioGrid = document.getElementById('portfolio-grid');
      if (portfolioGrid) {
        portfolioGrid.innerHTML = portfolio.map(p => {
          const techPills = (p.tech || '').split(',').map(t => t.trim()).filter(Boolean);
          const pillsHtml = techPills.map(t =>
            `<span class="px-2.5 py-1 rounded-lg bg-[#101726] border border-[#1e293b] text-slate-300 font-medium text-[11px]">${t}</span>`
          ).join('');

          return `
          <div class="project-card rounded-2xl bg-[#0c101d] border border-slate-800/80 p-4 sm:p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group" data-category="${p.category || 'all'}" data-demo="${p.demo || ''}">
            <div class="rounded-xl overflow-hidden border border-slate-800 bg-[#0b101f] shadow-inner">
              <div class="bg-[#0e1424] px-3 py-1.5 flex items-center justify-between border-b border-slate-800/80">
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="w-2 h-2 rounded-full bg-[#ef4444] inline-block"></span>
                  <span class="w-2 h-2 rounded-full bg-[#f59e0b] inline-block"></span>
                  <span class="w-2 h-2 rounded-full bg-[#10b981] inline-block"></span>
                </div>
                <div class="bg-[#070b14] border border-slate-800/80 rounded px-3 py-0.5 text-slate-400 font-mono text-[11px] text-center flex-1 max-w-[220px] mx-auto truncate">
                  ${p.url || 'www.website-preview.com'}
                </div>
                <div class="w-6 shrink-0"></div>
              </div>
              <div class="portfolio-img-wrapper relative overflow-hidden bg-slate-900">
                <img src="${p.image || 'portfolio-ecommerce.png'}" alt="${p.title}" class="portfolio-scroll-img" loading="lazy" />
              </div>
            </div>

            <h3 class="text-lg sm:text-xl font-bold text-white tracking-tight mt-3.5 mb-1.5">
              ${p.title}
            </h3>

            <p class="text-slate-400 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2">
              ${p.description}
            </p>

            <div class="flex flex-wrap gap-1.5">
              ${pillsHtml}
            </div>
          </div>`;
        }).join('');
      }
    }

    // 6. PRICING SECTION
    const pricing = getDashboardData('pricing');
    if (pricing && Array.isArray(pricing) && pricing.length >= 3) {
      const priceCards = document.querySelectorAll('#pricing .grid > div');
      pricing.slice(0, 3).forEach((p, idx) => {
        const card = priceCards[idx];
        if (!card) return;
        const nameEl = card.querySelector('h3');
        if (nameEl) nameEl.textContent = p.name;
        const badgeEl = card.querySelector('.flex.items-center.gap-2 span.text-xl');
        if (badgeEl && p.badge) badgeEl.textContent = p.badge;
        const taglineEl = card.querySelector('p.text-slate-400.text-xs');
        if (taglineEl && p.tagline) taglineEl.textContent = p.tagline;
        const discountEl = card.querySelector('.inline-flex.items-center.gap-1\\.5');
        if (discountEl && p.discount) discountEl.innerHTML = p.discount;
        if (p.features) {
          const ul = card.querySelector('ul');
          if (ul) {
            const lines = p.features.split('\n').filter(l => l.trim());
            ul.innerHTML = lines.map(line => `
              <li class="flex items-center gap-2.5"><i class="fa-solid fa-circle-check text-blue-400 text-sm"></i> ${line}</li>
            `).join('');
          }
        }
        const btn = card.querySelector('a');
        if (btn) {
          if (p.buttonText) {
            btn.innerHTML = `<i class="fa-brands fa-whatsapp text-lg"></i> ${p.buttonText}`;
          }
          if (p.whatsappMsg) {
            btn.href = `https://wa.me/923433387801?text=${encodeURIComponent(p.whatsappMsg)}`;
          }
        }
      });
    }

    // 7. REVIEWS SECTION
    const reviews = getDashboardData('reviews');
    if (reviews && Array.isArray(reviews) && reviews.length > 0) {
      const marqueeRows = document.querySelectorAll('#testimonials .marquee-content, #testimonials .marquee-content-reverse');
      marqueeRows.forEach((row) => {
        row.innerHTML = reviews.map(r => `
          <div class="glass-card p-6 w-[340px] flex-shrink-0 flex flex-col justify-between border border-slate-800">
            <div class="space-y-3">
              <div class="flex text-amber-400 text-xs gap-1">
                ${Array(r.rating || 5).fill('<i class="fa-solid fa-star"></i>').join('')}
              </div>
              <p class="text-slate-300 text-xs italic leading-relaxed">
                "${r.text}"
              </p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-slate-800/80 mt-4">
              <div class="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr ${r.gradient || 'from-blue-500 to-cyan-400'} animate-spin-slow flex items-center justify-center shadow-lg shadow-blue-500/30">
                <div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs">${r.initials || 'AW'}</div>
              </div>
              <div>
                <div class="text-xs font-bold text-white">${r.name}</div>
                <div class="text-[10px] text-slate-400">${r.role}</div>
              </div>
            </div>
          </div>
        `).join('');
      });
    }

    // 8. FAQ SECTION
    const faqs = getDashboardData('faq');
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      const faqContainer = document.querySelector('#faq .space-y-4');
      if (faqContainer) {
        faqContainer.innerHTML = faqs.map(f => `
          <div class="faq-item glass-card p-6 rounded-2xl cursor-pointer">
            <div class="faq-question flex items-center justify-between font-bold text-base sm:text-lg text-white">
              <span>${f.question}</span>
              <i class="fa-solid fa-plus faq-icon transition-transform duration-300 text-slate-400"></i>
            </div>
            <div class="faq-answer text-slate-400 text-sm mt-3 leading-relaxed">
              ${f.answer}
            </div>
          </div>
        `).join('');
      }
    }

    // 9. CONTACT SECTION
    const contact = getDashboardData('contact');
    if (contact) {
      if (contact.address) {
        const addressEls = document.querySelectorAll('#contact .text-white.font-semibold.leading-relaxed');
        if (addressEls[0]) addressEls[0].textContent = contact.address;
        const footerAddr = document.querySelector('footer strong.text-slate-300');
        if (footerAddr && footerAddr.parentElement) {
          footerAddr.parentElement.innerHTML = `<strong class="text-slate-300">Location:</strong> ${contact.address}`;
        }
      }
      if (contact.status) {
        const statusBadge = document.querySelector('#contact .inline-flex.items-center.gap-2.px-3');
        if (statusBadge) {
          statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ${contact.status}`;
        }
      }
      if (contact.maps) {
        const mapIframe = document.querySelector('#contact iframe');
        if (mapIframe) mapIframe.src = contact.maps;
      }
      if (contact.email) {
        document.querySelectorAll('.contact-email-link').forEach(el => {
          if (el.tagName === 'A') {
            el.href = 'mailto:' + contact.email;
            el.textContent = contact.email;
          }
        });
      }
      if (contact.whatsapp) {
        const cleanWa = contact.whatsapp.replace(/\D/g, '');
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
          try {
            const url = new URL(a.href);
            const currentText = url.searchParams.get('text') || 'Hi Ahmed!';
            a.href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(currentText)}`;
          } catch (e) {
            a.href = `https://wa.me/${cleanWa}`;
          }
        });
      }
    }

    // 10. SOCIAL LINKS
    const social = getDashboardData('social');
    if (social) {
      if (social.facebook) {
        const fb = document.querySelector('footer a[title="Facebook"]');
        if (fb) fb.href = social.facebook;
      }
      if (social.tiktok) {
        const tt = document.querySelector('footer a[title="TikTok"]');
        if (tt) tt.href = social.tiktok;
      }
      if (social.instagram) {
        const ig = document.querySelector('footer a[title="Instagram"]');
        if (ig) ig.href = social.instagram;
      }
      if (social.whatsapp) {
        const wa = document.querySelector('footer a[title="WhatsApp"]');
        if (wa) wa.href = social.whatsapp;
      }
    }

    // 11. WORK PROCESS (5 STEPS)
    const processData = getDashboardData('process');
    if (processData) {
      if (processData.heading) {
        const headingEl = document.getElementById('process-heading');
        if (headingEl) headingEl.innerHTML = processData.heading;
      }
      if (processData.steps && Array.isArray(processData.steps) && processData.steps.length > 0) {
        const grid = document.getElementById('process-steps-grid');
        if (grid) {
          const lineHtml = '<div class="hidden md:block absolute top-7 left-14 right-14 h-[1px] bg-slate-800/90 -z-0"></div>';
          const stepsHtml = processData.steps.map(s => `
            <div class="flex flex-col items-center text-center relative z-10 group">
              <div class="w-14 h-14 rounded-2xl bg-[#090f1d] border border-slate-700/80 text-white font-black text-base flex items-center justify-center mb-5 group-hover:border-blue-500 group-hover:text-[#38bdf8] shadow-xl transition-all">
                ${s.num || '01'}
              </div>
              <h4 class="font-extrabold text-base text-white mb-2 group-hover:text-[#38bdf8] transition-colors">${s.title || ''}</h4>
              <p class="text-slate-400 text-xs leading-relaxed max-w-[210px]">
                ${s.desc || ''}
              </p>
            </div>
          `).join('');
          grid.innerHTML = lineHtml + stepsHtml;
        }
      }
    }

    // 12. BRANDING & FOOTER
    const branding = getDashboardData('branding');
    if (branding) {
      if (branding.logoText) {
        document.querySelectorAll('header a span.font-extrabold span:first-child, footer a span.font-extrabold span:first-child').forEach(el => {
          el.textContent = branding.logoText;
        });
      }
      if (branding.logoBadge) {
        document.querySelectorAll('.hex-badge-inner span').forEach(el => {
          el.textContent = branding.logoBadge;
        });
      }
      if (branding.chatBtnText) {
        const chatSpan = document.querySelector('header a.btn-whatsapp span');
        if (chatSpan) chatSpan.textContent = branding.chatBtnText;
      }
      if (branding.footerBio) {
        const footerBioEl = document.querySelector('footer p.text-slate-400');
        if (footerBioEl) footerBioEl.textContent = branding.footerBio;
      }
      if (branding.footerCopyright) {
        const copyEl = document.querySelector('footer .text-slate-500 span');
        if (copyEl) copyEl.textContent = branding.footerCopyright;
      }
      if (branding.promoTitle) {
        const promoT = document.querySelector('footer .bg-\\[\\#0b1329\\]\\/90 .font-bold.text-white');
        if (promoT) promoT.innerHTML = `<span>🎉</span> ${branding.promoTitle}`;
      }
      if (branding.promoText) {
        const promoP = document.querySelector('footer .bg-\\[\\#0b1329\\]\\/90 p.text-slate-400');
        if (promoP) promoP.textContent = branding.promoText;
      }
    }
  }

  // Execute sync on page load!
  syncWebsiteFromDashboard();

  // --- Mobile Menu Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
  });

  // --- Sticky Header Backdrop & Active Nav Link Highlight ---
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    let currentId = 'hero';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateActiveNav();
  });
  updateActiveNav();


  // --- Animated Stats Counter on Scroll ---
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  function animateCounters() {
    const triggerBottom = window.innerHeight * 0.85;
    const statsSection = document.getElementById('stats-section');

    if (!statsSection || animated) return;

    const statsTop = statsSection.getBoundingClientRect().top;

    if (statsTop < triggerBottom) {
      animated = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000; // ms
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target + suffix;
            clearInterval(timer);
          } else {
            counter.innerText = Math.ceil(current) + suffix;
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters(); // Initial check

  // --- Scroll Reveal Animation for Portfolio Cards ---
  // Add .scroll-reveal class to every project card with staggered delay
  const revealCards = document.querySelectorAll('#portfolio-grid .project-card');
  const delayClasses = ['delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5', 'delay-6'];

  revealCards.forEach((card, i) => {
    card.classList.add('scroll-reveal');
    // Cycle delays in groups of 3 (matching 3-column grid)
    card.classList.add(delayClasses[i % 3]);
  });

  // Add reveal to portfolio section header
  const portfolioHeader = document.querySelector('#portfolio .text-center');
  if (portfolioHeader) {
    portfolioHeader.classList.add('scroll-reveal-up');
  }

  // Add reveal to filter tabs row
  const filterTabRow = document.querySelector('#portfolio .flex.flex-wrap.items-center.justify-center');
  if (filterTabRow) {
    filterTabRow.classList.add('scroll-reveal-up');
    filterTabRow.style.transitionDelay = '0.15s';
  }

  // IntersectionObserver — fires when element enters viewport
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once revealed, stop observing to keep it visible
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,                   // trigger when 12% of card is visible
    rootMargin: '0px 0px -40px 0px'    // slight bottom offset
  });

  // Observe all scroll-reveal elements
  document.querySelectorAll('.scroll-reveal, .scroll-reveal-up').forEach(el => {
    revealObserver.observe(el);
  });

  // --- Portfolio Filter & See More Logic ---
  const filterBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const seeMoreBtn = document.getElementById('see-more-projects-btn');
  const seeMoreText = document.getElementById('see-more-text');
  const seeMoreIcon = document.getElementById('see-more-icon');
  const seeMoreContainer = document.getElementById('see-more-container');

  const INITIAL_VISIBLE_COUNT = 6;
  let isExpanded = false;

  function updatePortfolioDisplay(scroll = false) {
    const activeBtn = document.querySelector('.tab-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    const matchingCards = [];
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const matchesFilter = filterValue === 'all' || category.toLowerCase().includes(filterValue.toLowerCase());

      if (matchesFilter) {
        matchingCards.push(card);
      } else {
        card.style.display = 'none';
        card.classList.remove('is-visible');
      }
    });

    const totalMatching = matchingCards.length;
    const countToShow = isExpanded ? totalMatching : Math.min(INITIAL_VISIBLE_COUNT, totalMatching);

    matchingCards.forEach((card, index) => {
      if (index < countToShow) {
        card.style.display = 'flex';
        card.classList.remove('is-visible');
        setTimeout(() => {
          card.classList.add('is-visible');
        }, 30 * (index % 6));
      } else {
        card.style.display = 'none';
        card.classList.remove('is-visible');
      }
    });

    // Update See More Button text & visibility
    if (seeMoreContainer && seeMoreBtn) {
      if (totalMatching > INITIAL_VISIBLE_COUNT) {
        seeMoreContainer.style.display = 'block';
        if (isExpanded) {
          if (seeMoreText) seeMoreText.textContent = 'Show Less';
          if (seeMoreIcon) {
            seeMoreIcon.className = 'fa-solid fa-chevron-up text-xs transition-transform duration-300';
          }
        } else {
          const remaining = totalMatching - INITIAL_VISIBLE_COUNT;
          if (seeMoreText) seeMoreText.textContent = `See More Projects (${remaining}+)`;
          if (seeMoreIcon) {
            seeMoreIcon.className = 'fa-solid fa-chevron-down text-xs transition-transform duration-300';
          }
        }
      } else {
        seeMoreContainer.style.display = 'none';
      }
    }

    if (scroll) {
      const portfolioSection = document.getElementById('portfolio');
      if (portfolioSection) {
        portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      isExpanded = false; // Reset to 6 projects on category switch
      updatePortfolioDisplay();
    });
  });

  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isExpanded) {
        isExpanded = true;
        updatePortfolioDisplay(false);
      } else {
        isExpanded = false;
        updatePortfolioDisplay(true); // Smooth scroll back to top of portfolio
      }
    });
  }

  // Initial render on load
  updatePortfolioDisplay();

  // --- Portfolio Cards: Keep preview stable and prevent unwanted click behavior ---
  projectCards.forEach(card => {
    const wrapper = card.querySelector('.portfolio-img-wrapper') || card.querySelector('.card-iframe-wrapper') || card;
    if (wrapper) {
      wrapper.style.cursor = 'default';
      wrapper.removeAttribute('title');
    }
  });

  const demoIframes = document.querySelectorAll('.card-demo-iframe');
  demoIframes.forEach(iframe => {
    function calibrateHeight() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          doc.documentElement.style.overflow = 'hidden';
          doc.body.style.overflow = 'hidden';
          const fullH = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
          if (fullH > 1000) {
            iframe.style.height = fullH + 'px';
          }
        }
      } catch (err) {
        // Cross-origin fallback uses CSS height (3600px)
      }
    }

    iframe.addEventListener('load', calibrateHeight);
    if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
      calibrateHeight();
    }
  });

  // --- FAQ Accordion Toggle ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));

      // If it was not open, open it
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  // --- WhatsApp Free Quote Form Submission ---
  const waForm = document.getElementById('whatsapp-quote-form');
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  if (waForm) {
    waForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('wa-name').value;
      const email = document.getElementById('wa-email')?.value || '';
      const service = document.getElementById('wa-service').value;
      const budget = document.getElementById('wa-budget').value;
      const details = document.getElementById('wa-details').value;

      // Construct formatted WhatsApp message
      let text = `Hi Ahmed! I would like to request a free quote for my website project.\n\n`;
      text += `*Name:* ${name}\n`;
      if (email) {
        text += `*Email:* ${email}\n`;
      }
      text += `*Service Needed:* ${service}\n`;
      text += `*Budget (PKR):* ${budget}\n`;
      if (details) {
        text += `*Project Details:* ${details}\n`;
      }
      text += `\nPlease provide a free consultation and discount quote. Thanks!`;

      const encodedText = encodeURIComponent(text);
      const waUrl = `https://wa.me/923433387801?text=${encodedText}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // Save inquiry to localStorage for Admin Dashboard
      try {
        const inqList = JSON.parse(localStorage.getItem('aw_contact_inquiries') || '[]');
        inqList.unshift({
          id: Date.now(),
          date: new Date().toLocaleString(),
          name: name || 'Website Visitor',
          email: email || '',
          phone: '',
          service: service || 'General Inquiry',
          budget: budget || 'Negotiable',
          message: details || ''
        });
        localStorage.setItem('aw_contact_inquiries', JSON.stringify(inqList));
      } catch (e) {}

      // Send background API log
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, service, budget, message: details })
        });

        if (toast && toastMessage) {
          toastMessage.innerText = 'Opening WhatsApp with your project quote details...';
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 5000);
        }
      } catch (err) {
        console.log('Local API log completed');
      }
    });
  }


  // --- Project Live Preview Modal ---
  const projectModal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');
  const modalImg = document.getElementById('modal-img');
  const modalAddressBar = document.getElementById('modal-address-bar');
  const modalSiteLogo = document.getElementById('modal-site-logo');
  const modalFooterBrand = document.getElementById('modal-footer-brand');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const modalOrderBtn = document.getElementById('modal-order-btn');
  const modalIframe = document.getElementById('modal-iframe');

  // Open modal on clicking project card's browser bar or title
  function openProjectModal(card) {
    if (!card || !projectModal) return;
    const titleEl = card.querySelector('h3');
    const catEl = card.querySelector('.uppercase');
    const descEl = card.querySelector('p');
    const addressEl = card.querySelector('.font-mono');

    if (titleEl && modalTitle) modalTitle.innerText = titleEl.innerText;
    if (catEl && modalCategory) modalCategory.innerText = catEl.innerText;
    if (descEl && modalDesc) modalDesc.innerText = descEl.innerText;
    if (addressEl && modalAddressBar) modalAddressBar.innerText = addressEl.innerText;
    if (titleEl && modalSiteLogo) modalSiteLogo.innerText = titleEl.innerText.toUpperCase();
    if (titleEl && modalFooterBrand) modalFooterBrand.innerText = titleEl.innerText;

    const cardDemo = card.getAttribute('data-demo') || 'demo-salon.html';
    if (modalIframe) modalIframe.src = cardDemo;

    const demoBtns = projectModal.querySelectorAll('a[href*="demo"], a[href*="luxe-apparel"]');
    demoBtns.forEach(a => a.href = cardDemo);

    projectModal.classList.remove('hidden');
    projectModal.classList.add('flex');
  }

  // Portfolio cards stay stable in place (no auto-opening of full page or modal on hover/click)
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'default';
    const cardTitle = card.querySelector('h3');
    if (cardTitle) {
      cardTitle.style.cursor = 'default';
    }
  });

  if (modalOrderBtn && projectModal) {
    modalOrderBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
      projectModal.classList.remove('flex');
    });
  }

  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => {
      projectModal.classList.add('hidden');
      projectModal.classList.remove('flex');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.add('hidden');
        projectModal.classList.remove('flex');
      }
    });
  }

  // --- Custom Glowing Mouse Cursor Effect ---
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorGlow = document.getElementById('custom-cursor-glow');

  if (cursorDot && cursorGlow && window.innerWidth > 768) {
    let mouseX = -100, mouseY = -100;
    let glowX = -100, glowY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      glowX += (mouseX - glowX) * 0.18;
      glowY += (mouseY - glowY) * 0.18;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverableSelector = 'a, button, input, select, textarea, .project-card, .case-study-card, .glass-card, .tab-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverableSelector)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverableSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }
});
