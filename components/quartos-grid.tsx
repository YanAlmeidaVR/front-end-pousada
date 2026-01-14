"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Edit } from "lucide-react"
import type { Quarto } from "@/lib/api"

interface QuartosGridProps {
  quartos: Quarto[]
  onEdit: (quarto: Quarto) => void
}

const statusColors = {
  DISPONIVEL: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  OCUPADO: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  MANUTENCAO: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  LIMPEZA: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
}

const statusLabels = {
  DISPONIVEL: "Disponível",
  OCUPADO: "Ocupado",
  MANUTENCAO: "Manutenção",
  LIMPEZA: "Limpeza",
}

const tipoLabels = {
  SINGLE: "Single",
  DOUBLE: "Double",
  SUITE: "Suíte",
  DELUXE: "Deluxe",
}

export function QuartosGrid({ quartos, onEdit }: QuartosGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {quartos.map((quarto) => (
        <Card key={quarto.id} className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bed className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Quarto {quarto.numeroQuarto}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tipoLabels[quarto.tipoQuarto]}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(quarto)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge className={statusColors[quarto.quartoStatus]} variant="secondary">
                {statusLabels[quarto.quartoStatus]}
              </Badge>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(quarto.precoPorNoite)}
                <span className="text-sm font-normal text-muted-foreground">/noite</span>
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
