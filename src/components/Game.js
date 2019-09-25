import React, { Component } from "react";
import { Board } from "./Board";
import { History } from './History'

export class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ value: null, i: null, j: null }],
            stepNumber: 0,
            xIsNext: true,
            winner: null,
            winnerSquares: Array(20).fill(Array(20).fill(null)),
            squares: Array(20).fill(Array(20).fill(null))
        };
    }

    handleClick(i, j) {
        const { winner, history, stepNumber, xIsNext, squares } = this.state;

        const newHistory = history.slice(0, stepNumber + 1)
        let newSquares = [];
        squares.map(value => newSquares.push(value.slice()));


        if (winner || newSquares[i][j]) return;
        newSquares[i][j] = xIsNext ? 'X' : 'O';
        const winnerS = calculateWinner(i, j, newSquares)
        this.setState({
            history: newHistory.concat({ value: xIsNext ? 'X' : 'O', i, j }),
            xIsNext: !xIsNext,
            winner: winnerS[i][j],
            winnerSquares: winnerS,
            stepNumber: newHistory.length,
            squares: newSquares
        });
    }

    jumpTo(step) {
        const { history } = this.state
        let newSquares = Array(20).fill(null).map(() => Array(20).fill(null))

        if (step > 0) {
            for (let index = 1; index <= step; index++) {
                const his = history[index]
                newSquares[his.i][his.j] = his.value
            }
        }

        var index = history[step]
        const winnerS = calculateWinner(index.i || 0, index.j || 0, newSquares)


        this.setState({
            squares: newSquares,
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            winner: winnerS[index.i || 0][index.j || 0],
            winnerSquares: winnerS
        });
    }

    render() {
        const { history, winner, xIsNext, squares, stepNumber, winnerSquares } = this.state;
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} winnerSquares={winnerSquares} handleClick={(i, j) => this.handleClick(i, j)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <History listHistory={history} stepNumber={stepNumber} jumpTo={(move) => this.jumpTo(move)} />

                </div>
            </div>
        );
    }
}

const calculateWinner = (i, j, squares) => {
    let result = Array(20).fill(null).map(() => Array(20).fill(null))

    let count = 0;
    const pValue = squares[i][j]
    let index = { i: i, j: (j - 4 < 0) ? 0 : j - 4 }

    if (!pValue)
        return result

    //check row
    while (index.j <= j) {
        let run = { i: index.i, j: index.j }
        while (count < 5) {

            if (!checkIndex(run) || pValue !== squares[run.i][run.j]) {
                count = 0
                break
            }
            run.j++
            count++
        }

        if (count === 5) {
            const start = { i: index.i, j: index.j - 1 }
            const end = { i: index.i, j: index.j + 5 }
            if (checkRudeVN(squares, start, end, index)) {
                while (count > 0) {
                    result[index.i][index.j] = squares[i][j]
                    index.j++;
                    count--;
                }
                return result
            } else {
                count = 0
            }
        }

        index.j++;

    }

    //check column
    index = { i: (i - 4 < 0) ? 0 : i - 4, j: j }
    while (index.i <= i) {
        let run = { i: index.i, j: index.j }
        while (count < 5) {
            if (!checkIndex(run) || squares[i][j] !== squares[run.i][run.j]) {
                count = 0
                break
            }
            run.i++
            count++
        }

        if (count === 5) {
            const start = { i: index.i - 1, j: index.j }
            const end = { i: index.i + 5, j: index.j }
            if (checkRudeVN(squares, start, end, index)) {
                while (count > 0) {
                    result[index.i][index.j] = squares[i][j];
                    index.i++;
                    count--;
                }
                return result
            }
            else
                count = 0



        }
        index.i++;
    }
    //check diagonal up right
    if (19 - i < 4 || j < 4) {
        if (19 - i < j) {
            index = { i: 19, j: j - 19 + i }
        }
        else {
            index = { i: i + j, j: 0 }
        }
    } else {
        index = { i: i + 4, j: j - 4 }
    }

    while (index.j <= j) {
        let run = { i: index.i, j: index.j }
        while (count < 5) {
            if (!checkIndex(run) || squares[i][j] !== squares[run.i][run.j]) {
                count = 0
                break
            }
            run.i--;
            run.j++;
            count++
        }


        if (count === 5) {
            const start = { i: index.i + 1, j: index.j - 1 }
            const end = { i: index.i - 5, j: index.j + 5 }
            if (checkRudeVN(squares, start, end, index)) {
                while (count > 0) {
                    result[index.i][index.j] = squares[i][j];
                    index.i--;
                    index.j++;
                    count--;
                }
                return result
            }
            else
                count = 0
        }
        index.i--;
        index.j++;
    }

    // //check diagonal down right
    if (i < 4 || j < 4) {
        if (i < j) {
            index = { i: 0, j: j - i }
        }
        else {
            index = { i: i - j, j: 0 }
        }
    } else {
        index = { i: i - 4, j: j - 4 }
    }

    while (index.j <= j) {
        let run = { i: index.i, j: index.j }
        while (count < 5) {
            if (!checkIndex(run) || squares[i][j] !== squares[run.i][run.j]) {
                count = 0
                break
            }
            run.i++;
            run.j++;
            count++
        }

        if (count === 5) {
            const start = { i: index.i - 1, j: index.j - 1 }
            const end = { i: index.i + 5, j: index.j + 5 }
            if (checkRudeVN(squares, start, end, index)) {
                while (count > 0) {
                    result[index.i][index.j] = squares[i][j];
                    index.i++;
                    index.j++;
                    count--;
                }
                return result
            }
            else
                count = 0
        }
        index.i++;
        index.j++;
    }
    return result;
}

const checkIndex = (index) => {
    if (index.i >= 0 && index.i < 20 && index.j >= 0 && index.j < 20) {
        return true
    }
    return false

}

const checkRudeVN = (squares, startIndex, endIndex, index) => {
    if (startIndex.i >= 0 && startIndex.i < 20 && endIndex.i >= 0 && startIndex.j < 20) {
        const start = squares[startIndex.i][startIndex.j]
        const end = squares[endIndex.i][endIndex.j]
        const value = squares[index.i][index.j]
        if (start && end)
            if (value !== start && value !== end) {
                return false
            }
    }
    return true
}