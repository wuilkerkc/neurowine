/**
 * Lógica do Dashboard Administrativo
 */
document.addEventListener('DOMContentLoaded', () => {

    // ==== NOME DA SESSÃO ====
    const username = sessionStorage.getItem('nw_admin_user');
    if (username) {
        document.getElementById('loggedUserName').innerText = `Logado como: ${username}`;
    }

    // ==== MOCK DATA INICIAL (Inscritos e Valores de Inscrição) ====
    // Simula os dados de inscrições
    const attendeesMock = [
        { nome: "Ana Beatriz Costa", categoria: "Estudante (apenas aulas)", valor: 300, especialidade: "Estudante", cidade: "Florianópolis/SC", email: "ana@email.com", whatsapp: "48999990001", dataIns: "2026-05-15" },
        { nome: "Carlos Eduardo Silva", categoria: "Médico(a) + Cônjuge", valor: 3500, especialidade: "Neurocirurgia", cidade: "Curitiba/PR", email: "carlos@email.com", whatsapp: "41999990002", dataIns: "2026-06-12" },
        { nome: "Daniela Fernanda Lima", categoria: "Médico(a)", valor: 2500, especialidade: "Neurologia", cidade: "São Paulo/SP", email: "daniela@email.com", whatsapp: "11999990003", dataIns: "2026-06-19" },
        { nome: "Eduardo Gomes", categoria: "Estudante (aulas + eventos sociais)", valor: 2500, especialidade: "Estudante", cidade: "Porto Alegre/RS", email: "eduardo@email.com", whatsapp: "51999990004", dataIns: "2026-06-05" },
        { nome: "Fátima Silva Rodrigues", categoria: "Médico(a)", valor: 2500, especialidade: "Psiquiatria", cidade: "Lages/SC", email: "fatima@email.com", whatsapp: "49999990005", dataIns: "2026-05-22" },
        { nome: "Gabriel Moura", categoria: "Médico(a) + Cônjuge", valor: 3500, especialidade: "Neurocirurgia", cidade: "Rio de Janeiro/RJ", email: "gabriel@email.com", whatsapp: "21999990006", dataIns: "2026-05-29" }
    ];
    
    // Sort alfabético da lista de inscritos
    attendeesMock.sort((a, b) => a.nome.localeCompare(b.nome));

    // Soma inscrições
    let totalInscricoesValor = attendeesMock.reduce((acc, curr) => acc + curr.valor, 0);

    // Soma para gráfico de barras (Receita por Categoria)
    const revCat = {
        'Estudante (apenas aulas)': 0,
        'Estudante (aulas + eventos sociais)': 0,
        'Médico(a) + Cônjuge': 0,
        'Médico(a)': 0
    };
    attendeesMock.forEach(a => {
        if(revCat[a.categoria] !== undefined) {
            revCat[a.categoria] += a.valor;
        }
    });

    // ==== CRONÔMETRO DE DIAS ====
    function updateCountdown() {
        const eventDate = new Date('2026-07-03T00:00:00');
        const now = new Date();
        const diffTime = eventDate - now;

        if (diffTime <= 0) {
            document.getElementById('countdownTimer').innerText = "O Evento Começou!";
            return;
        }

        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        document.getElementById('countdownTimer').innerText = `${diffDays} Dias`;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000 * 60 * 60);

    // ==== RENDERIZAR TABELA INCRITOS ====
    const buildAttendeesTable = () => {
        const tbody = document.querySelector('#attendeesTable tbody');
        tbody.innerHTML = '';
        attendeesMock.forEach(att => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${att.nome}</td>
                <td>${att.categoria}</td>
                <td>${att.especialidade}</td>
                <td>${att.cidade}</td>
                <td>${att.email}</td>
                <td>${att.whatsapp}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    buildAttendeesTable();

    // ==== GERENCIAMENTO DE DESPESAS ====
    let expenses = JSON.parse(localStorage.getItem('nw_expenses')) || [
        { id: 1, name: 'Reserva Hotel Le Canard (Sinal)', value: 15400 },
        { id: 2, name: 'Material Gráfico / Adesivos', value: 2500 }
    ];

    const saveExpenses = () => localStorage.setItem('nw_expenses', JSON.stringify(expenses));

    const renderExpenses = () => {
        const tbody = document.querySelector('#expensesTable tbody');
        tbody.innerHTML = '';
        let tot = 0;
        expenses.forEach(ex => {
            tot += ex.value;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ex.name}</td>
                <td>R$ ${ex.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td><button class="btn btn-outline" style="padding: 2px 8px; border-color: #ff6b6b; color: #ff6b6b;" onclick="removeExpense(${ex.id})"><i class="fas fa-trash"></i></button></td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById('expensesTotal').innerText = `R$ ${tot.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        updateFinances();
    };

    window.removeExpense = (id) => {
        expenses = expenses.filter(e => e.id !== id);
        saveExpenses();
        renderExpenses();
    };

    document.getElementById('btnExpenseAdd').addEventListener('click', () => {
        const name = document.getElementById('expenseNameAdd').value.trim();
        const value = parseFloat(document.getElementById('expenseValueAdd').value);
        if (name && value > 0) {
            expenses.push({ id: Date.now(), name, value });
            saveExpenses();
            renderExpenses();
            document.getElementById('expenseNameAdd').value = '';
            document.getElementById('expenseValueAdd').value = '';
        }
    });

    // ==== GERENCIAMENTO DE PATROCINADORES ====
    let sponsors = JSON.parse(localStorage.getItem('nw_sponsors')) || [
        { id: 1, name: 'Zeiss Medica', category: 'Diamante', value: 20000 },
        { id: 2, name: 'SurgiLine', category: 'Ouro', value: 12000 },
        { id: 3, name: 'Editora Medical', category: 'Raiz', value: 3000 }
    ];

    const catOrder = { 'Diamante': 1, 'Ouro': 2, 'Prata': 3, 'Vitis': 4, 'Raiz': 5 };
    const catClass = { 'Diamante': 'bg-diamante', 'Ouro': 'bg-ouro', 'Prata': 'bg-prata', 'Vitis': 'bg-vitis', 'Raiz': 'bg-raiz' };

    const saveSponsors = () => localStorage.setItem('nw_sponsors', JSON.stringify(sponsors));

    const renderSponsors = () => {
        const tbody = document.querySelector('#sponsorsTable tbody');
        tbody.innerHTML = '';
        let tot = 0;
        
        // Sort by category order
        sponsors.sort((a,b) => catOrder[a.category] - catOrder[b.category]);

        sponsors.forEach(sp => {
            tot += sp.value;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${sp.name}</strong></td>
                <td><span class="badge ${catClass[sp.category]}" style="padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 0.8rem;">${sp.category}</span></td>
                <td>R$ ${sp.value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td><button class="btn btn-outline" style="padding: 2px 8px; border-color: #ff6b6b; color: #ff6b6b;" onclick="removeSponsor(${sp.id})"><i class="fas fa-trash"></i></button></td>
            `;
            tbody.appendChild(tr);
        });
        document.getElementById('sponsorsTotal').innerText = `R$ ${tot.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        updateFinances();
        updateGaugeChart();
    };

    window.removeSponsor = (id) => {
        sponsors = sponsors.filter(s => s.id !== id);
        saveSponsors();
        renderSponsors();
    };

    document.getElementById('btnSponsorAdd').addEventListener('click', () => {
        const name = document.getElementById('sponsorNameAdd').value.trim();
        const category = document.getElementById('sponsorCategoryAdd').value;
        const valInput = document.getElementById('sponsorValueAdd').value;
        
        let value = parseFloat(valInput);
        if(!valInput) {
            // suggest value
            const sugeridos = {'Diamante': 20000, 'Ouro': 12000, 'Prata': 8000, 'Vitis': 6000, 'Raiz': 3000};
            value = sugeridos[category];
        }

        if (name && value > 0) {
            sponsors.push({ id: Date.now(), name, category, value });
            saveSponsors();
            renderSponsors();
            document.getElementById('sponsorNameAdd').value = '';
            document.getElementById('sponsorValueAdd').value = '';
        }
    });

    // ==== ATUALIZAÇÃO DO FINANCEIRO GERAL ====
    function updateFinances() {
        const totSponsors = sponsors.reduce((acc, curr) => acc + curr.value, 0);
        const totExp = expenses.reduce((acc, curr) => acc + curr.value, 0);
        
        const totRev = totalInscricoesValor + totSponsors;
        const profit = totRev - totExp;

        document.getElementById('resTotalRevenue').innerText = `R$ ${totRev.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        document.getElementById('resTotalExpenses').innerText = `R$ ${totExp.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        
        const elProfit = document.getElementById('resProfit');
        elProfit.innerText = `R$ ${profit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
        
        if(profit < 0) {
            elProfit.style.color = '#ff6b6b';
        } else {
            elProfit.style.color = '#4cd137';
        }
    }

    // ==== TO DO LIST ====
    let tasks = JSON.parse(localStorage.getItem('nw_tasks')) || [
        { id: 1, text: 'Confirmar lista de vinhos com o Sommelier', done: false },
        { id: 2, text: 'Fechar contrato de passagens para o Dr. palestrante convidado', done: true }
    ];

    const saveTasks = () => localStorage.setItem('nw_tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        const ul = document.getElementById('taskList');
        ul.innerHTML = '';
        tasks.forEach(t => {
            const li = document.createElement('li');
            li.style.cssText = "background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 8px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;";
            
            const div = document.createElement('div');
            div.style.cssText = "display: flex; align-items: center; gap: 10px;";
            div.innerHTML = `
                <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask(${t.id})" style="width: 18px; height: 18px; accent-color: var(--color-gold);">
                <span style="font-size: 1.05rem; ${t.done ? 'text-decoration: line-through; color: var(--color-text-muted);' : ''}">${t.text}</span>
            `;
            
            const btn = document.createElement('button');
            btn.innerHTML = '<i class="fas fa-trash"></i>';
            btn.style.cssText = "background: transparent; border: none; color: #ff6b6b; cursor: pointer;";
            btn.onclick = () => removeTask(t.id);

            li.appendChild(div);
            li.appendChild(btn);
            ul.appendChild(li);
        });
    };

    window.toggleTask = (id) => {
        const t = tasks.find(x => x.id === id);
        if(t) {
            t.done = !t.done;
            saveTasks();
            renderTasks();
        }
    };

    window.removeTask = (id) => {
        tasks = tasks.filter(x => x.id !== id);
        saveTasks();
        renderTasks();
    };

    document.getElementById('btnTaskAdd').addEventListener('click', () => {
        const inp = document.getElementById('taskInputAdd');
        if(inp.value.trim()){
            tasks.push({ id: Date.now(), text: inp.value.trim(), done: false });
            saveTasks();
            renderTasks();
            inp.value = '';
        }
    });


    // ==== INITIAL RENDER ====
    renderExpenses();
    renderSponsors();
    renderTasks();

    // ============================================
    // ========== GRÁFICOS (CHART.JS) ============
    // ============================================

    // Configuração base global para dark theme
    Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
    Chart.defaults.font.family = '"Montserrat", sans-serif';

    // 1. Gráfico de Linhas (Inscrições no tempo)
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['22/05', '29/05', '05/06', '12/06', '19/06', '26/06', '03/07'],
            datasets: [
                {
                    label: 'Médicos (Geral)',
                    data: [1, 2, 2, 3, 4, 0, 0],
                    borderColor: '#feca57',
                    backgroundColor: 'rgba(254, 202, 87, 0.2)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Estudantes (Geral)',
                    data: [0, 0, 1, 1, 2, 0, 0],
                    borderColor: '#48dbfb',
                    backgroundColor: 'rgba(72, 219, 251, 0.2)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Total Acumulado',
                    data: [1, 3, 4, 5, 8, 8, 8],
                    borderColor: '#ff9f43',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.3,
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
        }
    });

    // 2. Gráfico de Barras Financeiro
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: [
                'Estudantes (apenas aulas)', 
                'Estudantes (aulas + social)', 
                'Médico(a) + Cônjuge', 
                'Médico(a)',
                'Total'
            ],
            datasets: [{
                label: 'Receita Arrecadada (R$)',
                data: [
                    revCat['Estudante (apenas aulas)'],
                    revCat['Estudante (aulas + eventos sociais)'],
                    revCat['Médico(a) + Cônjuge'],
                    revCat['Médico(a)'],
                    totalInscricoesValor
                ],
                backgroundColor: [
                    '#48dbfb',
                    '#0abde3',
                    '#ff9f43',
                    '#feca57',
                    '#1dd1a1'
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                // Plugin customizado para escrever o valor no topo
                datalabels: { // Nós simularemos com animation onComplete se não quiser carregar outro plugin, ou usaremos tooltip.
                    // Para simplificar, vou deixar o ChartJS desenrolar o valor numérico acima usando uma variação simples no animation
                }
            },
            animation: {
                onComplete: function() {
                    let ctx = this.ctx;
                    ctx.font = Chart.helpers.fontString(12, 'bold', '"Montserrat", sans-serif');
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillStyle = '#fff';

                    this.data.datasets.forEach(function(dataset, i) {
                        let meta = this.getDatasetMeta(i);
                        meta.data.forEach(function(bar, index) {
                            let data = dataset.data[index];
                            if(data > 0) {
                                // Formata para R$ XXXX,XX
                                let text = 'R$ ' + data.toLocaleString('pt-BR');
                                ctx.fillText(text, bar.x, bar.y - 5);
                            }
                        });
                    }, this);
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // 3. Velocímetro (Gauge Chart trick com Doughnut)
    // Para criar um gauge sem biblioteca externa complexa, um doughnut chart cortado pela metade
    const ctxGauge = document.getElementById('gaugeChart').getContext('2d');
    let gaugeChartInstance = null;

    window.updateGaugeChart = function() {
        const totSponsors = sponsors.reduce((acc, curr) => acc + curr.value, 0);
        const currentRevenue = totalInscricoesValor + totSponsors;
        
        document.getElementById('totalRevenueText').innerText = `R$ ${currentRevenue.toLocaleString('pt-BR')}`;

        const maxValue = 160000;
        let p = (currentRevenue / maxValue) * 100;
        if(p > 100) p = 100;
        
        const dataFilled = currentRevenue;
        const dataEmpty = maxValue - currentRevenue < 0 ? 0 : maxValue - currentRevenue;

        if (gaugeChartInstance) {
            gaugeChartInstance.data.datasets[0].data = [dataFilled, dataEmpty];
            gaugeChartInstance.update();
        } else {
            gaugeChartInstance = new Chart(ctxGauge, {
                type: 'doughnut',
                data: {
                    labels: ['Arrecadado', 'Faltante'],
                    datasets: [{
                        data: [dataFilled, dataEmpty],
                        backgroundColor: [
                            'var(--color-gold)', // Arrecadado
                            'rgba(255, 255, 255, 0.1)' // Faltante
                        ],
                        borderWidth: 0,
                        circumference: 180,
                        rotation: -90
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                },
                plugins: [{
                    id: 'gaugeTextPlugin',
                    afterDraw: function(chart) {
                        const {ctx, chartArea: {left, right, top, bottom, width, height}} = chart;
                        ctx.save();
                        
                        // Desenha 0K
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.font = '12px Montserrat';
                        ctx.textAlign = 'left';
                        ctx.fillText('0K', left, bottom);

                        // Desenha 80K (Meio)
                        ctx.textAlign = 'center';
                        ctx.fillText('80K', left + width / 2, top + 15);

                        // Desenha 160K
                        ctx.textAlign = 'right';
                        ctx.fillText('160K', right, bottom);
                        
                        ctx.restore();
                    }
                }]
            });
        }
    }

    // Call update on init to draw gauge
    updateGaugeChart();

});
