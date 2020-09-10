document.addEventListener("DOMContentLoaded", function (event) {
  const cvs = document.getElementByID("game");
  const ctx = cvs.getContext("2d")
  
  const sq = 20;
  const row = 20
  const col = 10;
  const vacant = "white"
  
  //draw a square
  function draw(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*sq,y*sq,sq,sq);
    
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x,y,sq,sq)
  }
  
  //create game board
  let board = [];
  for(r=0; r < row; r++){
    board[r] = [];
    for(c=0; c < col; c++){
      board[r][c] = vacant;
    }
  }
});
