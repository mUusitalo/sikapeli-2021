import { doc, getDoc, setDoc } from "firebase/firestore"; 

async function readGamestate({uid, db}) {
  let docref = await getDoc(doc(db, "users", uid));
  const data = docref?.data() ?? {}
  return {
    gamestate: data.gamestate,
    timestamp: data.timestamp
  }
}

async function saveGamestate({uid, gamestate, db}) {
    await setDoc(doc(db, "users", uid),
        {gamestate: {...gamestate}, timestamp: Date.now()}
    );
}

export { readGamestate, saveGamestate }