import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'

const Game = () => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    
    console.log(gamestate)

    return (
        <>
            <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI]}</p>
            <SikaKuva handleClick={() => setGamestate(gamestate.add(GamestateVariables.PEKONI))}/>
            {Object.values(GamestateVariables).map((variable) =>
                <button key={variable} onClick={() => setGamestate(gamestate.add(variable))}>{variable}</button>)}
            <p>{JSON.stringify(gamestate)}</p>
        </>
    )
}

export { Game }