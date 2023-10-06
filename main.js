
const player = (sign) => {

    this.sign = sign;

    const getSign = () =>{
        return sign;
    };

    return { getSign };
}

const gameBoard = (()=>{
    const board = ["","","","","","","","",""];

    const setCell = (index,sign) => {
        if(index > board.length) return ;
        board[index] = sign;
    }

    const getCell = (index) => {
        if(index > board.length) return ;
        return board[index];
    }

    const reset = () =>{
        for(let i = 0; i < board.length; i++){
            board[i] = "";
        }
    }

    return { setCell, getCell, reset};
})();

const displayController = (()=>{
    const cells = document.querySelectorAll(".cell");
    const messageElement = document.getElementById("message");
    const restartElement = document.getElementById("restart");

    cells.forEach((cell)=>{
        cell.addEventListener('click',(e)=>{
            if(gameController.getIsOver() || e.target.textContent !== "") return ;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameBoard();
        });
    });

    restartElement.addEventListener('click',(e) => {
        gameBoard.reset();
        gameController.reset();
        updateGameBoard();
        setMessageElement("Player X's Turn");
    });

    const updateGameBoard = () => {
        for(let i = 0; i < cells.length; i++){
            cells[i].textContent = gameBoard.getCell(i);
        }
    };

    const setMessageElement = (message) => {
        messageElement.textContent = message;
    };

    const setResultMessage = (winner) => {
        if(winner == "Draw"){
            setMessageElement("It's a draw");
        }
        else{
            setMessageElement(`Player ${winner} wins`)
        }
    }

    return { setMessageElement, setResultMessage};

})();

const gameController = (()=>{
    const playerX = player('X');
    const playerO = player('O');
    let round = 1;
    let isOver = false;

    const playRound = (cellIndex) => {
        gameBoard.setCell(cellIndex,getCurrentPlayerSign());
        if(checkWinner(cellIndex)){
            displayController.setResultMessage(getCurrentPlayerSign());
            isOver = true; 
            return ;
        }
        if(round === 9){
            displayController.setResultMessage("Draw");
            isOver = true;
            return ;
        }
        round++;
        displayController.setMessageElement(`Player ${getCurrentPlayerSign()}'s turn`);
    }

    const getCurrentPlayerSign = () => {
        return round%2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const checkWinner = (cellIndex) => {
        const winConditions = [
            [0, 1, 2], 
            [0, 3, 6], 
            [0, 4, 8],
            [1, 4, 7], 
            [2, 5, 8], 
            [2, 4, 6],
            [3, 4, 5], 
            [6, 7, 8]
        ];

        return winConditions
        .filter(combination => combination.includes(cellIndex))
        .some(possibleCombination => 
            possibleCombination.every(index => 
                gameBoard.getCell(index) === getCurrentPlayerSign()
            )
        );
    }

    const getIsOver = () => {
        return isOver;
    }

    const reset = () => {
        round = 1;
        isOver = false;
    }

    return { playRound, getIsOver, reset};

})();