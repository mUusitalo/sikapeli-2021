import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { Store, } from './store.jsx'

import { useAnimationFrame } from "../hooks/use-animation-frame";


const Game = () => {
    const [gamestate, setGamestate] = useState(new Gamestate())

    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    return (
        <>
            <div id='game'>
                <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI].toExponential(4)}</p>
                <SikaKuva handleClick={() => {setGamestate(gamestate.add(GamestateVariables.PEKONI))}}/>
                <div id='store'><Store gamestate={gamestate} handleClick={x => setGamestate(gamestate.add(x))}/></div>
            </div>
        </>
    )
}

export { Game }