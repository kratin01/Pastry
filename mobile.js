let highestZ = 1;

class Paper {
  holdingPaper = false;
  rotating = false;
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

  init(paper) {
    // Handle touchmove to drag or rotate the paper
    paper.addEventListener("touchmove", (e) => {
      if (!this.holdingPaper) return;
      e.preventDefault(); // Prevent page scrolling

      const touch = e.touches[0];
      this.touchX = touch.clientX;
      this.touchY = touch.clientY;

      this.velX = this.touchX - this.prevTouchX;
      this.velY = this.touchY - this.prevTouchY;

      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      } else {
        const dirX = this.touchX - this.touchStartX;
        const dirY = this.touchY - this.touchStartY;
        const angle = Math.atan2(dirY, dirX);
        this.rotation = (angle * 180) / Math.PI;
      }

      this.prevTouchX = this.touchX;
      this.prevTouchY = this.touchY;

      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    });

    // Handle touchstart to initiate dragging or rotating
    paper.addEventListener("touchstart", (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;

      if (e.touches.length > 1) {
        this.rotating = true; // Enable rotation if two fingers are used
      }
    });

    // Handle touchend to stop dragging/rotating
    window.addEventListener("touchend", () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Initialize all paper elements
const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Add functionality for the heart element to toggle audio
const heart = document.querySelector(".paper.heart");
const audio = new Audio("images/song.mp3");

heart.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});
