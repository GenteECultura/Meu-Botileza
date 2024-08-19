document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('evaluationForm');
    const startBtn = document.getElementById('startBtn');
    const nextToAcolha = document.getElementById('nextToAcolha');
    const nextToPersonalize = document.getElementById('nextToPersonalize');
    const nextToPotencialize = document.getElementById('nextToPotencialize');
    const nextToEncante = document.getElementById('nextToEncante');
    const submitBtn = document.getElementById('submitBtn');
    const summaryText = document.getElementById('summaryText');
    const downloadLink = document.getElementById('downloadLink');
    const chartContainer = document.getElementById('chartContainer'); 
    const nextToNewQuestions = document.getElementById('nextToNewQuestions'); 

    const sections = {
        welcomeScreen: document.getElementById('welcomeScreen'),
        initialData: document.getElementById('initialData'),
        acolha: document.getElementById('acolha'),
        personalize: document.getElementById('personalize'),
        potencialize: document.getElementById('potencialize'),
        encante: document.getElementById('encante'),
        summary: document.getElementById('summary')
    };

    function showSection(sectionId) {
        Object.values(sections).forEach(section => {
            section.classList.remove('active');
        });
        sections[sectionId].classList.add('active');
    }

    startBtn.addEventListener('click', () => {
        showSection('initialData');
    });

    nextToAcolha.addEventListener('click', () => {
        showSection('acolha');
    });

    nextToPersonalize.addEventListener('click', () => {
        showSection('personalize');
    });

    nextToPotencialize.addEventListener('click', () => {
        showSection('potencialize');
    });

    nextToEncante.addEventListener('click', () => {
        showSection('encante');
    });

    submitBtn.addEventListener('click', () => {

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });


        fetch('https://sheetdb.io/api/v1/0y8rv1d4wdu3f', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            showSection('summary');
            generatePDF();
            generateChart();
        })
    });

    nextToNewQuestions.addEventListener('click', () => {

        setTimeout(() => {
            const formData = new FormData(form);
            const answers = {};
            formData.forEach((value, key) => {
                answers[key] = value;
            });

            const nomeCompleto = answers['nomeCompleto'] || 'Nome não fornecido';
            const praca = answers['praca'] || 'Praça não fornecida';

            const url = new URL('new_questions.html', window.location.origin);
            url.searchParams.set('nomeCompleto', nomeCompleto);
            url.searchParams.set('praca', praca);

            window.location.href = url;
        }, 1000); 
    });

    function generatePDF() {
        const formData = new FormData(form);
        const answers = {};
        formData.forEach((value, key) => {
            answers[key] = value;
        });

        const nomeCompleto = answers['nomeCompleto'] || 'Nome não fornecido';
        const praca = answers['praca'] || 'Praça não fornecida';

        const profile = getProfile(answers);
        const summaryMessage = getSummaryMessage(profile);

        summaryText.innerHTML = `<strong>Nome:</strong> ${nomeCompleto}<br><strong>Praça:</strong> ${praca}<br><br>${summaryMessage.text}`;

        const pdfContent = generatePDFContent(nomeCompleto, praca, summaryMessage);
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = 'resumo.pdf';
        downloadLink.style.display = 'block';
    }

    function getProfile(answers) {
        const scores = {
            acolha: 0,
            personalize: 0,
            potencialize: 0,
            encante: 0
        };

        Object.keys(scores).forEach(profile => {
            for (let i = 1; i <= 4; i++) {
                const value = answers[`${profile}${i}`];
                scores[profile] += parseInt(value, 10) || 0;
            }
        });

        return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    }

    function getSummaryMessage(profile) {
        const messages = {
            acolha: {
                text: "Parabéns! Você demonstrou um grande talento em acolher os clientes, criando conexões significativas e entendendo suas necessidades. Seu sorriso e abordagem amigável fazem toda a diferença na experiência do cliente, e sua habilidade em identificar os motivos da visita e usar o CPF do cliente para personalizar o atendimento é admirável. Continue a usar essas técnicas para fortalecer ainda mais a relação com seus clientes. Você é uma peça fundamental para garantir que cada cliente se sinta bem-vindo e compreendido."
            },
            personalize: {
                text: "Incrível! Sua capacidade de personalizar a experiência do cliente é excepcional. Você demonstra um conhecimento profundo dos produtos e utiliza técnicas de storytelling de forma eficaz, além de sempre consultar o histórico de compras para oferecer opções únicas e personalizadas. Sua abordagem ao convidar os clientes a experimentar os produtos e a conexão que você cria com eles é notável. Continue a aprimorar essas habilidades para proporcionar experiências únicas e memoráveis a cada cliente."
            },
            potencialize: {
                text: "Fantástico! Você tem um talento natural para potencializar as vendas, oferecendo benefícios adicionais e aumentando o valor dos pedidos. Seu conhecimento do histórico de compras do cliente e a apresentação de promoções personalizadas mostram seu compromisso em oferecer o melhor. Sua capacidade de inspirar os clientes a comprarem mais e a maneira detalhada como você explica os benefícios adicionais são impressionantes. Continue a explorar essas habilidades para maximizar as oportunidades de venda e agregar valor para os clientes."
            },
            encante: {
                text: "Maravilhoso! Você sabe como encantar os clientes, garantindo que cada interação termine de maneira memorável. Seu hábito de finalizar o atendimento com gentileza, celebrar a escolha do cliente e incluir toques especiais, como borrifar fragrâncias nas sacolas, faz toda a diferença. Sua menção ao programa de reciclagem Boti Recicla demonstra seu compromisso com a sustentabilidade. Continue a encantar os clientes com essas práticas, criando experiências únicas que farão com que eles voltem sempre."
            }
        };

        return messages[profile] || { text: "Erro ao determinar o perfil." };
    }

    function generatePDFContent(nomeCompleto, praca, summaryMessage) {
        return `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    h1 { color: #2a4971; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Resumo do Teste #MeuBotileza</h1>
                    <p><strong>Nome:</strong> ${nomeCompleto}</p>
                    <p><strong>Praça:</strong> ${praca}</p>
                    <p>${summaryMessage.text}</p>
                </div>
            </body>
            </html>
        `;
    }

    function generateChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const answers = new FormData(form);
        const profile = getProfile(Object.fromEntries(answers));
        const data = {
            labels: ['Acolha', 'Personalize', 'Potencialize', 'Encante'],
            datasets: [{
                label: 'Pontuações',
                data: [
                    profile === 'acolha' ? 1 : 0,
                    profile === 'personalize' ? 1 : 0,
                    profile === 'potencialize' ? 1 : 0,
                    profile === 'encante' ? 1 : 0
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            }]
        };

        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                scale: {
                    ticks: { beginAtZero: true }
                }
            }
        });
    }
});




































