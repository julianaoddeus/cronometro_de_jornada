"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TimerDisplay } from "@/components/timer-display";
import { DailyEntriesTable } from "@/components/daily-entries-table";
import { StatsCard } from "@/components/stats-card";
import {
  Play,
  Square,
  Download,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  saveEntry,
  updateEntry,
  getEntriesByDate,
  getEntriesByMonth,
} from "@/lib/time-tracker-storage";
import {
  formatDate,
  formatDateTime,
  calculateMinutes,
  calculateDayTotal,
  calculateMonthTotal,
  calculateBilling,
  formatCurrency,
  formatMinutesToHHMM,
  minutesToHours,
  MAX_MONTHLY_HOURS,
  getMonthName,
  HOURLY_RATE,
} from "@/lib/time-calculations";
import { exportToExcel } from "@/lib/excel-export";
import type { TimeEntry } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";

export default function TimeTrackerPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [monthEntries, setMonthEntries] = useState<TimeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Carrega dados
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const todayStr = formatDate(today);
    const todayData = getEntriesByDate(todayStr);
    const monthData = getEntriesByMonth(currentYear, currentMonth);

    setTodayEntries(todayData);
    setMonthEntries(monthData);
    setIsLoading(false);
  }

  function handleStart() {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);

    // Cria nova entrada
    const entry = saveEntry({
      date: formatDate(now),
      start_time: formatDateTime(now),
      end_time: null,
      total_minutes: null,
    });

    setCurrentEntryId(entry.id);
    loadData();
  }

  function handleStop() {
    if (!startTime || !currentEntryId) return;

    const endTime = new Date();
    const minutes = calculateMinutes(
      startTime.toISOString(),
      endTime.toISOString()
    );

    // Atualiza entrada
    updateEntry(currentEntryId, {
      end_time: formatDateTime(endTime),
      total_minutes: minutes,
    });

    setIsRunning(false);
    setStartTime(null);
    setCurrentEntryId(null);
    loadData();
  }

  function handleExport() {
    exportToExcel(monthEntries, currentMonth, currentYear);
  }

  // Cálculos
  const todayMinutes = calculateDayTotal(todayEntries);
  const monthMinutes = calculateMonthTotal(monthEntries);
  const monthHours = minutesToHours(monthMinutes);
  const monthBilling = calculateBilling(monthMinutes);
  const progressPercent = (monthHours / MAX_MONTHLY_HOURS) * 100;

  const todayBilling = calculateBilling(todayMinutes);
  const todayHours = minutesToHours(todayMinutes);

  const remainingHours = MAX_MONTHLY_HOURS - monthHours;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Controle de Horas</h1>
              <p className="text-muted-foreground mt-1">
                {today.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              size="lg"
              className="gap-2 bg-transparent"
            >
              <Download className="w-5 h-5" />
              Exportar Excel
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Stats Grid */}
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Horas Hoje"
              value={formatMinutesToHHMM(todayMinutes)}
              subtitle={`${todayHours.toFixed(2)}h trabalhadas`}
              icon={<Clock className="w-5 h-5" />}
            />
            <StatsCard
              title="Faturamento Hoje"
              value={formatCurrency(todayBilling)}
              subtitle={`${HOURLY_RATE.toFixed(2)} por hora`}
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatsCard
              title="Faturamento Mês"
              value={formatCurrency(monthBilling)}
              subtitle={`${getMonthName(currentMonth)}/${currentYear}`}
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatsCard
              title="Horas Restantes"
              value={`${remainingHours.toFixed(1)}h`}
              subtitle={`De ${MAX_MONTHLY_HOURS}h no mês`}
              icon={<Calendar className="w-5 h-5" />}
            />
          </section>
          {/* Timer Section */}
          <section className="bg-card border border-border rounded-lg p-8">
            <div className="flex flex-col items-center gap-6">
              <TimerDisplay startTime={startTime} isRunning={isRunning} />
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="gap-2 px-8 py-6 text-lg "
                    variant="default"
                  >
                    <Play className="w-6 h-6" />
                    Iniciar
                  </Button>
                ) : (
                  <Button
                    onClick={handleStop}
                    size="lg"
                    variant="destructive"
                    className="gap-2 px-8 py-6 text-lg"
                  >
                    <Square className="w-6 h-6" />
                    Parar
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Today's Entries */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Registros de Hoje</h2>
            <DailyEntriesTable entries={todayEntries} />
          </section>
          {/* Progress Section */}
          <section className="bg-card border border-border rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Progresso do Limite Mensal
                </h3>
                <span className="text-2xl font-bold">
                  {monthHours.toFixed(1)}h / {MAX_MONTHLY_HOURS}h
                </span>
              </div>
              <Progress
                value={Math.min(progressPercent, 100)}
                className="h-3"
              />
              <p className="text-sm text-muted-foreground text-right">
                {progressPercent.toFixed(1)}% do limite | Restam{" "}
                {(MAX_MONTHLY_HOURS - monthHours).toFixed(1)}h
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Valor Hora: {formatCurrency(HOURLY_RATE)} | Limite Mensal:{" "}
            {MAX_MONTHLY_HOURS} horas
          </p>
        </div>
      </footer>
    </div>
  );
}
