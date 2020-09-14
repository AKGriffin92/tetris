const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

const height = cvs.height;
const width = cvs.width;

const row = 20;
const col = 10;
const sq = height / (row + 2);
const vacant = "white";


const centerX = width / 2 - col * sq / 2;
const centerY = height / 2 - row * sq / 2;


//draw a square
function drawSquare(x, y, color) {
  
  let newX = x * sq + centerX
  let newY = y * sq + centerY
  
  // checks to see if square is above the board
  // only draws if below top of board
 
  if(newY >= height/2 - sq * row /2){
    
    ctx.fillStyle = color;
    ctx.fillRect(newX, newY, sq, sq);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(newX, newY, sq,sq,sq)
    
  };
};

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

// create a new ui element

function display(column, x, y, w, h, color){
  this.column = column;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;

};

// draw display
display.prototype.draw =  function(){
  let newX = (this.x * sq + centerX) * (this.column - 1);
  let newY =  this.y * sq + centerY
    
  ctx.fillStyle = this.color;
  ctx.fillRect(newX, newY, this.w*sq, this.h*sq);
};

let nextDisplay = new display(3, 0, 0, 5, 5, "red");
let scoreDisplay = new display(3, 0, 6, 5, 3, "green");

scoreDisplay.draw();
nextDisplay.draw();

  //the pieces and their colors

  const pieces = [
    [z, "orangered"],
    [s, "gold"],
    [t, "chartreuse"],
    [l, "hotpink"],
    [j, "royalblue"],
    [i, "cyan"],
    [o, "darkviolet"]
  ];

//generate random tetromino

function randomPiece(){
  let r = Math.floor(Math.random() * pieces.length);
  return new piece(pieces[r][0], pieces[r][1])
};

let p = randomPiece();

//create piece object

function piece(tetromino, color){

  this.tetromino = tetromino;
  this.color = color;
  this.tetrominoRotation = 0;
  this.activeTetromino = this.tetromino[this.tetrominoRotation]
  
  // starting point
  this.x = (this.activeTetromino.length > 2 ? 3 : 4);
  this.y = -(this.activeTetromino.length);
};  

//create fill function

piece.prototype.fill = function(color) {
  for(r = 0; r < this.activeTetromino.length; r++){
    for(c = 0; c < this.activeTetromino.length; c++){
      //only draw occupied squares
      if(this.activeTetromino[r][c]){
        drawSquare(this.x + c,this.y + r, color);
      };
    };
  };
};


//draw a piece to the board

piece.prototype.draw = function() {
  this.fill(this.color);
};

// undraw a piece

piece.prototype.undraw = function() {
  this.fill(vacant);
};

//move down the piece
piece.prototype.moveDown = function (){
  if(!this.collision(0,1, this.activeTetromino)){
    this.undraw();
    this.y++;
    this.draw();
    secondTimer = 0;
  }else{
    //lock the piece and generate a new one
    this.lock();
    p = randomPiece();
  };
};

//move the piece right
piece.prototype.moveRight = function (){
  if(!this.collision(1,0, this.activeTetromino)){
    this.undraw();
    this.x++;
    this.draw();
  };
};

//move the piece left
piece.prototype.moveLeft = function (){
  if(!this.collision(-1,0, this.activeTetromino)){
    this.undraw();
    this.x--;
    this.draw();
  };
};

//rotate the piece
piece.prototype.rotate = function(){
  let nextRotation = this.tetromino[(this.tetrominoRotation + 1)%this.tetromino.length];
  let kick = 0;
  
  if(this.collision(0, 0, nextRotation)){
    //checks to see if collision is right or left wall
    if(this.x > col/2){
      //it's the right wall
      kick = -1;
    }else{
      //its the left wall
      kick = 1;
    };
  };
  
  if(!this.collision(kick, 0, nextRotation)){
    this.undraw();
    this.x += kick;
    this.tetrominoRotation = (this.tetrominoRotation + 1) % this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoRotation];
    this.draw()
  };
};

// lock the piece

piece.prototype.lock = function(){
  for(r = 0; r < this.activeTetromino.length; r++){
    for(c = 0; c < this.activeTetromino.length; c++){
      // skip vacant square
      if(!this.activeTetromino[r][c]){
        continue;
      };
      //lock on top gameover
      if(this.y + r < 0){
        alert("Game Over");
        gameOver = true;
        break;
      };
      // we lock the piece
      board[this.y + r][this.x + c] = this.color;
    };
  };
  // remove full rows
  for(r = 0; r < row; r++){
    let isRowFull = true;
    for(c = 0; c < col; c++){
      isRowFull = isRowFull && (board[r][c] != vacant);
    };
    if(isRowFull){
      // if row is full
      // move down all rows above it
      for(y = r; y > 1; y--){
        for(c = 0; c < col; c++){
          board[y][c] = board[y-1][c]
        };
        //the top row has no row above it
        for(c = 0; c < col; c++){
          board[0][c] = vacant;
        };
      };
    };
  };
  drawBoard();
};

// collision function

piece.prototype.collision = function(x,y,piece){
  for(r = 0; r < piece.length; r++){
    for(c = 0; c < piece.length; c++){
      //check if square is vacant
      if(!piece[r][c]){
        continue;
      };
      // coordinates of piece after movement
      let newX = this.x + c + x;
      let newY = this.y + r + y;
      
      // conditions
      if(newX < 0 || newX >= col || newY >= row){
        return true;
      };
      
      // skip newY < 0; board[-1] will crash game
      if(newY < 0){
        continue;
      };
      
      //check if there is a locked piece alrready in place
      if(board[newY][newX] != vacant){
        return true;
      };
    };
  };
  return false;
};

//control the piece

document.addEventListener("keydown", control);

const keys = [37, 38, 39, 40, 65, 87, 68, 83]

function control(event){
  let keyPress = event.keyCode;
  
  if(keys.includes(keyPress)){
    p.resetTimer();
  };
  
  if(keyPress === 37 || keyPress === 65){
    p.moveLeft();
  }else if(keyPress === 38 || keyPress === 87){
    p.rotate();
  }else if(keyPress === 39 || keyPress === 68){
    p.moveRight();
  }else if(keyPress === 40 || keyPress === 83){
    p.moveDown();
  };  
};

//drop the piece down every 1 second

let dropStart = Date.now();
let gameOver = false;
function drop(){
  let press;
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > 1000){
    p.moveDown();
    dropStart = Date.now();
  };
  if(!gameOver){
    requestAnimationFrame(drop)  
  };
};

let secondTimer;
piece.prototype.resetTimer = function(){
  if(!secondTimer){
    dropStart = Date.now();
    secondTimer = 1;
  };

};

focusCanvas = function getFocus() {           
  document.getElementById("game").focus({preventScroll:true});
};

p.draw();
drop();
