const gameConfig = {
    symbols: [
        { icon: '⚡', weight: 5, multipliers: [0, 2, 5, 10, 25] },
        { icon: '♦', weight: 15, multipliers: [0, 1, 3, 5, 10] },
        { icon: '♠', weight: 30, multipliers: [0, 0, 2, 4, 8] },
        // Add more symbols
    ],
    paylines: [
        [1,1,1,1,1], // Center line
        [0,0,0,0,0], // Top line
        [2,2,2,2,2], // Bottom line
        // Additional paylines
    ],
    baseBet: 10
};

let gameState = {
    balance: 1000,
    currentBet: gameConfig.baseBet,
    isSpinning: false
};

function spinReels() {
    if (gameState.isSpinning) return;
    gameState.isSpinning = true;
    
    const reels = Array.from(document.querySelectorAll('.reel'));
    const spinPromises = reels.map((reel, index) => {
        return new Promise(resolve => {
            const symbols = reel.querySelectorAll('.symbol');
            symbols.forEach(symbol => {
                const randomSymbol = getWeightedSymbol();
                symbol.textContent = randomSymbol.icon;
                symbol.dataset.value = randomSymbol.multipliers;
            });
            
            reel.style.animation = 'reel-spin 3s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                reel.style.animation = '';
                resolve();
            }, 3000 + (index * 150));
        });
    });

    Promise.all(spinPromises).then(checkWins);
}

function getWeightedSymbol() {
    const totalWeight = gameConfig.symbols.reduce((sum, sym) => sum + sym.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const symbol of gameConfig.symbols) {
        if (random < symbol.weight) return symbol;
        random -= symbol.weight;
    }
}

function checkWins() {
    const visibleSymbols = Array.from(document.querySelectorAll('.symbol'))
        .map(sym => sym.textContent);
    
    let totalWin = 0;
    gameConfig.paylines.forEach(line => {
        const lineSymbols = line.map((row, reel) => 
            visibleSymbols[reel * 3 + row]);
        
        const firstSymbol = lineSymbols[0];
        if (lineSymbols.every(sym => sym === firstSymbol)) {
            const symbolConfig = gameConfig.symbols.find(s => s.icon === firstSymbol);
            const multiplier = symbolConfig.multipliers[lineSymbols.length - 1];
            totalWin += gameState.currentBet * multiplier;
        }
    });

    gameState.balance += totalWin;
    gameState.isSpinning = false;
    updateUI();
}

function updateUI() {
    document.getElementById('balance').textContent = gameState.balance;
    document.getElementById('current-bet').textContent = gameState.currentBet;
}

document.getElementById('spin-button').addEventListener('click', spinReels);
// Add bet adjustment handlers
