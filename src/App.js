import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth';
//import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebaseEnv from './firebase-env.js'
import { Game } from './components/game.jsx'

const firebaseApp = initializeApp(firebaseEnv)
const auth = getAuth(firebaseApp);
const db = getFirestore()

function App() {
  const [ user ] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <SignOut/>
        <section id='sign-in'>
            {user ? <SignedInComponent/> : <SignIn/>}
        </section>
      </header>
      <h1 id='game-title'>Sikapeli 2021</h1>
      {user ? <Game uid={user.uid} db={db}/> : <h1>Kirjaudu sisään pelataksesi</h1>}
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
