const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

const height = cvs.height;
const width = cvs.width;

const row = 20;
const col = 10;
const sq = height / (row + 2);
const vacant = "white";

let rowCount = 0;
let level = 0;
let score = 0;



const centerX = width / 2 - col * sq / 2;
const centerY = height / 2 - row * sq / 2;


//draw a square
function drawSquare(x, y, color) {

  ctx.fillStyle = color;
  ctx.fillRect(x, y, sq, sq);

  ctx.strokeStyle = "BLACK";
  ctx.strokeRect(x, y, sq,sq)
  
  // checks to see if square is above the board
  // only draws if below top of board
 
  //if(newY >= height/2 - sq * row /2){
    
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
      let newX = c * sq //+ centerX
      let newY = r * sq //+ centerY
      drawSquare(newX, newY, board[r][c]);
    };
  };
};

drawBoard();

// create a new display

function display(column, x, y, w, h, text){
  this.column = column;
  this.x = (x * sq + centerX) * (column - 1);
  this.y = y * sq + centerY
  this.w = w;
  this.h = h;
  this.text = text  
  this.color = "rgba(0, 0, 0, 0.5)";

};

// draw display
display.prototype.draw =  function(){
  ctx.clearRect(this.x, this.y, this.w*sq, this.h*sq);
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.w*sq, this.h*sq);  

  ctx.strokeStyle = "BLACK";
  ctx.strokeWidth = 3;
  ctx.strokeRect(this.x, this.y, this.w*sq, this.h*sq)
  
  if(this.text){    
    ctx.font = "bold 16px sans-serif";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillText(this.text, this.x + .25 * sq, this.y + .25 * sq);  
  };
};

let nextDisplay = new display(3, 0, 0, 5, 5.5, "NEXT");
let rowDisplay = new display(3, 0, 6, 5, 3, "ROWS");
let levelDisplay = new display(3, 0, 10, 5, 3, "LEVEL");
let scoreDisplay = new display(3, 0, 14, 5, 3, "SCORE");

nextDisplay.draw();
rowDisplay.draw();
levelDisplay.draw();
scoreDisplay.draw();

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
let next = randomPiece();

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
      if(this.activeTetromino[r][c]){
        let newX = (this.x + c) * sq; //+ centerX
        let newY = (this.y + r) * sq; //+ centerY
        drawSquare(newX, newY, color);
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

// display next piece
display.prototype.drawNext = function(nextPiece){
  nextDisplay.draw();
  let length = nextPiece.activeTetromino.length
  for(r = 0; r < length; r++){
    for(c = 0; c < length; c++){
      if(nextPiece.activeTetromino[r][c]){
        paddingY = length < 3 ? 2.5 * sq : length < 4 ? 1.5 * sq : sq;
        paddingX = length < 3 ? 1.5 * sq : length < 4 ? sq : .5 * sq;
        
        let newX = (c * sq) + this.x + paddingX;
        let newY = (r * sq) + this.y + paddingY;
        
        drawSquare(newX, newY, nextPiece.color);      
      };
    };
  }; 
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
    p = next;
    next = randomPiece();
    nextDisplay.drawNext(next);
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
      
      // increment row count
      rowCount++;
      
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

p.draw();
nextDisplay.drawNext(next);
drop();
