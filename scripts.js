class SlotMachine {
    constructor() {
        this.symbols = [
            { icon: '⭐', weight: 8, multipliers: [0,2,5,15,50] },
            { icon: '♦', weight: 15, multipliers: [0,1,4,10,25] },
            { icon: '♠', weight: 25, multipliers: [0,0,3,8,20] },
            { icon: '♣', weight: 35, multipliers: [0,0,2,5,15] },
            { icon: '⚡', weight: 50, multipliers: [0,0,1,3,10] }
        ];
        
        this.state = {
            credit: 10_000,
            bet: 100,
            spinning: false,
            lastWin: 0
        };

        this.init();
    }

    init() {
        this.createReels();
        this.setupControls();
        this.updateUI();
    }

    createReels() {
        const reels = document.querySelector('.reels');
        for(let i = 0; i < 5; i++) {
            const reel = document.createElement('div');
            reel.className = 'reel';
            for(let j = 0; j < 15; j++) { // Buffer symbols
                const symbol = document.createElement('div');
                symbol.className = 'symbol';
                symbol.textContent = this.getRandomSymbol().icon;
                reel.appendChild(symbol);
            }
            reels.appendChild(reel);
        }
    }

    getRandomSymbol() {
        const totalWeight = this.symbols.reduce((acc, cur) => acc + cur.weight, 0);
        const random = Math.random() * totalWeight;
        return this.symbols.find(s => (random -= s.weight) < 0);
    }

    async spin() {
        if(this.state.spinning || this.state.credit < this.state.bet) return;
        
        this.state.spinning = true;
        this.state.credit -= this.state.bet;
        this.updateUI();

        const reels = document.querySelectorAll('.reel');
        const results = [];
        
        // Professional spin animation
        await Promise.all([...reels].map((reel, i) => 
            new Promise(resolve => {
                const duration = 2000 + i * 300;
                reel.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
                reel.style.transform = `translateY(-200%)`;
                
                setTimeout(() => {
                    reel.style.transition = '';
                    reel.style.transform = 'translateY(0)';
                    results.push(this.evaluateReel(reel));
                    resolve();
                }, duration);
            })
        ));

        this.calculateWin(results);
        this.state.spinning = false;
        this.updateUI();
    }

    evaluateReel(reel) {
        const symbols = [...reel.children];
        const middleIndex = Math.floor(symbols.length / 2);
        return symbols.slice(middleIndex - 1, middleIndex + 2);
    }

    calculateWin(visibleSymbols) {
        // Professional payline evaluation
        const paylines = [
            [1,1,1,1,1], // Center line
            [0,0,0,0,0], // Top line
            [2,2,2,2,2], // Bottom line
            [0,1,2,1,0], // V pattern
            [2,1,0,1,2]  // Inverse V
        ];

        let totalWin = 0;
        paylines.forEach(line => {
            const lineSymbols = line.map((row, i) => 
                visibleSymbols[i][row].textContent);
                
            const unique = new Set(lineSymbols);
            if(unique.size === 1) {
                const symbol = this.symbols.find(s => s.icon === lineSymbols[0]);
                totalWin += this.state.bet * symbol.multipliers[4];
            }
        });

        this.state.credit += totalWin;
        this.state.lastWin = totalWin;
    }

    updateUI() {
        document.getElementById('credit').textContent = this.state.credit.toLocaleString();
        document.getElementById('bet').textContent = this.state.bet;
        document.getElementById('win').textContent = this.state.lastWin.toLocaleString();
    }

    setupControls() {
        document.getElementById('spin').addEventListener('click', () => this.spin());
        
        document.getElementById('half').addEventListener('click', () => {
            this.state.bet = Math.max(10, this.state.bet / 2);
            this.updateUI();
        });

        document.getElementById('double').addEventListener('click', () => {
            this.state.bet = Math.min(this.state.credit, this.state.bet * 2);
            this.updateUI();
        });
    }
}

// Initialize game
new SlotMachine();
