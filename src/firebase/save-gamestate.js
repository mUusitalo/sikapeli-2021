import { doc, setDoc } from "firebase/firestore"; 

async function saveGamestate(gamestate, db, uid) {
    await setDoc(doc(db, "users", uid),
        {...gamestate}
    );
}

export {
    saveGamestate,
}