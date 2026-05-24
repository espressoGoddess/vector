'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/useAuth'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'

import { LogWorkoutModal } from '@/components/LogWorkoutModal'
import { getGoals } from '@/lib/goals'
import { formatDate } from '@/lib/utils'
import { getWorkouts, deleteWorkout } from '@/lib/workouts'

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

		async function loadData() {
			await getGoalId()
			await fetchWorkouts()
			setLoadingWorkouts(false)
		}

		loadData()
	}, [user, router])

	async function handleDeleteWorkout(e, workoutId) {
		await deleteWorkout(user.uid, workoutId)
		await fetchWorkouts()
	}

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
					<CardFooter>
						<LogWorkoutModal
							onSuccess={fetchWorkouts}
							mode="edit"
							workout={workout}
							activeGoalId={activeGoalId}
						/>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" className="ml-4">
									Delete Workout
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-sm">
								<DialogHeader>
									<DialogTitle>Are you sure you want to delete this workout?</DialogTitle>
								</DialogHeader>
								<FieldGroup>
									<Button onClick={(e) => handleDeleteWorkout(e, workout.id)}>Yes</Button>
									<DialogClose asChild>
										<Button variant="outline">No</Button>
									</DialogClose>
								</FieldGroup>
							</DialogContent>
						</Dialog>
					</CardFooter>
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
				</Card>
			) : (
				<div>
					<div className="m-10">
						<LogWorkoutModal onSuccess={fetchWorkouts} mode="create" activeGoalId={activeGoalId} />
					</div>
					<div>
						<h2 className="text-xl m-6">Logged Workouts</h2>
						{renderWorkouts()}
					</div>
				</div>
			)}
		</div>
	)
}
