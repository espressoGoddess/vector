'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/lib/firebase/useAuth'
import { endGoal, getGoals } from '@/lib/goals'
import { formatDate } from '@/lib/utils'
import { AddGoalModal } from '@/components/AddGoalModal'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'

export default function GoalsPage() {
	const user = useAuth()
	const router = useRouter()

	const [activeGoal, setActiveGoal] = useState(null)
	const [loadingGoal, setLoadingGoal] = useState(true)
	const [oldGoals, setOldGoals] = useState([])

	async function fetchGoals() {
		if (!user) return

		try {
			setLoadingGoal(true)

			const currentGoal = await getGoals(user.uid, 'active')
			setActiveGoal(currentGoal)
			const completedGoals = await getGoals(user.uid, 'completed')
			setOldGoals(completedGoals)
		} catch (err) {
			console.error('Error fetching active goal:', err)
		} finally {
			setLoadingGoal(false)
		}
	}

	useEffect(() => {
		if (user === undefined) return

		if (!user) {
			router.push('/login')
			return
		}

		fetchGoals()
	}, [user, router])

	async function handleEndGoal(e, status) {
		e.preventDefault()

		if (!user || !activeGoal) return
		await endGoal(user.uid, activeGoal.id, status)
		await fetchGoals()
	}

	if (user === undefined || loadingGoal) {
		return <main className="pt-20">Loading...</main>
	}

	if (!user) {
		return null
	}

	const goals = () => {
		return oldGoals.map((goal) => {
			return (
				<Card className="w-full max-w-sm mt-4" key={goal.id}>
					<CardHeader>
						<CardTitle>Goal: {goal.type}</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Date Started:</strong> {formatDate(goal.created_at)}
						</p>
						<p>
							<strong>Date {goal.status === 'completed' ? 'Completed' : 'Ended'}:</strong>{' '}
							{formatDate(goal.ended_at)}
						</p>
						{goal.notes && (
							<p>
								<strong>Notes:</strong> {goal.notes}
							</p>
						)}
					</CardContent>
				</Card>
			)
		})
	}

	return (
		<main className="p-12">
			<h1 className="mt-8 ml-8 text-xl">Goals</h1>

			{!activeGoal ? (
				<Card className="w-full max-w-sm mt-4">
					<CardHeader>
						<CardTitle>You don’t have an active goal yet.</CardTitle>
					</CardHeader>
					<CardContent>
						<AddGoalModal mode="create" onSuccess={fetchGoals} />
					</CardContent>
				</Card>
			) : (
				<Card className="w-full max-w-sm mt-4">
					<CardHeader>
						<CardTitle>Goal: {activeGoal.type}</CardTitle>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Target Date:</strong> {formatDate(activeGoal.target_date)}
						</p>

						<p>
							<strong>Experience:</strong> {activeGoal.experience_level || '—'}
						</p>

						<p>
							<strong>Training days per week:</strong> {activeGoal.days_per_week || '—'}
						</p>

						{activeGoal.notes && (
							<p>
								<strong>Notes:</strong> {activeGoal.notes}
							</p>
						)}
					</CardContent>

					<CardFooter>
						<AddGoalModal mode="edit" goal={activeGoal} onSuccess={fetchGoals} />
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline" className="ml-4">
									End Goal
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-sm">
								<DialogHeader>
									<DialogTitle>Did you complete this goal?</DialogTitle>
								</DialogHeader>
								<FieldGroup>
									<Button
										onClick={(e) => {
											handleEndGoal(e, 'completed')
										}}
										className="ml-8"
									>
										Yes
									</Button>
									<Button
										onClick={(e) => {
											handleEndGoal(e, 'inactive')
										}}
										className="ml-8"
									>
										No
									</Button>
								</FieldGroup>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="outline">Cancel</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</CardFooter>
				</Card>
			)}
			{oldGoals.length && (
				<div>
					<h2 className="text-xl m-6">Past Goals</h2>
					{goals()}
				</div>
			)}
		</main>
	)
}
