import { useState, useEffect } from "react";
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { readGamestate, saveGamestate } from "../firebase/database-service";


import runBackendGamestateVerification from "../utils/verify-gamestate.js";
import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { Store, } from './store.jsx'


const Game = ({uid, db}) => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    const [modifications, setModifications] = useState([])
    const [previousModificationTime, setPreviousModificationTime] = useState(Date.now())

    useEffect(async () => {
        setGamestate(new Gamestate(await readGamestate({uid, db})))
    }, [])

    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    const handleVerify = (verifiedGamestate, timestamp) => {
        console.log(verifiedGamestate, timestamp)
        setModifications([])
        setGamestate(verifiedGamestate)
        setPreviousModificationTime(timestamp)
    }

    
    const setGamestateAndLogModification = (modification) => {
        setGamestate(gamestate.add(modification))
        
        const currentTime = Date.now()
        const deltaTime = currentTime - previousModificationTime
        setPreviousModificationTime(currentTime)

        const modificationLogEntry = {
            modification,
            deltaTime,
            count: 1
        }

        setModifications([...modifications, modificationLogEntry])
    }



    return (
        <>
            <div id='game'>
                <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI].toExponential(4)}</p>
                <SikaKuva handleClick={() => {setGamestateAndLogModification(GamestateVariables.PEKONI)}}/>
                <div id='store'><Store gamestate={gamestate} handleClick={x => setGamestateAndLogModification(x)}/></div>
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

const VerifyGamestateButton = (props) => (
    <button onClick={() => runBackendGamestateVerification(props)}>Verify gamestate</button>
)

export { Game }