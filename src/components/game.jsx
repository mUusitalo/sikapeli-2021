import { useState, } from "react";
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions'

import firebaseConfig from '../firebase-config.js'
import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { Store, } from './store.jsx'
import { Icons, } from './icons.jsx'

import { useAnimationFrame } from "../hooks/use-animation-frame";
import { readGamestate, saveGamestate } from "../firebase/database-service";


const functions = getFunctions(initializeApp(firebaseConfig));
connectFunctionsEmulator(functions, 'localhost', 5001)
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
                <div id="counter">
                    <div id='bacon-counter'>{gamestate.formatNumber(gamestate[GamestateVariables.PEKONI])} <img class="counter-icon" src={Icons[GamestateVariables.PEKONI]}/></div>
                    <div id='bacon-per-second'>{gamestate.calculateBaconPerSecond().toFixed(1)} <img class="bpc-icon" src={Icons[GamestateVariables.PEKONI]}/>/S</div>
                </div>
                <SikaKuva handleClick={() => {setGamestateAndLogModification(GamestateVariables.PEKONI)}}/>
                <div id='store'><Store gamestate={gamestate} handleClick={x => setGamestateAndLogModification(x)}/></div>
            </div>
            {/*<DevTools {...{gamestate, uid, db, gameSetter: setGamestate, modifications, previousModificationTime, handleVerify}}/>*/}
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