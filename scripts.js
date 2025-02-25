// Animation utilities for the slot machine

// Show win animation
function showWinAnimation(amount) {
    const winOverlay = document.querySelector('.win-overlay');
    const winAmount = document.querySelector('.win-amount');
    const winText = document.querySelector('.win-text');
    
    // Set win amount
    winAmount.textContent = `+${amount}`;
    
    // Set win text based on amount
    if (amount >= 500) {
        winText.textContent = 'MEGA WIN';
        winText.classList.add('big-win-pulse');
    } else if (amount >= 200) {
        winText.textContent = 'BIG WIN';
        winText.classList.add('big-win-pulse');
    } else {
        winText.textContent = 'WIN';
        winText.classList.remove('big-win-pulse');
    }
    
    // Show overlay with fade-in
    winOverlay.style.opacity = '0';
    winOverlay.classList.add('active');
    setTimeout(() => {
        winOverlay.style.opacity = '1';
    }, 50);
    
    // Hide after delay with fade-out
    setTimeout(() => {
        winOverlay.style.opacity = '0';
        setTimeout(() => {
            winOverlay.classList.remove('active');
            winText.classList.remove('big-win-pulse');
        }, 500);
    }, 2500);
}

// Show bonus activation animation
function showBonusAnimation() {
    const bonusOverlay = document.querySelector('.bonus-overlay');
    const bonusTitle = document.querySelector('.bonus-title');
    const bonusSubtitle = document.querySelector('.bonus-subtitle');
    const bonusMultiplier = document.querySelector('.bonus-multiplier');
    
    // Add activation class with staggered timing
    bonusOverlay.classList.add('active');
    
    setTimeout(() => {
        bonusTitle.classList.add('bonus-activation');
        
        setTimeout(() => {
            bonusSubtitle.classList.add('bonus-activation');
            
            setTimeout(() => {
                bonusMultiplier.classList.add('bonus-activation');
            }, 300);
        }, 300);
    }, 200);
    
    // Play bonus activation sound
    playBonusSound();
    
    // Hide after delay
    setTimeout(() => {
        bonusOverlay.style.opacity = '0';
        
        setTimeout(() => {
            bonusOverlay.classList.remove('active');
            bonusTitle.classList.remove('bonus-activation');
            bonusSubtitle.classList.remove('bonus-activation');
            bonusMultiplier.classList.remove('bonus-activation');
            bonusOverlay.style.opacity = '1';
        }, 500);
    }, 4000);
}

// Create enhanced particle burst
function createParticleBurst(element, color, intensity = 1) {
    const particleCount = Math.floor(30 * intensity);
    Utils.createParticles(element, particleCount, color);
    
    // Add shockwave effect
    const shockwave = document.createElement('div');
    shockwave.classList.add('shockwave');
    shockwave.style.setProperty('--shockwave-color', color);
    
    const rect = element.getBoundingClientRect();
    shockwave.style.left = `${rect.left + rect.width/2}px`;
    shockwave.style.top = `${rect.top + rect.height/2}px`;
    
    document.body.appendChild(shockwave);
    
    // Remove shockwave after animation completes
    setTimeout(() => {
        shockwave.remove();
    }, 1000);
}

// Play sound effects
function playSpinSound() {
    const audio = new Audio('assets/audio/spin.mp3');
    audio.volume = 0.7;
    audio.play();
}

function playWinSound(amount) {
    let sound;
    if (amount >= 500) {
        sound = 'assets/audio/big_win.mp3';
    } else if (amount >= 200) {
        sound = 'assets/audio/medium_win.mp3';
    } else {
        sound = 'assets/audio/small_win.mp3';
    }
    
    const audio = new Audio(sound);
    audio.volume = 0.8;
    audio.play();
}

function playBonusSound() {
    const audio = new Audio('assets/audio/bonus_trigger.mp3');
    audio.volume = 0.9;
    audio.play();
}

function playButtonSound() {
    const audio = new Audio('assets/audio/button_click.mp3');
    audio.volume = 0.5;
    audio.play();
}

// Export animation functions
window.Animations = {
    showWinAnimation,
    showBonusAnimation,
    createParticleBurst,
    playSpinSound,
    playWinSound,
    playBonusSound,
    playButtonSound
};

// Bonus feature management
let bonusSymbolsCollected = 0;
let bonusSpinsRemaining = 0;
let isBonusActive = false;

// Initialize bonus display
function initBonus() {
    updateBonusDisplay();
}

// Update the bonus display
function updateBonusDisplay() {
    const bonusBar = document.querySelector('.bonus-bar');
    const bonusCount = document.querySelector('.bonus-count');
    
    // Update progress bar with smooth animation
    const progressPercentage = (bonusSymbolsCollected / 3) * 100;
    bonusBar.style.width = `${progressPercentage}%`;
    
    // Update count
    bonusCount.textContent = `${bonusSymbolsCollected}/3`;
    
    // Add pulse effect if close to triggering
    if (bonusSymbolsCollected === 2) {
        bonusCount.classList.add('bonus-pulse');
    } else {
        bonusCount.classList.remove('bonus-pulse');
    }
}

// Add bonus symbols
function addBonusSymbols(count) {
    const previousCount = bonusSymbolsCollected;
    bonusSymbolsCollected += count;
    
    // Cap at 3
    if (bonusSymbolsCollected > 3) {
        bonusSymbolsCollected = 3;
    }
    
    // Check if bonus should activate
    if (bonusSymbolsCollected >= 3 && !isBonusActive) {
        activateBonus();
    } else {
        // Only update display if we didn't activate bonus
        if (bonusSymbolsCollected < 3) {
            updateBonusDisplay();
            
            // Play sound if we collected a new bonus symbol
            if (bonusSymbolsCollected > previousCount) {
                const audio = new Audio('assets/audio/bonus_collect.mp3');
                audio.volume = 0.7;
                audio.play();
            }
        }
    }
}

// Activate bonus feature
function activateBonus() {
    isBonusActive = true;
    bonusSpinsRemaining = 10;
    bonusSymbolsCollected = 0;
    
    // Set bonus multiplier
    Multiplier.setBonusMultiplier(3);
    
    // Update display
    updateBonusDisplay();
    
    // Show bonus animation
    Animations.showBonusAnimation();
    
    // Update UI to show bonus mode
    document.querySelector('.game-container').classList.add('bonus-mode');
    document.querySelector('.spin-btn').textContent = 'FREE SPIN';
    
    // Update spins counter
    updateBonusSpinsCounter();
}

// Process a bonus spin
function processBonusSpin() {
    bonusSpinsRemaining--;
    
    // Update spins counter
    updateBonusSpinsCounter();
    
    // Check if bonus is over
    if (bonusSpinsRemaining <= 0) {
        endBonus();
    }
}

// Update bonus spins counter
function updateBonusSpinsCounter() {
    // Create or update the counter
    let counter = document.querySelector('.bonus-spins-counter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.classList.add('bonus-spins-counter');
        document.querySelector('.game-controls').appendChild(counter);
    }
    
    counter.textContent = `FREE SPINS: ${bonusSpinsRemaining}`;
    
    // Add pulse animation on low spins
    if (bonusSpinsRemaining <= 3) {
        counter.classList.add('low-spins');
    } else {
        counter.classList.remove('low-spins');
    }
}

// End bonus feature
function endBonus() {
    isBonusActive = false;
    bonusSpinsRemaining = 0;
    
    // Reset bonus multiplier
    Multiplier.resetBonusMultiplier();
    
    // Update display
    updateBonusDisplay();
    
    // Update UI to exit bonus mode
    document.querySelector('.game-container').classList.remove('bonus-mode');
    document.querySelector('.spin-btn').textContent = 'SPIN';
    
    // Remove spins counter
    const counter = document.querySelector('.bonus-spins-counter');
    if (counter) {
        counter.remove();
    }
    
    // Show end bonus message
    const message = document.createElement('div');
    message.classList.add('end-bonus-message');
    message.textContent = 'BONUS ROUND COMPLETE';
    document.querySelector('.game-container').appendChild(message);
    
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
            message.remove();
        }, 1000);
    }, 2000);
}

// Check if bonus is active
function isInBonus() {
    return isBonusActive;
}

// Get remaining bonus spins
function getRemainingBonusSpins() {
    return bonusSpinsRemaining;
}

// Export bonus functions
window.Bonus = {
    initBonus,
    addBonusSymbols,
    processBonusSpin,
    isInBonus,
    getRemainingBonusSpins
};

// Main game logic
let balance = 1000;
let currentBet = 50;
let isSpinning = false;
let autoSpinActive = false;
let autoSpinCount = 0;
let maxBet = 500;
let minBet = 10;

// Initialize the game
function initGame() {
    // Initialize UI elements
    updateBalanceDisplay();
    updateBetDisplay();
    
    // Initialize grid
    Grid.initializeGrid();
    
    // Initialize multiplier
    Multiplier.initMultiplier();
    
    // Initialize bonus
    Bonus.initBonus();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add symbol values to the info panel
    populateSymbolValues();
    
    // Show welcome message
    showWelcomeMessage();
}

// Show welcome message
function showWelcomeMessage() {
    const message = document.createElement('div');
    message.classList.add('welcome-message');
    message.innerHTML = `
        <h2>DARK FORTUNE</h2>
        <p>Match 3+ symbols to win!</p>
        <p>Collect bonus symbols for FREE SPINS!</p>
    `;
    document.querySelector('.game-container').appendChild(message);
    
    setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
            message.remove();
        }, 1000);
    }, 3000);
}

// Set up event listeners
function setupEventListeners() {
    // Spin button
    document.getElementById('spin-button').addEventListener('click', () => {
        if (!isSpinning) {
            Animations.playButtonSound();
            spin();
        }
    });
    
    // Bet controls
    document.getElementById('increase-bet').addEventListener('click', () => {
        if (!isSpinning) {
            increaseBet();
            Animations.playButtonSound();
        }
    });
    
    document.getElementById('decrease-bet').addEventListener('click', () => {
        if (!isSpinning) {
            decreaseBet();
            Animations.playButtonSound();
        }
    });
    
    // Max bet button
    document.getElementById('max-bet').addEventListener('click', () => {
        if (!isSpinning) {
            setMaxBet();
            Animations.playButtonSound();
        }
    });
    
    // Auto spin button
    document.getElementById('auto-spin').addEventListener('click', () => {
        toggleAutoSpin();
        Animations.playButtonSound();
    });
    
    // Info button
    document.getElementById('info-button').addEventListener('click', () => {
        toggleInfoPanel();
        Animations.playButtonSound();
    });
    
    // Close info button
    document.getElementById('close-info').addEventListener('click', () => {
        toggleInfoPanel();
        Animations.playButtonSound();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isSpinning) {
            spin();
            e.preventDefault();
        }
    });
}

// Populate symbol values in the info panel
function populateSymbolValues() {
    const symbolValuesContainer = document.querySelector('.symbol-values');
    
    // Clear existing content
    symbolValuesContainer.innerHTML = '';
    
    // Add each symbol and its value
    for (const symbol of Object.values(Symbols.SYMBOLS)) {
        if (symbol.isBonus) continue; // Skip bonus symbol
        
        const symbolElement = document.createElement('div');
        symbolElement.classList.add('symbol-value-item');
        
        symbolElement.innerHTML = `
            <div class="symbol-image" style="background-image: url(${symbol.image})"></div>
            <div class="symbol-value-text">${symbol.value}</div>
        `;
        
        symbolValuesContainer.appendChild(symbolElement);
    }
    
    // Add bonus symbol separately
    const bonusSymbol = Symbols.SYMBOLS.BONUS;
    const bonusElement = document.createElement('div');
    bonusElement.classList.add('symbol-value-item', 'bonus-item');
    
    bonusElement.innerHTML = `
        <div class="symbol-image" style="background-image: url(${bonusSymbol.image})"></div>
        <div class="symbol-value-text">BONUS</div>
    `;
    
    symbolValuesContainer.appendChild(bonusElement);
}

// Spin the reels
async function spin() {
    if (isSpinning) return;
    
    // Check if we have enough balance
    if (balance < currentBet && !Bonus.isInBonus()) {
        // Not enough balance - show message
        const message = document.createElement('div');
        message.classList.add('error-message');
        message.textContent = 'INSUFFICIENT BALANCE';
        document.querySelector('.game-container').appendChild(message);
        
        setTimeout(() => {
            message.classList.add('fade-out');
            setTimeout(() => {
                message.remove();
            }, 1000);
        }, 2000);
        return;
    }
    
    isSpinning = true;
    
    // Update balance
    if (!Bonus.isInBonus()) {
        balance -= currentBet;
        updateBalanceDisplay();
    } else {
        // Process bonus spin
        Bonus.processBonusSpin();
    }
    
    //
// Set win amount
winAmount.textContent = `+${amount}`;
    
// Set win text based on amount
if (amount >= 500) {
    winText.textContent = 'BIG WIN';
    winText.classList.add('big-win-pulse');
} else if (amount >= 200) {
    winText.textContent = 'GREAT WIN';
    winText.classList.add('big-win-pulse');
} else {
    winText.textContent = 'WIN';
    winText.classList.remove('big-win-pulse');
}

// Show overlay
winOverlay.classList.add('active');

// Hide after delay
setTimeout(() => {
    winOverlay.classList.remove('active');
    winText.classList.remove('big-win-pulse');
}, 2000);
}

// Show bonus activation animation
function showBonusAnimation() {
    const bonusOverlay = document.querySelector('.bonus-overlay');
    const bonusTitle = document.querySelector('.bonus-title');
    const bonusSubtitle = document.querySelector('.bonus-subtitle');
    const bonusMultiplier = document.querySelector('.bonus-multiplier');
    
    // Add activation class
    bonusTitle.classList.add('bonus-activation');
    bonusSubtitle.classList.add('bonus-activation');
    bonusMultiplier.classList.add('bonus-activation');
    
    // Show overlay
    bonusOverlay.classList.add('active');
    
    // Hide after delay
    setTimeout(() => {
        bonusOverlay.classList.remove('active');
        bonusTitle.classList.remove('bonus-activation');
        bonusSubtitle.classList.remove('bonus-activation');
        bonusMultiplier.classList.remove('bonus-activation');
    }, 3000);
}

// Export animation functions
window.Animations = {
    showWinAnimation,
    showBonusAnimation
};

// Bonus feature management
let bonusSymbolsCollected = 0;
let bonusSpinsRemaining = 0;
let isBonusActive = false;

// Initialize bonus display
function initBonus() {
    updateBonusDisplay();
}

// Update the bonus display
function updateBonusDisplay() {
    const bonusBar = document.querySelector('.bonus-bar');
    const bonusCount = document.querySelector('.bonus-count');
    
    // Update progress bar
    const progressPercentage = (bonusSymbolsCollected / 3) * 100;
    bonusBar.style.width = `${progressPercentage}%`;
    
    // Update count
    bonusCount.textContent = `${bonusSymbolsCollected}/3`;
}

// Add bonus symbols
function addBonusSymbols(count) {
    bonusSymbolsCollected += count;
    
    // Check if bonus should activate
    if (bonusSymbolsCollected >= 3 && !isBonusActive) {
        activateBonus();
    } else {
        updateBonusDisplay();
    }
}

// Activate bonus feature
function activateBonus() {
    isBonusActive = true;
    bonusSpinsRemaining = 10;
    bonusSymbolsCollected = 0;
    
    // Set bonus multiplier
    Multiplier.setBonusMultiplier(3);
    
    // Update display
    updateBonusDisplay();
    
    // Show bonus animation
    Animations.showBonusAnimation();
}

// Process a bonus spin
function processBonusSpin() {
    bonusSpinsRemaining--;
    
    // Check if bonus is over
    if (bonusSpinsRemaining <= 0) {
        endBonus();
    }
}

// End bonus feature
function endBonus() {
    isBonusActive = false;
    bonusSpinsRemaining = 0;
    
    // Reset bonus multiplier
    Multiplier.resetBonusMultiplier();
    
    // Update display
    updateBonusDisplay();
}

// Check if bonus is active
function isInBonus() {
    return isBonusActive;
}

// Get remaining bonus spins
function getRemainingBonusSpins() {
    return bonusSpinsRemaining;
}

// Export bonus functions
window.Bonus = {
    initBonus,
    addBonusSymbols,
    processBonusSpin,
    isInBonus,
    getRemainingBonusSpins
};

// Main game logic
let balance = 1000;
let currentBet = 50;
let isSpinning = false;
let autoSpinActive = false;
let autoSpinCount = 0;

// Initialize the game
function initGame() {
    // Initialize UI elements
    updateBalanceDisplay();
    updateBetDisplay();
    
    // Initialize grid
    Grid.initializeGrid();
    
    // Initialize multiplier
    Multiplier.initMultiplier();
    
    // Initialize bonus
    Bonus.initBonus();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    // Spin button
    document.getElementById('spin-button').addEventListener('click', () => {
        if (!isSpinning) {
            spin();
        }
    });
    
    // Bet controls
    document.getElementById('increase-bet').addEventListener('click', () => {
        if (!isSpinning) {
            increaseBet();
        }
    });
    
    document.getElementById('decrease-bet').addEventListener('click', () => {
        if (!isSpinning) {
            decreaseBet();
        }
    });
    
    // Max bet button
    document.getElementById('max-bet').addEventListener('click', () => {
        if (!isSpinning) {
            setMaxBet();
        }
    });
    
    // Auto spin button
    document.getElementById('auto-spin').addEventListener('click', () => {
        toggleAutoSpin();
    });
    
    // Info button
    document.getElementById('info-button').addEventListener('click', () => {
        toggleInfoPanel();
    });
    
    // Close info button
    document.getElementById('close-info').addEventListener('click', () => {
        toggleInfoPanel();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isSpinning) {
            spin();
            e.preventDefault();
        }
    });
}

// Spin the reels
async function spin() {
    if (isSpinning) return;
    
    // Check if we have enough balance
    if (balance < currentBet && !Bonus.isInBonus()) {
        // Not enough balance
        return;
    }
    
    isSpinning = true;
    
    // Update balance
    if (!Bonus.isInBonus()) {
        balance -= currentBet;
        updateBalanceDisplay();
    } else {
        // Process bonus spin
        Bonus.processBonusSpin();
    }
    
    // Disable spin button
    toggleSpinButton(false);
    
    // Clear previous highlights
    Grid.clearHighlights();
    
    // Spin the grid
    const newGrid = await Grid.spinGrid(Bonus.isInBonus());
    
    // Check for wins
    const { winningCells, bonusCells, totalWin } = Grid.checkWins(newGrid);
    
    // Process bonus symbols
    if (bonusCells.length > 0 && !Bonus.isInBonus()) {
        Bonus.addBonusSymbols(bonusCells.length);
        Grid.highlightWinningCells(bonusCells, true);
    }
    
    // Process win
    if (winningCells.length > 0) {
        // Calculate final win with multiplier
        const multiplier = Multiplier.getCurrentMultiplier();
        const finalWin = Math.floor(totalWin * multiplier);
        
        // Update balance
        balance += finalWin;
        updateBalanceDisplay();
        
        // Highlight winning cells
        Grid.highlightWinningCells(winningCells);
        
        // Show win animation
        Animations.showWinAnimation(finalWin);
        
        // Increase multiplier
        Multiplier.increaseMultiplier();
    } else {
        // Reset multiplier on loss (if not in bonus)
        if (!Bonus.isInBonus()) {
            Multiplier.resetMultiplier();
        }
    }
    
    // Re-enable spin button
    isSpinning = false;
    toggleSpinButton(true);
    
    // Continue auto spin if active
    if (autoSpinActive) {
        autoSpinCount--;
        
        if (autoSpinCount > 0) {
            setTimeout(spin, 1000);
        } else {
            autoSpinActive = false;
        }
    }
}

// Increase bet
function increaseBet() {
    if (currentBet < 500) {
        currentBet += 10;
        updateBetDisplay();
    }
}

// Decrease bet
function decreaseBet() {
    if (currentBet > 10) {
        currentBet -= 10;
        updateBetDisplay();
    }
}

// Set max bet
function setMaxBet() {
    currentBet = 500;
    updateBetDisplay();
}

// Toggle auto spin
function toggleAutoSpin() {
    if (autoSpinActive) {
        autoSpinActive = false;
        autoSpinCount = 0;
    } else {
        autoSpinActive = true;
        autoSpinCount = 10;
        
        if (!isSpinning) {
            spin();
        }
    }
}

// Toggle info panel
function toggleInfoPanel() {
    const infoPanel = document.querySelector('.info-panel');
    infoPanel.classList.toggle('active');
}

// Update balance display
function updateBalanceDisplay() {
    document.querySelector('.balance-value').textContent = Utils.formatCurrency(balance);
}

// Update bet display
function updateBetDisplay() {
    document.getElementById('bet-amount').textContent = currentBet;
}

// Toggle spin button
function toggleSpinButton(enabled) {
    const spinButton = document.getElementById('spin-button');
    
    if (enabled) {
        spinButton.classList.remove('disabled');
        spinButton.disabled = false;
    } else {
        spinButton.classList.add('disabled');
        spinButton.disabled = true;
    }
}

// Export game functions
window.Game = {
    initGame
};

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Game.initGame();
});
