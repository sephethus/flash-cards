document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.querySelector('.card-container');
    const cards = Array.from(document.querySelectorAll('.flashcard')); // Convert NodeList to Array
    // shuffleArray(cards);
    // reorderCards(cardContainer, cards);
    // currentCardIndex = 0; // Initialize the currentCardIndex (set last cards.length - 1;)
    currentCardIndex = cards.length - 1;
    showCard(currentCardIndex); // Show the first card after shuffling
});

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

// Initially show the first card
showCard(currentCardIndex);