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
let isGameOver = false; // ✅ 控制遊戲狀態
let score = 0; // 分數
let timeLeft = 30; // 倒數計時
let currentCanType = 0; // 當前罐頭類型（0=普通, 1=金色, 2=壞掉）

// 罐頭種類
const cans = [
    "https://lh3.googleusercontent.com/d/1r3O4cvBIggQOTzFYtQCaBlJxYwRtoBjT", // 普通罐頭
    "https://lh3.googleusercontent.com/d/1Fi0VfIh1P-2QkFUEZlFXQKxcYsSTIFBF", // 金色罐頭
    "https://lh3.googleusercontent.com/d/1Tn66HTQNCQmC8EFVi6poJJcJUrEjlzX_"  // 壞掉的罐頭
];

// ✅ 隨機更換罐頭
function randomizeCan() {
    if (isGameOver) return; // 遊戲結束時不再變換罐頭
    currentCanType = Math.floor(Math.random() * 3);
    can.src = cans[currentCanType];
}

// ✅ 計時器，每秒減少 1 秒
let timer = setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
    } else {
        endGame(); // 時間到，執行遊戲結束
    }
}, 1000);

// ✅ 讓貓咪隨機移動
function moveCatRandomly() {
    if (isGameOver) return; // 遊戲結束時停止移動

    const containerRect = gameContainer.getBoundingClientRect();
    const maxX = containerRect.width - cat.width;
    const maxY = containerRect.height - cat.height;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    cat.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// ✅ 每秒讓貓移動一次
let catMoveInterval = setInterval(moveCatRandomly, 1000);

// ✅ 當遊戲結束時執行
function endGame() {
    isGameOver = true; // 設定遊戲狀態為結束
    clearInterval(timer); // 停止倒數計時
    clearInterval(catMoveInterval); // 停止貓咪移動

    finalScoreDisplay.innerText = score;
    finalScoreMessage.style.display = 'block'; // 顯示最終分數

    // 禁止罐頭拖曳
    can.style.pointerEvents = "none";
    can.style.opacity = "0.5"; // 讓罐頭變灰，提示遊戲結束
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

// ✅ 觸控支援（手機）
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

// ✅ 更新罐頭位置（防止拖曳到遊戲區域外）
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
    if (canRect.bottom > catRect.top && canRect.top < catRect.bottom && canRect.right > catRect.left && canRect.left < catRect.right) {
        let points = 0;
        if (currentCanType === 0) points = 1;
        else if (currentCanType === 1) points = 5;
        else if (currentCanType === 2) points = -3;

        score += points;
        counter.innerText = score;
        message.innerText = points > 0 ? "meow！" : "😾"; // 壞掉的罐頭讓貓咪生氣

        message.style.display = 'block';
        can.style.display = 'none';

        setTimeout(() => {
            message.style.display = 'none';
            can.style.display = 'block';
            can.style.top = '20px';
            can.style.left = '50%';
            randomizeCan(); // 隨機變換罐頭
        }, 1000);
    }
}

// ✅ 遊戲開始時隨機選擇罐頭
randomizeCan();
