"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Bed, Calendar, DollarSign } from "lucide-react"

interface StatsCardsProps {
  totalHospedes: number
  totalQuartos: number
  quartosDisponiveis: number
  reservasAtivas: number
  taxaOcupacao: number
}

export function StatsCards({
  totalHospedes,
  totalQuartos,
  quartosDisponiveis,
  reservasAtivas,
  taxaOcupacao,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Hóspedes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHospedes}</div>
          <p className="text-xs text-muted-foreground">Com reservas ativas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quartos Disponíveis</CardTitle>
          <Bed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {quartosDisponiveis}/{totalQuartos}
          </div>
          <p className="text-xs text-muted-foreground">Prontos para reserva</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reservas Ativas</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reservasAtivas}</div>
          <p className="text-xs text-muted-foreground">Em andamento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{taxaOcupacao.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Ocupação atual</p>
        </CardContent>
      </Card>
    </div>
  )
}