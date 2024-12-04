const readline = require('readline');

// Setup command line interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Card deck setup
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const deck = [];

// Function to shuffle the deck
function shuffleDeck() {
    deck.length = 0;
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }

    // Shuffle using Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to create ASCII art for the card
function cardToASCII(card) {
    const rank = card.rank;
    const suit = card.suit;

    return [
        ` _____    `,
        `|${rank.padStart(2, ' ')} ${suit}|  `,
        `|     |  `,
        `| ${rank.padStart(2, ' ')} ${suit}|  `,
        `|_____ |  `
    ];
}

// Function to display the cards side-by-side
function displayCards(hand, who) {
    let cardLines = ["", "", "", "", ""];
    hand.forEach(card => {
        const cardArt = cardToASCII(card);
        cardArt.forEach((line, index) => {
            cardLines[index] += line + "  ";
        });
    });

    console.log(`${who} cards:`);
    cardLines.forEach(line => console.log(line));
}

// Function to evaluate a poker hand
function getHandRanking(hand) {
    const sortedHand = hand.slice().sort((a, b) => {
        const rankOrder = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
            '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return rankOrder[a.rank] - rankOrder[b.rank];
    });

    // Check for flush (same suit)
    const isFlush = sortedHand.every(card => card.suit === sortedHand[0].suit);

    // Check for straight (consecutive ranks)
    const isStraight = sortedHand.every((card, index) => {
        if (index === 0) return true;
        const rankOrder = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
            '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return rankOrder[card.rank] === rankOrder[sortedHand[index - 1].rank] + 1;
    });

    // Check for Royal Flush (A, K, Q, J, 10 of same suit)
    if (isFlush && isStraight && sortedHand[0].rank === '10' && sortedHand[1].rank === 'J' && sortedHand[2].rank === 'Q' && sortedHand[3].rank === 'K' && sortedHand[4].rank === 'A') {
        return 'Royal Flush';
    }

    // Check for Straight Flush
    if (isFlush && isStraight) {
        return 'Straight Flush';
    }

    // Check for Four of a Kind
    const rankCounts = {};
    sortedHand.forEach(card => {
        rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });
    if (Object.values(rankCounts).includes(4)) {
        return 'Four of a Kind';
    }

    // Check for Full House (three of a kind and a pair)
    if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) {
        return 'Full House';
    }

    // Check for Flush
    if (isFlush) {
        return 'Flush';
    }

    // Check for Straight
    if (isStraight) {
        return 'Straight';
    }

    // Check for Three of a Kind
    if (Object.values(rankCounts).includes(3)) {
        return 'Three of a Kind';
    }

    // Check for Two Pair
    if (Object.values(rankCounts).filter(count => count === 2).length === 2) {
        return 'Two Pair';
    }

    // Check for One Pair
    if (Object.values(rankCounts).includes(2)) {
        return 'One Pair';
    }

    return 'High Card';
}

// Function to display the winner
function displayWinner(playerHand, dealerHand, playerRank, dealerRank) {
    console.log(`\nYour hand: ${playerRank}`);
    console.log(`Dealer's hand: ${dealerRank}\n`);

    if (playerRank === dealerRank) {
        console.log("It's a tie!");
    } else if (playerRank > dealerRank) {
        console.log('You win!');
    } else {
        console.log('Dealer wins!');
    }

    console.log("Press any key to exit...");
}

// Function to start the game
function startGame() {
    shuffleDeck();

    // Deal 5 cards to the player and the dealer
    const playerHand = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
    const dealerHand = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];

    // Display the cards
    displayCards(playerHand, 'Your');
    displayCards(dealerHand, 'Dealer');

    // Determine hand rankings
    const playerRank = getHandRanking(playerHand);
    const dealerRank = getHandRanking(dealerHand);

    // Display the winner
    displayWinner(playerHand, dealerHand, playerRank, dealerRank);

    rl.close();
}

startGame();
