import { db } from '@/lib/firebase/firebase'
import { addDoc, doc, updateDoc, collection, serverTimestamp } from 'firebase/firestore'

export async function createGoal(user_id, goal_data) {
  return addDoc(collection(db, 'users', user_id, 'goals'), {
    ...goal_data,
    status: 'active',
    started_at: serverTimestamp(),
    ended_at: null,
    created_at: serverTimestamp(),
  })
}

export async function endGoal(user_id, goal_id, status) {
  const currentGoal = doc(db, 'users', user_id, 'goals', goal_id)

  await updateDoc(currentGoal, {
    ended_at: serverTimestamp(),
    status,
  })
}
