'use client'
// @TODO FETCH WORKOUTS AFTER LOGGING ONE

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/useAuth'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

import { LogWorkoutModal } from '@/components/LogWorkoutModal'
import { getGoals } from '@/lib/goals'
import { formatDate } from '@/lib/utils'
import { getWorkouts } from '@/lib/workouts'

export default function Page() {
	const user = useAuth()
	const router = useRouter()

	const [loadingWorkouts, setLoadingWorkouts] = useState(true)
	const [pastWorkouts, setPastWorkouts] = useState([])
	const [activeGoalId, setActiveGoalId] = useState(null)

	async function getGoalId() {
		if (!user) return
		const goal = await getGoals(user.uid, 'active')
		setActiveGoalId(goal?.id || null)
	}

	async function fetchWorkouts() {
		if (!user) return
		const workouts = await getWorkouts(user.uid)
		setPastWorkouts(workouts)
	}

	useEffect(() => {
		if (user === undefined) return

		if (!user) {
			router.push('/login')
			return
		}

		getGoalId()
		fetchWorkouts()
		setLoadingWorkouts(false)
	}, [user, router])

	const renderWorkouts = () => {
		return pastWorkouts.map((workout) => {
			return (
				<Card className="w-full max-w-sm mt-4" key={workout.id}>
					<CardHeader>
						<CardTitle>Workout: {workout.type}</CardTitle>
					</CardHeader>

					<CardContent className="space-y-2">
						<p>
							<strong>Status:</strong> {workout.status}
						</p>
						<p>
							<strong>Completed:</strong> {formatDate(workout.completed_at)}
						</p>
						<p>
							<strong>Duration:</strong> {workout.duration_minutes} min
						</p>

						{workout.distance_miles !== null && (
							<p>
								<strong>Distance:</strong> {workout.distance_miles} miles
							</p>
						)}
						<p>
							<strong>Intensity:</strong> {workout.intensity}/10
						</p>
						<p>
							<strong>Felt:</strong> {workout.feel_label}
						</p>
						{workout.notes && (
							<p>
								<strong>Notes:</strong> {workout.notes}
							</p>
						)}
					</CardContent>
				</Card>
			)
		})
	}

	if (loadingWorkouts) {
		return <main className="pt-20">Loading...</main>
	}

	if (!user) return null

	return (
		<div className="p-12">
			<h1 className="mt-8 ml-8 text-xl">Workouts</h1>
			{!pastWorkouts.length ? (
				<Card className="w-full max-w-sm mt-4">
					<CardHeader>
						<CardTitle>You haven't logged any workouts yet.</CardTitle>
					</CardHeader>
					<CardContent>
						<LogWorkoutModal onSuccess={fetchWorkouts} mode="create" goal={activeGoalId} />
					</CardContent>
				</Card>
			) : (
				<div>
					<h2 className="text-xl m-6">Logged Workouts</h2>
					{renderWorkouts()}
				</div>
			)}
		</div>
	)
}
