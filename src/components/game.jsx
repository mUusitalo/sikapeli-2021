import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { PurchaseButton, } from './purchaseButton.jsx'
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
                <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI].toFixed(2)}</p>
                <SikaKuva handleClick={() => setGamestate(gamestate.add(GamestateVariables.PEKONI))}/>
                <div id='store'>
                    {Object.values(GamestateVariables)
                    .filter(variable => variable !== GamestateVariables.PEKONI)
                    .map((variable) =>
                        <PurchaseButton
                            key={variable}
                            gamestate={gamestate}
                            generator={variable}
                            onClick={() => setGamestate(gamestate.add(variable))}
                            canBuy={gamestate.canBuy(variable)}
                    />)}
                </div>
            </div>
        </>
    )
}

export { Game }