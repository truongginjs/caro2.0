import React, { Component } from "react";

export class History extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAscending: false        }
    }

    changeSoft() {

        this.setState({
            isAscending: !this.state.isAscending
        })
    }

    render() {
        const { isAscending } = this.state;
        const { listHistory, stepNumber, jumpTo } = this.props;
        let moves = listHistory.map((his, move) => {
            const desc = move ?
                `value: ${his.value}; index: (${his.i} : ${his.j})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button className={(stepNumber === move) ? "btn-active" : ""} onClick={() => jumpTo(move)}>{desc}</button>
                </li>
            );
        });



        return (<div>
            <ol>{(isAscending)?moves:moves.reverse()}</ol>
            <button onClick={() => this.changeSoft()}>{isAscending ? "ascending" : "decreasing"}</button>
        </div>)
    }
}


