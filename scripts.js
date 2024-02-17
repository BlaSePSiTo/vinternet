document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const body = document.querySelector('body');
    let currentCardIndex = 0;
    let currentAudio = null;

    function showCard(index) {
        cards.forEach((card, idx) => {
            if (idx === index) {
                $(card).fadeIn(300);
            } else {
                $(card).fadeOut(300);
            }
        });
        const albumImage = cards[index].querySelector('.album').getAttribute('src');
        body.style.backgroundImage = `url(${albumImage})`;
    }

    function rotateCard(direction) {
        const currentCard = cards[currentCardIndex];
        currentCard.classList.add(`rotate-${direction}`);
        currentCard.addEventListener('transitionend', function () {
            $(this).fadeOut(300);
            this.style.display = 'none';
            this.classList.remove(`rotate-${direction}`);
            currentCardIndex = (currentCardIndex + 1) % cards.length;
            showCard(currentCardIndex);
            const audioId = cards[currentCardIndex].getAttribute('data-audio');
            const newAudio = document.getElementById(audioId);
            if (newAudio) {
                if (currentAudio) {
                    fadeOutAudio(currentAudio);
                }
                startAudio(newAudio);
            }
        }, { once: true });
    }

    function fadeOutAudio(audio) {
        let volume = audio.volume;
        const fadeOutInterval = setInterval(() => {
            if (volume > 0.1) {
                volume -= 0.1;
                audio.volume = volume;
            } else {
                clearInterval(fadeOutInterval);
                audio.pause();
                audio.currentTime = 0;
            }
        }, 100);
    }

    function fadeInAudio(audio) {
        let volume = 0;
        audio.volume = volume;
        audio.play();
        const fadeInInterval = setInterval(() => {
            if (volume < 0.17) {
                volume += 0.03;
                audio.volume = volume;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 100);
    }

    function startAudio(audio) {
        fadeInAudio(audio);
        currentAudio = audio; // Actualizar la referencia al elemento de audio actual
    }

    cards.forEach(card => {
        // Verificar si la tarjeta actual tiene el ID "happy"
        if (card.id !== 'happy') {
            const hammertime = new Hammer(card);
            hammertime.on('swipe', function (ev) {
                const direction = ev.offsetDirection === 2 ? 'left' : 'right';
                rotateCard(direction);
            });
        }
    });

    $('#loader').fadeIn();

    document.getElementById('music-on').addEventListener('click', function () {
        const audioId = cards[currentCardIndex].getAttribute('data-audio');
        const audio = document.getElementById(audioId);
        if (audio) {
            // Reproducir la música después de 2 segundos
            setTimeout(function () {
                audio.play();
                fadeInAudio(audio);
                // Actualizar la referencia al elemento de audio actual
                currentAudio = audio;
                $('#loader').fadeOut();
                $('body').addClass('loaded');
            }, 1000); // 2 segundos de retraso
        }
    });

    showCard(currentCardIndex);
});
