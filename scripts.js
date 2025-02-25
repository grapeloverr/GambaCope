// Utility functions for the slot machine

// Random number generator within a range
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Delay function using Promises
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Format currency
function formatCurrency(amount) {
    return amount.toLocaleString();
}

// Create particle effects
function createParticles(element, count, color) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position within the element
        const x = getRandomInt(-rect.width / 2, rect.width / 2);
        const y = getRandomInt(-rect.height / 2, rect.height / 2);
        
        // Random end position for the animation
        const tx = getRandomInt(-100, 100);
        const ty = getRandomInt(-100, 100);
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--particle-color', color);
        
        particle.style.left = `${centerX + x}px`;
        particle.style.top = `${centerY + y}px`;
        
        document.body.appendChild(particle);
        
        // Remove the particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Shake animation for near misses
function shakeElement(element) {
    element.classList.add('near-miss');
    setTimeout(() => {
        element.classList.remove('near-miss');
    }, 400);
}

// Export utilities
window.Utils = {
    getRandomInt,
    delay,
    formatCurrency,
    createParticles,
    shakeElement
};

// Symbol definitions and probabilities

// Define symbols with their properties
const SYMBOLS = {
    DIAMOND: {
        id: 'diamond',
        value: 100,
        image: 'assets/images/diamond.png',
        probability: 5,
        color: '#1e90ff'
    },
    CROWN: {
        id: 'crown',
        value: 75,
        image: 'assets/images/crown.png',
        probability: 8,
        color: '#ffd700'
    },
    SEVEN: {
        id: 'seven',
        value: 50,
        image: 'assets/images/seven.png',
        probability: 10,
        color: '#ff4757'
    },
    BAR: {
        id: 'bar',
        value: 30,
        image: 'assets/images/bar.png',
        probability: 15,
        color: '#9370db'
    },
    BELL: {
        id: 'bell',
        value: 20,
        image: 'assets/images/bell.png',
        probability: 20,
        color: '#ff9f43'
    },
    CHERRY: {
        id: 'cherry',
        value: 10,
        image: 'assets/images/cherry.png',
        probability: 25,
        color: '#ff6b81'
    },
    LEMON: {
        id: 'lemon',
        value: 5,
        image: 'assets/images/lemon.png',
        probability: 30,
        color: '#feca57'
    },
    BONUS: {
        id: 'bonus',
        value: 0,
        image: 'assets/images/bonus.png',
        probability: 3,
        color: '#ff4757',
        isBonus: true
    }
};

// Calculate total probability
const TOTAL_PROBABILITY = Object.values(SYMBOLS).reduce((total, symbol) => total + symbol.probability, 0);

// Function to get a random symbol based on probability
function getRandomSymbol() {
    const rand = Utils.getRandomInt(1, TOTAL_PROBABILITY);
    let cumulativeProbability = 0;
    
    for (const symbol of Object.values(SYMBOLS)) {
        cumulativeProbability += symbol.probability;
        if (rand <= cumulativeProbability) {
            return symbol;
        }
    }
    
    // Fallback (should never reach here)
    return SYMBOLS.CHERRY;
}

// Function to get a weighted random symbol (for teases)
function getWeightedRandomSymbol(weights) {
    const symbolList = Object.values(SYMBOLS);
    const weightedSymbols = symbolList.map((symbol, index) => {
        return {
            symbol,
            weight: weights[index] || 1
        };
    });
    
    const totalWeight = weightedSymbols.reduce((sum, item) => sum + item.weight, 0);
    const rand = Utils.getRandomInt(1, totalWeight);
    let cumulativeWeight = 0;
    
    for (const item of weightedSymbols) {
        cumulativeWeight += item.weight;
        if (rand <= cumulativeWeight) {
            return item.symbol;
        }
    }
    
    return symbolList[0];
}

// Function to get symbol by ID
function getSymbolById(id) {
    return Object.values(SYMBOLS).find(symbol => symbol.id === id);
}

// Export symbols
window.Symbols = {
    SYMBOLS,
    getRandomSymbol,
    getWeightedRandomSymbol,
    getSymbolById
};

// Grid management for the 6x6 slot machine

// Grid state
let gridState = Array(6).fill().map(() => Array(6).fill(null));
let gridElements = Array(6).fill().map(() => Array(6).fill(null));

// Initialize the grid
function initializeGrid() {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';
    
    // Create the 6x6 grid
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const symbol = document.createElement('div');
            symbol.classList.add('symbol');
            
            // Set initial symbol
            const randomSymbol = Symbols.getRandomSymbol();
                        symbol.style.backgroundImage = `url(${randomSymbol.image})`;
            symbol.dataset.symbolId = randomSymbol.id;
            
            cell.appendChild(symbol);
            gridContainer.appendChild(cell);
            
            // Store references
            gridElements[row][col] = cell;
            gridState[row][col] = randomSymbol;
        }
    }
}

// Spin the grid
async function spinGrid(isBonus = false) {
    // Prepare new symbols but don't show them yet
    const newGridState = Array(6).fill().map(() => Array(6).fill(null));
    
    for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 6; row++) {
            // Determine if this should be a tease spin
            const shouldTease = Math.random() < 0.3; // 30% chance for tease
            
            // Get new symbol
            let newSymbol;
            if (isBonus) {
                // During bonus rounds, higher chance of valuable symbols
                const bonusWeights = [15, 12, 10, 8, 6, 4, 2, 1]; // Higher weights for valuable symbols
                newSymbol = Symbols.getWeightedRandomSymbol(bonusWeights);
            } else {
                newSymbol = Symbols.getRandomSymbol();
            }
            
            newGridState[row][col] = newSymbol;
        }
    }
    
    // If we want to force a near miss for excitement
    if (Math.random() < 0.2 && !isBonus) { // 20% chance of near miss
        createNearMiss(newGridState);
    }
    
    // Spin each column with a slight delay between them
    for (let col = 0; col < 6; col++) {
        await spinColumn(col, newGridState[col], 100 * col);
    }
    
    // Update the grid state
    gridState = newGridState;
    
    // Return the new grid state for win checking
    return gridState;
}

// Spin a single column
async function spinColumn(col, newSymbols, delay) {
    await Utils.delay(delay);
    
    const promises = [];
    
    for (let row = 0; row < 6; row++) {
        const cell = gridElements[row][col];
        const symbolElement = cell.querySelector('.symbol');
        
        // Clear existing classes
        symbolElement.className = 'symbol';
        
        // Determine if this should be a tease spin
        const shouldTease = Math.random() < 0.3; // 30% chance for tease
        
        // Apply spinning animation
        if (shouldTease) {
            symbolElement.classList.add('spinning-tease');
        } else {
            symbolElement.classList.add('spinning');
        }
        
        // Set the new symbol after animation
        const promise = new Promise(resolve => {
            // Animation duration is 1.2s for regular spin, 1.5s for tease
            const animDuration = shouldTease ? 1500 : 1200;
            
            setTimeout(() => {
                symbolElement.style.backgroundImage = `url(${newSymbols[row].image})`;
                symbolElement.dataset.symbolId = newSymbols[row].id;
                
                // Add bonus class if it's a bonus symbol
                if (newSymbols[row].isBonus) {
                    symbolElement.classList.add('bonus');
                }
                
                resolve();
            }, animDuration);
        });
        
        promises.push(promise);
    }
    
    return Promise.all(promises);
}

// Create a near miss pattern for excitement
function createNearMiss(gridState) {
    // Choose a high-value symbol
    const highValueSymbols = [Symbols.SYMBOLS.DIAMOND, Symbols.SYMBOLS.CROWN, Symbols.SYMBOLS.SEVEN];
    const targetSymbol = highValueSymbols[Utils.getRandomInt(0, highValueSymbols.length - 1)];
    
    // Choose a pattern: row, column, or diagonal
    const patternType = Utils.getRandomInt(0, 2);
    
    if (patternType === 0) {
        // Row near miss
        const row = Utils.getRandomInt(0, 5);
        const missingCol = Utils.getRandomInt(0, 5);
        
        for (let col = 0; col < 6; col++) {
            if (col !== missingCol) {
                gridState[row][col] = targetSymbol;
            }
        }
    } else if (patternType === 1) {
        // Column near miss
        const col = Utils.getRandomInt(0, 5);
        const missingRow = Utils.getRandomInt(0, 5);
        
        for (let row = 0; row < 6; row++) {
            if (row !== missingRow) {
                gridState[row][col] = targetSymbol;
            }
        }
    } else {
        // Diagonal near miss
        const isDiagonalDown = Math.random() < 0.5;
        const missingPos = Utils.getRandomInt(0, 5);
        
        for (let i = 0; i < 6; i++) {
            if (i !== missingPos) {
                if (isDiagonalDown) {
                    gridState[i][i] = targetSymbol;
                } else {
                    gridState[i][5 - i] = targetSymbol;
                }
            }
        }
    }
}

// Highlight winning cells
function highlightWinningCells(winningCells, isBonus = false) {
    winningCells.forEach(cell => {
        const [row, col] = cell;
        const element = gridElements[row][col];
        
        if (isBonus) {
            element.classList.add('bonus-highlight', 'pulse');
        } else {
            element.classList.add('highlight', 'pulse');
        }
        
        // Create particle effects
        const symbolElement = element.querySelector('.symbol');
        const symbolId = symbolElement.dataset.symbolId;
        const symbol = Symbols.getSymbolById(symbolId);
        
        Utils.createParticles(element, 20, symbol.color);
    });
}

// Clear all highlights
function clearHighlights() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const element = gridElements[row][col];
            element.classList.remove('highlight', 'bonus-highlight', 'pulse');
        }
    }
}

// Check for winning combinations
function checkWins(grid) {
    const winningCells = [];
    const bonusCells = [];
    let totalWin = 0;
    
    // Check for horizontal wins (rows)
    for (let row = 0; row < 6; row++) {
        let currentSymbol = null;
        let count = 0;
        let startCol = 0;
        
        for (let col = 0; col < 6; col++) {
            const symbol = grid[row][col];
            
            if (symbol.isBonus) {
                bonusCells.push([row, col]);
                continue; // Bonus symbols don't count for regular wins
            }
            
            if (currentSymbol === null || symbol.id !== currentSymbol.id) {
                // If we had a streak, record it
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        winningCells.push([row, startCol + i]);
                    }
                    totalWin += currentSymbol.value * count;
                }
                
                // Start new streak
                currentSymbol = symbol;
                count = 1;
                startCol = col;
            } else {
                // Continue streak
                count++;
            }
        }
        
        // Check for streak at the end of the row
        if (count >= 3) {
            for (let i = 0; i < count; i++) {
                winningCells.push([row, startCol + i]);
            }
            totalWin += currentSymbol.value * count;
        }
    }
    
    // Check for vertical wins (columns)
    for (let col = 0; col < 6; col++) {
        let currentSymbol = null;
        let count = 0;
        let startRow = 0;
        
        for (let row = 0; row < 6; row++) {
            const symbol = grid[row][col];
            
            if (symbol.isBonus) {
                // Already counted in horizontal check
                continue;
            }
            
            if (currentSymbol === null || symbol.id !== currentSymbol.id) {
                // If we had a streak, record it
                if (count >= 3) {
                    for (let i = 0; i < count; i++) {
                        winningCells.push([startRow + i, col]);
                    }
                    totalWin += currentSymbol.value * count;
                }
                
                // Start new streak
                currentSymbol = symbol;
                count = 1;
                startRow = row;
            } else {
                // Continue streak
                count++;
            }
        }
        
        // Check for streak at the end of the column
        if (count >= 3) {
            for (let i = 0; i < count; i++) {
                winningCells.push([startRow + i, col]);
            }
            totalWin += currentSymbol.value * count;
        }
    }
    
    // Check for diagonal wins (top-left to bottom-right)
    for (let startRow = 0; startRow <= 3; startRow++) {
        for (let startCol = 0; startCol <= 3; startCol++) {
            let currentSymbol = grid[startRow][startCol];
            let count = 1;
            const diagonalCells = [[startRow, startCol]];
            
            if (currentSymbol.isBonus) {
                continue; // Skip bonus symbols for diagonal checks
            }
            
            for (let i = 1; i < 6; i++) {
                const row = startRow + i;
                const col = startCol + i;
                
                if (row >= 6 || col >= 6) break;
                
                const symbol = grid[row][col];
                
                if (symbol.isBonus) {
                    break; // Break the diagonal on bonus symbols
                }
                
                if (symbol.id === currentSymbol.id) {
                    count++;
                    diagonalCells.push([row, col]);
                } else {
                    break;
                }
            }
            
            if (count >= 3) {
                diagonalCells.forEach(cell => winningCells.push(cell));
                totalWin += currentSymbol.value * count;
            }
        }
    }
    
    // Check for diagonal wins (top-right to bottom-left)
    for (let startRow = 0; startRow <= 3; startRow++) {
        for (let startCol = 5; startCol >= 2; startCol--) {
            let currentSymbol = grid[startRow][startCol];
            let count = 1;
            const diagonalCells = [[startRow, startCol]];
            
            if (currentSymbol.isBonus) {
                continue; // Skip bonus symbols for diagonal checks
            }
            
            for (let i = 1; i < 6; i++) {
                const row = startRow + i;
                const col = startCol - i;
                
                if (row >= 6 || col < 0) break;
                
                const symbol = grid[row][col];
                
                if (symbol.isBonus) {
                    break; // Break the diagonal on bonus symbols
                }
                
                if (symbol.id === currentSymbol.id) {
                    count++;
                    diagonalCells.push([row, col]);
                } else {
                    break;
                }
            }
            
            if (count >= 3) {
                diagonalCells.forEach(cell => winningCells.push(cell));
                totalWin += currentSymbol.value * count;
            }
        }
    }
    
    // Remove duplicates from winningCells
    const uniqueWinningCells = [];
    const cellMap = new Map();
    
    winningCells.forEach(cell => {
        const key = `${cell[0]},${cell[1]}`;
        if (!cellMap.has(key)) {
            cellMap.set(key, true);
            uniqueWinningCells.push(cell);
        }
    });
    
    return {
        winningCells: uniqueWinningCells,
        bonusCells,
        totalWin
    };
}

// Export grid functions
window.Grid = {
    initializeGrid,
    spinGrid,
    highlightWinningCells,
    clearHighlights,
    checkWins
};

// Multiplier system for consecutive wins

// Multiplier values
const multiplierValues = [1, 1.5, 2, 3, 5, 8];
let currentMultiplierIndex = 0;
let bonusMultiplier = 1; // Additional multiplier during bonus rounds

// Initialize multiplier display
function initMultiplier() {
    updateMultiplierDisplay();
}

// Update the multiplier display
function updateMultiplierDisplay() {
    const multiplierElement = document.querySelector('.multiplier-value');
    const progressBar = document.querySelector('.progress-bar');
    const multiplier = getCurrentMultiplier();
    
    // Update text
    multiplierElement.innerHTML = `${multiplier}<span>x</span>`;
    
    // Update progress bar
    const progressPercentage = (currentMultiplierIndex / (multiplierValues.length - 1)) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    
    // Add animation if multiplier changed
    if (currentMultiplierIndex > 0) {
        multiplierElement.classList.add('multiplier-change');
        setTimeout(() => {
            multiplierElement.classList.remove('multiplier-change');
        }, 500);
    }
}

// Get the current multiplier value
function getCurrentMultiplier() {
    const baseMultiplier = multiplierValues[currentMultiplierIndex];
    return baseMultiplier * bonusMultiplier;
}

// Increase multiplier after a win
function increaseMultiplier() {
    if (currentMultiplierIndex < multiplierValues.length - 1) {
        currentMultiplierIndex++;
    }
    updateMultiplierDisplay();
}

// Reset multiplier after a loss
function resetMultiplier() {
    currentMultiplierIndex = 0;
    updateMultiplierDisplay();
}

// Set bonus multiplier
function setBonusMultiplier(value) {
    bonusMultiplier = value;
    updateMultiplierDisplay();
}

// Reset bonus multiplier
function resetBonusMultiplier() {
    bonusMultiplier = 1;
    updateMultiplierDisplay();
}

// Export multiplier functions
window.Multiplier = {
    initMultiplier,
    getCurrentMultiplier,
    increaseMultiplier,
    resetMultiplier,
    setBonusMultiplier,
    resetBonusMultiplier
};

// Animation utilities for the slot machine

// Show win animation
function showWinAnimation(amount) {
    const winOverlay = document.querySelector('.win-overlay');
    const winAmount = document.querySelector('.win-amount');
    const winText = document.querySelector('.win-text');
    
    // Set win amount
    winAmount.textContent =

