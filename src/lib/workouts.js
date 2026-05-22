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

export async function createWorkout(userId, goalId, workoutData) {
	const workoutRef = collection(db, 'users', userId, 'workouts')

	return await addDoc(workoutRef, {
		goal_id: goalId || null,
		...workoutData,
		source: workoutData.source || 'manual',
		created_at: serverTimestamp(),
		updated_at: serverTimestamp(),
	})
}

export async function getWorkouts(userId) {
	const workoutRef = collection(db, 'users', userId, 'workouts')
	const snapshot = await getDocs(workoutRef)
	return snapshot.docs.map((workoutDoc) => ({
		id: workoutDoc.id,
		...workoutDoc.data(),
	}))
}
