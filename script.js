document.addEventListener("DOMContentLoaded", function (event) {
  const cvs = document.getElementByID("game");
  const ctx = cvs.getContext("2d")
  
  const sq = 20;
  
  //draw a square
  function draw(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*sq,y*sq,sq,sq);
    
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x,y,sq,sq)
  }
});
