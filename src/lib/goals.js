import { db } from '@/lib/firebase/firebase'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

export async function createGoal(userId, goalData) {
  const goalsRef = collection(db, 'users', userId, 'goals')

  return addDoc(goalsRef, {
    ...goalData,
    status: 'active',
    started_at: serverTimestamp(),
    ended_at: null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
}

export async function getGoals(userId) {
  const goalsRef = collection(db, 'users', userId, 'goals')
  const activeGoalQuery = query(goalsRef, where('status', '==', 'active'))
  const snapshot = await getDocs(activeGoalQuery)

  if (snapshot.empty) return null

  const goalDoc = snapshot.docs[0]

  return {
    id: goalDoc.id,
    ...goalDoc.data(),
  }
}

export async function editGoal(userId, goalId, goalData) {
  const goalRef = doc(db, 'users', userId, 'goals', goalId)

  return updateDoc(goalRef, {
    ...goalData,
    updated_at: serverTimestamp(),
  })
}

export async function endGoal(userId, goalId, status = 'completed') {
  const goalRef = doc(db, 'users', userId, 'goals', goalId)

  return updateDoc(goalRef, {
    status,
    ended_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
}
