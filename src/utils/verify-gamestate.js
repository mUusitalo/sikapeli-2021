import { getFunctions, httpsCallable } from 'firebase/functions'
import { initializeApp } from 'firebase/app';

import firebaseConfig from '../firebase-config.js'
import { GamestateVariables } from '../game-logic/gamestate-variables.js'
import { Gamestate } from '../game-logic/gamestate.js';

const functions = getFunctions(initializeApp(firebaseConfig), 'europe-central2');
//connectFunctionsEmulator(functions, 'localhost', 5001)
const verifyGamestate = httpsCallable(functions, 'verifyGamestateV2')

/**
 * Compress multiple consecutive clicks into one
 * by taking the sum of their .count and .deltaTime
 * 
 * This is incredibly ugly but it works
 */
function compressModifications(modifications) {
	return modifications.reduce((all, next) => {

		if (all.length === 0) return [next]

		if (next.modification === GamestateVariables.PEKONI
			&& all[all.length - 1].modification === GamestateVariables.PEKONI
		) {
			const copy = [...all]
			const last = { ...copy[copy.length - 1] }

			last.count += 1
			last.deltaTime += next.deltaTime

			copy[copy.length - 1] = last
			return copy
		} else return [...all, next]
	}, [])
}

/**
 * Calls cloud function to verify gamestate.
 */
async function runBackendGamestateVerification({
	modifications,
	previousModificationTime,
	handleVerify
}) {
	const currentTime = Date.now()

	const res = await verifyGamestate({
		modifications: compressModifications(modifications),
		idleTimeAfterModifications: currentTime - previousModificationTime
	})

	const verifiedGamestate = new Gamestate(res.data)

	return verifiedGamestate
}

export default runBackendGamestateVerification
