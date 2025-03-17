function checkCollision() {
  const canRect = can.getBoundingClientRect();
  const catRect = cat.getBoundingClientRect();

  if (canRect.bottom > catRect.top &&
      canRect.top < catRect.bottom &&
      canRect.right > catRect.left &&
      canRect.left < catRect.right) {
      
      let points = 0;

      if (currentCanType === 0) points = 1;  // 普通罐頭 +1 分
      else if (currentCanType === 1) points = 5;  // 金色罐頭 +5 分
      else if (currentCanType === 2) points = -3; // 壞罐頭 -3 分

      score += points;
      counter.innerText = score;

      // 🐱 讓貓咪顯示「開心」或「生氣」
      message.innerText = points > 0 ? "喵！😺" : "😾";
      message.style.display = 'block';

      // 🚀 讓罐頭短暫消失，不管是壞的還是好的
      can.style.display = 'none';

      setTimeout(() => {
          message.style.display = 'none'; // 隱藏「喵！」
          can.style.display = 'block'; // 讓罐頭再次顯示
          can.style.top = '20px'; // 回到原位
          can.style.left = '50%';

          randomizeCan(); // ✅ 給玩家一個新罐頭
      }, 1000);
  }
}
