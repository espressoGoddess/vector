import { db } from '@/lib/firebase/firebase'
import {
  addDoc,
  doc,
  updateDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore'

export async function createGoal(userId, goal_data) {
  return addDoc(collection(db, 'users', userId, 'goals'), {
    ...goal_data,
    status: 'active',
    started_at: serverTimestamp(),
    ended_at: null,
    created_at: serverTimestamp(),
  })
}

export async function endGoal(userId, goalId, status) {
  const currentGoal = doc(db, 'users', userId, 'goals', goalId)

  await updateDoc(currentGoal, {
    ended_at: serverTimestamp(),
    status,
  })
}

export async function getGoals(userId) {
  const goals = collection(db, 'users', userId, 'goals')
  const fetchedGoal = query(goals, where('status', '==', 'active'))
  const snapshot = await getDocs(fetchedGoal)
  if (snapshot.empty) return null

  const goalDoc = snapshot.docs[0]

  return {
    id: goalDoc.id,
    ...goalDoc.data(),
  }
}
