// Game variables
let tokens = 1000;
const spinCost = 10;
let isSpinning = false;
let multiplier = 1;

// Symbols with their probabilities and values
const symbols = [
    { symbol: '♠', value: 50, probability: 30 },
    { symbol: '♥', value: 100, probability: 20 },
    { symbol: '♦', value: 150, probability: 15 },
    { symbol: '♣', value: 300, probability: 10 },
    { symbol: '★', value: 500, probability: 5 },
    { symbol: '⚡', value: 1000, probability: 3 },
    { symbol: '♞', value: 2000, probability: 2 },
    { symbol: '♟', value: 5000, probability: 1 },
    { symbol: '❓', value: 0, probability: 24 }
];

// Initialize
updateTokenDisplay();

// Spin button click event
document.getElementById('spin-btn').addEventListener('click', () => {
    if (isSpinning) return;
    
    if (tokens < spinCost) {
        document.getElementById('result-text').textContent = "Not enough tokens!";
        document.getElementById('result-text').style.color = "#ff5252";
        return;
    }
    
    // Deduct tokens
    tokens -= spinCost;
    updateTokenDisplay();
    
    // Start spinning
    isSpinning = true;
    document.getElementById('spin-btn').disabled = true;
    document.getElementById('result-text').textContent = "";
    
    // Animate reels
    spinReels();
});

// Auto spin functionality
document.getElementById('auto-spin-btn').addEventListener('click', () => {
    let autoSpin = !autoSpin;
    if (autoSpin) {
        document.getElementById('auto-spin-btn').textContent = "Stop Auto Spin";
        document.getElementById('spin-btn').disabled = true;
        autoSpinLoop();
    } else {
        document.getElementById('auto-spin-btn').textContent = "Auto Spin";
        document.getElementById('spin-btn').disabled = false;
    }
});

function autoSpinLoop() {
    if (autoSpin && tokens >= spinCost) {
        document.getElementById('spin-btn').click();
        setTimeout(autoSpinLoop, 2000); // Spin every 2 seconds
    }
}

function spinReels() {
    // Generate final results first
    const results = Array.from({length: 36}, () => getRandomSymbol());
    
    // Animation variables
    const spinDuration = 2000; // 2 seconds
    const startTime = Date.now();
    
    // Animation function
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Update reels with random symbols during animation
        document.querySelectorAll('.reel').forEach((reel, index) => {
            // Stop reels one by one
            if (progress < 0.7 + (index % 6 * 0.1)) {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)].symbol;
            } else {
                // Show final result
                reel.textContent = results[index].symbol;
            }
        });
        
        // Continue animation or end
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete, check for wins
            checkWin(results);
            isSpinning = false;
            document.getElementById('spin-btn').disabled = false;
        }
    }
    
    // Start animation
    animate();
}

function getRandomSymbol() {
    // Create array based on probabilities
    const probabilityArray = [];
    
    for (const item of symbols) {
        for (let i = 0; i < item.probability; i++) {
            probabilityArray.push(item);
        }
    }
    
    // Return random symbol
    return probabilityArray[Math.floor(Math.random() * probabilityArray.length)];
}

function checkWin(results) {
    // Check for horizontal lines, diagonal clusters, and mystery bonuses
    let winAmount = 0;
    let winMessage = "";
    
    // Horizontal lines
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            const line = results.slice(row * 6 + col, row * 6 + col + 3);
            if (line.every(symbol => symbol.symbol === line[0].symbol && symbol.symbol !== '❓')) {
                winAmount += line[0].value * multiplier;
                winMessage += `Horizontal win: ${line[0].symbol} x3 = ${line[0].value * multiplier} tokens. `;
            }
        }
    }
    
    // Diagonal clusters
    // Implement diagonal win check here
    
    // Mystery bonuses
    // Implement mystery bonus check here
    
    if (winAmount > 0) {
        tokens += winAmount;
        updateTokenDisplay();
        document.getElementById('result-text').textContent = winMessage + `Total win: +${winAmount} tokens`;
        document.getElementById('result-text').style.color = "#4caf50";
        multiplier++;
    } else {
        document.getElementById('result-text').textContent = "Try again!";
        document.getElementById('result-text').style.color = "#ff9800";
        multiplier = 1;
    }
}

function updateTokenDisplay() {
    document.getElementById('token-count').textContent = tokens;
}
