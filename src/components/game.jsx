import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { PurchaseButton, } from './purchaseButton.jsx'
import { saveGamestate } from "../firebase/save-gamestate";
import { useAnimationFrame } from "../hooks/use-animation-frame";



const Game = ({uid, db}) => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    
    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    return (
        <>
            <div id='game'>
                <SaveGameButton gamestate={gamestate} db={db} uid={uid}/>
                <div id='items'>
                    {Object.values(GamestateVariables)
                           .filter((variable) =>
                                variable!=GamestateVariables.PEKONI && variable!=GamestateVariables.RESET)
                           .map((variable) =>
                                <p key={variable}> {variable}: {gamestate[variable]} </p>)}
                </div>
                <div>
                 <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI].toFixed(2)}</p>
                 <SikaKuva handleClick={() => setGamestate(gamestate.add(GamestateVariables.PEKONI))}/>
                </div>
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

const SaveGameButton = ({gamestate, uid, db}) => <button onClick={() => saveGamestate(gamestate, uid, db)} >Save game woot wooot!</button>

export { Game }