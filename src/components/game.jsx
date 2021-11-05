import { useState, useEffect, useRef, useCallback } from "react";
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { readGamestate } from "../firebase/database-service";


import { VERIFICATION_FREQUENCY } from '../constants.js';
import runBackendGamestateVerification from "../utils/verify-gamestate.js";
import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { Store, } from './store.jsx'

const Game = ({uid, db}) => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    const modificationsRef = useRef([])
    const previousModificationTimeRef = useRef(Date.now())

    useEffect(() => {
        readGamestate({uid, db})
            .then(plainGamestate =>
                setGamestate(new Gamestate(plainGamestate)))
    }, [uid, db])

    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    const handleVerify = useCallback((verifiedGamestate, timestamp) => {
        setGamestate(verifiedGamestate)
        previousModificationTimeRef.current = timestamp
        modificationsRef.current = []
    }, [setGamestate, modificationsRef, previousModificationTimeRef])

    useEffect(() => {
        // This might need cleanup
        setInterval(
            () => runBackendGamestateVerification({
                modifications: modificationsRef.current,
                previousModificationTime: previousModificationTimeRef.current,
                handleVerify
            }),
            VERIFICATION_FREQUENCY)
    }, [modificationsRef, previousModificationTimeRef, handleVerify])
    
    const setGamestateAndLogModification = (modification) => {
        setGamestate(gamestate.add(modification))
        
        const currentTime = Date.now()
        const deltaTime = currentTime - previousModificationTimeRef.current
        previousModificationTimeRef.current = currentTime

        const modificationLogEntry = {
            modification,
            deltaTime,
            count: 1
        }

        modificationsRef.current = [...modificationsRef.current, modificationLogEntry]
    }

    return (
        <>
            <div id='game'>
                <p id='bacon-counter'>{gamestate[GamestateVariables.PEKONI].toExponential(4)}</p>
                <SikaKuva handleClick={() => {setGamestateAndLogModification(GamestateVariables.PEKONI)}}/>
                <div id='store'><Store gamestate={gamestate} handleClick={x => setGamestateAndLogModification(x)}/></div>
            </div>
        </>
    )
}

export { Game }