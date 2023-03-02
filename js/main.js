import {
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement,
} from './selectors.js';
import { TURN, GAME_STATUS } from './constants.js';
import { checkGameStatus } from './utils.js';
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let isGameEnded = false;
let cellValues = new Array(9).fill('');
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
// 1. Bind click event for all cells
function toggleCurrentTurn() {
  // changCurrentTurn
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
  // Updata CurrentTurn Element in DOM
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}
function changeGameStatus(status) {
  const statusElement = getGameStatusElement();
  statusElement.textContent = status.status;
}
function handleCellClick(cell, index) {
  // Check class cell
  if (cell.className === TURN.CROSS || cell.className === TURN.CIRCLE) return;
  if (isGameEnded) return;

  //   set cross || circle for cell
  cell.classList.add(currentTurn);
  //   toggle Current Turn
  toggleCurrentTurn();
  //check status game
  cellValues[index] = cell.className === TURN.CROSS ? GAME_STATUS.X_WIN : GAME_STATUS.O_WIN;
  const statusMatch = checkGameStatus(cellValues);
  //   change Element Game Status
  changeGameStatus(statusMatch);
}
function InitCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
}
(() => {
  InitCellElementList();
})();
