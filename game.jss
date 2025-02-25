class SlotMachine {
  constructor() {
    // Load state from local storage or use defaults
    this.balance = parseInt(localStorage.getItem('balance')) || 1000;
    this.bet = 10;
    this.jackpot = parseInt(localStorage.getItem('jackpot')) || 5000;
    this.symbols = ['♠', '♥', '♦', '♣', '★', '⚡', '♞', '♟'];
    this.isSpinning = false;
    this.autoSpin = false;
    this.consecutiveWins = 0;

    // Get DOM elements
    this.balanceEl = document.getElementById('balance');
    this.betEl = document.getElementById('bet-value');
    this.jackpotEl = document.getElementById('jackpot');
    this.spinBtn = document.getElementById('spin-btn');
    this.autoSpinBtn = document.getElementById('auto-spin-btn');
    this.gameGrid = document.querySelector('.game-grid');
    this.spinSound = document.getElementById('spin-sound');
    this.winChime = document.getElementById('win-chime');
    this.bgMusic = document.getElementById('bg-music');

    // Initialize the grid cells
    this.initGrid();

    // Bind event handlers
    this.spinBtn.addEventListener('click', () => this.startSpin());
    this.autoSpinBtn.addEventListener('click', () => this.toggleAutoSpin());
    document.getElementById('decrease-bet').addEventListener('click', () => this.changeBet(-5));
    document.getElementById('increase-bet').addEventListener('click', () => this.changeBet(5));

    // Set up background music
    this.bgMusic.volume = 0.5;
    this.bgMusic.play();
    this.updateDisplay();
  }
  
  initGrid() {
    // Clear existing cells and set up a 6x6 grid
    this.gameGrid.innerHTML = '';
    for (let i = 0; i < 36; i++) {
      const cell = document.createElement('div');
      cell.classList.add('game-cell');
      cell.setAttribute('data-index', i);
      cell.textContent = this.randomSymbol();
      this.gameGrid.appendChild(cell);
    }
  }

  randomSymbol() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }
  
  changeBet(amount) {
    this.bet = Math.max(5, this.bet + amount);
    this.betEl.textContent = this.bet;
  }
  
  updateDisplay() {
    this.balanceEl.textContent = this.balance;
    this.jackpotEl.textContent = this.jackpot;
    localStorage.setItem('balance', this.balance);
    localStorage.setItem('jackpot', this.jackpot);
  }
  
  startSpin() {
    if (this.isSpinning) return;
    if (this.balance < this.bet) {
      alert("Not enough balance!");
      return;
    }
    try {
      this.balance -= this.bet;
      this.updateDisplay();
      this.isSpinning = true;
      this.spinSound.currentTime = 0;
      this.spinSound.play();

      // Animate each cell with a staggered delay to simulate column‐based spin and realistic inertia
      const cells = document.querySelectorAll('.game-cell');
      cells.forEach((cell, index) => {
        // Adding stagger delay based on column index;
        // (using modulo on a 6-cell row, adjust delay as needed)
        const delay = (index % 6) * 50;
        setTimeout(() => {
          cell.style.transition = `transform 1s cubic-bezier(0.4, 0, 0.2, 1)`;
          cell.style.transform = `translateY(-100%)`;
          cell.addEventListener(
            'transitionend',
            () => {
              cell.textContent = this.randomSymbol();
              cell.style.transition = '';
              cell.style.transform = '';
            },
            { once: true }
          );
        }, delay);
      });
      
      // After animations complete, evaluate for wins
      setTimeout(() => {
        this.evaluateWin();
        this.isSpinning = false;
        if (this.autoSpin) {
          setTimeout(() => this.startSpin(), 500);
        }
      }, 1200);
    } catch (error) {
      console.error("Error during spin:", error);
      this.isSpinning = false;
    }
  }
  
  evaluateWin() {
    // Check win conditions on a 6x6 grid:
    // • Horizontal lines: 3 or more matching symbols consecutively
    // • Diagonals: simple check for diagonal clusters of 3 matching symbols
    // • Plus a 10% chance for a random mystery bonus win
    let win = false;
    const cells = Array.from(document.querySelectorAll('.game-cell'));
    const gridSymbols = [];
    for (let i = 0; i < 6; i++) {
      gridSymbols.push(cells.slice(i * 6, (i + 1) * 6).map((c) => c.textContent));
    }

    // Horizontal win
    for (let i = 0; i < 6; i++) {
      let count = 1;
      for (let j = 1; j < 6; j++) {
        if (gridSymbols[i][j] === gridSymbols[i][j - 1]) {
          count++;
          if (count >= 3) {
            win = true;
            this.giveWinReward(20 * count);
            this.animateWinningCell(i, j);
          }
        } else {
          count = 1;
        }
      }
    }

    // Diagonal win check (basic 3-match diagonal)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const symbol = gridSymbols[i][j];
        if (
          symbol === gridSymbols[i + 1][j + 1] &&
          symbol === gridSymbols[i + 2][j + 2]
        ) {
          win = true;
          this.giveWinReward(30);
          this.animateWinningCell(i, j);
        }
      }
    }

    // Random mystery bonus (10% chance)
    if (Math.random() < 0.1) {
      win = true;
      this.giveWinReward(50);
      this.showParticleEffect();
    }
    
    if (!win) {
      console.log("No win this time. Try again!");
    }
  }
  
  giveWinReward(amount) {
    // Increase multiplier for consecutive wins
    this.consecutiveWins++;
    const multiplier = 1 + this.consecutiveWins * 0.1;
    const reward = amount * multiplier;
    this.balance += reward;
    this.jackpot += reward * 0.05;
    this.updateDisplay();
    this.winChime.play();
  }
  
  animateWinningCell(row, col) {
    // Calculate index based on 6x6 layout and animate (pulse animation)
    const index = row * 6 + col;
    const cell = document.querySelector(`.game-cell[data-index="${index}"]`);
    if (cell) {
      cell.style.animation = 'pulse 0.6s ease-in-out';
      cell.addEventListener('animationend', () => {
        cell.style.animation = '';
      }, { once: true });
    }
  }
  
  showParticleEffect() {
    // Create a simple particle burst element (placeholder for WebGL integration)
    const burst = document.createElement('div');
    burst.className = 'particle-burst';
    burst.textContent = '💥';
    burst.style.top = '50%';
    burst.style.left = '50%';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);
  }
  
  toggleAutoSpin() {
    this.autoSpin = !this.autoSpin;
    this.autoSpinBtn.textContent = this.autoSpin ? 'Stop Auto Spin' : 'Auto Spin';
    if (this.autoSpin && !this.isSpinning) {
      this.startSpin();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SlotMachine();
});
