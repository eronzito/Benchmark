let isPlaying = false;
const audio = document.getElementById('site-music');
const btn = document.getElementById('music-btn');
const slider = document.getElementById('volume-slider');
const musicContainer = document.querySelector('.header-music-container');

// Controle de Música de Fundo
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
        clickCount = 0;
    }

    function finishTest() {
        testRunning = false;
        clickTarget.disabled = true;
        clickTarget.removeEventListener('click', onClickTarget);
        clearInterval(timeInterval);
        timeRemainingEl.textContent = '';

        const cpsValue = clickCount / 10;            
        const cpsDisplay = cpsValue.toFixed(1);      
        const cpsLabel = cpsDisplay.replace('.', ',');
        resultEl.textContent = `${cpsLabel}Cps (${cpsDisplay} clicks por segundo)`;
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
