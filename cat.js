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

const cans = [
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/catcan.png",  // 普通罐頭
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/goldcan.png", // 金色罐頭
    "https://raw.githubusercontent.com/pluska1209/cat-feeding-game/main/blackcan.png" // 壞掉的罐頭
];

// ✅ 讓罐頭平滑變換
function smoothChangeCan() {
    can.style.opacity = "0"; // 先淡出罐頭
    setTimeout(() => {
        randomizeCan(); // 更換罐頭
        can.style.opacity = "1"; // 再淡入罐頭
    }, 300); // 300ms 讓過渡更順暢
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

        // 🚀 讓罐頭滑順地回到原位
        can.style.transition = "opacity 0.3s, transform 0.5s";
        can.style.opacity = "0";
        can.style.transform = "translateY(-20px)"; // 往上飄一點
       
        setTimeout(() => {
            message.style.display = 'none';
            can.style.transition = "none"; // 關閉 transition，避免影響拖曳
            can.style.transform = "translateY(0)"; // 回到原本位置
            can.style.top = '20px';
            can.style.left = '50%';
            smoothChangeCan(); // ✅ 流暢地更換新罐頭
        }, 500);
    }
}

// ✅ 每 5 秒換新罐頭，防止壞罐頭卡住
setInterval(() => {
    if (!isGameOver) {
        smoothChangeCan();
    }
}, 5000);

// ✅ 防止手機下拉導致網頁刷新
document.addEventListener("touchmove", function (event) {
  event.preventDefault();
}, { passive: false });

// ✅ 遊戲開始時選擇罐頭
randomizeCan();
