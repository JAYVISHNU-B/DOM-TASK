document.addEventListener('DOMContentLoaded', () => {
    const cardArray = [
        { name: 'A', img: 'A' },
        { name: 'B', img: 'B' },
        { name: 'C', img: 'C' },
        { name: 'D', img: 'D' },
        { name: 'E', img: 'E' },
        { name: 'F', img: 'F' },
        { name: 'G', img: 'G' },
        { name: 'H', img: 'H' },
    ];

    const gameGrid = shuffle([...cardArray, ...cardArray]);
    const gameBoard = document.getElementById('game-board');
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;

    // Sound elements
    const flipSound = document.getElementById('flip-sound');
    const matchSound = document.getElementById('match-sound');

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        gameBoard.innerHTML = ''; // Clear the game board before creating new cards
        gameGrid.forEach((item) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.name = item.name;

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-content', 'card-front');
            cardFront.textContent = item.img;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-content', 'card-back');
            cardBack.textContent = '?';

            card.appendChild(cardFront);
            card.appendChild(cardBack);
            gameBoard.appendChild(card);

            card.addEventListener('click', flipCard);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');
        flipSound.play();  // Play the flip sound

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.name === secondCard.dataset.name;
        if (isMatch) {
            matchSound.play();  // Play the match sound
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        resetBoard();
        if (matchedPairs === cardArray.length) {
            setTimeout(() => {
                alert('Congratulations! You found all the pairs!');
                triggerConfetti(); // Trigger confetti when the game is won
            }, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function restartGame() {
        matchedPairs = 0;
        createBoard();
    }

    function triggerConfetti() {
        const duration = 5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            // Launch a random amount of confetti from random locations
            confetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: Math.random() },
                colors: ['#bb0000', '#ffffff'], // Optional: Customize colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    document.getElementById('restart').addEventListener('click', restartGame);
    createBoard();
});
