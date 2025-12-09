import type { TimeEntry } from "@/lib/supabase"
import { formatMinutesToHHMM } from "@/lib/time-calculations"

interface DailyEntriesTableProps {
  entries: TimeEntry[]
}

export function DailyEntriesTable({ entries }: DailyEntriesTableProps) {
  const totalMinutes = entries.reduce((sum, e) => sum + (e.total_minutes || 0), 0)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-left font-semibold">Data</th>
            <th className="px-4 py-3 text-center font-semibold">Entrada</th>
            <th className="px-4 py-3 text-center font-semibold">Saída</th>
            <th className="px-4 py-3 text-center font-semibold">Entrada</th>
            <th className="px-4 py-3 text-center font-semibold">Saída</th>
            <th className="px-4 py-3 text-center font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="bg-card">
          {entries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                Nenhum registro hoje
              </td>
            </tr>
          ) : (
            <>
              {/* Agrupa entradas em pares */}
              {Array.from({ length: Math.ceil(entries.length / 2) }).map((_, index) => {
                const firstEntry = entries[index * 2]
                const secondEntry = entries[index * 2 + 1]
                const rowTotal = (firstEntry?.total_minutes || 0) + (secondEntry?.total_minutes || 0)

                return (
                  <tr key={firstEntry.id} className="border-t border-border">
                    <td className="px-4 py-3">{new Date(firstEntry.date + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3 text-center font-mono">
                      {new Date(firstEntry.start_time).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {firstEntry.end_time
                        ? new Date(firstEntry.end_time).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {secondEntry
                        ? new Date(secondEntry.start_time).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {secondEntry?.end_time
                        ? new Date(secondEntry.end_time).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-semibold">{formatMinutesToHHMM(rowTotal)}</td>
                  </tr>
                )
              })}
              <tr className="border-t-2 border-primary bg-muted/50">
                <td colSpan={5} className="px-4 py-3 text-right font-semibold">
                  Total do Dia:
                </td>
                <td className="px-4 py-3 text-center font-mono font-bold text-lg">
                  {formatMinutesToHHMM(totalMinutes)}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
