 // --- 1. OPTIMISATION SCROLL (DEBOUNCE) ---
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                const later = () => { clearTimeout(timeout); func(...args); };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        const navbar = document.getElementById('navbar');
        const backToTopBtn = document.getElementById("backToTop");
        const progressBar = document.getElementById("progressBar");

        function handleScroll() {
            const scrollY = window.scrollY;
            
            // Navbar effect
            if (scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');

            // Back to top
            if (scrollY > 300) backToTopBtn.classList.add('active');
            else backToTopBtn.classList.remove('active');

            // Progress Bar
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (scrollY / height) * 100;
            progressBar.style.width = scrolled + "%";
        }

        window.addEventListener('scroll', debounce(handleScroll, 10));

        // --- 2. THEME DARK/LIGHT ---
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = themeToggleBtn.querySelector('i');
        const body = document.body;

        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });

        // --- 3. MENU BURGER ---
        const hamburger = document.getElementById('hamburger');
        const menu = document.getElementById('menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            menu.classList.toggle('active');
        });
        console.log("%cSi vous trouvez ceci, envoyer moi FLAG{Found}");
        function closeMenu() {
            hamburger.classList.remove('open');
            menu.classList.remove('active');
        }

        // --- 4. ANIMATIONS & OBSERVER ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animated').forEach(el => observer.observe(el));

        // --- 5. MODALE ---
        const modal = document.getElementById('projectModal');
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalLink = document.getElementById('modalLink');

        function openModal(title, desc, imgSrc, repoLink) {
            modal.classList.add('open');
            body.classList.add('no-scroll');
            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            modalImg.src = imgSrc;
            
            if (repoLink && repoLink !== '#') {
                modalLink.href = repoLink;
                modalLink.style.display = "inline-block";
            } else {
                modalLink.style.display = "none";
            }
        }

        function closeModal() {
            modal.classList.remove('open');
            body.classList.remove('no-scroll');
        }
        window.onclick = (e) => { if (e.target == modal) closeModal(); };

        // --- 6. FORMULAIRE AJAX (ETATS) ---
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('form-status');
        const submitBtn = document.getElementById('submitBtn');

        if(contactForm) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const originalBtnText = submitBtn.innerText;
                submitBtn.innerText = "Envoi...";
                submitBtn.disabled = true;
                submitBtn.style.opacity = "0.7";
                formStatus.style.display = "none";

                try {
                    const response = await fetch(contactForm.action, {
                        method: contactForm.method,
                        body: new FormData(contactForm),
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        formStatus.innerText = "Message envoyé avec succès !";
                        formStatus.style.color = "#00ff88";
                        formStatus.style.display = "block";
                        contactForm.reset();
                    } else {
                        throw new Error("Erreur serveur");
                    }
                } catch (error) {
                    formStatus.innerText = "Erreur lors de l'envoi.";
                    formStatus.style.color = "#ff4444";
                    formStatus.style.display = "block";
                } finally {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = "1";
                }
            });
        }

        // --- 7. EXTRAS ---
        // Année dynamique
        document.getElementById("year").textContent = new Date().getFullYear();
        
        // Compteur visites
        const visitCountSpan = document.getElementById('visit-count');
        let visits = localStorage.getItem('visitCount') || 0;
        visits++;
        localStorage.setItem('visitCount', visits);
        visitCountSpan.innerText = visits;