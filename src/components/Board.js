import React, { Component } from 'react'
import { Square } from './Square'

export class Board extends Component {

    renderSquare(i, j) {
        return (
            <Square key={20 * i + j}
                value={this.props.squares[i][j]}
                winner={this.props.winnerSquares[i][j]}
                onClick={() => this.props.handleClick(i, j)}
            />
        );
    }

    render() {
        const arr = Array(20).fill(null)
        return (
            <div>
                {arr.map((_, i) => <div className="board-row" key={i}>{arr.map((_, j) => this.renderSquare(i, j))}</div>)}
            </div>
        );
    }

}




