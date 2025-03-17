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
let animationFrameId = null; // ✅ 讓拖曳更流暢

const cans = [
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/catcan.png",
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/goldcan.png",
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/blackcan.png"
];

// ✅ 讓罐頭立即換新
function smoothChangeCan() {
    can.style.opacity = "0"; // 先淡出罐頭
    setTimeout(() => {
        randomizeCan(); // 更換罐頭
        can.style.opacity = "1"; // 再淡入罐頭
    }, 300);
}

// ✅ 隨機更換罐頭
function randomizeCan() {
    if (isGameOver) return;
    currentCanType = Math.floor(Math.random() * cans.length);
    can.src = cans[currentCanType];
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
    can.style.opacity = "0.5";
}

// ✅ 罐頭拖曳邏輯（滑鼠）
can.addEventListener('mousedown', (e) => {
    if (isGameOver) return;
    isDragging = true;
    moveCan(e.clientX, e.clientY);
});

document.addEventListener('mousemove', (e) => {
    if (isGameOver || !isDragging) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(() => moveCan(e.clientX, e.clientY));
});

document.addEventListener('mouseup', () => isDragging = false);

// ✅ **觸控支援（手機）**
can.addEventListener('touchstart', (e) => {
    if (isGameOver) return;
    isDragging = true;
    moveCan(e.touches[0].clientX, e.touches[0].clientY);
    e.preventDefault(); // ✅ 防止手機滾動
});

document.addEventListener('touchmove', (e) => {
    if (isGameOver || !isDragging) return;
    let touch = e.touches[0];
    cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(() => moveCan(touch.clientX, touch.clientY));
}, { passive: false });

document.addEventListener('touchend', () => isDragging = false);

// ✅ **更新罐頭位置**
function moveCan(clientX, clientY) {
    const rect = gameContainer.getBoundingClientRect();
    let x = clientX - rect.left - can.offsetWidth / 2;
    let y = clientY - rect.top - can.offsetHeight / 2;

    // ✅ 讓罐頭可稍微超出邊界，不會卡住
    x = Math.max(-20, Math.min(rect.width - can.offsetWidth + 20, x));
    y = Math.max(-20, Math.min(rect.height - can.offsetHeight + 20, y));

    can.style.left = `${x}px`;
    can.style.top = `${y}px`;

    checkCollision(); // ✅ 確保碰撞檢測
}

// ✅ **檢查罐頭是否餵到貓**
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
        can.style.transition = "opacity 0.3s, transform 0.3s";
        can.style.opacity = "0";
        can.style.transform = "scale(0.8)";

        setTimeout(() => {
            message.style.display = 'none';
            can.style.transition = "none";
            can.style.transform = "scale(1)";
            can.style.top = '20px';
            can.style.left = '50%';
            smoothChangeCan(); // ✅ 流暢地更換新罐頭
        }, 300);
    }
}

// ✅ **防止手機下拉導致網頁刷新，但允許遊戲區域內移動**
document.addEventListener("touchstart", function (event) {
    if (!event.target.closest('.game-container')) {
        event.preventDefault(); // ✅ 只有在遊戲區域外才阻止滾動
    }
}, { passive: false });

// ✅ **確保遊戲區域允許拖曳**
gameContainer.addEventListener("touchmove", function (event) {
    event.stopPropagation(); // ✅ 允許在遊戲區域內拖曳
}, { passive: false });

// ✅ **遊戲開始時選擇罐頭**
randomizeCan();
