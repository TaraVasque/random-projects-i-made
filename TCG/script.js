document.addEventListener('DOMContentLoaded', () => {
    const playerHand = document.getElementById('player-hand');
    const opponentHand = document.getElementById('opponent-hand');
    const battlefield = document.getElementById('battlefield');
    const playerHealthElement = document.getElementById('player-health');
    const opponentHealthElement = document.getElementById('opponent-health');
    const endTurnButton = document.getElementById('end-turn');

    let playerHealth = 20;
    let opponentHealth = 20;
    let playerTurn = true;

    // Function to create a card element
    function createCard(card) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = `${card.name}\nA:${card.attack} D:${card.defense}\n${card.rarity}`;
        cardElement.addEventListener('click', () => {
            if (playerTurn) {
                battlefield.appendChild(cardElement);
                attackOpponent(card.attack);
                endTurn();
            }
        });
        return cardElement;
    }

    // Function to add a card to a hand
    function addCardToHand(hand, card) {
        const cardElement = createCard(card);
        hand.appendChild(cardElement);
    }

    // Function to attack opponent
    function attackOpponent(attack) {
        opponentHealth -= attack;
        opponentHealthElement.textContent = opponentHealth;
        checkWinCondition();
    }

    // Function to check win condition
    function checkWinCondition() {
        if (opponentHealth <= 0) {
            alert('Player wins!');
            resetGame();
        } else if (playerHealth <= 0) {
            alert('Opponent wins!');
            resetGame();
        }
    }

    // Function to end turn
    function endTurn() {
        playerTurn = !playerTurn;
        if (!playerTurn) {
            opponentTurn();
        }
    }

    // Function for opponent's turn
    function opponentTurn() {
        setTimeout(() => {
            const card = cards[Math.floor(Math.random() * cards.length)];
            addCardToHand(battlefield, card);
            attackPlayer(card.attack);
            endTurn();
        }, 1000);
    }

    // Function to attack player
    function attackPlayer(attack) {
        playerHealth -= attack;
        playerHealthElement.textContent = playerHealth;
        checkWinCondition();
    }

    // Function to reset game
    function resetGame() {
        playerHealth = 20;
        opponentHealth = 20;
        playerHealthElement.textContent = playerHealth;
        opponentHealthElement.textContent = opponentHealth;
        battlefield.innerHTML = '';
        playerHand.innerHTML = '';
        opponentHand.innerHTML = '';
        cards.forEach(card => {
            addCardToHand(playerHand, card);
            addCardToHand(opponentHand, card);
        });
    }

    const cards = [
        { name: 'Cerberus', attack: 8, defense: 7, rarity: 'Legendary' },
        { name: 'Hydra', attack: 7, defense: 6, rarity: 'Rare' },
        { name: 'Minotaur', attack: 6, defense: 5, rarity: 'Uncommon' },
        { name: 'Phoenix', attack: 9, defense: 4, rarity: 'Legendary' },
        { name: 'Griffin', attack: 7, defense: 5, rarity: 'Rare' },
        { name: 'Basilisk', attack: 6, defense: 4, rarity: 'Uncommon' },
        { name: 'Chimera', attack: 8, defense: 6, rarity: 'Legendary' },
        { name: 'Kraken', attack: 9, defense: 7, rarity: 'Legendary' },
        { name: 'Sphinx', attack: 5, defense: 5, rarity: 'Common' },
        { name: 'Cyclops', attack: 7, defense: 4, rarity: 'Rare' },
        { name: 'Gorgon', attack: 6, defense: 3, rarity: 'Uncommon' },
        { name: 'Manticore', attack: 8, defense: 5, rarity: 'Legendary' },
        { name: 'Harpy', attack: 5, defense: 4, rarity: 'Common' },
        { name: 'Leviathan', attack: 9, defense: 8, rarity: 'Legendary' },
        { name: 'Fenrir', attack: 8, defense: 7, rarity: 'Legendary' },
        { name: 'Jormungandr', attack: 7, defense: 6, rarity: 'Rare' },
        { name: 'NemeanLion', attack: 6, defense: 5, rarity: 'Uncommon' },
        { name: 'Pegasus', attack: 5, defense: 4, rarity: 'Common' },
        { name: 'Medusa', attack: 8, defense: 6, rarity: 'Legendary' },
        { name: 'Scylla', attack: 7, defense: 5, rarity: 'Rare' },
        { name: 'Charybdis', attack: 6, defense: 4, rarity: 'Uncommon' },
        { name: 'Typhon', attack: 9, defense: 7, rarity: 'Legendary' },
        { name: 'Echidna', attack: 8, defense: 6, rarity: 'Legendary' },
        { name: 'Orthrus', attack: 7, defense: 5, rarity: 'Rare' },
        { name: 'Ladon', attack: 6, defense: 4, rarity: 'Uncommon' },
        { name: 'Hippogriff', attack: 5, defense: 3, rarity: 'Common' },
        { name: 'Banshee', attack: 8, defense: 5, rarity: 'Legendary' },
        { name: 'Selkie', attack: 7, defense: 4, rarity: 'Rare' },
        { name: 'Kelpie', attack: 6, defense: 3, rarity: 'Uncommon' },
        { name: 'Wendigo', attack: 9, defense: 6, rarity: 'Legendary' },
        { name: 'Yeti', attack: 8, defense: 5, rarity: 'Legendary' },
        { name: 'Bigfoot', attack: 7, defense: 4, rarity: 'Rare' },
        { name: 'Chupacabra', attack: 6, defense: 3, rarity: 'Uncommon' },
        { name: 'Mothman', attack: 5, defense: 2, rarity: 'Common' },
        { name: 'JerseyDevil', attack: 8, defense: 4, rarity: 'Legendary' },
        { name: 'Thunderbird', attack: 7, defense: 3, rarity: 'Rare' },
        { name: 'Peryton', attack: 6, defense: 2, rarity: 'Uncommon' },
        { name: 'Ammit', attack: 9, defense: 5, rarity: 'Legendary' },
        { name: 'Anubis', attack: 8, defense: 4, rarity: 'Legendary' },
        { name: 'Bastet', attack: 7, defense: 3, rarity: 'Rare' },
        { name: 'Raiju', attack: 6, defense: 2, rarity: 'Uncommon' },
        { name: 'Kitsune', attack: 5, defense: 1, rarity: 'Common' },
        { name: 'Tengu', attack: 8, defense: 3, rarity: 'Legendary' },
        { name: 'Oni', attack: 7, defense: 2, rarity: 'Rare' },
        { name: 'Yurei', attack: 6, defense: 1, rarity: 'Uncommon' },
        { name: 'Nue', attack: 9, defense: 4, rarity: 'Legendary' },
        { name: 'Bakekujira', attack: 8, defense: 3, rarity: 'Legendary' },
        { name: 'Jorogumo', attack: 7, defense: 2, rarity: 'Rare' },
        { name: 'Kappa', attack: 6, defense: 1, rarity: 'Uncommon' },
        { name: 'YamataNoOrochi', attack: 5, defense: 0, rarity: 'Common' },
        { name: 'Quetzalcoatl', attack: 8, defense: 2, rarity: 'Legendary' },
        { name: 'Tezcatlipoca', attack: 7, defense: 1, rarity: 'Rare' },
        { name: 'Huitzilopochtli', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'Xolotl', attack: 9, defense: 3, rarity: 'Legendary' },
        { name: 'Tlaloc', attack: 8, defense: 2, rarity: 'Legendary' },
        { name: 'Cipactli', attack: 7, defense: 1, rarity: 'Rare' },
        { name: 'Ahuizotl', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'Camazotz', attack: 5, defense: 0, rarity: 'Common' },
        { name: 'Itzamna', attack: 8, defense: 1, rarity: 'Legendary' },
        { name: 'Kukulkan', attack: 7, defense: 0, rarity: 'Rare' },
        { name: 'AhPuch', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'IxChel', attack: 9, defense: 2, rarity: 'Legendary' },
        { name: 'Chaac', attack: 8, defense: 1, rarity: 'Legendary' },
        { name: 'Huracan', attack: 7, defense: 0, rarity: 'Rare' },
        { name: 'Zotz', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'Balam', attack: 5, defense: 0, rarity: 'Common' },
        { name: 'Alux', attack: 8, defense: 0, rarity: 'Legendary' },
        { name: 'Chaneque', attack: 7, defense: 0, rarity: 'Rare' },
        { name: 'EkChapat', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'Ixtab', attack: 9, defense: 1, rarity: 'Legendary' },
        { name: 'Pele', attack: 8, defense: 0, rarity: 'Legendary' },
        { name: 'Maui', attack: 7, defense: 0, rarity: 'Rare' },
        { name: 'Kanaloa', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'Ku', attack: 5, defense: 0, rarity: 'Common' },
        { name: 'Lono', attack: 8, defense: 0, rarity: 'Legendary' },
        { name: 'Hina', attack: 7, defense: 0, rarity: 'Rare' },
        { name: 'Kamohoalii', attack: 6, defense: 0, rarity: 'Uncommon' },
        { name: 'Mooinanea', attack: 9, defense: 1, rarity: 'Legendary' },]
    // Initialize game
    resetGame();

    // Event listener for end turn button
    endTurnButton.addEventListener('click', endTurn);
});