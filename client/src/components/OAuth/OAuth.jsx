import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'

import { signInStart, signInSuccess } from "../../redux/user/userSlice";
import { app } from '../../firebase';



export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const results = await signInWithPopup(auth, provider);

      dispatch(signInStart());

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: results.user.displayName,
          email: results.user.email,
          image: results.user.photoURL,
        }),
      })
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/hero");
    } catch (error) {
      console.log('Could not sign in with Google', error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className=" flex w-full mt-6 uppercase justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
    >
      continue with google
    </button>
  );
}
