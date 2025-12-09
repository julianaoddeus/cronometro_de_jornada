import type { TimeEntry } from "./supabase"

export const HOURLY_RATE = 46.31
export const MAX_MONTHLY_HOURS = 176

export function calculateMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
}

export function minutesToHours(minutes: number): number {
  return minutes / 60
}

export function formatMinutesToHHMM(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}:${String(mins).padStart(2, "0")}`
}

export function calculateDayTotal(entries: TimeEntry[]): number {
  return entries.reduce((total, entry) => {
    return total + (entry.total_minutes || 0)
  }, 0)
}

export function calculateMonthTotal(entries: TimeEntry[]): number {
  return calculateDayTotal(entries)
}

export function calculateBilling(minutes: number): number {
  const hours = minutesToHours(minutes)
  return hours * HOURLY_RATE
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function formatDateTime(date: Date): string {
  return date.toISOString()
}

export function getMonthName(month: number): string {
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ]
  return months[month]
}

export function getDayName(date: Date): string {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
  return days[date.getDay()]
}
