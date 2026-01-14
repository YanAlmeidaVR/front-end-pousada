"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, TrendingUp, Loader2 } from "lucide-react"

interface RelatoriosProps {
  taxaOcupacao: number
}

export function Relatorios({ taxaOcupacao }: RelatoriosProps) {
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [receita, setReceita] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const calcularReceita = async () => {
    if (!dataInicio || !dataFim) {
      alert("Por favor, preencha as duas datas")
      return
    }

    if (new Date(dataFim) < new Date(dataInicio)) {
      alert("Data final deve ser posterior à data inicial")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pousada/reservas/receita?inicio=${dataInicio}&fim=${dataFim}`
      )
      if (!response.ok) throw new Error("Erro ao buscar receita")
      const valor = await response.json()
      setReceita(valor)
    } catch (error) {
      console.error("Erro ao calcular receita:", error)
      alert("Erro ao calcular receita. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const limpar = () => {
    setDataInicio("")
    setDataFim("")
    setReceita(null)
  }

  return (
    <div className="space-y-6">
      {/* Card de Taxa de Ocupação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Taxa de Ocupação Atual
          </CardTitle>
          <CardDescription>Percentual de quartos ocupados no momento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">{taxaOcupacao.toFixed(1)}%</div>
        </CardContent>
      </Card>

      {/* Card de Receita por Período */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Receita por Período
          </CardTitle>
          <CardDescription>Calcule a receita total de reservas pagas em um período específico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dataInicio" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data Início
              </Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dataFim" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data Fim
              </Label>
              <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calcularReceita} disabled={loading || !dataInicio || !dataFim} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                "Calcular Receita"
              )}
            </Button>
            <Button variant="outline" onClick={limpar} disabled={loading}>
              Limpar
            </Button>
          </div>

          {receita !== null && (
            <div className="mt-4 rounded-lg border-2 border-primary bg-primary/5 p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Receita Total no Período</p>
                <p className="mt-2 text-4xl font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(receita)}
                </p>
                {dataInicio && dataFim && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    De {new Date(dataInicio).toLocaleDateString("pt-BR")} até{" "}
                    {new Date(dataFim).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações sobre Relatórios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• A receita considera apenas reservas com pagamento processado (status: PAGO)</p>
          <p>• A taxa de ocupação mostra a porcentagem atual de quartos ocupados</p>
          <p>• Os valores são calculados em tempo real do banco de dados</p>
        </CardContent>
      </Card>
    </div>
  )
}