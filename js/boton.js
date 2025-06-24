    const toggleBtn = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');

    toggleBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
        overlay.classList.toggle('shifted');
    });