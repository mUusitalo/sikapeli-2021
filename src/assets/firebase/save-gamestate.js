import { collection, addDoc } from "firebase/firestore"; 

async function saveGamestate(gamestate, uid, db) {
    try {
        const docRef = await addDoc(collection(db, "gamestates"),
            {...gamestate}
        );
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export { saveGamestate }