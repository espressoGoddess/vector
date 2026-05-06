'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import { use_auth } from '@/lib/firebase/use_auth'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { AddGoalModal } from '@/components/AddGoalModal'

export default function GoalsPage() {
	//@TODO fetch goal once one is created
	const user = use_auth()
	const router = useRouter()

	const [activeGoal, setActiveGoal] = useState(null)
	const [loadingGoal, setLoadingGoal] = useState(true)
	async function fetchActiveGoal() {
		try {
			const goals_ref = collection(db, 'users', user.uid, 'goals')
			const q = query(goals_ref, where('status', '==', 'active'))
			const snapshot = await getDocs(q)

			if (!snapshot.empty) {
				const goalDoc = snapshot.docs[0]
				setActiveGoal({ id: goalDoc.id, ...goalDoc.data() })
			} else {
				setActiveGoal(null)
			}
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

	if (user === undefined || loadingGoal) {
		return <main style={{ padding: 40 }}>Loading...</main>
	}

	if (!user) {
		return null
	}
	function formatFirestoreDate(timestamp) {
		if (!timestamp) return '—'

		if (timestamp.toDate) {
			return format(timestamp.toDate(), 'PPP')
		}

		return String(timestamp)
	}

	return (
		<main style={{ padding: 40 }}>
			<h1>Goals</h1>

			{!activeGoal ? (
				<div style={{ marginTop: 20 }}>
					<p>You don’t have an active goal yet.</p>
					<AddGoalModal onSuccess={fetchActiveGoal} />
				</div>
			) : (
				<div style={{ marginTop: 20, border: '1px solid #ccc', padding: 20 }}>
					<h2>{activeGoal.type}</h2>
					<p>
						<strong>Target:</strong> {formatFirestoreDate(activeGoal.target_date) || '—'}
					</p>
					<p>
						<strong>Experience:</strong> {activeGoal.experience_level || '—'}
					</p>
					<Button>Edit Goal</Button>
					<Button style={{ marginLeft: 10 }}>End Goal</Button>
				</div>
			)}
		</main>
	)
}
