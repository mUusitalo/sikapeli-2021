import { useState, } from "react";
import { initializeApp } from 'firebase/app';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions'

import firebaseEnv from '../firebase-env.js'
import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { PurchaseButton, } from './purchaseButton.jsx'
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { readGamestate, saveGamestate } from "../firebase/database-service";


const functions = getFunctions(initializeApp(firebaseEnv));
connectFunctionsEmulator(functions, 'localhost', 5001); // This is for emulator testing only
const verifyGamestate = httpsCallable(functions, 'verifyGamestate')

const Game = ({uid, db}) => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    const [modifications, setModifications] = useState([])
    const [previousModificationTime, setPreviousModificationTime] = useState(Date.now())

    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    const setGamestateAndLogModification = (modification) => {
        setGamestate(gamestate.add(modification))
        
        const currentTime = Date.now()
        const deltaTime = currentTime - previousModificationTime
        setPreviousModificationTime(currentTime)

        const modificationLogEntry = {
            modification: modification,
            deltaTime: deltaTime 
        }

        setModifications([...modifications, modificationLogEntry])
    }

    const handleVerify = (verifiedGamestate, timestamp) => {
        console.log(verifiedGamestate, timestamp)
        setModifications([])
        setGamestate(verifiedGamestate)
        setPreviousModificationTime(timestamp)
    }

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
                 <SikaKuva handleClick={() => setGamestateAndLogModification(GamestateVariables.PEKONI)}/>
                </div>
                <div id='store'>
                    {Object.values(GamestateVariables)
                    .filter(variable => variable !== GamestateVariables.PEKONI)
                    .map((variable) =>
                        <PurchaseButton
                            key={variable}
                            gamestate={gamestate}
                            generator={variable}
                            onClick={() => setGamestateAndLogModification(variable)}
                            canBuy={gamestate.canBuy(variable)}
                    />)}
                </div>
            </div>
            <DevTools {...{gamestate, uid, db, gameSetter: setGamestate, modifications, previousModificationTime, handleVerify}}/>
        </>
    )
}

const DevTools = ({gamestate, uid, db, gameSetter, modifications, previousModificationTime, handleVerify}) => (
    <>
        <h1>Devtools</h1>
        <SaveGameButton {...{gamestate, uid, db}}/>
        <GetSaveButton {...{gameSetter, uid, db}}/>
        <VerifyGamestateButton {...{modifications, previousModificationTime, handleVerify}}/>
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

const VerifyGamestateButton = ({modifications, previousModificationTime, handleVerify}) => (
    <button onClick={async () => {
        const currentTime = Date.now()
        const res = await verifyGamestate({
            modifications,
            idleTimeAfterModifications: currentTime - previousModificationTime
        })
        const verifiedGamestate = new Gamestate(res.data)
        handleVerify(verifiedGamestate, currentTime)
    }}>
        Verify gamestate
    </button>
)

export { Game }