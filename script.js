let isPlaying = false;
const audio = document.getElementById('site-music');
const btn = document.getElementById('music-btn');
const slider = document.getElementById('volume-slider');
const musicContainer = document.querySelector('.header-music-container');

function toggleMusic() {
	if (isPlaying) {
		audio.pause();
		btn.innerHTML = '&#x1F507;';
	} else {
		audio.play();
		btn.innerHTML = '&#x1F50A;';
	}
	isPlaying = !isPlaying;
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
