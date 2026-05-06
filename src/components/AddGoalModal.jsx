'use client'

import { useState } from 'react'
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
import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { createGoal } from '@/lib/goals'
import { use_auth } from '@/lib/firebase/use_auth'
import { Timestamp } from 'firebase/firestore'

export function AddGoalModal({ onSuccess }) {
  const user = use_auth()

  const [open, setOpen] = useState(false)
  const [goalType, setGoalType] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [daysPerWeek, setDaysPerWeek] = useState('')
  const [targetDate, setTargetDate] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [datePopoverOpen, setDatePopoverOpen] = useState(false)

  async function addGoal(e) {
    e.preventDefault()
    setHasSubmitted(true)

    if (!goalType || !experienceLevel || !daysPerWeek) {
      return
    }

    if (!user) return

    const goal_data = {
      type: goalType,
      target_date: targetDate ? Timestamp.fromDate(targetDate) : null,
      experience_level: experienceLevel,
      days_per_week: Number(daysPerWeek),
      notes: notes || null,
    }

    try {
      setIsSubmitting(true)

      await createGoal(user.uid, goal_data)
      onSuccess()

      setOpen(false)
      setGoalType('')
      setExperienceLevel('')
      setDaysPerWeek('')
      setNotes('')
      setTargetDate()
    } catch (err) {
      console.error('Error creating goal:', err)
    } finally {
      setIsSubmitting(false)
      setHasSubmitted(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Goal</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={addGoal} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
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
                    className="w-full justify-between text-left data-[empty=true]:text-muted-foreground"
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

            <Field>
              <FieldLabel>
                Experience level <span className="text-destructive">*</span>
              </FieldLabel>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
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

            <Field>
              <FieldLabel htmlFor="days_per_week">
                Training days per week<span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="days_per_week"
                name="days_per_week"
                type="number"
                min="1"
                max="7"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
              />
              {hasSubmitted && !daysPerWeek && (
                <p className="text-sm text-destructive">Training days per week is required.</p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                id="notes"
                name="notes"
                placeholder="Anything your coach should know?"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
