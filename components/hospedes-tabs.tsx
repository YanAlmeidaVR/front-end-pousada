"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { HospedesTable } from "@/components/hospedes-table"
import type { Hospede, Reserva } from "@/lib/api"

interface HospedesTabsProps {
  hospedes: Hospede[]
  reservas: Reserva[]
  onEdit: (hospede: Hospede) => void
  onDelete: (hospede: Hospede) => void
}

export function HospedesTabs({ hospedes, reservas, onEdit, onDelete }: HospedesTabsProps) {
  // Verificar se hóspede tem reservas ativas
  const hospedeTemReservaAtiva = (hospedeId: number) => {
    return reservas.some(
      (r) => r.statusReserva === "ATIVA" && 
      hospedes.find(h => h.id === hospedeId && h.nomeHospede === r.nomeHospede)
    )
  }

  // Verificar se hóspede tem alguma reserva (ativa, finalizada ou cancelada)
  const hospedeTemReserva = (hospede: Hospede) => {
    return reservas.some((r) => r.nomeHospede === hospede.nomeHospede)
  }

  // Filtrar hóspedes ativos (com reservas ativas ou sem reservas)
  const hospedesAtivos = hospedes.filter((h) => {
    const temReserva = hospedeTemReserva(h)
    if (!temReserva) return true // Sem reserva = ativo
    return hospedeTemReservaAtiva(h.id) // Com reserva ativa = ativo
  })

  // Filtrar hóspedes inativos (só têm reservas finalizadas/canceladas)
  const hospedesInativos = hospedes.filter((h) => {
    const temReserva = hospedeTemReserva(h)
    if (!temReserva) return false // Sem reserva = ativo
    return !hospedeTemReservaAtiva(h.id) // Sem reserva ativa = inativo
  })

  return (
    <Tabs defaultValue="ativos" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ativos" className="relative">
          Ativos
          {hospedesAtivos.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {hospedesAtivos.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="inativos" className="relative">
          Inativos
          {hospedesInativos.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {hospedesInativos.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ativos" className="mt-6">
        {hospedesAtivos.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Nenhum hóspede ativo cadastrado</p>
          </div>
        ) : (
          <HospedesTable 
            hospedes={hospedesAtivos} 
            reservas={reservas}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>

      <TabsContent value="inativos" className="mt-6">
        {hospedesInativos.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-muted-foreground">Nenhum hóspede inativo</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hóspedes aparecem aqui quando todas as suas reservas são finalizadas ou canceladas
            </p>
          </div>
        ) : (
          <HospedesTable 
            hospedes={hospedesInativos} 
            reservas={reservas}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </TabsContent>
    </Tabs>
  )
}