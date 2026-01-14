"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Key, CheckCircle, XCircle } from "lucide-react"
import type { Reserva } from "@/lib/api"

interface ReservasListProps {
  reservas: Reserva[]
  onCheckIn: (id: number) => void
  onCheckOut: (id: number) => void
  onDevolverChave: (id: number) => void
  onProcessarPagamento: (id: number) => void
  onCancelar: (id: number) => void
}

const statusReservaColors = {
  ATIVA: "bg-green-500/10 text-green-700 dark:text-green-400",
  CANCELADA: "bg-red-500/10 text-red-700 dark:text-red-400",
  FINALIZADA: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
}

const statusPagamentoColors = {
  PENDENTE: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  PAGO: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
}

const statusChaveColors = {
  NAO_DEVOLVIDA: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  DEVOLVIDA: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
}

export function ReservasList({
  reservas,
  onCheckIn,
  onCheckOut,
  onDevolverChave,
  onProcessarPagamento,
  onCancelar,
}: ReservasListProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR")
  }

  return (
    <div className="space-y-4">
      {reservas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Nenhuma reserva encontrada</CardContent>
        </Card>
      ) : (
        reservas.map((reserva) => (
          <Card key={reserva.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{reserva.nomeHospede}</h3>
                  <p className="text-sm text-muted-foreground">Quarto {reserva.numeroQuarto}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusReservaColors[reserva.statusReserva]} variant="secondary">
                    {reserva.statusReserva}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Check-in: {formatDate(reserva.dataCheckIn)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Check-out: {formatDate(reserva.dataCheckOut)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(reserva.valorTotal)}
                  </span>
                  <Badge className={statusPagamentoColors[reserva.statusPagamento]} variant="secondary">
                    {reserva.statusPagamento}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>Chave:</span>
                  <Badge className={statusChaveColors[reserva.statusChave]} variant="secondary">
                    {reserva.statusChave === "DEVOLVIDA" ? "Devolvida" : "Não devolvida"}
                  </Badge>
                </div>
              </div>

              {reserva.statusReserva === "ATIVA" && (
                <div className="flex flex-wrap gap-2">
                  {reserva.statusPagamento === "PENDENTE" && (
                    <Button size="sm" onClick={() => onProcessarPagamento(reserva.id)}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Processar Pagamento
                    </Button>
                  )}
                  {reserva.statusChave === "NAO_DEVOLVIDA" && (
                    <Button size="sm" variant="outline" onClick={() => onDevolverChave(reserva.id)}>
                      <Key className="mr-2 h-4 w-4" />
                      Devolver Chave
                    </Button>
                  )}
                  {reserva.statusPagamento === "PAGO" && reserva.statusChave === "DEVOLVIDA" && (
                    <Button size="sm" variant="default" onClick={() => onCheckOut(reserva.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Fazer Check-out
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => onCancelar(reserva.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}