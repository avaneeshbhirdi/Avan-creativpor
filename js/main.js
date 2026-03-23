/* js/main.js */

window.switchSection = function(sectionId, btnElement) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');

    if (btnElement) {
        document.querySelectorAll('.slide-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
};

function initWarpBackground() {
    const warpBg = document.createElement('div');
    warpBg.id = 'warp-bg';
    // Append at the start of body so it sits behind text
    document.body.insertBefore(warpBg, document.body.firstChild);

    const sides = [
        { class: 'warp-top' },
        { class: 'warp-bottom' },
        { class: 'warp-left' },
        { class: 'warp-right' }
    ];

    const beamsPerSide = 3;
    const beamSize = 5; 
    const beamDuration = 5; 

    sides.forEach(sideDf => {
        const sideEl = document.createElement('div');
        sideEl.className = 'warp-side ' + sideDf.class;

        const cellsPerSide = Math.floor(100 / beamSize);
        const step = cellsPerSide / beamsPerSide;
        
        for (let i = 0; i < beamsPerSide; i++) {
            const x = Math.floor(i * step);
            const delay = Math.random() * 5; 
            const hue = Math.floor(Math.random() * 360);
            const ar = Math.floor(Math.random() * 10) + 1;

            const beam = document.createElement('div');
            beam.className = 'warp-beam';
            beam.style.setProperty('--x', `${x * beamSize}%`);
            beam.style.setProperty('--width', `${beamSize}%`);
            beam.style.setProperty('--aspect-ratio', `${ar}`);
            beam.style.setProperty('--background', `linear-gradient(hsl(${hue} 80% 60%), transparent)`);
            beam.style.setProperty('--delay', `${delay}s`);
            beam.style.setProperty('--duration', `${beamDuration}s`);
            
            sideEl.appendChild(beam);
        }
        warpBg.appendChild(sideEl);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initWarpBackground();

    // Initialize slidebar to correct state if not set
    const activeBtn = document.querySelector('.slide-btn.active');
    if(!activeBtn) {
        const firstBtn = document.querySelector('.slide-btn');
        if (firstBtn) firstBtn.classList.add('active');
    }
});
