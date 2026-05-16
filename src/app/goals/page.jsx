'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

import { use_auth } from '@/lib/firebase/use_auth'
import { endGoal, getGoals } from '@/lib/goals'

import { Button } from '@/components/ui/button'
import { AddGoalModal } from '@/components/AddGoalModal'

export default function GoalsPage() {
	const user = use_auth()
	const router = useRouter()

	const [activeGoal, setActiveGoal] = useState(null)
	const [loadingGoal, setLoadingGoal] = useState(true)

	async function fetchActiveGoal() {
		if (!user) return

		try {
			setLoadingGoal(true)

			const goal = await getGoals(user.uid)
			setActiveGoal(goal)
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

		fetchActiveGoal()
	}, [user, router])

	function formatFirestoreDate(timestamp) {
		if (!timestamp) return '—'

		if (timestamp.toDate) {
			return format(timestamp.toDate(), 'PPP')
		}

		return String(timestamp)
	}

	async function handleEndGoal(e) {
		e.preventDefault()

		if (!user || !activeGoal) return

		await endGoal(user.uid, activeGoal.id, 'completed')
		await fetchActiveGoal()
	}

	if (user === undefined || loadingGoal) {
		return <main style={{ padding: 40 }}>Loading...</main>
	}

	if (!user) {
		return null
	}

	return (
		<main style={{ padding: 40 }}>
			<h1>Goals</h1>

			{!activeGoal ? (
				<div style={{ marginTop: 20 }}>
					<p>You don’t have an active goal yet.</p>

					<AddGoalModal mode="create" onSuccess={fetchActiveGoal} />
				</div>
			) : (
				<div style={{ marginTop: 20, border: '1px solid #ccc', padding: 20 }}>
					<h2>
						<strong>Goal</strong>: {activeGoal.type}
					</h2>
					<p>
						<strong>Target Date:</strong> {formatFirestoreDate(activeGoal.target_date)}
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

					<div style={{ marginTop: 16 }}>
						<AddGoalModal mode="edit" goal={activeGoal} onSuccess={fetchActiveGoal} />

						<Button onClick={handleEndGoal} style={{ marginLeft: 10 }}>
							End Goal
						</Button>
					</div>
				</div>
			)}
		</main>
	)
}
