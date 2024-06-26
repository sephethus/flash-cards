document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector('.card-container');
    const cards = Array.from(document.querySelectorAll('.flashcard')); // Convert NodeList to Array
    cards.forEach(card => {
        const answerElement = card.querySelector('.flashcard-back p');
        if (answerElement) {
            formatAnswer(answerElement);
        }

        const questionElement = card.querySelector('.flashcard-front p');
        if (questionElement) {
            bionicQuestion(questionElement);
        }
    });

    // Get the card ID from the URL hash
    const hash = window.location.hash;
    let currentCardId = null;
    if (hash.startsWith('#flashcard-')) {
        currentCardId = parseInt(hash.replace('#flashcard-', ''), 10);
    }

    // Set currentCardIndex based on the card ID from the URL hash or default to the last card
    if (currentCardId !== null) {
        currentCardIndex = cards.findIndex(card => parseInt(card.id.split('-')[1], 10) === currentCardId);
    } else {
        currentCardIndex = cards.length - 1; // Default to the last card or use shuffle and reorder.
    }

    shuffleArray(cards);
    reorderCards(cardContainer, cards);
    currentCardIndex = 0; // Initialize the currentCardIndex (set last cards.length - 1;)
    showCard(currentCardIndex); // Show the first card after shuffling
});

function bionicQuestion(answerElement) {
    const text = answerElement.innerText;
    const lines = text.split('\n');
    if (lines.length > 0) {
        // Bold the first line
        lines[0] = lines[0].split(' ').map(word => {
            const midIndex = Math.ceil(word.length / 2);
            return `<strong>${word.slice(0, midIndex)}</strong>${word.slice(midIndex)}`;
        }).join(' ');
        answerElement.innerHTML = lines.join('<br>');
    }
}

function formatAnswer(answerElement) {
    const text = answerElement.innerText;
    const lines = text.split('\n');
    if (lines.length > 0) {
        // Bold the first line
        lines[0] = `<strong>${lines[0]}</strong>`;
        // Apply Bionic Reading formatting to the rest of the lines
        for (let i = 1; i < lines.length; i++) {
            lines[i] = lines[i].split(' ').map(word => {
                const midIndex = Math.ceil(word.length / 2);
                return `<strong>${word.slice(0, midIndex)}</strong>${word.slice(midIndex)}`;
            }).join(' ');
        }
        answerElement.innerHTML = lines.join('<br>');
    }
}

let currentCardIndex;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function reorderCards(container, cards) {
    cards.forEach(card => container.appendChild(card)); // Reorder the DOM based on shuffled array
}

function showCard(index) {
    const cards = document.querySelectorAll('.flashcard'); // Ensure cards is defined within the function
    cards.forEach((card, i) => {
        card.style.display = (i === index) ? 'block' : 'none';
    });
}

function showNextCard() {
    const cards = document.querySelectorAll('.flashcard'); // Ensure cards is defined within the function
    currentCardIndex = (currentCardIndex + 1) % cards.length;
    showCard(currentCardIndex);
}

function showPreviousCard() {
    const cards = document.querySelectorAll('.flashcard'); // Ensure cards is defined within the function
    currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    showCard(currentCardIndex);
}

function openModal(event, id) {
    event.stopPropagation();  // Prevent the card from flipping
    document.getElementById('modal-' + id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById('modal-' + id).style.display = 'none';
}

window.onclick = function(event) {
    var modals = document.getElementsByClassName('modal');
    for (var i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

function editCurrentCard() {
    const cards = document.querySelectorAll('.flashcard'); // Ensure cards is defined within the function
    const currentCard = cards[currentCardIndex];
    const cardId = currentCard.id.split('-')[1];
    window.location.href = `/edit/${cardId}`;
}

function applyBionicReading(text) {
    // Implement the Bionic Reading technique
    const words = text.split(' ');
    const bionicWords = words.map(word => {
        const middle = word.slice(1, -1);
        const highlighted = word[0] + '<span class="important">' + middle + '</span>' + word[word.length - 1];
        return highlighted;
    });
    return bionicWords.join(' ');
}


// Initially show the first card
showCard(currentCardIndex);