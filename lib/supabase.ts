// import { createBrowserClient } from '@supabase/ssr'

// let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

// export function getSupabase() {
//   if (!supabaseInstance) {
//     supabaseInstance = createBrowserClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//   }
//   return supabaseInstance
// }

// Estrutura dos dados
export interface TimeEntry {
  id: string
  date: string
  start_time: string
  end_time: string | null
  total_minutes: number | null
}
