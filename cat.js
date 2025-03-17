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
let canTimeout; // ⏳ 用來控制罐頭自動更換的計時器

const cans = [
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/catcan.png",  // 普通罐頭
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/goldcan.png", // 金色罐頭
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/blackcan.png" // 壞掉的罐頭
];

// ✅ 強制更換罐頭（3 秒後自動換）
function forceChangeCan() {
    clearTimeout(canTimeout); // 🔄 清除舊的計時器
    canTimeout = setTimeout(() => {
        if (!isGameOver) {
            replaceCanImmediately(); // ✅ 強制換新罐頭
        }
    }, 3000); // 3 秒後換新罐頭
}

// ✅ 讓罐頭立即換新
function replaceCanImmediately() {
    can.style.opacity = "0"; // 先淡出罐頭
    setTimeout(() => {
        randomizeCan(); // 立刻換新罐頭
        can.style.opacity = "1"; // 再淡入罐頭
    }, 200); // 200ms 過渡動畫
}

// ✅ 隨機更換罐頭
function randomizeCan() {
    if (isGameOver) return;
    currentCanType = Math.floor(Math.random() * cans.length);
    can.src = cans[currentCanType];
    forceChangeCan(); // ✅ 確保罐頭 3 秒內會自動變更
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
can.addEventListener('mousedown', () => {
    if (isGameOver) return;
    isDragging = true;
});

document.addEventListener('mousemove', (e) => {
    if (isGameOver || !isDragging) return;
    moveCan(e.clientX, e.clientY);
});

document.addEventListener('mouseup', () => isDragging = false);

can.addEventListener('touchstart', (e) => {
    if (isGameOver) return;
    isDragging = true;
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (isGameOver || !isDragging) return;
    let touch = e.touches[0];
    moveCan(touch.clientX, touch.clientY);
});

document.addEventListener('touchend', () => isDragging = false);

// ✅ 更新罐頭位置
function moveCan(clientX, clientY) {
    const rect = gameContainer.getBoundingClientRect();
    let x = clientX - rect.left - can.width / 2;
    let y = clientY - rect.top - can.height / 2;
    x = Math.max(0, Math.min(rect.width - can.width, x));
    y = Math.max(0, Math.min(rect.height - can.height, y));
    can.style.left = `${x}px`;
    can.style.top = `${y}px`;
    checkCollision();
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
        can.style.transform = "scale(0.8)"; // 稍微縮小

        setTimeout(() => {
            message.style.display = 'none';
            can.style.transition = "none";
            can.style.transform = "scale(1)";
            can.style.top = '20px';
            can.style.left = '50%';
            replaceCanImmediately(); // ✅ 立即換新罐頭
        }, 300);
    }
}

// ✅ 防止手機下拉導致網頁刷新
document.addEventListener("touchmove", function (event) {
  event.preventDefault();
}, { passive: false });

// ✅ 遊戲開始時選擇罐頭
randomizeCan();
