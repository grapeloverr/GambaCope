// Game Variables
let balance = 1000; // Starting balance
const betInput = document.getElementById('bet-input');
const linesInput = document.getElementById('lines-input');
const spinButton = document.getElementById('spin-btn');
const balanceDisplay = document.getElementById('balance');
const payoutDisplay = document.getElementById('payout');

// Symbols for the reels
const symbols = ['💎', '👑', '🐪', '🦂', '🔷', '💰'];

// Initialize Reels
const reels = Array.from(document.querySelectorAll('.reel'));
function initializeReels() {
    reels.forEach(reel => {
        reel.innerHTML = ''; // Clear the reel
        for (let i = 0; i < 10; i++) { // Add random symbols to each reel
            const symbolDiv = document.createElement('div');
            symbolDiv.classList.add('symbol');
            symbolDiv.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            reel.appendChild(symbolDiv);
        }
    });
}
initializeReels();

// Spin Functionality
function spinReels() {
    const betAmount = parseFloat(betInput.value) || 0;

    // Validation
    if (betAmount <= 0) {
        alert('Please enter a valid bet amount.');
        return;
    }
    
    if (balance - betAmount < 0) {
        alert('Insufficient balance!');
        return;
    }

    // Deduct bet from balance
    balance -= betAmount;

    // Animate reels
    reels.forEach((reel, index) => {
        setTimeout(() => {
            reel.style.transition = 'transform 1s ease-in-out';
            reel.style.transform = 'translateY(-100%)';

            setTimeout(() => {
                reel.style.transition = 'none';
                reel.style.transform = 'translateY(0)';
                initializeReels(); // Reset symbols after spinning
            }, 1000);
        }, index * 200); // Staggered start for each reel
    });

    // Calculate winnings after spin finishes
    setTimeout(() => calculateWinnings(betAmount), reels.length * 200 + 1000);
}

// Calculate Winnings
function calculateWinnings(betAmount) {
    const lines = parseInt(linesInput.value);
    
    // Simple logic to calculate winnings (e.g., random chance of winning)
    const winChance = Math.random();
    
    let payout = winChance > 0.7 ? betAmount * lines * Math.random() : 0; // Random payout multiplier for simplicity

    
     payoutDisplay.textContent = payout.toFixed(2);
}

// Event Listener for Spin Button
spinButton.addEventListener('click', spinReels);
