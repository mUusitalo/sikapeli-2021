import { useState, useEffect, useRef, useCallback } from "react";
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { useBeforeunload } from 'react-beforeunload';

import { readGamestate } from "../firebase/database-service";
import { VERIFICATION_FREQUENCY } from '../constants.js';
import runBackendGamestateVerification from "../utils/verify-gamestate.js";
import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { Store, } from './store.jsx'
import { Icons, } from './icons.jsx'

const Game = ({uid, db, signOut}) => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    const modificationsRef = useRef([])
    const previousModificationTimeRef = useRef(Date.now())

    useBeforeunload(() => 'Suljethan pelin kiltisti "Sign out"-napin kautta, niin pelitilasi tallennetaan tietokantaan 🤠')

    const handleVerify = useCallback((verifiedGamestate, timestamp) => {
        setGamestate(verifiedGamestate)
        previousModificationTimeRef.current = timestamp
        modificationsRef.current = []
    }, [setGamestate, modificationsRef, previousModificationTimeRef])
    
    useEffect(() => {
        readGamestate({uid, db})
            .then(plainGamestate =>
                setGamestate(new Gamestate(plainGamestate)))

        return () => {
            console.log("Verified gamestate after sign out")
            runBackendGamestateVerification({
            modifications: modificationsRef.current,
            previousModificationTime: previousModificationTimeRef.current,
            handleVerify: () => {}
        })}
    }, [uid, db, handleVerify])

    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    useEffect(() => {
        // This might need cleanup
        const id = setInterval(
            () => {
                console.log("Verifying gamestate")
                runBackendGamestateVerification({
                    modifications: modificationsRef.current,
                    previousModificationTime: previousModificationTimeRef.current,
                    handleVerify
            })},
            VERIFICATION_FREQUENCY)
        
        return () => clearInterval(id)
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

    const baconPerClick = 1 + gamestate[GamestateVariables.KERROIN]*(gamestate.calculateBaconPerSecond() / 100)

    return (
        <>
            <SignOut {...{signOut, modificationsRef, previousModificationTimeRef}}/>
            <div id='game'>
                <div id="counter">
                    <div id='bacon-counter'>{gamestate.formatNumber((gamestate[GamestateVariables.PEKONI]), 5)} <img class="counter-icon" src={Icons[GamestateVariables.PEKONI]}/></div>
                    <div id='bacon-per-second'>{gamestate.calculateBaconPerSecond().toFixed(1)} <img class="bpc-icon" src={Icons[GamestateVariables.PEKONI]}/>/S</div>
                </div>
                <SikaKuva baconPerClick={baconPerClick} handleClick={() => {setGamestateAndLogModification(GamestateVariables.PEKONI)}}/>
                <div id='store'><Store gamestate={gamestate} handleClick={x => setGamestateAndLogModification(x)}/></div>
            </div>
        </>
    )
}

const SignOut = ({signOut, modificationsRef, previousModificationTimeRef}) => {
    const verifyAndSignOut = () => {
        runBackendGamestateVerification({
            modifications: modificationsRef.current, 
            previousModificationTime: previousModificationTimeRef.current,
        })
        signOut()
    }
    return (<button id="sign-out" onClick={verifyAndSignOut}>Sign Out</button>)
}

export { Game }