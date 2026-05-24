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
	deleteDoc,
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

export async function deleteWorkout(userId, workoutId) {
	if (!userId || !workoutId) {
		throw new Error('Missing userId or workoutId')
	}

	const workoutRef = doc(db, 'users', userId, 'workouts', workoutId)

	await deleteDoc(workoutRef)
}

export async function editWorkout(userId, workoutId, workoutData) {
	const workoutRef = doc(db, 'users', userId, 'workouts', workoutId)

	return updateDoc(workoutRef, {
		...workoutData,
		updated_at: serverTimestamp(),
	})
}
