let isPlaying = false;
const audio = document.getElementById('site-music');
const btn = document.getElementById('music-btn');
const slider = document.getElementById('volume-slider');
const musicContainer = document.querySelector('.header-music-container');

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

let reactionTimeout;
let reactionStart;
const reactionBtn = document.getElementById('reaction-btn');
const reactionResult = document.getElementById('reaction-result');

if (reactionBtn) {
    reactionBtn.addEventListener('click', function () {
        if (!reactionBtn.classList.contains('ready')) {
            if (reactionBtn.disabled) return;
            reactionBtn.disabled = true;
            reactionBtn.textContent = 'Espere...';
            reactionResult.textContent = '';
            const waitTime = Math.random() * 5000 + 3000;
            reactionTimeout = setTimeout(() => {
                reactionBtn.classList.add('ready');
                reactionBtn.disabled = false;
                reactionBtn.textContent = 'Clique!';
                reactionStart = performance.now();
            }, waitTime);
        } else {
            const reactionEnd = performance.now();
            let reactionTime = Math.round(reactionEnd - reactionStart);
            reactionTime = Math.max(0, reactionTime - 100);
            reactionResult.textContent = `Seu tempo de reação: ${reactionTime} ms`;
            reactionBtn.classList.remove('ready');
            reactionBtn.textContent = 'Iniciar';
        }
    });
}

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
