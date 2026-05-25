'use client'
//@TODO check the goal start date, only attach workout with same or more recent date to it
//@TODO edit goal capability

import { useEffect, useState } from 'react'
import { useUser } from '@/lib/UserContext'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogDescription,
	DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'

import { LogWorkoutModal } from '@/components/LogWorkoutModal'
import { getGoals } from '@/lib/goals'
import { formatDate } from '@/lib/utils'
import { getWorkouts, deleteWorkout } from '@/lib/workouts'

export default function Page() {
	const user = useUser()

	const [loadingWorkouts, setLoadingWorkouts] = useState(true)
	const [pastWorkouts, setPastWorkouts] = useState([])
	const [activeGoalId, setActiveGoalId] = useState(null)

	async function fetchWorkouts() {
		const workouts = await getWorkouts(user.uid)
		setPastWorkouts(workouts)
	}

	useEffect(() => {
		if (!user) return

		async function loadData() {
			const goal = await getGoals(user.uid, 'active')
			setActiveGoalId(goal?.id || null)

			const workouts = await getWorkouts(user.uid)
			setPastWorkouts(workouts)

			setLoadingWorkouts(false)
		}

		loadData()
	}, [user])

	async function handleDeleteWorkout(workoutId) {
		await deleteWorkout(user.uid, workoutId)
		await fetchWorkouts()
	}

	const renderWorkouts = () => {
		return pastWorkouts.map((workout) => {
			return (
				<Card className="w-fit max-w-sm mt-4" key={workout.id}>
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
									<DialogDescription>This action cannot be undone.</DialogDescription>
								</DialogHeader>

								<FieldGroup>
									<Button onClick={() => handleDeleteWorkout(workout.id)}>Yes</Button>

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

	if (!user || loadingWorkouts) {
		return <main className="pt-20 ml-14">Loading...</main>
	}

	return (
		<div className="pl-4">
			<h1 className="mt-8 ml-8 text-xl">Workouts</h1>

			{pastWorkouts.length === 0 ? (
				<Card className="w-[calc(100%-2rem)] max-w-sm mt-6">
					<CardHeader>
						<CardTitle>You haven&apos;t logged any workouts yet.</CardTitle>
					</CardHeader>

					<CardContent>
						<LogWorkoutModal onSuccess={fetchWorkouts} mode="create" activeGoalId={activeGoalId} />
					</CardContent>
				</Card>
			) : (
				<div>
					<div className="m-6">
						<LogWorkoutModal onSuccess={fetchWorkouts} mode="create" activeGoalId={activeGoalId} />
					</div>

					<h2 className="text-xl m-6">Logged Workouts</h2>
					{renderWorkouts()}
				</div>
			)}
		</div>
	)
}
