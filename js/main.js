import {
  getCellElementList,
  getCellElementAtIdx,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButton,
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
function updateGameStaus(status) {
  const statusElement = getGameStatusElement();
  if (statusElement) statusElement.textContent = status;
}
function showReplayButton() {
  const replayButtonElement = getReplayButton();
  if (replayButtonElement) replayButtonElement.classList.add('show');
}
function hideReplayButton() {
  const replayButtonElement = getReplayButton();
  if (replayButtonElement) replayButtonElement.classList.remove('show');
}

function hightLightWinCell(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) return;
  for (const win of winPositions) {
    const cellElement = getCellElementAtIdx(win);
    cellElement.classList.add('win');
  }
}
function handleCellClick(cell, index) {
  // Check class cell
  if (isGameEnded) return;
  if (cell.className === TURN.CROSS || cell.className === TURN.CIRCLE) return;
  //   set cross || circle for cell
  cell.classList.add(currentTurn);
  //   toggle Current Turn
  toggleCurrentTurn();
  //check status game
  cellValues[index] = cell.className === TURN.CROSS ? GAME_STATUS.X_WIN : GAME_STATUS.O_WIN;
  const statusMatch = checkGameStatus(cellValues);

  switch (statusMatch.status) {
    case GAME_STATUS.ENDED: {
      showReplayButton();
      updateGameStaus(statusMatch.status);
      isGameEnded = true;
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      showReplayButton();
      updateGameStaus(statusMatch.status);
      hightLightWinCell(statusMatch.winPositions);
      isGameEnded = true;
      break;
    }
    default:
    // playing
  }
}
function InitCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(cell, index));
  });
}
function resetGame() {
  // rs - current turn
  currentTurn = TURN.CROSS;
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
  // rs - isGameEnded
  isGameEnded = false;
  // rs - game
  cellValues = cellValues.map(() => '');
  // rs - status game
  updateGameStaus(GAME_STATUS.PLAYING);
  //   rs - cellList
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell) => (cell.className = ''));
  //   rs - replay - btn
  hideReplayButton();
}
function InitReplayButton() {
  const replayButtonElement = getReplayButton();
  if (!replayButtonElement) return;
  replayButtonElement.addEventListener('click', resetGame);
}
(() => {
  InitCellElementList();
  InitReplayButton();
})();
