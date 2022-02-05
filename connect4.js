/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

var WIDTH = 7;
var HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false; //disables certain clicks when game is over

const reset = document.getElementById("reset");
reset.addEventListener("click", resetBoard);

function resetBoard() {
  location.reload();
}

// makeBoard: create in-JS board structure:
// Board = array of rows, each row is array of cells  (board[y][x])

function makeBoard(width, height) {
  for (var y = 0; y < height; y++) {
    let row = [];
    for (var x = 0; x < width; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

//makeHtmlBoard: make HTML table and row of column tops

function makeHtmlBoard() {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // Create table row html element, set attributes and click event listener
  var top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.classList.add(`player${currPlayer}`);
  top.addEventListener("click", handleClick);

  //Creates a headCell element WIDTH amount of times, assigns column ID, and adds the cell to the top table row
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.classList.add(`player${currPlayer}`);
    top.append(headCell);
  }
  //Adds top row to htmlBoard
  htmlBoard.append(top);

  // Creates a table row HEIGHT amount of times
  // For each row a cell is created WIDTH amount of times, assigned xy coordinates, and appended to the row.
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    //Each row appended to htmlBoard
    htmlBoard.append(row);
  }
}

// findSpotForCol: Find the highest empty cell in column (x)
function findSpotForCol(x) {
  // Begin looping over each cell in column (x)
  for (let y = HEIGHT - 1; y > -1; y--) {
    //get html element at (y,x), check to see if it contains a child element, if not return (y)
    const cell = document.getElementById(`${y}-${x}`);
    if (cell.firstElementChild == null) {
      return y;
    }
  }
  return null;
}

// placeInTable: Create and set attributes of div element and place it in the cell with ID of ('x-y')
function placeInTable(y, x) {
  const div = document.createElement("div");
  const cell = document.getElementById(`${y}-${x}`);
  div.classList.add("piece", `p${currPlayer}`);
  cell.append(div);
}

// endGame: announce game end
function endGame(msg) {
  gameOver = true;
  alert(`${msg}`);
}

function handleClick(evt) {
  //Ignore click if game is over
  if (gameOver) {
    return;
  }

  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // Update in-memory board
  board[y][x] = currPlayer;

  // check for win, end the game if true
  // endgame is delayed 500ms so the piece appears before the alert message is showed
  if (checkForWin()) {
    endGame(`Player ${currPlayer} won!`);
  }

  // checkForTie: checks to see if the whole board is full
  function checkForTie() {
    let nullCount = 0;
    //check each column to see if it's full
    for (let w = 0; w < WIDTH; w++) {
      if (findSpotForCol(w) == null) {
        nullCount += 1;
      }
    }
    //if the each column is full, it's a tie. Otherwise return nothing
    if (nullCount == WIDTH) {
      return endGame("The board is full, it's a tie!");
    }
    return;
  }

  checkForTie();

  // switch players
  currPlayer = currPlayer == 1 ? 2 : 1;

  //hoverColor: switches hover color on the top row to reflect current player

  function hoverColor(player) {
    //Get previous player number from current player, select top row of the board
    const oldPlayer = player == 1 ? 2 : 1;
    const topRow = document.getElementById("column-top");

    //update topRow class with new player number
    topRow.classList.replace(`player${oldPlayer}`, `player${currPlayer}`);
  }

  hoverColor(currPlayer);
}

function checkForWin() {
  // _win: Checks if every cell's coordinates in a potential winner array are inbounds and belong to the current player
  // If ever cell meets the conditions, returns true

  function _win(cells) {
    //this function is called after the loop below
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //loop begins at (0,0), iterates over each cell in each row
  //4 arrays of potential winning coordinates are created for each cell

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      //array of four coordiantes extending horizontally from (y,x)
      var horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      //array of four coordiantes extending vertically from (y,x)
      var vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      //array of four coordiantes extending diagonally right from (y,x)
      var diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      //array of four coordiantes extending diagonally left from (y,x)
      var diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      //Each potential winner array is checked against winning conditions
      //if any of the four array's meet winning conditions, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

//Construct boards in memory and html
makeBoard(WIDTH, HEIGHT);
makeHtmlBoard();
