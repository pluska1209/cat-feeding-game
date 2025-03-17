// 取得 HTML 元素
const can = document.getElementById('can');
const cat = document.getElementById('cat');
const message = document.querySelector('.message');
const counter = document.getElementById('count');
const timerDisplay = document.getElementById('time');
const finalScoreDisplay = document.getElementById('final-score');
const finalScoreMessage = document.querySelector('.final-score');
const gameContainer = document.querySelector('.game-container');

let isDragging = false;
let isGameOver = false;
let score = 0;
let timeLeft = 30;
let currentCanType = 0;
let canTimeout;

const cans = [
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/catcan.png",
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/goldcan.png",
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/blackcan.png"
];

// ✅ 讓罐頭立即換新
function replaceCanImmediately() {
    can.style.opacity = "0"; // 先淡出罐頭
    setTimeout(() => {
        randomizeCan(); // 立刻換新罐頭
        can.style.opacity = "1"; // 再淡入罐頭
    }, 200);
}

// ✅ 隨機更換罐頭
function randomizeCan() {
    if (isGameOver) return;
    currentCanType = Math.floor(Math.random() * cans.length);
    can.src = cans[currentCanType];
    forceChangeCan();
}

// ✅ 強制更換罐頭（3 秒後自動換）
function forceChangeCan() {
    clearTimeout(canTimeout);
    canTimeout = setTimeout(() => {
        if (!isGameOver) {
            replaceCanImmediately();
        }
    }, 3000);
}

// ✅ 計時器
let timer = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
    } else {
        endGame();
    }
}, 1000);

// ✅ 讓貓咪隨機移動
function moveCatRandomly() {
    if (isGameOver) return;
    const containerRect = gameContainer.getBoundingClientRect();
    const maxX = containerRect.width - cat.width;
    const maxY = containerRect.height - cat.height;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    cat.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// ✅ 每秒讓貓移動一次
let catMoveInterval = setInterval(moveCatRandomly, 1000);

// ✅ 當遊戲結束時
function endGame() {
    isGameOver = true;
    clearInterval(timer);
    clearInterval(catMoveInterval);
    finalScoreDisplay.innerText = score;
    finalScoreMessage.style.display = 'block';
    can.style.pointerEvents = "none";
    can.style.opacity = "0.5";
}

// ✅ 罐頭拖曳邏輯
can.addEventListener('mousedown', (e) => {
    if (isGameOver) return;
    isDragging = true;
    moveCan(e.clientX, e.clientY);
});

document.addEventListener('mousemove', (e) => {
    if (isGameOver || !isDragging) return;
    requestAnimationFrame(() => moveCan(e.clientX, e.clientY));
});

document.addEventListener('mouseup', () => isDragging = false);

// ✅ 觸控支援（手機）
can.addEventListener('touchstart', (e) => {
    if (isGameOver) return;
    isDragging = true;
    moveCan(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (isGameOver || !isDragging) return;
    requestAnimationFrame(() => moveCan(e.touches[0].clientX, e.touches[0].clientY));
}, { passive: false });

document.addEventListener('touchend', () => isDragging = false);

// ✅ 更新罐頭位置 & 防止邊界卡住
function moveCan(clientX, clientY) {
    const rect = gameContainer.getBoundingClientRect();
    let x = clientX - rect.left - can.offsetWidth / 2;
    let y = clientY - rect.top - can.offsetHeight / 2;

    // ✅ 讓罐頭可以稍微超出邊界
    x = Math.max(-20, Math.min(rect.width - can.offsetWidth + 20, x));
    y = Math.max(-20, Math.min(rect.height - can.offsetHeight + 20, y));

    can.style.left = `${x}px`;
    can.style.top = `${y}px`;

    checkCollision(); // ✅ 每次移動時檢查碰撞
}

// ✅ 檢查罐頭是否餵到貓
function checkCollision() {
    const canRect = can.getBoundingClientRect();
    const catRect = cat.getBoundingClientRect();

    if (canRect.bottom > catRect.top &&
        canRect.top < catRect.bottom &&
        canRect.right > catRect.left &&
        canRect.left < catRect.right) {
        
        let points = 0;
        if (currentCanType === 0) points = 1;
        else if (currentCanType === 1) points = 5;
        else if (currentCanType === 2) points = -3;

        score += points;
        counter.innerText = score;

        message.innerText = points > 0 ? "喵！😺" : "😾";
        message.style.display = 'block';

        // 🚀 罐頭立即消失並換新
        can.style.transition = "opacity 0.2s, transform 0.3s";
        can.style.opacity = "0";
        can.style.transform = "scale(0.8)"; 

        setTimeout(() => {
            message.style.display = 'none';
            can.style.transition = "none";
            can.style.transform = "scale(1)";
            can.style.top = '20px';
            can.style.left = '50%';
            replaceCanImmediately(); 
        }, 300);
    }
}

// ✅ **防止手機下拉導致網頁刷新**
document.addEventListener("touchstart", function(event) {
    event.preventDefault(); // ✅ 這樣能完全阻止下拉刷新
}, { passive: false });

// ✅ **確保遊戲區域允許拖曳**
gameContainer.addEventListener("touchmove", function(event) {
    event.stopPropagation(); // ✅ 允許在遊戲區域內拖曳
}, { passive: false });

// ✅ 遊戲開始時選擇罐頭
randomizeCan();
