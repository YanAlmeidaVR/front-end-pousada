"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, AlertCircle, Plus } from "lucide-react"
import { StatsCards } from "@/components/stats-cards"
import { HospedesTabs } from "@/components/hospedes-tabs"
import { QuartosGrid } from "@/components/quartos-grid"
import { ReservasTabs } from "@/components/reservas-tabs"
import { Relatorios } from "@/components/relatorios"
import { HospedeDialog } from "@/components/hospede-dialog"
import { QuartoDialog } from "@/components/quarto-dialog"
import { ReservaDialog } from "@/components/reserva-dialog"
import { api, type Hospede, type Quarto, type Reserva } from "@/lib/api"
import { handleApiError, showSuccess } from "@/lib/error-handler"

const MOCK_DATA = {
  hospedes: [
    { id: 1, cpf: "123.456.789-00", nomeHospede: "João Silva", telefone: "(11) 98765-4321" },
    { id: 2, cpf: "987.654.321-00", nomeHospede: "Maria Santos", telefone: "(21) 99876-5432" },
  ],
  quartos: [
    { id: 1, numeroQuarto: 101, tipoQuarto: "SINGLE" as const, precoPorNoite: 150.0, quartoStatus: "DISPONIVEL" as const },
    { id: 2, numeroQuarto: 102, tipoQuarto: "DELUXE" as const, precoPorNoite: 350.0, quartoStatus: "OCUPADO" as const },
    { id: 3, numeroQuarto: 201, tipoQuarto: "SINGLE" as const, precoPorNoite: 150.0, quartoStatus: "DISPONIVEL" as const },
    { id: 4, numeroQuarto: 202, tipoQuarto: "SUITE" as const, precoPorNoite: 500.0, quartoStatus: "MANUTENCAO" as const },
  ],
  reservas: [
    {
      id: 1,
      nomeHospede: "Maria Santos",
      numeroQuarto: 102,
      dataCheckIn: "2024-01-15",
      dataCheckOut: "2024-01-20",
      valorTotal: 1750,
      statusReserva: "ATIVA" as const,
      statusPagamento: "PAGO" as const,
      statusChave: "NAO_DEVOLVIDA" as const,
    },
  ],
}

export default function Page() {
  const [hospedes, setHospedes] = useState<Hospede[]>([])
  const [quartos, setQuartos] = useState<Quarto[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [activeTab, setActiveTab] = useState("reservas")
  
  // Estados dos modais
  const [hospedeDialogOpen, setHospedeDialogOpen] = useState(false)
  const [quartoDialogOpen, setQuartoDialogOpen] = useState(false)
  const [reservaDialogOpen, setReservaDialogOpen] = useState(false)
  const [selectedHospede, setSelectedHospede] = useState<Hospede | null>(null)
  const [selectedQuarto, setSelectedQuarto] = useState<Quarto | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [hospedesRes, quartosRes, reservasRes] = await Promise.all([
        api.getHospedes(),
        api.getQuartos(),
        api.getReservas(),
      ])

      setHospedes(hospedesRes)
      setQuartos(quartosRes)
      setReservas(reservasRes)
      setIsDemoMode(false)
    } catch (error) {
      console.log("Usando modo demonstração com dados de exemplo", error)
      setHospedes(MOCK_DATA.hospedes)
      setQuartos(MOCK_DATA.quartos)
      setReservas(MOCK_DATA.reservas)
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEditHospede = (hospede: Hospede) => {
    setSelectedHospede(hospede)
    setHospedeDialogOpen(true)
  }

  const handleNewHospede = () => {
    setSelectedHospede(null)
    setHospedeDialogOpen(true)
  }

  const handleEditQuarto = (quarto: Quarto) => {
    setSelectedQuarto(quarto)
    setQuartoDialogOpen(true)
  }

  const handleNewQuarto = () => {
    setSelectedQuarto(null)
    setQuartoDialogOpen(true)
  }

  const handleNewReserva = () => {
    setReservaDialogOpen(true)
  }

  const handleDeleteHospede = async (hospede: Hospede) => {
    try {
      await api.deleteHospede(hospede.id)
      showSuccess("Hóspede deletado", `${hospede.nomeHospede} foi removido do sistema.`)
      await fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCheckIn = async (id: number) => {
    try {
      await api.checkIn(id)
      showSuccess("Check-in realizado", "Check-in feito com sucesso!")
      await fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCheckOut = async (id: number) => {
    try {
      await api.checkOut(id)
      showSuccess("Check-out realizado", "Check-out feito com sucesso!")
      await fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleDevolverChave = async (id: number) => {
    try {
      await api.devolverChave(id)
      showSuccess("Chave devolvida", "Chave registrada como devolvida.")
      await fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleProcessarPagamento = async (id: number) => {
    try {
      await api.processarPagamento(id, 'DINHEIRO')
      showSuccess("Pagamento processado", "Pagamento registrado com sucesso!")
      await fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleCancelarReserva = async (id: number) => {
    try {
      await api.cancelarReserva(id)
      showSuccess("Reserva cancelada", "A reserva foi cancelada com sucesso.")
      await fetchData()
    } catch (error) {
      handleApiError(error)
    }
  }

  // Cálculos para os cards de estatísticas
  const quartosDisponiveis = quartos.filter((q) => q.quartoStatus === "DISPONIVEL").length
  const reservasAtivas = reservas.filter((r) => r.statusReserva === "ATIVA").length
  const hospedesComReservaAtiva = reservasAtivas // Cada reserva ativa = 1 hóspede
  const taxaOcupacao = quartos.length > 0 ? (reservasAtivas / quartos.length) * 100 : 0

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">Sistema de Gestão - Pousada</h1>
          {isDemoMode && (
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reconectar Backend
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        {isDemoMode && (
          <Alert className="mb-6 border-orange-500 bg-orange-50 dark:bg-orange-950">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-600">
              Modo Demonstração: O backend não está conectado. Os dados exibidos são apenas exemplos.
            </AlertDescription>
          </Alert>
        )}

        <StatsCards
          totalHospedes={hospedesComReservaAtiva}
          totalQuartos={quartos.length}
          quartosDisponiveis={quartosDisponiveis}
          reservasAtivas={reservasAtivas}
          taxaOcupacao={taxaOcupacao}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hospedes">Hóspedes</TabsTrigger>
            <TabsTrigger value="quartos">Quartos</TabsTrigger>
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="hospedes" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleNewHospede}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Hóspede
              </Button>
            </div>
            <HospedesTabs 
              hospedes={hospedes} 
              reservas={reservas}
              onEdit={handleEditHospede}
              onDelete={handleDeleteHospede}
            />
          </TabsContent>

          <TabsContent value="quartos" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleNewQuarto}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Quarto
              </Button>
            </div>
            <QuartosGrid quartos={quartos} onEdit={handleEditQuarto} />
          </TabsContent>

          <TabsContent value="reservas" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleNewReserva}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Reserva
              </Button>
            </div>
            <ReservasTabs
              reservas={reservas}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onDevolverChave={handleDevolverChave}
              onProcessarPagamento={handleProcessarPagamento}
              onCancelar={handleCancelarReserva}
            />
          </TabsContent>

          <TabsContent value="relatorios" className="mt-6">
            <Relatorios taxaOcupacao={taxaOcupacao} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Modais */}
      <HospedeDialog
        hospede={selectedHospede}
        open={hospedeDialogOpen}
        onOpenChange={setHospedeDialogOpen}
        onSuccess={fetchData}
      />
      <QuartoDialog
        quarto={selectedQuarto}
        open={quartoDialogOpen}
        onOpenChange={setQuartoDialogOpen}
        onSuccess={fetchData}
      />
      <ReservaDialog
        open={reservaDialogOpen}
        onOpenChange={setReservaDialogOpen}
        onSuccess={fetchData}
        hospedes={hospedes}
        quartos={quartos}
      />
    </div>
  )
}