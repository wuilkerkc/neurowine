document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveals-on-scroll');

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slightly before it enters viewport
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 4. Hero Background Image Slider ---
    const sliderContainer = document.getElementById('hero-slider');

    // Array of selected beautiful photos from the "Fotos do evento 2023/Randomico 1" directory
    let heroImagePaths = [
        'Fotos do evento 2023/Randomico 1/057_Evento-1o-NeuroWine-Day-2-57-scaled.jpg',
        'Fotos do evento 2023/Randomico 1/150_Evento-1o-NeuroWine-Day-3-151-scaled.jpg',
        'Fotos do evento 2023/Randomico 1/349_Evento-1o-NeuroWine-Day-2-349-scaled.jpg',
        'Fotos do evento 2023/Randomico 1/WhatsApp Image 2026-02-13 at 15.59.17 (1).jpeg',
        'Fotos do evento 2023/Randomico 1/WhatsApp Image 2026-02-13 at 15.59.18.jpeg',
        'Fotos do evento 2023/Randomico 1/WhatsApp Image 2026-02-13 at 15.59.36 (1).jpeg',
        'Fotos do evento 2023/Randomico 1/WhatsApp Image 2026-02-13 at 15.59.59.jpeg',
        'Fotos do evento 2023/Randomico 1/WhatsApp Image 2026-02-13 at 16.00.21 (1).jpeg',
        'Fotos do evento 2023/Randomico 1/WhatsApp Image 2026-02-13 at 16.00.21.jpeg'
    ];

    if (sliderContainer) {
        // Shuffle hero images so they are random
        heroImagePaths = heroImagePaths.sort(() => Math.random() - 0.5);

        let currentSlide = 0;

        // Create and append slide divs
        heroImagePaths.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'hero-slide';
            if (index === 0) slide.classList.add('active');
            // Double quotes inside url() to handle filenames with spaces correctly
            slide.style.backgroundImage = `url("${src}")`;
            sliderContainer.appendChild(slide);
        });

        const slides = document.querySelectorAll('.hero-slide');

        // Function to rotate slides
        function nextSlide() {
            if (slides.length <= 1) return;

            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        // Change slide every 6 seconds
        if (slides.length > 1) {
            setInterval(nextSlide, 6000);
        }
    }

    // --- 5. Random Details Image ---
    const random2ImagesRaw = [
        'Fotos do evento 2023/Randomico 2/002_Evento-1o-NeuroWine-Day-3-2-scaled.jpg',
        'Fotos do evento 2023/Randomico 2/085_Evento-1o-NeuroWine-Day-3-86-scaled.jpg',
        'Fotos do evento 2023/Randomico 2/WhatsApp Image 2026-02-13 at 15.58.56.jpeg',
        'Fotos do evento 2023/Randomico 2/WhatsApp Image 2026-02-13 at 15.58.57 (1).jpeg',
        'Fotos do evento 2023/Randomico 2/WhatsApp Image 2026-02-13 at 15.59.00.jpeg',
        'Fotos do evento 2023/Randomico 2/WhatsApp Image 2026-02-13 at 15.59.03.jpeg',
        'Fotos do evento 2023/Randomico 2/WhatsApp Image 2026-02-13 at 15.59.16.jpeg',
        'Fotos do evento 2023/Randomico 2/WhatsApp Image 2026-02-13 at 15.59.39.jpeg'
    ];

    // Properly encode the URI to handle spaces and parentheses in file names
    let random2Images = random2ImagesRaw.map(path => encodeURI(path));
    random2Images = random2Images.sort(() => Math.random() - 0.5);

    const expSliderContainer = document.getElementById('experiencia-slider');
    if (expSliderContainer) {
        let currentExpSlide = 0;

        // Create elements
        random2Images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'exp-slide';
            if (index === 0) slide.classList.add('active');
            slide.style.backgroundImage = `url("${src}")`;
            expSliderContainer.appendChild(slide);
        });

        const expSlides = document.querySelectorAll('.exp-slide');

        function nextExpSlide() {
            if (expSlides.length <= 1) return;
            expSlides[currentExpSlide].classList.remove('active');
            currentExpSlide = (currentExpSlide + 1) % expSlides.length;
            expSlides[currentExpSlide].classList.add('active');
        }

        if (expSlides.length > 1) {
            setInterval(nextExpSlide, 4500); // slightly different timing than hero
        }
    }

    // --- 6. Modais (Accommodation, Flight, Registration) ---
    function setupModal(modalId, openBtnId) {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);

        if (modal && openBtn) {
            const closeBtn = modal.querySelector('.close-modal');

            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto'; // Restore scrolling
                });
            }

            // Close when clicking outside of the modal content
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    // Inicializa todos os Modais da página de inscrição
    setupModal('accommodationModal', 'openAccommodationModal');
    setupModal('flightModal', 'openFlightModal');
    setupModal('registrationModal', 'openRegistrationModal');

    // Toggle campo "Nome do Cônjuge" com base na categoria
    const categoryRadios = document.querySelectorAll('input[name="categoria"]');
    const conjugeField = document.getElementById('conjugeField');
    const nomeConjugeInput = document.getElementById('nome_conjuge');

    if (categoryRadios.length > 0 && conjugeField && nomeConjugeInput) {
        categoryRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'medico_acompanhante') {
                    conjugeField.style.display = 'flex';
                    nomeConjugeInput.setAttribute('required', 'required');
                } else {
                    conjugeField.style.display = 'none';
                    nomeConjugeInput.removeAttribute('required');
                    nomeConjugeInput.value = ''; // Limpa se o usuário mudar de ideia
                }
            });
        });
    }

    // Interceptar form submit para redirecionamento de pagamento
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obter a categoria selecionada
            const categoriaElement = document.querySelector('input[name="categoria"]:checked');
            if (!categoriaElement) {
                alert('Por favor, selecione uma categoria.');
                return;
            }
            
            const categoriaSelecionada = categoriaElement.value;
            
            // Dicionário com os links de pagamento temporários (o usuário precisa preencher com os links reais)
            const linksPagamento = {
                'medico': '#link-pagamento-medico', // Substitua pelo link real do Mercado Pago / Asaas
                'medico_acompanhante': '#link-pagamento-medico-acompanhante',
                'estudante_aulas': '#link-pagamento-estudante-aulas',
                'estudante_completo': '#link-pagamento-estudante-completo'
            };

            const linkSelecionado = linksPagamento[categoriaSelecionada];

            if (linkSelecionado && linkSelecionado !== '') {
                // Aqui removemos o modal antes de redirecionar para não bugar a tela
                document.getElementById('registrationModal').classList.remove('active');
                document.body.style.overflow = 'auto';
                
                // Mensagem amigável de redirecionamento
                alert('Sua solicitação foi registrada! Você será redirecionado para a página de pagamento seguro.');
                
                // Redireciona para o gateway
                window.location.href = linkSelecionado;
            } else {
                alert('Não foi possível encontrar o link de pagamento. Tente novamente mais tarde.');
            }
        });
    }
});
