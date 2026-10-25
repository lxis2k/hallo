const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmYesBtn = document.getElementById('confirmYesBtn');

const card = document.querySelector('.card');
const questionContainer = document.querySelector('.question-container');
const btnGroup = document.querySelector('.btn-group');
const subtitle = document.querySelector('.subtitle');
const h1 = document.querySelector('h1');

const loadingContainer = document.getElementById('loadingContainer');
const loadingStatus = document.getElementById('loadingStatus');
const progressFill = document.getElementById('progressFill');
const successMessage = document.getElementById('successMessage');

let noClickCount = 0;
const noTexts = [
    "Ne hs",
    "Sicher?",
    "Niemals!",
    "Gemein!",
    "Keine Chance",
    "Gib auf!"
];

// Variablen für die relative Position des Nein-Buttons
let currentX = 0;
let currentY = 0;

// Kontrollierter Sprung für den Nein-Button
const fnTeleportNoButton = () => {
    const deltaX = (Math.random() - 0.5) * 220;
    const deltaY = (Math.random() - 0.5) * 220;

    currentX += deltaX;
    currentY += deltaY;

    currentX = Math.max(-220, Math.min(220, currentX));
    currentY = Math.max(-160, Math.min(160, currentY));

    noBtn.style.transform = `translate(${currentX}px, ${currentY}px)`;
    noBtn.style.transition = 'transform 0.2s ease-out';

    noClickCount++;
    if (noClickCount < noTexts.length) {
        noBtn.textContent = noTexts[noClickCount];
    } else {
        noBtn.textContent = "Gib auf!";
    }
};

noBtn.addEventListener('mouseover', fnTeleportNoButton);
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fnTeleportNoButton();
});

// 1. Schritt: Klick auf "Ja, bitte" -> Öffne Bestätigungs-Modal
yesBtn.addEventListener('click', () => {
    confirmModal.classList.remove('hidden');
});

// 2. Schritt: Bestätigung im Modal geklickt -> Ladebalken starten
confirmYesBtn.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
    noBtn.style.display = 'none';
    
    h1.style.display = 'none';
    subtitle.style.display = 'none';
    questionContainer.style.display = 'none';
    btnGroup.style.display = 'none';
    
    loadingContainer.classList.get = loadingContainer.classList.remove('hidden');
    loadingContainer.classList.remove('hidden');

    const steps = [
        { percent: '20%', status: 'Analysiere...' },
        { percent: '50%', status: 'suche nach ausreden...' },
        { percent: '80%', status: 'keine ausreden gefunden...' },
        { percent: '100%', status: 'Erfolgreich!' }
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            progressFill.style.width = steps[currentStep].percent;
            loadingStatus.textContent = steps[currentStep].status;
            currentStep++;
        } else {
            clearInterval(interval);
            setTimeout(showFinalSuccess, 900);
        }
    }, 700);
});

// 3. Schritt: Nach dem Ladebalken Endnachricht & Sternenstaub-Regen
function showFinalSuccess() {
    loadingContainer.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    card.style.borderColor = '#facc15';
    card.style.boxShadow = '8px 8px 0px #1c1917';
    
    createStarDust();
}

function createStarDust() {
    for (let i = 0; i < 45; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        
        const size = Math.random() * 6 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = Math.random() > 0.4 ? '#facc15' : '#ffffff';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px #facc15';
        particle.style.transition = 'all 2s ease-out';
        particle.style.zIndex = '1000';
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.style.top = window.innerHeight + 'px';
            particle.style.opacity = '0';
            particle.style.transform = `translate(${(Math.random() - 0.5) * 120}px, 0)`;
        }, 50);

        setTimeout(() => {
            particle.remove();
        }, 2100);
    }
}

/* --- ANIMIERTES WELTALL (STERNEN-BACKGROUND) --- */
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 140;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.015 + 0.005;
        this.color = Math.random() > 0.4 ? '#fef08a' : '#ffffff';
    }

    update() {
        this.alpha += this.speed;
        if (this.alpha >= 1 || this.alpha <= 0.1) {
            this.speed = -this.speed;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.abs(this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < numStars; i++) {
    stars.pop; // safety
    stars.push(new Star());
}

// fix array populate cleanly
stars = [];
for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

function animateSpace() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateSpace);
}

animateSpace();