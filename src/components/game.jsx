import { useState, useEffect, useRef, useCallback } from "react";
import { useAnimationFrame } from "../hooks/use-animation-frame";
import { useBeforeunload } from 'react-beforeunload';

import { readGamestate } from "../firebase/database-service";
import { VERIFICATION_FREQUENCY, MAX_FAILED_SAVE_TRIES } from '../constants.js';
import runBackendGamestateVerification from "../utils/verify-gamestate.js";
import { alertAndLogError } from '../utils/utils.js'
import { Gamestate, } from '../game-logic/gamestate'
import { GamestateVariables, } from "../game-logic/gamestate-variables";
import { SikaKuva, } from './sikaKuva.jsx'
import { Store, } from './store.jsx'
import { Icons, } from './icons.jsx'

const Game = ({uid, db, signOut}) => {
    const [gamestate, setGamestate] = useState(new Gamestate())
    const modificationsRef = useRef([])
    const previousModificationTimeRef = useRef(Date.now())
    const saveTriesRef = useRef(0)
    const previousVerificationRef = useRef({gamestate, timestamp: previousModificationTimeRef.current})

    useBeforeunload(() => 'Suljethan pelin kiltisti "Sign out"-napin kautta, niin pelitilasi tallennetaan tietokantaan 🤠')

    const handleVerify = useCallback(verifiedGamestate => {
        setGamestate(verifiedGamestate)
        previousModificationTimeRef.current = Date.now()
        modificationsRef.current = []
        previousVerificationRef.current = {
            gamestate: verifiedGamestate,
            timestamp: previousModificationTimeRef.current
        }
    }, [setGamestate, modificationsRef, previousModificationTimeRef, previousVerificationRef])
    
    useEffect(() => {
        readGamestate({uid, db})
            .then(({gamestate: plainGamestate, timestamp}) => {
                const gamestate = new Gamestate(plainGamestate)
                previousVerificationRef.current = {
                    gamestate,
                    timestamp
                }
                setGamestate(gamestate)
            })
    }, [uid, db])

    useAnimationFrame(deltaTime => setGamestate(gamestate => gamestate.stepInTime(deltaTime)))

    const resetToPreviousVerifiedState = useCallback(() => {
        previousModificationTimeRef.current = previousVerificationRef.current.timestamp
        modificationsRef.current = []
        saveTriesRef.current = 0
        setGamestate(previousVerificationRef.current.gamestate)
    }, [previousModificationTimeRef, modificationsRef, saveTriesRef, setGamestate])


    const handleNetworkError = useCallback(e => {
        if (saveTriesRef.current < MAX_FAILED_SAVE_TRIES) {
            saveTriesRef.current += 1
            alertAndLogError("Could not save the game. Is your internet connection OK?", e)
        } else {
            alertAndLogError("Reverting game to previously saved state due to connection error.", e)
            resetToPreviousVerifiedState()
        }
    }, [resetToPreviousVerifiedState])

    const handleVerificationError = useCallback(e => {
        alertAndLogError("Reverting game to previously saved state due to an unexpected error", e)
        resetToPreviousVerifiedState()
    }, [resetToPreviousVerifiedState])

    useEffect(() => {
        const id = setInterval(
            async () => {
                console.log("Autosaving")
                try {
                    const verifiedGamestate = await runBackendGamestateVerification({
                        modifications: modificationsRef.current,
                        previousModificationTime: previousModificationTimeRef.current,
                    })
                    handleVerify(verifiedGamestate)
                } catch (e) {
                    const { name, message } = e
                    if (name === "VerificationError") { console.log("Got verification error");handleVerificationError(message)}
                    else {handleNetworkError(message)}
                }
            },
            VERIFICATION_FREQUENCY)
        
        return () => clearInterval(id)
    }, [modificationsRef, previousModificationTimeRef, handleVerify, handleNetworkError, handleVerificationError])
    
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
                    <div id='bacon-counter'>{gamestate.formatNumber((gamestate[GamestateVariables.PEKONI]), 5)} <img class="counter-icon" src={Icons[GamestateVariables.PEKONI]} alt="bacon"/></div>
                    <div id='bacon-per-second'>{gamestate.calculateBaconPerSecond().toFixed(1)} <img class="bpc-icon" src={Icons[GamestateVariables.PEKONI]} alt="bacon"/>/S</div>
                </div>
                <SikaKuva baconPerClick={baconPerClick} handleClick={() => {setGamestateAndLogModification(GamestateVariables.PEKONI)}}/>
                <div id='store'><Store gamestate={gamestate} handleClick={x => setGamestateAndLogModification(x)}/></div>
            </div>
        </>
    )
}

const SignOut = ({signOut, modificationsRef, previousModificationTimeRef}) => {
    const [ isLoading, setLoading ] = useState(false)

    const verifyAndSignOut = async () => {

        setLoading(true)
        try {
            await runBackendGamestateVerification({
                modifications: modificationsRef.current, 
                previousModificationTime: previousModificationTimeRef.current,
            })    
        } catch (e) {
            console.error("Failed to save the game.", e)
            if (!window.confirm(`Failed to save the game. Quit anyway? Error: ${e.message}`)) {
                setLoading(false)
                return
            }
        }
        setLoading(false)
        signOut()
    }
    return (<button id="sign-out" disabled={isLoading} onClick={verifyAndSignOut}>Sign Out</button>)
}

export { Game }