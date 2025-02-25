<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Golden Fortune Slots</title>
    <style>
        /* Base styles remain similar */
        
        /* New Animation Styles */
        @keyframes reelSpin {
            0% { transform: translateY(0); }
            100% { transform: translateY(-1000px); }
        }

        @keyframes winFlash {
            0%, 100% { background-color: #333; }
            50% { background-color: #4caf50; }
        }

        .reel {
            position: relative;
            overflow: hidden;
        }

        .symbols-column {
            transition: transform 2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .win-animation {
            animation: winFlash 0.5s 3;
        }

        .bonus-screen {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            display: none;
            z-index: 1000;
        }

        .bonus-wheel {
            width: 250px;
            height: 250px;
            border-radius: 50%;
            background: conic-gradient(
                #ff5722 0deg 90deg,
                #4caf50 90deg 180deg,
                #2196f3 180deg 270deg,
                #ffc107 270deg 360deg
            );
            margin: 1rem auto;
            transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        /* Enhanced Win Animation */
        .win-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }

        .win-content {
            text-align: center;
            color: white;
            font-size: 3rem;
            text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Golden Fortune Slots</h1>
        
        <div class="tokens">
            Tokens: <span id="token-count">1000</span> 
            | Jackpot: <span id="jackpot">5000</span>
        </div>

        <div class="slot-machine">
            <div class="reel" id="reel1"></div>
            <div class="reel" id="reel2"></div>
            <div class="reel" id="reel3"></div>
        </div>

        <button id="spin-btn">SPIN (10 tokens)</button>
        
        <!-- Bonus Elements -->
        <div class="bonus-screen" id="bonusScreen">
            <h2>BONUS WHEEL!</h2>
            <div class="bonus-wheel" id="bonusWheel"></div>
            <p id="bonusResult"></p>
        </div>

        <div class="win-overlay" id="winOverlay">
            <div class="win-content">
                <div class="win-text">WINNER!</div>
                <div class="win-amount">+500</div>
            </div>
        </div>
    </div>

    <script>
        const symbols = ['🍒', '🍋', '🔔', '💎', '7️⃣', '⭐'];
        const reelElements = [document.getElementById('reel1'), 
                            document.getElementById('reel2'), 
                            document.getElementById('reel3')];
        
        // Initialize reels with symbols
        reelElements.forEach(reel => {
            const symbolsColumn = document.createElement('div');
            symbolsColumn.className = 'symbols-column';
            
            // Create multiple symbol copies for seamless animation
            for(let i = 0; i < 20; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                symbolsColumn.appendChild(symbol);
            }
            
            reel.appendChild(symbolsColumn);
        });

        // Bonus Wheel Logic
        function spinBonusWheel() {
            const wheel = document.getElementById('bonusWheel');
            const rotations = Math.random() * 1440 + ;
            
            
            
            
            
            
            
            
            
            
            
            
            360 * Math.random();
            
            
            
            
            
            
            
            
            360 * Math.random();
wheel.style.transform = `rotate(${rotations}deg)`;

setTimeout(() => {
const result = Math.floor((rotations % ) / );
const prizes = ['+500 TOKENS', 'FREE SPINS x10', 'JACKPOT!', '2X MULTIPLIER'];
document.getElementById('bonusResult').textContent = prizes[result];

// Apply rewards
switch(result) {
case : tokens += ; break;
case : freeSpins += ; break;
case : tokens += jackpot; break;
case : multiplier = ; break;
}
updateTokenDisplay();
}, );
}

// Enhanced Spin Logic
document.getElementById('spin-btn').addEventListener('click', async function() {
    if(isSpinning) return;

    // Deduct tokens
    tokens -= spinCost;
    updateTokenDisplay();
    
    // Start spinning animation
    isSpinning = true;
    this.disabled = true;

    // Generate final results
    const results = [];
    for(let i = ; i < ; i++) {
results.push(getRandomSymbol());
}

// Animate reels
const animations = [];
for(let i = ; i < reelElements.length; i++) {
const reel = reelElements[i];
const finalPosition = -100 * (Math.floor(Math.random() * ) + );

animations.push(new Promise(resolve => {
reel.style.transition = '';
reel.style.transform = `translateY(${finalPosition}px)`;
setTimeout(() => resolve(), );
}));
}

await Promise.all(animations);

// Check for bonus trigger
if(results.filter(s => s === '⭐').length >= ) {
document.getElementById('bonusScreen').style.display = 'block';
spinBonusWheel();
}

// Check wins
checkWin(results);

isSpinning = false;
this.disabled = false;

// Progressive Jackpot
jackpot += ;
document.getElementById('jackpot').textContent = jackpot;

// Sound Effects
const audio = new Audio('spin_sound.mp3');
audio.play();
});

function checkWin(results) {
// Existing win logic plus:
if(results[ ] === results[ ] && results[ ] === results[ ]) {
showWinAnimation(results[ ].value);
}
}

function showWinAnimation(amount) {
const winOverlay = document.getElementById('winOverlay');
winOverlay.style.display = 'flex';
document.querySelector('.win-amount').textContent = `+${amount}`;

setTimeout(() => {
winOverlay.style.display = 'none';
}, );
}

// Mobile Optimization
function handleResize() {
const isMobile = window.innerWidth <= ;
document.querySelectorAll('.reel').forEach(reel => {
reel.style.width = isMobile ? '60px' : '80px';
reel.style.height = isMobile ? '90px' : '120px';
});
}
window.addEventListener('resize', handleResize);
handleResize();
    </script>
</body>
</html>
