import type { TimeEntry } from "./supabase"
import { formatMinutesToHHMM, calculateDayTotal, getDayName } from "./time-calculations"

export function exportToExcel(entries: TimeEntry[], month: number, year: number) {
  // Agrupa entradas por data
  const entriesByDate = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = []
      }
      acc[entry.date].push(entry)
      return acc
    },
    {} as Record<string, TimeEntry[]>,
  )

  // Ordena as datas
  const sortedDates = Object.keys(entriesByDate).sort()

  // Cria o conteúdo CSV
  let csv = "Data,,Entrada,Saída,Entrada,Saída,Total\n"

  sortedDates.forEach((date) => {
    const dateEntries = entriesByDate[date]
    const dateObj = new Date(date + "T00:00:00")
    const dayName = getDayName(dateObj)
    const formattedDate = dateObj.toLocaleDateString("pt-BR")

    // Processa entradas em pares
    for (let i = 0; i < dateEntries.length; i += 2) {
      const first = dateEntries[i]
      const second = dateEntries[i + 1]

      const firstStart = first
        ? new Date(first.start_time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : ""
      const firstEnd = first?.end_time
        ? new Date(first.end_time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : ""
      const secondStart = second
        ? new Date(second.start_time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : ""
      const secondEnd = second?.end_time
        ? new Date(second.end_time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : ""

      const rowTotal = (first?.total_minutes || 0) + (second?.total_minutes || 0)

      csv += `${formattedDate},${dayName},${firstStart},${firstEnd},${secondStart},${secondEnd},${formatMinutesToHHMM(rowTotal)}\n`
    }
  })

  // Adiciona total geral
  const totalMinutes = calculateDayTotal(entries)
  csv += `\nTotal do Mês:,,,,,${formatMinutesToHHMM(totalMinutes)}\n`

  // Cria o arquivo e faz download
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  const monthNames = [
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
  const filename = `horas-trabalhadas-${monthNames[month]}-${year}.csv`

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
