import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { useAnimationFrame } from "../hooks/use-animation-frame";


const Game = () => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    
    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    return (
        <>
            {Object.values(GamestateVariables).map((variable) =>
                <button key={variable} onClick={() => setGamestate(gamestate.add(variable))}>{variable}</button>)}
            <p>{JSON.stringify(gamestate)}</p>
        </>
    )
}

export { Game }