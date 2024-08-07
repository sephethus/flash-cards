document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    // Modal functionality for full-size images in questions
    var imageModal = document.createElement('div');
    imageModal.classList.add('image-modal');
    var imageModalContent = document.createElement('div');
    imageModalContent.classList.add('image-modal-content');
    imageModal.appendChild(imageModalContent);
    var closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    imageModal.appendChild(closeButton);
    document.body.appendChild(imageModal);

    closeButton.onclick = function() {
        imageModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
    };

    // Handle image clicks on the front of the flashcard
    document.querySelectorAll('.flashcard-front img').forEach(function(img) {
        img.addEventListener('click', function() {
            imageModalContent.innerHTML = '<img src="' + img.src + '">';
            imageModal.style.display = 'block';
        });
    });

    // Modal functionality for additional info
    var additionalModal = document.createElement('div');
    additionalModal.classList.add('modal');
    var additionalModalContent = document.createElement('div');
    additionalModalContent.classList.add('modal-content');
    additionalModal.appendChild(additionalModalContent);
    var closeAdditionalButton = document.createElement('span');
    closeAdditionalButton.classList.add('close');
    closeAdditionalButton.innerHTML = '&times;';
    additionalModal.appendChild(closeAdditionalButton);
    document.body.appendChild(additionalModal);

    closeAdditionalButton.onclick = function() {
        additionalModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == additionalModal) {
            additionalModal.style.display = 'none';
        }
    };

    document.querySelectorAll('.view-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var cardId = this.getAttribute('data-card-id');
            var additionalContent = document.getElementById('modal-content-' + cardId).innerHTML;
            additionalModalContent.innerHTML = additionalContent;
            additionalModal.style.display = 'block';
        });
    });

    // Check if the Quill editors exist before initializing them
    var quillQuestionEditor = document.getElementById('question-editor');
    var quillAdditionalEditor = document.getElementById('additional-editor');

    if (quillQuestionEditor && quillAdditionalEditor) {
        var quillQuestion = new Quill('#question-editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block']
                ]
            }
        });

        var quillAdditional = new Quill('#additional-editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block']
                ]
            }
        });
        
        if (window.isEditPage) {
            quillQuestion.root.innerHTML = window.flashcardContent.question;
            quillAdditional.root.innerHTML = window.flashcardContent.additional_content;
        }

        console.log("Quill editors initialized");

        function handlePaste(event, quill) {
            var clipboardData = event.clipboardData || window.clipboardData;
            var items = clipboardData.items;
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind === 'file' && items[i].type.indexOf('image/') !== -1) {
                        var file = items[i].getAsFile();
                        event.preventDefault(); // Prevent the default pasting behavior

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var range = quill.getSelection();
                            quill.insertEmbed(range.index, 'image', e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        }

        quillQuestion.root.addEventListener('paste', function(event) {
            handlePaste(event, quillQuestion);
        });

        quillAdditional.root.addEventListener('paste', function(event) {
            handlePaste(event, quillAdditional);
        });

        const form = document.getElementById('flashcard-form');
        console.log("Form element:", form);

        const submitButton = document.getElementById('submit-button');
        console.log("Submit button element:", submitButton);

        if (form && submitButton) {
            console.log("Form and submit button found, attaching event listener");
            submitButton.addEventListener('click', function(e) {
                console.log("Submit button clicked");
                e.preventDefault();  // Prevent the default form submission

                const questionTextarea = document.getElementById('question');
                const additionalTextarea = document.getElementById('additional_content');
                questionTextarea.value = quillQuestion.root.innerHTML;
                additionalTextarea.value = quillAdditional.root.innerHTML;

                console.log("Textarea content (question):", questionTextarea.value);
                console.log("Textarea content (answer):", additionalTextarea.value);
                console.log("Quill content (question):", quillQuestion.root.innerHTML);
                console.log("Quill content (answer):", quillAdditional.root.innerHTML);

                questionTextarea.style.visibility = 'visible';
                additionalTextarea.style.visibility = 'visible';

                console.log("Trying to focus");
                questionTextarea.focus();
                additionalTextarea.focus();
                console.log("Tried to focus");

                questionTextarea.style.visibility = 'hidden';
                additionalTextarea.style.visibility = 'hidden';

                console.log("Submitting the form");
                form.submit();
            });
        } else {
            console.log("Form or submit button not found");
        }
    }

    const cardContainer = document.querySelector('.card-container');
    const cards = Array.from(document.querySelectorAll('.flashcard')); // Convert NodeList to Array

    // Get the card ID from the URL hash
    const hash = window.location.hash;
    let currentCardId = null;
    if (hash.startsWith('#flashcard-')) {
        currentCardId = parseInt(hash.replace('#flashcard-', ''), 10);
    }
    
    //Uncomment the below lines and comment out the shuffle and reorder lines if you want to add and edit new cards.

    // Set currentCardIndex based on the card ID from the URL hash or default to the last card
    if (currentCardId !== null) {
        currentCardIndex = cards.findIndex(card => parseInt(card.id.split('-')[1], 10) === currentCardId);
    } else {
        currentCardIndex = cards.length - 1; // Default to the last card or use shuffle and reorder.
    }
    //shuffleArray(cards);
    //reorderCards(cardContainer, cards);
    // currentCardIndex = 0; // Initialize the currentCardIndex (set last cards.length - 1;)

    cards.forEach((card, index) => {
        const cardNumberElement = card.querySelector('.card-number');
        const answerElement = card.querySelector('.flashcard-back p');
        const questionElement = card.querySelector('.flashcard-front p');

        if (answerElement) {
            formatAnswer(answerElement);
        }
        
        if (questionElement) {
            bionicQuestion(questionElement);
        }

        if (cardNumberElement) {
            cardNumberElement.textContent = index + 1;
        }
    });

    showCard(currentCardIndex); // Show the first card after shuffling


});

function bionicQuestion(questionElement) {
    const text = questionElement.innerText;
    const lines = text.split('\n');
    if (lines.length > 0) {
        // Bold the first line
        lines[0] = lines[0].split(' ').map(word => {
            const midIndex = Math.ceil(word.length / 2);
            return `<strong>${word.slice(0, midIndex)}</strong>${word.slice(midIndex)}`;
        }).join(' ');
        questionElement.innerHTML = lines.join('<br>');
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