import { useState, } from "react";

import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { PurchaseButton, } from './purchaseButton.jsx'
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { readGamestate, saveGamestate } from "../firebase/database-service";

const Game = ({uid, db}) => {
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
            <DevTools {...{gamestate, uid, db, gameSetter: setGamestate}}/>
        </>
    )
}

const DevTools = ({gamestate, uid, db, gameSetter}) => (
    <>
        <h1>Devtools</h1>
        <SaveGameButton {...{gamestate, uid, db}}/>
        <GetSaveButton {...{gameSetter, uid, db}}/>
    </>
)

const SaveGameButton = ({gamestate, uid, db}) => (
    <button onClick={() => saveGamestate({gamestate, uid, db})}>
        Write to database
    </button>
)

const GetSaveButton = ({gameSetter, uid, db}) => (
    <button onClick={async () => 
        gameSetter(new Gamestate(await readGamestate({uid, db})))}>
        Read from database
    </button>
)

export { Game }