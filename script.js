const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

const sq = 20;
const row = 20;
const col = 10;
const vacant = "white";

//draw a square
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x*sq,y*sq,sq,sq);

  ctx.strokeStyle = "BLACK";
  ctx.strokeRect(x*sq,y*sq,sq,sq)
}

//create game board
let board = [];
for(r=0; r < row; r++){
  board[r] = [];
  for(c=0; c < col; c++){
    board[r][c] = vacant;
  }
}

//draw game board
function drawBoard(){
  for(r = 0; r < row; r++){
    for(c = 0; c < col; c++){
      drawSquare(c, r, board[r][c]);
    };
  };
};

drawBoard();

  //the pieces and their colors

  const pieces = [
    [z, "red"],
    [s, "green"],
    [t, "yellow"],
    [l, "purple"],
    [j, "orange"],
    [i, "cyan"],
    [o, "blue"]
  ];

//initiate a piece the first piece in its first rotation

let p = new piece(pieces[0][0], pieces[0][1])

//create piece object

function piece(tetromino, color){

  this.tetromino = tetromino;
  this.color = color;
  this.tetrominoRotation = 0;
  this.activeTetromino = this.tetromino[this.tetrominoRotation]

  //starting position
  this.x = 3;
  this.y = 0;
};  

//draw a piece to the board

piece.prototype.draw = function() {
  for(r = 0; r < this.activeTetromino.length; r++){
    for(c = 0; c < this.activeTetromino.length; c++){
      //only draw occupied squares
      if(this.activeTetromino[r][c]){
        drawSquare(this.x + c,this.y + r, this.color);
      };
    };
  };
};

//drop down the piece
piece.prototype.moveDown = function (){
  this.y++;
  this.draw();
};


//drop the piece down a line

let dropStart = Date.now();
function drop(){
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > 1000){
    p.moveDown();
    dropStart = Date.now();
  };
  requestAnimationFrame(drop)
};

draw();
drop();
