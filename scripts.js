document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const spinButton = document.getElementById('spin-btn');
    const manualButton = document.getElementById('manual-btn');
    const autoButton = document.getElementById('auto-btn');
    const betInput = document.getElementById('bet-input');
    const tokenCountElement = document.querySelector('.bet-value');
    const payoutDisplay = document.querySelector('.payout-display span');
    const reels = document.querySelectorAll('.reel');
    const symbols = document.querySelectorAll('.symbol');
    
    // Game variables
    let balance = 1000;
    let currentBet = 0.00;
    let isSpinning = false;
    let autoSpin = false;
    let selectedLines = 20;
    
    // Symbol definitions with probabilities and values
    const symbolTypes = [
        { name: 'coin', class: 'symbol-coin', value: 500, probability: 5 },
        { name: 'pharaoh', class: 'symbol-pharaoh', value: 300, probability: 10 },
        { name: 'scarab', class: 'symbol-scarab', value: 150, probability: 15 },
        { name: 'ankh', class: 'symbol-ankh', value: 100, probability: 20 },
        { name: 'blue-gem', class: 'symbol-blue-gem', value: 50, probability: 25 },
        { name: 'blue-spade', class: 'symbol-blue-spade', value: 30, probability: 30 },
        { name: 'purple-club', class: 'symbol-purple-club', value: 20, probability: 35 },
        { name: 'green-diamond', class: 'symbol-green-diamond', value: 10, probability: 40 }
    ];
    
    // Paylines configuration
    const paylines = [
        // Horizontal lines
        [0, 1, 2, 3, 4], // Top row
        [5, 6, 7, 8, 9], // Middle row
        [10, 11, 12, 13, 14], // Bottom row
        // V-shaped lines
        [0, 6, 12, 8, 4],
        [10, 6, 2, 8, 14],
        // Zigzag lines
        [0, 6, 2, 8, 4],
        [10, 6, 12, 8, 14],
        // And more complex patterns...
    ];
    
    // Initialize the game
    function initGame() {
        updateBalanceDisplay();
        initializeSymbols();
        
        // Event listeners
        spinButton.addEventListener('click', spin);
        manualButton.addEventListener('click', () => toggleMode('manual'));
        autoButton.addEventListener('click', () => toggleMode('auto'));
        betInput.addEventListener('input', updateBetAmount);
        
        // Half and double bet buttons
        document.querySelector('.half').addEventListener('click', () => adjustBet(0.5));
        document.querySelector('.double').addEventListener('click', () => adjustBet(2));
    }
    
    function initializeSymbols() {
        symbols.forEach(symbol => {
            const randomSymbol = getRandomSymbol();
            symbol.className = 'symbol ' + randomSymbol.class;
            symbol.dataset.name = randomSymbol.name;
            symbol.dataset.value = randomSymbol.value;
        });
    }
    
    function getRandomSymbol() {
        // Create probability array
        const probabilityArray = [];
        symbolTypes.forEach(symbol => {
            for (let i = 0; i < symbol.probability; i++) {
                probabilityArray.push(symbol);
            }
        });
        
        // Return random symbol based on probability
        return probabilityArray[Math.floor(Math.random() * probabilityArray.length)];
    }
    
    function toggleMode(mode) {
        if (mode === 'manual') {
            manualButton.classList.add('active');
            autoButton.classList.remove('active');
            autoSpin = false;
        } else {
            manualButton.classList.remove('active');
            autoButton.classList.add('active');
            autoSpin = true;
            autoSpinLoop();
        }
    }
    
    function updateBetAmount() {
        currentBet = parseFloat(betInput.value) || 0;
        document.querySelectorAll('.bet-value')[0].textContent = currentBet.toFixed(8) + ' LTC';
        
        // Update bet per line
        const betPerLine = (currentBet / selectedLines) || 0;
        document.querySelectorAll('.bet-value')[1].textContent = betPerLine.toFixed(8) + ' LTC';
    }
    
    function adjustBet(multiplier) {
        currentBet = parseFloat(betInput.value) || 0;
        currentBet = Math.max(0, currentBet * multiplier);
        betInput.value = currentBet.toFixed(2);
        updateBetAmount();
    }
    
    function updateBalanceDisplay() {
        tokenCountElement.textContent = balance.toFixed(8) + ' LTC';
    }
    
    function spin() {
        if (isSpinning || currentBet <= 0 || currentBet > balance) {
            // Can't spin if already spinning, no bet, or bet > balance
            return;
        }
        
        // Deduct bet amount
        balance -= currentBet;
        updateBalanceDisplay();
        
        isSpinning = true;
        spinButton.disabled = true;
        
        // Reset previous wins
        symbols.forEach(symbol => symbol.classList.remove('win'));
        payoutDisplay.textContent = 'Total Payout: $0.00';
        
        // Start spinning animation
        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            
            // Stagger the stopping of reels
            setTimeout(() => {
                stopReel(reel, index);
            }, 1000 + (index * 300));
        });
        
        // Check for wins after all reels have stopped
        setTimeout(checkWins, 2500);
    }
    
    function stopReel(reel, reelIndex) {
        reel.classList.remove('spinning');
        
        // Set new symbols
        const reelSymbols = reel.querySelectorAll('.symbol');
        reelSymbols.forEach((symbol, symbolIndex) => {
            const randomSymbol = getRandomSymbol();
            symbol.className = 'symbol ' + randomSymbol.class;
            symbol.dataset.name = randomSymbol.name;
            symbol.dataset.value = randomSymbol.value;
        });
    }
    
    function checkWins() {
        let totalWin = 0;
        
        // Check each active payline
        for (let i = 0; i < selectedLines; i++) {
            if (i < paylines.length) {
                const line = paylines[i];
                const lineSymbols = [];
                
                // Get symbols on this payline
                line.forEach(position => {
                    const row = Math.floor(position / 5);
                    const col = position % 5;
                    const symbolElement = document.getElementById(`symbol-${col}-${row}`);
                    lineSymbols.push(symbolElement);
                });
                
                // Check for matches
                const firstSymbol = lineSymbols[0].dataset.name;
                let matchCount = 1;
                
                for (let j = 1; j < lineSymbols.length; j++) {
                    if (lineSymbols[j].dataset.name === firstSymbol) {
                        matchCount++;
                    } else {
                        break;
                    }
                }
                
                // Calculate win for this line
                if (matchCount >= 3) {
                    const symbolValue = parseInt(lineSymbols[0].dataset.value);
                    const betPerLine = currentBet / selectedLines;
                    const lineWin = symbolValue * betPerLine * (matchCount - 2);
                    totalWin += lineWin;
                    
                    // Highlight winning symbols
                    for (let j = 0; j < matchCount; j++) {
                        lineSymbols[j].classList.add('win');
                    }
                }
            }
        }
        
        // Update balance and display
        if (totalWin > 0) {
            balance += totalWin;
            updateBalanceDisplay();
            payoutDisplay.textContent = `Total Payout: $${totalWin.toFixed(2)}`;
        }
        
        // Reset game state
        isSpinning = false;
        spinButton.disabled = false;
        
        // Continue auto-spin if enabled
        if (autoSpin) {
            setTimeout(spin, 1000);
        }
    }
    
    function autoSpinLoop() {
        if (autoSpin && balance >= currentBet) {
            spin();
            setTimeout(autoSpinLoop, 3000);
        } else {
            autoSpin = false;
            autoButton.classList.remove('active');
            manualButton.classList.add('active');
        }
    }
    
    // Initialize the game
    initGame();
});
