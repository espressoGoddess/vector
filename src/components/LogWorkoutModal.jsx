'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'

import { useAuth } from '@/lib/firebase/useAuth'
import { createWorkout } from '@/lib/workouts'

import { Button } from '@/components/ui/button'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function LogWorkoutModal({ mode = 'create', workout = null, activeGoalId = null }) {
	const user = useAuth()

	const isEdit = mode === 'edit'

	const [open, setOpen] = useState(false)

	const [workoutType, setWorkoutType] = useState('')
	const [completedAt, setCompletedAt] = useState(new Date())

	const [durationMinutes, setDurationMinutes] = useState('')
	const [distanceMiles, setDistanceMiles] = useState('')
	const [intensity, setIntensity] = useState('')

	const [feelLabel, setFeelLabel] = useState('')
	const [notes, setNotes] = useState('')

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [datePopoverOpen, setDatePopoverOpen] = useState(false)

	useEffect(() => {
		if (!workout || !open) return

		setWorkoutType(workout.type || '')
		setCompletedAt(workout.completed_at?.toDate ? workout.completed_at.toDate() : new Date())
		setDurationMinutes(workout.duration_minutes ? String(workout.duration_minutes) : '')
		setDistanceMiles(workout.distance_miles ? String(workout.distance_miles) : '')
		setIntensity(workout.intensity ? String(workout.intensity) : '')
		setFeelLabel(workout.feel_label || '')
		setNotes(workout.notes || '')
	}, [workout, open])

	async function handleSubmit(e) {
		e.preventDefault()
		setHasSubmitted(true)

		const durationNumber = Number(durationMinutes)
		const distanceNumber = distanceMiles ? Number(distanceMiles) : null
		const intensityNumber = Number(intensity)

		if (
			!workoutType ||
			!completedAt ||
			!durationMinutes ||
			!intensity ||
			!feelLabel ||
			durationNumber < 1 ||
			Number.isNaN(durationNumber) ||
			intensityNumber < 1 ||
			intensityNumber > 10 ||
			Number.isNaN(intensityNumber) ||
			(distanceMiles && (distanceNumber < 0 || Number.isNaN(distanceNumber)))
		) {
			return
		}

		if (!user) return

		const workoutData = {
			goal_id: activeGoalId || workout?.goal_id || null,
			type: workoutType,
			status: 'completed',
			scheduled_for: null,
			completed_at: completedAt ? Timestamp.fromDate(completedAt) : null,
			duration_minutes: durationNumber,
			distance_miles: distanceNumber,
			intensity: intensityNumber,
			feel_label: feelLabel,
			notes: notes || '',
			source: workout?.source || 'manual',
		}

		try {
			setIsSubmitting(true)

			if (isEdit) {
				// await editWorkout(user.uid, workout.id, workoutData)
				console.log('edit workout', user.uid, workout.id, workoutData)
			} else {
				await createWorkout(user.uid, activeGoalId || null, workoutData)
				console.log('create workout', user.uid, activeGoalId || null, workoutData)
			}

			// if (onSuccess) {
			// 	await onSuccess()
			// }

			setOpen(false)
			resetForm()
		} catch (err) {
			console.error('Error saving workout:', err)
		} finally {
			setIsSubmitting(false)
			setHasSubmitted(false)
		}
	}

	function resetForm() {
		setWorkoutType('')
		setCompletedAt(new Date())
		setDurationMinutes('')
		setDistanceMiles('')
		setIntensity('')
		setFeelLabel('')
		setNotes('')
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">{isEdit ? 'Edit Workout' : 'Log Workout'}</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-lg">
				<form onSubmit={handleSubmit} noValidate className="space-y-6">
					<DialogHeader>
						<DialogTitle>{isEdit ? 'Edit Workout' : 'Log Workout'}</DialogTitle>

						<DialogDescription>Add details for a workout you completed.</DialogDescription>
					</DialogHeader>

					<FieldGroup>
						<Field>
							<FieldLabel>
								Workout type <span className="text-destructive">*</span>
							</FieldLabel>

							<Select value={workoutType} onValueChange={setWorkoutType}>
								<SelectTrigger>
									<SelectValue placeholder="Select workout type" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="run">Run</SelectItem>
									<SelectItem value="bike">Bike</SelectItem>
									<SelectItem value="swim">Swim</SelectItem>
									<SelectItem value="strength">Strength</SelectItem>
									<SelectItem value="yoga">Yoga</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>

							{hasSubmitted && !workoutType && (
								<p className="text-sm text-destructive">Workout type is required.</p>
							)}
						</Field>

						<Field>
							<FieldLabel>
								Completed date <span className="text-destructive">*</span>
							</FieldLabel>

							<Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										data-empty={!completedAt}
										className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
									>
										{completedAt ? format(completedAt, 'PPP') : <span>Pick a date</span>}
										<ChevronDownIcon className="size-4" />
									</Button>
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={completedAt}
										onSelect={(date) => {
											setCompletedAt(date)
											setDatePopoverOpen(false)
										}}
										defaultMonth={completedAt}
										disabled={(date) => {
											const tomorrow = new Date()
											tomorrow.setHours(0, 0, 0, 0)
											tomorrow.setDate(tomorrow.getDate() + 1)

											return date >= tomorrow
										}}
									/>
								</PopoverContent>
							</Popover>

							{hasSubmitted && !completedAt && (
								<p className="text-sm text-destructive">Completed date is required.</p>
							)}
						</Field>

						<Field>
							<FieldLabel>
								Duration minutes <span className="text-destructive">*</span>
							</FieldLabel>

							<Input
								type="number"
								min="1"
								value={durationMinutes}
								onChange={(e) => setDurationMinutes(e.target.value)}
								placeholder="30"
							/>

							{hasSubmitted &&
								(!durationMinutes ||
									Number(durationMinutes) < 1 ||
									Number.isNaN(Number(durationMinutes))) && (
									<p className="text-sm text-destructive">Duration must be at least 1 minute.</p>
								)}
						</Field>

						<Field>
							<FieldLabel>Distance miles</FieldLabel>

							<Input
								type="number"
								min="0"
								step="0.01"
								value={distanceMiles}
								onChange={(e) => setDistanceMiles(e.target.value)}
								placeholder="3.25"
							/>

							<FieldDescription>Optional. Useful for run, bike, or swim workouts.</FieldDescription>

							{hasSubmitted &&
								distanceMiles &&
								(Number(distanceMiles) < 0 || Number.isNaN(Number(distanceMiles))) && (
									<p className="text-sm text-destructive">Distance must be 0 or greater.</p>
								)}
						</Field>

						<Field>
							<FieldLabel>
								Intensity <span className="text-destructive">*</span>
							</FieldLabel>

							<Input
								type="number"
								min="1"
								max="10"
								value={intensity}
								onChange={(e) => setIntensity(e.target.value)}
								placeholder="1–10"
							/>

							<FieldDescription>Required effort rating from 1 to 10.</FieldDescription>

							{hasSubmitted &&
								(!intensity ||
									Number(intensity) < 1 ||
									Number(intensity) > 10 ||
									Number.isNaN(Number(intensity))) && (
									<p className="text-sm text-destructive">Intensity must be between 1 and 10.</p>
								)}
						</Field>

						<Field>
							<FieldLabel>
								How did it feel? <span className="text-destructive">*</span>
							</FieldLabel>

							<Select value={feelLabel} onValueChange={setFeelLabel}>
								<SelectTrigger>
									<SelectValue placeholder="Select feeling" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="great">Great</SelectItem>
									<SelectItem value="good">Good</SelectItem>
									<SelectItem value="okay">Okay</SelectItem>
									<SelectItem value="tired">Tired</SelectItem>
									<SelectItem value="bad">Bad</SelectItem>
								</SelectContent>
							</Select>

							{hasSubmitted && !feelLabel && (
								<p className="text-sm text-destructive">Feeling is required.</p>
							)}
						</Field>

						<Field>
							<FieldLabel htmlFor="notes">Notes</FieldLabel>

							<Textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Anything you want to remember?"
							/>
						</Field>
					</FieldGroup>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>

						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? isEdit
									? 'Saving...'
									: 'Logging...'
								: isEdit
									? 'Save Changes'
									: 'Log Workout'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
