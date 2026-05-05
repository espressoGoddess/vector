import { signInWithPopup, signOut } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, google_provider } from '@/lib/firebase/firebase'

export async function sign_in_with_google() {
  const result = await signInWithPopup(auth, google_provider)
  const user = result.user

  await setDoc(
    doc(db, 'users', user.uid),
    {
      display_name: user.displayName,
      email: user.email,
      photo_url: user.photoURL,
      updated_at: serverTimestamp(),
      created_at: serverTimestamp(),
    },
    { merge: true }
  )

  return user
}

export function sign_out_user() {
  return signOut(auth)
}
