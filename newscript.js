document.addEventListener('DOMContentLoaded', () => {
    const fieldsets = document.querySelectorAll('fieldset');
    const nextBtns = document.querySelectorAll('.nextBtn');
    const prevBtns = document.querySelectorAll('.prevBtn');
    const summaryDiv = document.getElementById('summary');
    const summaryContent = document.getElementById('summaryContent');
    const startBtn = document.getElementById('startBtn');

    let current = 0;

    function showFieldset(index) {
        fieldsets.forEach((fieldset, i) => {
            fieldset.style.display = (i === index) ? 'block' : 'none';
        });

        prevBtns.forEach(btn => btn.disabled = (index === 0));
        nextBtns.forEach(btn => btn.textContent = (index === fieldsets.length - 1) ? 'Enviar e Ver Resumo' : 'Próximo');
    }

    function generateSummary() {
        const formData = new FormData(document.getElementById('evaluationForm'));
        const counts = {
            '12': 0,
            '11': 0,
            '10': 0
        };

        // Contabiliza as respostas para cada alternativa
        formData.forEach((value, key) => {
            if (value === '12') counts['12']++;
            if (value === '11') counts['11']++;
            if (value === '10') counts['10']++;
        });

        // Determina a alternativa mais escolhida
        let maxAlternative = '';
        let maxCount = 0;
        for (let alternative in counts) {
            if (counts[alternative] > maxCount) {
                maxCount = counts[alternative];
                maxAlternative = alternative;
            }
        }

        // Define a mensagem personalizada baseada na alternativa mais escolhida
        const messages = {
            '12': "Parabéns! Você demonstrou um grande talento em acolher os clientes, criando conexões significativas e entendendo suas necessidades. Seu sorriso e abordagem amigável fazem toda a diferença na experiência do cliente, e sua habilidade em identificar os motivos da visita e usar o CPF do cliente para personalizar o atendimento é admirável. Continue a usar essas técnicas para fortalecer ainda mais a relação com seus clientes. Você é uma peça fundamental para garantir que cada cliente se sinta bem-vindo e compreendido.",
            '11': "Incrível! Sua capacidade de personalizar a experiência do cliente é excepcional. Você demonstra um conhecimento profundo dos produtos e utiliza técnicas de storytelling de forma eficaz, além de sempre consultar o histórico de compras para oferecer opções únicas e personalizadas. Sua abordagem ao convidar os clientes a experimentar os produtos e a conexão que você cria com eles é notável. Continue a aprimorar essas habilidades para proporcionar experiências únicas e memoráveis a cada cliente.",
            '10': "Fantástico! Você tem um talento natural para potencializar as vendas, oferecendo benefícios adicionais e aumentando o valor dos pedidos. Seu conhecimento do histórico de compras do cliente e a apresentação de promoções personalizadas mostram seu compromisso em oferecer o melhor. Sua capacidade de inspirar os clientes a comprarem mais e a maneira detalhada como você explica os benefícios adicionais são impressionantes. Continue a explorar essas habilidades para maximizar as oportunidades de venda e agregar valor para os clientes."
        };

        summaryContent.innerHTML = `<p>${messages[maxAlternative]}</p>`;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (current < fieldsets.length - 1) {
                current++;
                showFieldset(current);
            } else {
                // Gerar o resumo e mostrar a página de resumo
                generateSummary();
                summaryDiv.style.display = 'block';
                document.querySelector('.container').style.display = 'none';
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (current > 0) {
                current--;
                showFieldset(current);
            }
        });
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        summaryDiv.style.display = 'none';
        document.querySelector('.container').style.display = 'block';
        current = 0;
        showFieldset(current);
    });

    startBtn.addEventListener('click', () => {
        showFieldset(1); 
    });

    showFieldset(current);
});





