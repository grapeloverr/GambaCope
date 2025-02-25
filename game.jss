const reels = Array.from({ length: 15 }, (_, i) => document.getElementById(`reel${i + 1}`));
const spinButton = document.getElementById('spin-btn');
const tokenCountElement = document.getElementById('token-count');
const resultTextElement = document.getElementById('result-text');
const bonusInfoElement = document.getElementById('bonus-info');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const bonusSound = document.getElementById('bonus-sound');

let tokens = 1000;
const spinCost = 10;
let isSpinning = false;
let freeSpins = 0;
let currentMultiplier = 1;
const userId = 'YOUR_USER_ID';

const symbols = [
    { symbol: '🍒', value: 50, probability: 30 },
    { symbol: '🍋', value: 100, probability: 20 },
    { symbol: '🔔', value: 150, probability: 15 },
    { symbol: '💎', value: 300, probability: 10 },
    { symbol: '7️⃣', value: 500, probability: 5 },
    { symbol: '❓', value: 0, probability: 20 },
    { symbol: '🍇', value: 0, probability: 5 }
];

const multipliers = [2, 4, 8, 16, 32];

function updateTokenDisplay() {
    tokenCountElement.textContent = tokens;
}

function checkDailyReward() {
    const now = new Date();
    const lastRewardDate = localStorage.getItem('lastDailyReward');
    if (!lastRewardDate || (now - new Date(lastRewardDate)) >= 86400000) {
        tokens += 333;
        fetch('/update-tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, tokens })
        });
        updateTokenDisplay();
        localStorage.setItem('lastDailyReward', now.toISOString());
        resultTextElement.textContent = "Daily reward claimed! +333 tokens";
        resultTextElement.style.color = "#ffeb3b";
        winSound.play();
    }
}

async function spinReels() {
    const results = Array.from({ length: 15 }, () => getRandomSymbol());
    const spinDuration = 2000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        reels.forEach((reel, i) => {
            if (progress < 0.7 + (Math.floor(i / 5) * 0.1)) {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)].symbol;
                reel.classList.add('spinning');
            } else {
                reel.textContent = results[i].symbol;
                reel.classList.remove('spinning');
            }
        });

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            checkWin(results);
            isSpinning = false;
            spinButton.disabled = false;
        }
    }

    animate();
}

function getRandomSymbol() {
    const probabilityArray = [];
    symbols.forEach(item => {
        for (let i = 0; i < item.probability; i++) {
            probabilityArray.push(item);
        }
    });
    return probabilityArray[Math.floor(Math.random() * probabilityArray.length)];
}

function checkWin(results) {
    const winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], [9, 12, 13], [10, 13, 14],
        [0, 4, 8], [2, 4, 6], [9, 11, 13], [10, 12, 14]
    ];

    let winAmount = 0;
    let bonusTriggered = false;

    winLines.forEach(line => {
        const [a, b, c] = line;
        if (results[a].symbol === results[b].symbol && results[b].symbol === results[c].symbol) {
            if (results[a].symbol === '🍇') {
                bonusTriggered = true;
            } else {
                winAmount += results[a].value;
                reels[a].classList.add('winning');
                reels[b].classList.add('winning');
                reels[c].classList.add('winning');
            }
        }
    });

    if (bonusTriggered) {
        triggerBonusRound();
    } else if (winAmount > 0) {
        tokens += winAmount * currentMultiplier;
        fetch('/update-tokens', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, tokens })
        });
        updateTokenDisplay();
        resultTextElement.textContent = `Winner! +${winAmount * currentMultiplier} tokens`;
        resultTextElement.style.color = "#4caf50";
        winSound.play();
        setTimeout(() => {
            reels.forEach(reel => reel.classList.remove('winning'));
        }, 1000);
    } else {
        winLines.forEach(line => {
            const [a, b, c] = line;
            if (results[a].symbol === results[b].symbol ||
                results[b].symbol === results[c].symbol ||
                results[a].symbol === results[c].symbol) {
                tokens += 5 * currentMultiplier;
                fetch('/update-tokens', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, tokens })
                });
                updateTokenDisplay();
                resultTextElement.textContent = `Two matches! +${5 * currentMultiplier} tokens`;
                resultTextElement.style.color = "#2196f3";
                winSound.play();
                return;
            }
        });
        resultTextElement.textContent = "Try again!";
        resultTextElement.style.color = "#ff9800";
    }
}

function triggerBonusRound() {
    freeSpins = 10;
    currentMultiplier = 2;
    bonusInfoElement.textContent = "Bonus Round! 10 Free Spins with increasing multipliers!";
    spinButton.textContent = "SPIN (Free Spin)";
    spinButton.disabled = false;
    isSpinning = false;
    bonusSound.play();

    const multiplierDisplay = document.createElement('div');
    multiplierDisplay.classList.add('multiplier');
    multiplierDisplay.textContent = `Multiplier: x${currentMultiplier}`;
    document.body.appendChild(multiplierDisplay);

    const updateMultiplier = () => {
        if (freeSpins > 0) {
            currentMultiplier = multipliers[Math.min(Math.floor(Math.random() * multipliers.length), freeSpins - 1)];
            multiplierDisplay.textContent = `Multiplier: x${currentMultiplier}`;
        } else {
            document.body.removeChild(multiplierDisplay);
        }
    };

    const originalSpin = spinReels;
    spinReels = () => {
        updateMultiplier();
        originalSpin();
    };

    setTimeout(() => {
        document.body.removeChild(multiplierDisplay);
        spinReels = originalSpin;
    }, 10000);
}

spinButton.addEventListener('click', async () => {
    if (isSpinning) return;

    if (tokens < spinCost && freeSpins === 0) {
        resultTextElement.textContent = "Not enough tokens!";
        resultTextElement.style.color = "#ff5252";
        return;
    }

    if (freeSpins === 0) {
        await fetch('/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, betAmount: spinCost })
        });
        tokens -= spinCost;
        updateTokenDisplay();
    } else {
        freeSpins--;
        if (freeSpins === 0) {
            spinButton.textContent = "SPIN (10 tokens)";
            bonusInfoElement.textContent = "";
        }
    }

    isSpinning = true;
    spinButton.disabled = true;
    resultTextElement.textContent = "";
    spinSound.play();
    spinReels();
});

updateTokenDisplay();
checkDailyReward();
