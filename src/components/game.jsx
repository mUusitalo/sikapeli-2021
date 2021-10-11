import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";

const Game = () => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    
    console.log(gamestate)

    return (
        <>
            {Object.values(GamestateVariables).map((variable) =>
                <button key={variable} onClick={() => setGamestate(gamestate.add(variable))}>{variable}</button>)}
            <p>{JSON.stringify(gamestate)}</p>
        </>
    )
}

export { Game }