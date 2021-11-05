import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getPerformance } from 'firebase/performance'

import { useAuthState } from 'react-firebase-hooks/auth';
//import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebaseConfig from './firebase-config.js'
import { Game } from './components/game.jsx'

const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp);
const performance = getPerformance(firebaseApp)
const auth = getAuth(firebaseApp);
const db = getFirestore()

function App() {
  const [ user ] = useAuthState(auth);

  document.title = "Sikapeli"

  return (
    <div className="App">
      <header>
        <div class="empty"></div>
        <h1 id="game-title">SikaClick</h1>
        <div id="sign-in">
        <SignOut />
        <section>
          {user ? <SignedInComponent/> : <SignIn/>}
        </section>
        </div>
      </header>
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
