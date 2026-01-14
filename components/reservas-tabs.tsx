"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ReservasList } from "@/components/reservas-list"
import type { Reserva } from "@/lib/api"

interface ReservasTabsProps {
  reservas: Reserva[]
  onCheckIn: (id: number) => void
  onCheckOut: (id: number) => void
  onDevolverChave: (id: number) => void
  onProcessarPagamento: (id: number) => void
  onCancelar: (id: number) => void
}

export function ReservasTabs({
  reservas,
  onCheckIn,
  onCheckOut,
  onDevolverChave,
  onProcessarPagamento,
  onCancelar,
}: ReservasTabsProps) {
  // Filtrar reservas por status
  const reservasAtivas = reservas.filter((r) => r.statusReserva === "ATIVA")
  const reservasFinalizadas = reservas.filter((r) => r.statusReserva === "FINALIZADA")
  const reservasCanceladas = reservas.filter((r) => r.statusReserva === "CANCELADA")

  return (
    <Tabs defaultValue="ativas" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="ativas" className="relative">
          Ativas
          {reservasAtivas.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {reservasAtivas.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="finalizadas" className="relative">
          Finalizadas
          {reservasFinalizadas.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {reservasFinalizadas.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="canceladas" className="relative">
          Canceladas
          {reservasCanceladas.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {reservasCanceladas.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ativas" className="mt-6">
        {reservasAtivas.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Nenhuma reserva ativa no momento</p>
          </div>
        ) : (
          <ReservasList
            reservas={reservasAtivas}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            onDevolverChave={onDevolverChave}
            onProcessarPagamento={onProcessarPagamento}
            onCancelar={onCancelar}
          />
        )}
      </TabsContent>

      <TabsContent value="finalizadas" className="mt-6">
        {reservasFinalizadas.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Nenhuma reserva finalizada ainda</p>
          </div>
        ) : (
          <ReservasList
            reservas={reservasFinalizadas}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            onDevolverChave={onDevolverChave}
            onProcessarPagamento={onProcessarPagamento}
            onCancelar={onCancelar}
          />
        )}
      </TabsContent>

      <TabsContent value="canceladas" className="mt-6">
        {reservasCanceladas.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Nenhuma reserva cancelada</p>
          </div>
        ) : (
          <ReservasList
            reservas={reservasCanceladas}
            onCheckIn={onCheckIn}
            onCheckOut={onCheckOut}
            onDevolverChave={onDevolverChave}
            onProcessarPagamento={onProcessarPagamento}
            onCancelar={onCancelar}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}