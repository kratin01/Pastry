let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Touchmove event
    document.addEventListener("touchmove", (e) => {
      if (!this.rotating) {
        const touch = e.touches[0]; // Get the first touch point
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;

        this.velX = this.touchX - this.prevTouchX;
        this.velY = this.touchY - this.prevTouchY;
      }

      const dirX = this.touchX - this.touchStartX;
      const dirY = this.touchY - this.touchStartY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchX;
        this.prevTouchY = this.touchY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Touchstart event
    paper.addEventListener("touchstart", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0]; // Get the first touch point
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;

      if (e.touches.length > 1) { // If two fingers are on the screen
        this.rotating = true; // Start rotating
      }
    });

    // Touchend event
    window.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

const heart = document.querySelector(".paper.heart");

const audio = new Audio("images/song.mp3");

heart.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});
