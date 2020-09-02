import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  console.log(props);
  return (
    <button className={props.highlight ? "square highlight" : "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
  
  class Board extends React.Component {
    renderRow(i) {
      const final = [];

      for(let s=0; s<this.props.boardSize; s++) {
        final.push(
          this.renderSquare(i)
        )
        i++;
      }

      return final;
    }

    renderSquare(i) {
      return (
        <Square
          highlight={this.props.highlightedSquares && this.props.highlightedSquares.includes(i)}
          onClick={() => this.props.onClick(i)}
          value={this.props.squares[i]}
        />
      );
    }
  
    render() {
      const final = [];
      let squareCount = 0;
      for(let i=0; i<this.props.boardSize; i++) {
        final.push(
          <div className="board-row">
            {this.renderRow(squareCount)}
          </div>
        );
        squareCount += this.props.boardSize;
      }

      return (
        <div>
          {final}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.boardSize = 3;
      this.state = {
        history: [{
          squares: Array(this.boardSize * this.boardSize).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();

      if(calculateWinner(squares) || squares[i]) {
        // Do nothing if the square is already filled 
        // OR if there is a winner.
        return;
      }

      // Take spot on board
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      // Generate move summary
      const summary = squares[i] + " to " + i;
      this.setState({
        history: history.concat([{
          squares: squares,
          summary: summary
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step%2) === 0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ? 
        'Go to move #' + move + " (" + step.summary + ")":
        'Go to game start';

        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} className={move === history.length-1 ? "current-move" : ""}>
              {desc}
            </button>
          </li>
        );
      })

      let status;
      if(winner && winner.player) {
        status = 'Winner, ' + winner.player + '!';
      } else if (winner && winner.player === null) {
        status = "Draw!";
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      console.log(winner)
      return (
        <div className="game">
          <div className="game-board">
            <Board
              boardSize={this.boardSize}
              highlightedSquares={winner ? winner.pattern : null}
              onClick={(i) => this.handleClick(i)}
              squares={current.squares}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          pattern: lines[i],
          player: squares[a]
        };
      }
    }

    if(!squares.includes(null)) {
      return {
        player: null
      }
    }

    return null;
  }