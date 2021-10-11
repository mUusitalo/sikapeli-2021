import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
//import { getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth';
//import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBs-vaqBiC5zL5j4Q6RKECz4xlunLmi8hU",
  authDomain: "sikapeli-2021.firebaseapp.com",
  projectId: "sikapeli-2021",
  storageBucket: "sikapeli-2021.appspot.com",
  messagingSenderId: "443237001906",
  appId: "1:443237001906:web:001f50d6c57ee645c737ab"
})

const auth = getAuth(firebaseApp);
//const firestore = getFirestore(firebaseApp);


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Sikagame 2021</h1>
        <SignOut />
      </header>

      <section>
        {user ? <h1>Olet kirjautunut :)</h1> : <SignIn />}
      </section>

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

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;
