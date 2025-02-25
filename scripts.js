document.addEventListener('DOMContentLoaded', () => {
    const spinButton = document.getElementById('spinButton');
    const spinnerContainer = document.getElementById('spinnerContainer');

    spinButton.addEventListener('click', () => {
        spinnerContainer.style.display = 'flex';

        // Simulate Jotform loading
        setTimeout(() => {
            // Simulate slot machine spinning
            spinReels();

            // Hide spinner after 3 seconds
            setTimeout(() => {
                spinnerContainer.style.display = 'none';
            }, 3000);
        }, 2000); // Simulate 2 seconds for Jotform to load
    });

    function spinReels() {
        const reels = document.querySelectorAll('.reel');
        reels.forEach(reel => {
            const symbols = reel.querySelectorAll('.symbol');
            const randomIndex = Math.floor(Math.random() * symbols.length);
            const symbolHeight = symbols[0].offsetHeight;
            reel.style.transition = 'transform 3s ease-in-out';
            reel.style.transform = `translateY(-${randomIndex * symbolHeight}px)`;
        });
    }
});
