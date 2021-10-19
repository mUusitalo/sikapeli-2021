import { doc, getDoc } from "firebase/firestore"; 


async function readGamestate(gamestate, uid, db) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
}

export { readGamestate }