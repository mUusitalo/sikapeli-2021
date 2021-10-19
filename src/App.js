import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth';
//import { useCollectionData } from 'react-firebase-hooks/firestore';

import { Game } from './components/game.jsx'

import { saveGamestate } from './firebase/save-gamestate';
import { readGamamestate } from './firebase/read-gamestate';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBs-vaqBiC5zL5j4Q6RKECz4xlunLmi8hU",
  authDomain: "sikapeli-2021.firebaseapp.com",
  projectId: "sikapeli-2021",
  storageBucket: "sikapeli-2021.appspot.com",
  messagingSenderId: "443237001906",
  appId: "1:443237001906:web:001f50d6c57ee645c737ab"
})

const auth = getAuth(firebaseApp);
const db = getFirestore()

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut />
        <section id='sign-in'>
            {user ? <SignedInComponent/> : <SignIn />}
        </section>
      </header>
      <h1 id='game-title'>{/*'Sikapeli 2021' OPSEC'*/'O1-PROJEKTI'/* FAKE */}</h1>
      <Game uid={auth.currentUser.uid} db={db}/>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )

}

const SignedInComponent = () => (
  <>
    <p>JEEJEE kirjautunut sisään 😎</p>
  </>
)

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


export default App;
