import type { TimeEntry } from "./supabase"

// Funções para trabalhar com localStorage temporariamente
// Substituir por Supabase depois

export function getAllEntries(): TimeEntry[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("time_entries")
  return data ? JSON.parse(data) : []
}

export function saveEntry(entry: Omit<TimeEntry, "id">): TimeEntry {
  const entries = getAllEntries()
  const newEntry: TimeEntry = {
    ...entry,
    id: crypto.randomUUID(),
  }
  entries.push(newEntry)
  localStorage.setItem("time_entries", JSON.stringify(entries))
  return newEntry
}

export function updateEntry(id: string, updates: Partial<TimeEntry>): void {
  const entries = getAllEntries()
  const index = entries.findIndex((e) => e.id === id)
  if (index !== -1) {
    entries[index] = { ...entries[index], ...updates }
    localStorage.setItem("time_entries", JSON.stringify(entries))
  }
}

export function getEntriesByDate(date: string): TimeEntry[] {
  return getAllEntries().filter((e) => e.date === date)
}

export function getEntriesByMonth(year: number, month: number): TimeEntry[] {
  return getAllEntries().filter((e) => {
    const entryDate = new Date(e.date)
    return entryDate.getFullYear() === year && entryDate.getMonth() === month
  })
}

// Supabase version (comentado para usar depois):
// import { getSupabase } from './supabase'
//
// export async function getAllEntries(): Promise<TimeEntry[]> {
//   const supabase = getSupabase()
//   const { data, error } = await supabase
//     .from('time_entries')
//     .select('*')
//     .order('date', { ascending: false })
//   if (error) throw error
//   return data || []
// }
//
// export async function saveEntry(entry: Omit<TimeEntry, 'id'>): Promise<TimeEntry> {
//   const supabase = getSupabase()
//   const { data, error } = await supabase
//     .from('time_entries')
//     .insert([entry])
//     .select()
//     .single()
//   if (error) throw error
//   return data
// }
//
// export async function updateEntry(id: string, updates: Partial<TimeEntry>): Promise<void> {
//   const supabase = getSupabase()
//   const { error } = await supabase
//     .from('time_entries')
//     .update(updates)
//     .eq('id', id)
//   if (error) throw error
// }
//
// export async function getEntriesByDate(date: string): Promise<TimeEntry[]> {
//   const supabase = getSupabase()
//   const { data, error } = await supabase
//     .from('time_entries')
//     .select('*')
//     .eq('date', date)
//     .order('start_time', { ascending: true })
//   if (error) throw error
//   return data || []
// }
//
// export async function getEntriesByMonth(year: number, month: number): Promise<TimeEntry[]> {
//   const supabase = getSupabase()
//   const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
//   const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]
//   const { data, error } = await supabase
//     .from('time_entries')
//     .select('*')
//     .gte('date', startDate)
//     .lte('date', endDate)
//     .order('date', { ascending: true })
//   if (error) throw error
//   return data || []
// }
