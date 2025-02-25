class SlotMachine {
  constructor() {
    this.symbols = ['♠', '♥', '♦', '♣', '★', '⚡', '♞', '♟'];
    this.grid = Array(6).fill().map(() => Array(6).fill('?'));
    this.balance = 1000;
    this.bet = 10;
    this.multiplier = 1;
    this.isSpinning = false;
    this.init();
  }

  init() {
    this.setupGrid();
    this.setupEventListeners();
  }

  setupGrid() {
    const grid = document.querySelector('.game-grid');
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        const reel = document.createElement('div');
        reel.className = 'reel';
        reel.id = `reel-${i}-${j}`;
        grid.appendChild(reel);
      }
    }
  }

  setupEventListeners() {
    document.getElementById('spin-btn').addEventListener('click', () => this.spin());
    // Add more event listeners for auto-spin, bet adjustments, etc.
  }

  spin() {
    if (this.isSpinning || this.balance < this.bet) return;
    this.isSpinning = true;
    this.balance -= this.bet;
    this.updateBalance();
    this.animateSpin();
  }

  animateSpin() {
    // Implement column-based spinning animation with staggered starts
    for (let col = 0; col < 6; col++) {
      setTimeout(() => this.spinColumn(col), col * 100);
    }
  }

  spinColumn(col) {
    // Animation logic for each column
    for (let row = 0; row < 6; row++) {
      const reel = document.getElementById(`reel-${col}-${row}`);
      reel.style.transform = 'translateY(100%)';
      setTimeout(() => {
        reel.textContent = this.getRandomSymbol();
        reel.style.transform = 'translateY(0)';
      }, 500 + row * 100);
    }
    setTimeout(() => this.checkWins(), 1000);
  }

  getRandomSymbol() {
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }

  checkWins() {
    // Check for horizontal lines, diagonal clusters, and mystery bonuses
    // Update balance, multiplier, and trigger animations
    this.isSpinning = false;
  }

  updateBalance() {
    document.getElementById('balance').textContent = this.balance;
  }
}

new SlotMachine();
