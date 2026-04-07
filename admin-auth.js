document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    // Mapeamento de usuários autorizados (segurança nivel frontend simulada)
    const allowedUsers = [
        'wuilker.campos',
        'marcelo.conrad',
        'leandro.haas'
    ];
    const secretPassword = 'NeuroWine26#';

    // Se já estiver logado (e na página de login), redireciona p/ o dashboard
    if (sessionStorage.getItem('nw_admin_logged') === 'true' && window.location.pathname.includes('admin-login.html')) {
        window.location.href = 'admin-dashboard.html';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim().toLowerCase();
            const password = document.getElementById('password').value;

            if (allowedUsers.includes(username) && password === secretPassword) {
                // Sucesso
                sessionStorage.setItem('nw_admin_logged', 'true');
                sessionStorage.setItem('nw_admin_user', username);
                window.location.href = 'admin-dashboard.html';
            } else {
                // Erro
                loginError.style.display = 'block';
                document.getElementById('password').value = '';
                
                // Shake effect on the card
                const card = document.querySelector('.login-card');
                card.style.transform = 'translatex(-10px)';
                setTimeout(() => card.style.transform = 'translatex(10px)', 100);
                setTimeout(() => card.style.transform = 'translatex(-10px)', 200);
                setTimeout(() => card.style.transform = 'translatex(10px)', 300);
                setTimeout(() => card.style.transform = 'translatex(0)', 400);
            }
        });
    }

    // Se estiver no dashboard e NÂO tiver a flag logado
    if (window.location.pathname.includes('admin-dashboard.html') && sessionStorage.getItem('nw_admin_logged') !== 'true') {
        window.location.href = 'admin-login.html';
    }

    // Botão de Logout caso exista na página
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('nw_admin_logged');
            sessionStorage.removeItem('nw_admin_user');
            window.location.href = 'admin-login.html';
        });
    }
});
