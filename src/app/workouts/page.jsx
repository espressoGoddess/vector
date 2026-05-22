'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/useAuth'
import { LogWorkoutModal } from '@/components/LogWorkoutModal'
import { getGoals } from '@/lib/goals'

export default function Page() {
	const user = useAuth()
	const router = useRouter()

	const [loadingWorkouts, setLoadingWorkouts] = useState(true)
	const [pastWorkouts, setPastWorkouts] = useState(null)
	const [activeGoalId, setActiveGoalId] = useState(null)

	async function getGoalId() {
		if (!user) return
		const goal = await getGoals(user.uid, 'active')
		setActiveGoalId(goal?.id || null)
	}

	useEffect(() => {
		if (user === undefined) return

		if (!user) {
			router.push('/login')
			return
		}

		getGoalId()
		setLoadingWorkouts(false)
	}, [user, router])

	if (loadingWorkouts) {
		return <main className="pt-20">Loading...</main>
	}

	if (!user) return null

	return (
		<div className="p-12">
			<h1 className="mt-8 ml-8 text-xl">Workouts</h1>
			<LogWorkoutModal mode="create" goal={activeGoalId} />
		</div>
	)
}
