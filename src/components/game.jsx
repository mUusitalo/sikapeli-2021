import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { useAnimationFrame } from "../hooks/use-animation-frame";

const Game = () => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    
    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    return (
        <>
            <div id='game'>
                <div id='items'>
                    {Object.values(GamestateVariables)
                           .filter((variable) =>
                                variable!=GamestateVariables.PEKONI && variable!=GamestateVariables.RESET)
                           .map((variable) =>
                                <p> {variable}: {gamestate[variable]} </p>)}
                </div>
                <div>
                 <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI]}</p>
                 <SikaKuva handleClick={() => setGamestate(gamestate.add(GamestateVariables.PEKONI))}/>
                </div>
                <div id='store'>
                    {Object.values(GamestateVariables).map((variable) =>
                        <button key={variable} onClick={() => setGamestate(gamestate.add(variable))}>{variable}</button>)}
                </div>
            </div>
        </>
    )
}

export { Game }