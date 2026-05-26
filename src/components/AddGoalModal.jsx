'use client'

import { useEffect, useState, startTransition } from 'react'
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'

import { useUser } from '@/lib/UserContext'
import { createGoal, editGoal } from '@/lib/goals'

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

export function AddGoalModal({ onSuccess, mode = 'create', goal = null }) {
	const user = useUser()

	const isEdit = mode === 'edit'

	const [open, setOpen] = useState(false)

	const [goalType, setGoalType] = useState('')
	const [experienceLevel, setExperienceLevel] = useState('')
	const [notes, setNotes] = useState('')
	const [daysPerWeek, setDaysPerWeek] = useState('')
	const [targetDate, setTargetDate] = useState()

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [hasSubmitted, setHasSubmitted] = useState(false)
	const [datePopoverOpen, setDatePopoverOpen] = useState(false)

	useEffect(() => {
		if (!goal || !open) return

		startTransition(() => {
			setGoalType(goal.type || '')
			setExperienceLevel(goal.experience_level || '')
			setDaysPerWeek(goal.days_per_week ? String(goal.days_per_week) : '')
			setNotes(goal.notes || '')
			setTargetDate(goal.target_date?.toDate ? goal.target_date.toDate() : undefined)
		})
	}, [goal, open])

	async function handleSubmit(e) {
		e.preventDefault()

		setHasSubmitted(true)

		if (!goalType || !experienceLevel || !daysPerWeek) {
			return
		}

		const goalData = {
			type: goalType,
			target_date: targetDate ? Timestamp.fromDate(targetDate) : null,
			experience_level: experienceLevel,
			days_per_week: Number(daysPerWeek),
			notes: notes || null,
		}

		try {
			setIsSubmitting(true)

			if (isEdit) {
				await editGoal(user.uid, goal.id, goalData)
			} else {
				await createGoal(user.uid, goalData)
			}

			await onSuccess()

			setOpen(false)

			setGoalType('')
			setExperienceLevel('')
			setDaysPerWeek('')
			setNotes('')
			setTargetDate(undefined)
		} catch (err) {
			console.error('Error saving goal:', err)
		} finally {
			setIsSubmitting(false)
			setHasSubmitted(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">{isEdit ? 'Edit Goal' : 'Add Goal'}</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
				<form onSubmit={handleSubmit} noValidate className="space-y-6">
					<DialogHeader>
						<DialogTitle>{isEdit ? 'Edit Goal' : 'Add Goal'}</DialogTitle>

						<DialogDescription>Choose the main goal you&apos;re training for.</DialogDescription>
					</DialogHeader>

					<FieldGroup>
						<Field>
							<FieldLabel>
								What are you training for? <span className="text-destructive">*</span>
							</FieldLabel>

							<Select value={goalType} onValueChange={setGoalType}>
								<SelectTrigger>
									<SelectValue placeholder="Select goal type" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="run">Run</SelectItem>
									<SelectItem value="bike">Bike</SelectItem>
									<SelectItem value="swim">Swim</SelectItem>
									<SelectItem value="strength">Strength</SelectItem>
									<SelectItem value="triathlon">Triathlon</SelectItem>
									<SelectItem value="general_fitness">General Fitness</SelectItem>
									<SelectItem value="other">Other</SelectItem>
								</SelectContent>
							</Select>

							<FieldDescription>This helps tailor your training recommendations.</FieldDescription>

							{hasSubmitted && !goalType && (
								<p className="text-sm text-destructive">Goal type is required.</p>
							)}
						</Field>

						<Field>
							<FieldLabel>Target date</FieldLabel>

							<Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										data-empty={!targetDate}
										className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
									>
										{targetDate ? format(targetDate, 'PPP') : <span>Pick a date</span>}

										<ChevronDownIcon className="size-4" />
									</Button>
								</PopoverTrigger>

								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={targetDate}
										onSelect={(date) => {
											setTargetDate(date)
											setDatePopoverOpen(false)
										}}
										defaultMonth={targetDate}
										disabled={(date) => {
											const today = new Date()
											today.setHours(0, 0, 0, 0)

											return date < today
										}}
									/>
								</PopoverContent>
							</Popover>

							<FieldDescription>
								Optional, but useful if you&apos;re training for an event.
							</FieldDescription>
						</Field>

						<div className="flex gap-4">
							<Field className="flex-1">
								<FieldLabel>
									Experience level <span className="text-destructive">*</span>
								</FieldLabel>

								<Select value={experienceLevel} onValueChange={setExperienceLevel}>
									<SelectTrigger>
										<SelectValue placeholder="Select level" />
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="beginner">Beginner</SelectItem>
										<SelectItem value="intermediate">Intermediate</SelectItem>
										<SelectItem value="advanced">Advanced</SelectItem>
									</SelectContent>
								</Select>

								{hasSubmitted && !experienceLevel && (
									<p className="text-sm text-destructive">Experience level is required.</p>
								)}
							</Field>

							<Field className="flex-1">
								<FieldLabel htmlFor="days_per_week">
									Days/week <span className="text-destructive">*</span>
								</FieldLabel>

								<Input
									id="days_per_week"
									type="number"
									min="1"
									max="7"
									value={daysPerWeek}
									onChange={(e) => setDaysPerWeek(e.target.value)}
									placeholder="4"
								/>

								{hasSubmitted && !daysPerWeek && (
									<p className="text-sm text-destructive">Days/week is required.</p>
								)}
							</Field>
						</div>

						<Field>
							<FieldLabel htmlFor="notes">Notes</FieldLabel>

							<Textarea
								id="notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								placeholder="Anything your coach should know?"
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
									: 'Creating...'
								: isEdit
									? 'Save Changes'
									: 'Create Goal'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
