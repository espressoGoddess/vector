import { db } from '@/lib/firebase/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

export async function create_goal(user_id, goal_data) {
  return addDoc(collection(db, 'users', user_id, 'goals'), {
    ...goal_data,
    status: 'active',
    started_at: serverTimestamp(),
    ended_at: null,
    created_at: serverTimestamp(),
  })
}
