import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth';
//import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebaseEnv from './firebase-config.js'
import { Game } from './components/game.jsx'
import { useEffect } from 'react';

const firebaseApp = initializeApp(firebaseEnv)
const auth = getAuth(firebaseApp);
const db = getFirestore()

function App() {
  const [ user ] = useAuthState(auth);

  useEffect(() => document.title = "Sikapeli", [])

  return (
    <div className="App">
      <header>
        <div class="empty"></div>
        <h1 id="game-title">SikaClick</h1>
      </header>
      {user ? <Game uid={user.uid} db={db} signOut={() => auth.currentUser && auth.signOut()}/>:<SignIn/>}
    </div>
  );
}

const SignIn = () => {

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <div id="sign-in">
      <p>When closing the page please do so by clicking the "sign out" button to make sure your game is saved!</p>
      <p>The player with the most resets will be awarded a prize at the main event 🤠</p>
      <button onClick={signInWithGoogle}>Sign in with Google to play</button>
      <p id="post-scriptum">PS. There's more spaghetti in the game's code than at Täffä, so if something unexpected happens, contact sikajuhla21@gmail.com</p>
    </div>
  )

}


export default App;
