import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp) {
  if (!timestamp) return '—'

  if (timestamp.toDate) {
    return format(timestamp.toDate(), 'PPP')
  }

  return String(timestamp)
}
