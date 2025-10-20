let isPlaying = false;
const audio = document.getElementById('site-music');
const btn = document.getElementById('music-btn');
const slider = document.getElementById('volume-slider');
const musicContainer = document.querySelector('.header-music-container');

// Controle de Música
function toggleMusic() {
    if (!btn) return;
    if (isPlaying) {
        audio.pause();
        btn.innerHTML = '<img src="sem_som.png" alt="Sem som" class="header-icon">';
    } else {
        audio.play();
        btn.innerHTML = '<img src="som.png" alt="Som" class="header-icon">';
    }
    isPlaying = !isPlaying;
}

if (btn) {
    btn.innerHTML = '<img src="sem_som.png" alt="Sem som" class="header-icon">';
}

if (slider) {
    slider.addEventListener('input', function() {
        audio.volume = parseFloat(slider.value);
    });
}

if (musicContainer) {
    musicContainer.addEventListener('mouseenter', function() {
        slider.style.display = 'inline-block';
    });
    musicContainer.addEventListener('mouseleave', function() {
        slider.style.display = 'none';
    });
}

// Teste de Reação
let reactionTimeout;
let reactionStart;
let waitingForSignal = false;
let earlyClickFlag = false;
const reactionBtn = document.getElementById('reaction-btn');
const reactionResult = document.getElementById('reaction-result');

function startReactionWait() {
    if (!reactionBtn) return;
    waitingForSignal = true;
    earlyClickFlag = false;
    reactionBtn.classList.remove('ready');
    reactionBtn.disabled = false;
    reactionBtn.textContent = 'Espere...';
    reactionResult.textContent = '';

    const waitTime = Math.random() * 5000 + 3000; // 3s a 8s
    reactionTimeout = setTimeout(() => {
        reactionTimeout = null;
        waitingForSignal = false;
        earlyClickFlag = false;
        reactionBtn.classList.add('ready');
        reactionBtn.disabled = false;
        reactionBtn.textContent = 'Clique!';
        reactionStart = performance.now();
    }, waitTime);
}

if (reactionBtn) {
    reactionBtn.textContent = 'Iniciar';
    reactionBtn.disabled = false;

    reactionBtn.addEventListener('click', function () {
        if (reactionBtn.classList.contains('ready')) {
            const reactionEnd = performance.now();
            let reactionTime = Math.round(reactionEnd - reactionStart);
            reactionTime = Math.max(0, reactionTime - 100);
            reactionResult.textContent = `Seu tempo de reação: ${reactionTime} ms`;
            reactionBtn.classList.remove('ready');
            reactionBtn.textContent = 'Iniciar';
            if (reactionTimeout) { clearTimeout(reactionTimeout); reactionTimeout = null; }
            waitingForSignal = false;
            earlyClickFlag = false;
            reactionBtn.disabled = false;
            return;
        }

        if (waitingForSignal) {
            if (!earlyClickFlag) {
                earlyClickFlag = true;
                reactionResult.textContent = 'Muito cedo!';
                reactionBtn.textContent = 'Muito cedo!';
                return;
            }

            if (earlyClickFlag) {
                if (reactionTimeout) {
                    clearTimeout(reactionTimeout);
                    reactionTimeout = null;
                }
                waitingForSignal = false;
                earlyClickFlag = false;
                reactionResult.textContent = 'Reiniciando o teste...';
                reactionBtn.textContent = 'Iniciar';
                reactionBtn.classList.remove('ready');
                reactionBtn.disabled = false;
                setTimeout(() => startReactionWait(), 300);
                return;
            }
        }

        startReactionWait();
    });
}

// Teste de Cliques
(function () {
    const startBtn = document.getElementById('click-start');
    const clickTarget = document.getElementById('click-target');
    const countdownEl = document.getElementById('countdown');
    const timeRemainingEl = document.getElementById('time-remaining');
    const resultEl = document.getElementById('click-result');

    if (!startBtn || !clickTarget) return;

    let clickCount = 0;
    let countdownInterval = null;
    let testTimeout = null;
    let timeInterval = null;
    let testRunning = false;

    function resetDisplay() {
        countdownEl.textContent = '';
        timeRemainingEl.textContent = '';
        resultEl.textContent = '';
        resultEl.style.display = 'none';
        clickCount = 0;
    }

    function finishTest() {
        testRunning = false;
        clickTarget.disabled = true;
        clickTarget.removeEventListener('click', onClickTarget);
        clearInterval(timeInterval);
        timeRemainingEl.textContent = '';

        const cpsValue = clickCount / 10;
        const cpsDisplay = cpsValue.toFixed(1).replace('.', ',');
        resultEl.textContent = `${cpsDisplay}Cps (${cpsValue.toFixed(1)} clicks por segundo)`;
        resultEl.style.display = 'block'; 
        startBtn.disabled = false;
        startBtn.textContent = 'Reiniciar';
    }

    function onClickTarget() {
        if (!testRunning) return;
        clickCount += 1;
    }

    startBtn.addEventListener('click', function () {
        if (startBtn.disabled) return;
        startBtn.disabled = true;
        startBtn.textContent = 'Preparando...';
        resetDisplay();

        let remaining = 3;
        countdownEl.textContent = remaining;
        countdownInterval = setInterval(() => {
            remaining -= 1;
            if (remaining > 0) {
                countdownEl.textContent = remaining;
            } else {
                clearInterval(countdownInterval);
                countdownEl.textContent = '';
                testRunning = true;
                clickCount = 0;
                clickTarget.disabled = false;
                clickTarget.focus();
                startBtn.textContent = 'Em execução...';

                clickTarget.addEventListener('click', onClickTarget);

                let timeLeft = 10;
                timeRemainingEl.textContent = `Tempo restante: ${timeLeft}s`;
                timeInterval = setInterval(() => {
                    timeLeft -= 1;
                    if (timeLeft >= 0) {
                        timeRemainingEl.textContent = `Tempo restante: ${timeLeft}s`;
                    }
                }, 1000);

                testTimeout = setTimeout(() => {
                    finishTest();
                }, 10000);
            }
        }, 1000);
    });
})();

// Teste de Memória
(function () {
    const startBtn = document.getElementById('memory-start');
    const displayEl = document.getElementById('memory-display');
    const levelEl = document.getElementById('memory-level');
    const inputArea = document.getElementById('memory-input-area');
    const inputEl = document.getElementById('memory-input');
    const submitBtn = document.getElementById('memory-submit');
    const resultEl = document.getElementById('memory-result');

    if (!startBtn || !displayEl) return;

    let level = 0;
    let sequence = [];
    let showTimeouts = [];
    const SHOW_TIME = 5000;
    const BETWEEN_TIME = 500;

    function randDigit() {
        return Math.floor(Math.random() * 10);
    }

    function clearShowTimeouts() {
        showTimeouts.forEach(t => clearTimeout(t));
        showTimeouts = [];
    }

    function updateLevelDisplay() {
        levelEl.textContent = level;
    }

    function showText(text) {
        displayEl.textContent = String(text);
    }

    function hideDisplay() {
        displayEl.textContent = '';
    }


    function playConcatenatedSequenceAndPrompt() {
        inputArea.style.display = 'none';
        inputEl.value = '';
        resultEl.textContent = '';
        resultEl.style.display = 'none'; 
        displayEl.textContent = '';

        const text = sequence.join('');
        showText(text);


        showTimeouts.push(setTimeout(() => {
            hideDisplay();
        }, SHOW_TIME));


        showTimeouts.push(setTimeout(() => {
            inputArea.style.display = 'flex';
            inputEl.focus();
            resultEl.textContent = 'Digite a sequência que você viu (ex: 54 ou 5 4).';
        }, SHOW_TIME + BETWEEN_TIME));
    }

    function startRound() {
        level += 1;
        sequence = [];
        for (let i = 0; i < level; i++) sequence.push(randDigit());
        updateLevelDisplay();
        startBtn.disabled = true;
        clearShowTimeouts();
        playConcatenatedSequenceAndPrompt();
    }

    function endGame() {
        const remembered = Math.max(0, level - 1);
        resultEl.textContent = `Fim de jogo — você lembrou ${remembered} número(s).`;
        resultEl.style.display = 'block';
        startBtn.textContent = 'Recomeçar';
        startBtn.disabled = false;
        inputArea.style.display = 'none';
        displayEl.textContent = '';
        level = 0;
        sequence = [];
        updateLevelDisplay();
        clearShowTimeouts();
    }

    function normalizeInputToDigits(raw) {
        const cleaned = raw.replace(/\D+/g, '');
        return cleaned.split('').map(c => parseInt(c, 10));
    }

    submitBtn.addEventListener('click', () => {
        const raw = (inputEl.value || '').trim();
        if (!raw) return;
        const attempt = normalizeInputToDigits(raw);
        if (attempt.length !== sequence.length) {
            resultEl.textContent = 'Sequência com tamanho incorreto. Jogo encerrado.';
            endGame();
            return;
        }
        let ok = true;
        for (let i = 0; i < sequence.length; i++) {
            if (Number.isNaN(attempt[i]) || attempt[i] !== sequence[i]) {
                ok = false;
                break;
            }
        }
        if (ok) {
            resultEl.textContent = 'Correto! Preparando próximo nível...';
            inputArea.style.display = 'none';
            setTimeout(() => {
                startRound();
            }, 1200);
        } else {
            endGame();
        }
    });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitBtn.click();
    });

    startBtn.addEventListener('click', () => {
        clearShowTimeouts();
        level = 0;
        sequence = [];
        resultEl.textContent = '';
        startBtn.textContent = 'Iniciar';
        startRound();
    });
})();

// Teste de Escrita:
(function () {
    const startBtn = document.getElementById('typing-start');
    const countdownEl = document.getElementById('typing-countdown');
    const timerEl = document.getElementById('typing-timer');
    const inputEl = document.getElementById('typing-input');
    const lineEls = [
        document.getElementById('line1'),
        document.getElementById('line2'),
        document.getElementById('line3')
    ];
    const resultEl = document.getElementById('typing-result');
    const wordLinesContainer = document.getElementById('word-lines');

    if (!startBtn || !inputEl || !lineEls[0]) return;


    const DICT = [
        "amor","casa","tempo","pessoa","ano","dia","mundo","vida","coisa","homem", 
        "mulher","mão","olho","cidade","lado","poder","trabalho","mão","palavra", 
        "parte","porta","rua","água","fogo","terra","ar","sonho","noite","manhã", 
        "carro","janela","amigo","falar","andar","saber","ver","vir","ficar","gente", 
        "história","música","livro","escola","mesa","cadeira","janela","computador", 
        "celular","janela","janela","janela","verde","azul","branco","preto","cinza", 
        "rápido","lento","forte","fraco","alegre","triste","bom","ruim","claro","escuro", 
        "cidade","campo","mar","ilha","flor","árvore","rio","montanha","praia","vento", 
        "criança","pai","mãe","irmão","irmã","tio","avó","bebê","nome","idade", "luz","sol",
        "chuva","neve","nuvem","estrela","céu","calor","frio","sombra", "comer","beber","dormir",
        "correr","pular","cair","ler","escrever","ouvir","sentir", "dizer","dar","levar","trazer",
        "pôr","tirar","abrir","fechar","pensar","achar", "caminho","ponto","fundo","meio","fim",
        "início","volta","fora","dentro","perto", "longe","sim","não","agora","nunca","sempre",
        "logo","devagar","paz","guerra", "risco","medo","sorte","chave","conta","doce","sal",
        "pão","leite","café", "chá","suco","vinho","copo","prato","faca","garfo","colher","bola",
        "jogo", "cão","gato","pássaro","peixe","bicho","cabeça","corpo","pé","braço","perna", "roupa",
        "sapato","anel","bolsa","cinto","laço","novo","velho","jovem","certo", "errado","doente",
        "saudável","limpo","sujo","quente","gelado","seco","molhado","vazio", "cheio","puro","simples",
        "total","grande","pequeno","alto","baixo","fino","grosso", "doer","pesar","tocar","gritar",
        "rir","chorar","ajudar","pedir","usar","trocar", "papel","tinta","lápis","borracha","tesoura",
        "cola","caixa","tubo","fita","disco", "roda","motor","freio","buzina","ponte","poste","telha",
        "parede","teto","chão", "cerca","poço","pedra","metal","vidro","plástico","seda","lã","linha",
        "agulha","nós","vós","eles","elas","este","esse","aqui","ali","quem","qual", "onde","como",
        "quanto","meu","teu","dele","sua","nosso","dela","vosso", "bom","mau"
    ];

    let buffer = [];        
    let index = 0;          
    let typedTotal = 0;
    let typedCorrect = 0;
    let testTimer = null;
    let countdownTimer = null;
    const TEST_DURATION = 30; 
    const COOLDOWN = 3;       

    function randWord() {
        return DICT[Math.floor(Math.random() * DICT.length)];
    }

    function ensureBuffer(minSize = 60) {
        while (buffer.length - index < minSize) {
            for (let i = 0; i < 40; i++) buffer.push(randWord());
        }
    }

    function renderLines() {
        ensureBuffer(60);
        const windowSize = 60; 
        const slice = buffer.slice(index, index + windowSize);
        const perLine = Math.ceil(slice.length / 3);
        for (let i = 0; i < 3; i++) {
            const lineWords = slice.slice(i * perLine, (i + 1) * perLine);
            const html = lineWords.map((w, idx) => {
                const globalIdx = index + i * perLine + idx;
                if (globalIdx === index) {
                    return `<strong style="text-decoration:underline">${w}</strong>`;
                }
                return w;
            }).join(' ');
            lineEls[i].innerHTML = html;
        }
    }

    function startCooldown() {
        let remaining = COOLDOWN;
        countdownEl.textContent = remaining;
        inputEl.disabled = true;
        inputEl.value = '';
        resultEl.textContent = '';
        resultEl.style.display = 'none';
        typedTotal = 0;
        typedCorrect = 0;
        index = 0;
        buffer = [];
        ensureBuffer(120);
        renderLines();

        countdownTimer = setInterval(() => {
            remaining -= 1;
            if (remaining > 0) {
                countdownEl.textContent = remaining;
            } else {
                clearInterval(countdownTimer);
                countdownEl.textContent = '';
                startTest();
            }
        }, 1000);
    }

    function startTest() {
        let timeLeft = TEST_DURATION;
        inputEl.disabled = false;
        inputEl.focus();
        timerEl.textContent = `Tempo: ${timeLeft}s`;
        renderLines();

        testTimer = setInterval(() => {
            timeLeft -= 1;
            timerEl.textContent = `Tempo: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(testTimer);
                endTest();
            }
        }, 1000);
    }

    function endTest() {
        inputEl.disabled = true;
        timerEl.textContent = '';
        countdownEl.textContent = '';
        const ppm = (typedCorrect / TEST_DURATION) * 60;
        const ppmDisplay = ppm.toFixed(1).replace('.', ',');
        const accuracy = typedTotal === 0 ? 0 : (typedCorrect / typedTotal) * 100;
        const accDisplay = accuracy.toFixed(1).replace('.', ',');
        resultEl.innerHTML = `Resultado: <strong>${ppmDisplay} PPM</strong> — Precisão: <strong>${accDisplay}%</strong>`;
        resultEl.style.display = 'block';
        startBtn.disabled = false;
        startBtn.textContent = 'Reiniciar';
    }

    function acceptTypedWord(raw) {
        const typed = raw.trim();
        if (typed === '') return;
        const target = buffer[index];
        typedTotal += 1;
        if (typed.toLowerCase() === target.toLowerCase()) {
            typedCorrect += 1;
        }
        index += 1;
        renderLines();
    }

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            const val = inputEl.value;
            acceptTypedWord(val);
            inputEl.value = '';
        }
    });

    inputEl.addEventListener('blur', () => {
        if (inputEl.value.trim()) {
            acceptTypedWord(inputEl.value);
            inputEl.value = '';
        }
    });

    startBtn.addEventListener('click', () => {
        if (startBtn.disabled) return;
        startBtn.disabled = true;
        startBtn.textContent = 'Preparando...';
        startCooldown();
    });

    ensureBuffer(120);
    renderLines();
})();

(function () {
    const rootEl = document.documentElement;


    function ensureThemeButton() {
        if (document.getElementById('theme-btn')) return document.getElementById('theme-btn');

        const header = document.querySelector('header');
        if (!header) return null;

        const btn = document.createElement('button');
        btn.id = 'theme-btn';
        btn.className = 'header-theme-btn';
        btn.setAttribute('aria-label', 'Alternar tema');
        btn.type = 'button';
        btn.textContent = '🌙';
        const musicBtn = document.getElementById('music-btn');
        if (musicBtn && musicBtn.parentNode === header) header.insertBefore(btn, musicBtn);
        else header.appendChild(btn);

        return btn;
    }

    const themeBtn = ensureThemeButton();

    const saved = localStorage.getItem('site-theme'); 
    if (saved === 'light') rootEl.classList.add('light-theme');

    function updateThemeIcon(btn) {
        const isLight = rootEl.classList.contains('light-theme');
        if (btn) btn.textContent = isLight ? '☀️' : '🌙';
    }
    updateThemeIcon(themeBtn);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = rootEl.classList.toggle('light-theme');
            localStorage.setItem('site-theme', isLight ? 'light' : 'dark');
            updateThemeIcon(themeBtn);
        });
    }
})();
