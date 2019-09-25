import React from 'react'

export const Square = (props) => {
    return (<button className={props.winner ? "square square-winner" : "square"} onClick={() => props.onClick()}>{props.value}</button>)
}
//{(props.winner) ?  : "square square-winner"}