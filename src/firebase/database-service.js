import { doc, getDoc, setDoc } from "firebase/firestore"; 


async function readGamestate({uid, db}) {
  let docref = await getDoc(doc(db, "users", uid));
  return docref.data()
}

async function saveGamestate({uid, gamestate, db}) {
    await setDoc(doc(db, "users", uid),
        {...gamestate}
    );
}

export { readGamestate, saveGamestate }