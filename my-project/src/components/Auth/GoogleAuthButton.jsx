import { GoogleLogin } from '@react-oauth/google';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '/src/Firebase';

export default function GoogleAuthButton({ onSuccess }) {
  const handleSuccess = async (credentialResponse) => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'psychologists', user.uid), {
        googleAuthToken: credentialResponse.credential,
      }, { merge: true });
      onSuccess();
    }
  };

  return (
    <div className="my-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Google Login failed')}
        useOneTap
        text="continue_with"
        size="large"
      />
      <p className="text-sm text-gray-500 mt-2">
        Connect Google Calendar to enable automatic meeting creation
      </p>
    </div>
  );
}