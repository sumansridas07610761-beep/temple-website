/**
 * চাটান শিব কালী মন্দির (Chatan Shiv Kali Mandir)
 * Official Website JavaScript — Clean, Lightweight, Mobile-Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initGallery();
});

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-item a');

    // Sticky Header Scroll Appearance Change
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 35) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // Mobile Hamburger Menu
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('is-open');
            menuToggle.classList.toggle('is-active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/* ==========================================================================
   2. TEMPLE GALLERY & LIGHTBOX
   ========================================================================== */
function initGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightbox = document.getElementById('lightboxModal');
    
    if (!galleryItems.length) return;

    let currentVisibleItems = [...galleryItems];
    let currentIndex = 0;

    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Category Filter Handler (সব, মন্দির, শিবরাত্রি, কালী পূজা, অনুষ্ঠান)
    function applyFilter(filterValue) {
        filterBtns.forEach(b => {
            if (b.getAttribute('data-filter') === filterValue) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        galleryItems.forEach(item => {
            const rawCat = item.getAttribute('data-category') || '';
            const categories = rawCat.trim().split(/\s+/);
            if (filterValue === 'all' || categories.includes(filterValue)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        currentVisibleItems = galleryItems.filter(item => item.style.display !== 'none');
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            applyFilter(filterValue);
        });
    });

    // Handle URL query parameter e.g. gallery.html?filter=shivaratri
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilter = urlParams.get('filter');
    if (initialFilter) {
        applyFilter(initialFilter);
    }

    // Connect festival card buttons directly to gallery filters
    document.querySelectorAll('a[href="#gallery"], a[href^="gallery.html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const text = link.textContent.toLowerCase();
            let targetFilter = null;
            if (text.includes('shivaratri')) {
                targetFilter = 'shivaratri';
            } else if (text.includes('kali puja') || text.includes('kalipuja')) {
                targetFilter = 'kalipuja';
            }

            if (targetFilter && window.location.pathname.endsWith('gallery.html')) {
                applyFilter(targetFilter);
            } else if (targetFilter && document.getElementById('galleryGrid')) {
                applyFilter(targetFilter);
            }
        });
    });

    // Open Lightbox
    function openLightbox(item) {
        if (!lightbox) return;
        currentIndex = currentVisibleItems.indexOf(item);
        if (currentIndex === -1) currentIndex = 0;
        updateLightboxContent();
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    // Close Lightbox
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Update Lightbox Display
    function updateLightboxContent() {
        if (!currentVisibleItems.length || currentIndex < 0 || currentIndex >= currentVisibleItems.length) return;
        
        const activeItem = currentVisibleItems[currentIndex];
        const title = activeItem.getAttribute('data-title') || 'চাটান শিব কালী মন্দির';
        const imgSrc = activeItem.getAttribute('data-src');

        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${currentVisibleItems.length}`;

        if (imgSrc && lightboxImg) {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = title;
        }
    }

    function showNext() {
        if (!currentVisibleItems.length) return;
        currentIndex = (currentIndex + 1) % currentVisibleItems.length;
        updateLightboxContent();
    }

    function showPrev() {
        if (!currentVisibleItems.length) return;
        currentIndex = (currentIndex - 1 + currentVisibleItems.length) % currentVisibleItems.length;
        updateLightboxContent();
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Touch Swipe Navigation for Mobile
        let touchStartX = 0;
        let touchEndX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
                touchStartX = e.changedTouches[0].screenX;
            }
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches.length > 0) {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    showNext();
                } else if (touchEndX - touchStartX > 50) {
                    showPrev();
                }
            }
        }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}
