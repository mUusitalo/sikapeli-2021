import { doc, getDoc, setDoc } from "firebase/firestore"; 


async function readGamestate({uid, db}) {
  let docref = await getDoc(doc(db, "users", uid));
  return docref.data().gamestate
}

async function saveGamestate({uid, gamestate, db}) {
    await setDoc(doc(db, "users", uid),
        {gamestate: {...gamestate}, timestamp: Date.now()}
    );
}

export { readGamestate, saveGamestate }