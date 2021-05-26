import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
  * Este es un function component, lo podemos
  * identificar porque no tiene estado y solo
  * tiene la opcion return
  * */
function Square(props) {
  /*
    * Este componente es un componente controlado
    * ya que el componente padre tiene todo el
    * control sobre este
    * */
  return (
    <button 
      className={props.valClass} 
      onClick={props.onClick}>
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let check = this.props.arrayValueClass.includes(i);
    return (
      <Square 
	value={ this.props.squares[i] } 
	onClick={() => this.props.onClick(i)}
	valClass={check ? 'square square-negritas' : 'square'}
      />
    );
  }

  render() {

    //console.log(this.props.valueClass);
  
    let contador = 0;

    const rows = Array(3).fill(null).map((elementr, contr) => {
      const colums = Array(3).fill(null).map((elementc, contc) => {
	contador++;
	return (
	  <div key={contc} className='square key'>
	    {this.renderSquare(contador - 1)}
	  </div>
	);
      });

      return (
	<div key={contr} className='board-row'>
	  {colums}
	</div>
      );
    });

    return (rows);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
	squares: Array(9).fill(null),
	lastMove: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAcendent: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    const lastMove = calcLastMove(i);
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
	squares: squares,
	lastMove: lastMove,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  order() {
    const isAcendent = !this.state.isAcendent;
    this.setState({
      isAcendent: isAcendent,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move ?
	step.lastMove +' Go to move #' + move :
	'Go to game start';
      
      const compare = step === current;

      return (
	<li key={ move }>
	  <button 
	    className={compare ? 'negritas' : ''} 
	    onClick={() => this.jumpTo(move)}>
	    { desc }
	  </button>
	</li>
      );
    });

    if(!this.state.isAcendent) {
      moves.reverse();
    }

    let status;
    let xywinner=[];
    if(winner) {
      status = 'Winner: ' + winner;
      xywinner = winnerSquares(current.squares, winner);
    } else {
      const empate = esEmpate(current.squares);
      if(empate) {
	status = 'Empate'
      } else {
	status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
	    squares={current.squares}
	    onClick={(i) => this.handleClick(i)}
	    arrayValueClass={xywinner}
	  />
        </div>
        <div className="game-info">
          <div>{ status }</div>
	  <button
	    onClick={() => this.order()}
	  >
	    {
	      this.state.isAcendent ? 'Decendente' : 'Acendente'
	    }
	  </button>
          <ol>{ moves }</ol>
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

//Para calcular el ganador
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function winnerSquares(squares, winner) {
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
    if (squares[a] === winner && squares[b] === winner && squares[c] === winner) {
      return lines[i];
    }
  }
  return null;
}

function calcLastMove(i) {
  let row;
  let colum;

  if(i < 3) {
    row = 1;
  } else if(i < 6) {
    row = 2;
  } else {
    row = 3;
  }

  if([0, 3, 6].includes(i)) {
    colum = 1;
  } else if([1, 4, 7].includes(i)) {
    colum = 2;
  } else {
    colum = 3;
  }

  return [colum,row];
}

function esEmpate(squares) {
  for(let i = 0; i < squares.length; i++){
    //console.log(squares[i]);
    if(!squares[i]){
      return false;
    }
  }
  return true;
}
