const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/aconchega'

// Tipos que o BACKEND realmente retorna (baseado no JSON real)
interface HospedeBackend {
  id: number
  cpf: string
  nome: string
  telefone: string
}

interface QuartoBackend {
  id: number
  numero: number
  tipo: string
  precoPorNoite: number
  status: string
}

interface ReservaBackend {
  id: number
  nomeHospede: string
  cpfHospede: string
  telefoneHospede: string
  numeroQuarto: number
  tipoQuarto: string
  dataCheckIn: string
  dataCheckOut: string
  valorTotal: number
  statusReserva: string
  statusPagamento: string
  statusChave: string
  metodoPagamento?: string
}

// Tipos do Frontend
export interface Hospede {
  id: number
  cpf: string
  nomeHospede: string
  telefone: string
}

export interface Quarto {
  id: number
  numeroQuarto: number
  tipoQuarto: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE'
  precoPorNoite: number
  quartoStatus: 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO' | 'LIMPEZA'
}

export interface Reserva {
  id: number
  nomeHospede: string
  numeroQuarto: number
  dataCheckIn: string
  dataCheckOut: string
  valorTotal: number
  statusReserva: 'ATIVA' | 'CANCELADA' | 'FINALIZADA'
  statusPagamento: 'PENDENTE' | 'PAGO'
  statusChave: 'NAO_DEVOLVIDA' | 'DEVOLVIDA'
}

// Mapear tipos de quarto
const mapTipoQuarto = (tipo: string): 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE' => {
  const map: Record<string, 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE'> = {
    'SOLTEIRO': 'SINGLE',
    'CASAL': 'DOUBLE',
    'TRIPLA': 'SUITE',
  }
  return map[tipo.toUpperCase()] || 'SINGLE'
}

// Mapear status de quarto
const mapQuartoStatus = (status: string): 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO' | 'LIMPEZA' => {
  const map: Record<string, 'DISPONIVEL' | 'OCUPADO' | 'MANUTENCAO' | 'LIMPEZA'> = {
    'DISPONIVEL': 'DISPONIVEL',
    'OCUPADO': 'OCUPADO',
    'MANUTENÇÃO': 'MANUTENCAO',
    'MANUTENCAO': 'MANUTENCAO',
  }
  return map[status.toUpperCase()] || 'DISPONIVEL'
}

// Converter Hospede do backend para frontend
const convertHospede = (hospede: HospedeBackend): Hospede => ({
  id: hospede.id,
  cpf: hospede.cpf,
  nomeHospede: hospede.nome,
  telefone: hospede.telefone,
})

// Converter Quarto do backend para frontend
const convertQuarto = (quarto: QuartoBackend): Quarto => ({
  id: quarto.id,
  numeroQuarto: quarto.numero,
  tipoQuarto: mapTipoQuarto(quarto.tipo),
  precoPorNoite: quarto.precoPorNoite,
  quartoStatus: mapQuartoStatus(quarto.status),
})

// Converter Reserva do backend para frontend (já vem no formato correto!)
const convertReserva = (reserva: ReservaBackend): Reserva => ({
  id: reserva.id,
  nomeHospede: reserva.nomeHospede,
  numeroQuarto: reserva.numeroQuarto,
  dataCheckIn: reserva.dataCheckIn,
  dataCheckOut: reserva.dataCheckOut,
  valorTotal: reserva.valorTotal,
  statusReserva: reserva.statusReserva as 'ATIVA' | 'CANCELADA' | 'FINALIZADA',
  statusPagamento: reserva.statusPagamento as 'PENDENTE' | 'PAGO',
  statusChave: reserva.statusChave as 'NAO_DEVOLVIDA' | 'DEVOLVIDA',
})

// Funções da API
export const api = {
  async getHospedes(): Promise<Hospede[]> {
    const response = await fetch(`${API_URL}/pousada/hospedes`)
    if (!response.ok) throw new Error('Falha ao buscar hóspedes')
    const data: HospedeBackend[] = await response.json()
    return data.map(convertHospede)
  },

  async getQuartos(): Promise<Quarto[]> {
    const response = await fetch(`${API_URL}/pousada/quartos`)
    if (!response.ok) throw new Error('Falha ao buscar quartos')
    const data: QuartoBackend[] = await response.json()
    return data.map(convertQuarto)
  },

  async getReservas(): Promise<Reserva[]> {
    const response = await fetch(`${API_URL}/pousada/reservas`)
    if (!response.ok) throw new Error('Falha ao buscar reservas')
    const data: ReservaBackend[] = await response.json()
    return data.map(convertReserva)
  },

  async createHospede(hospede: Omit<Hospede, 'id'>): Promise<Hospede> {
    const response = await fetch(`${API_URL}/pousada/hospedes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: hospede.nomeHospede,
        cpf: hospede.cpf,
        telefone: hospede.telefone,
      }),
    })
    if (!response.ok) throw new Error('Falha ao criar hóspede')
    const data: HospedeBackend = await response.json()
    return convertHospede(data)
  },

  async updateHospede(id: number, hospede: Partial<Hospede>): Promise<Hospede> {
    const response = await fetch(`${API_URL}/pousada/hospedes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: hospede.nomeHospede,
        cpf: hospede.cpf,
        telefone: hospede.telefone,
      }),
    })
    if (!response.ok) throw new Error('Falha ao atualizar hóspede')
    const data: HospedeBackend = await response.json()
    return convertHospede(data)
  },

  async deleteHospede(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/pousada/hospedes/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Falha ao deletar hóspede')
  },

  async createQuarto(quarto: Omit<Quarto, 'id'>): Promise<Quarto> {
    const tipoMap: Record<string, string> = {
      SINGLE: 'SOLTEIRO',
      DOUBLE: 'CASAL',
      SUITE: 'TRIPLA',
      DELUXE: 'TRIPLA',
    }

    const response = await fetch(`${API_URL}/pousada/quartos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numero: quarto.numeroQuarto,
        tipo: tipoMap[quarto.tipoQuarto],
        precoPorNoite: quarto.precoPorNoite,
      }),
    })
    if (!response.ok) throw new Error('Falha ao criar quarto')
    const data: QuartoBackend = await response.json()
    return convertQuarto(data)
  },

  async updateQuartoStatus(numero: number, status: string): Promise<Quarto> {
    const statusMap: Record<string, string> = {
      DISPONIVEL: 'DISPONIVEL',
      OCUPADO: 'OCUPADO',
      MANUTENCAO: 'MANUTENÇÃO',
      LIMPEZA: 'DISPONIVEL',
    }

    const response = await fetch(`${API_URL}/pousada/quartos/${numero}/status?status=${statusMap[status]}`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Falha ao atualizar status do quarto')
    const data: QuartoBackend = await response.json()
    return convertQuarto(data)
  },

  async checkIn(reservaId: number): Promise<Reserva> {
    const response = await fetch(`${API_URL}/pousada/reservas/${reservaId}/check-in`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Falha ao fazer check-in')
    const data: ReservaBackend = await response.json()
    return convertReserva(data)
  },

  async checkOut(reservaId: number): Promise<Reserva> {
    const response = await fetch(`${API_URL}/pousada/reservas/${reservaId}/check-out`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Falha ao fazer check-out')
    const data: ReservaBackend = await response.json()
    return convertReserva(data)
  },

  async devolverChave(reservaId: number): Promise<Reserva> {
    const response = await fetch(`${API_URL}/pousada/reservas/${reservaId}/devolucao-chave`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Falha ao devolver chave')
    const data: ReservaBackend = await response.json()
    return convertReserva(data)
  },

  async processarPagamento(reservaId: number, metodoPagamento: string = 'DINHEIRO'): Promise<Reserva> {
    const response = await fetch(`${API_URL}/pousada/reservas/${reservaId}/pagamento?metodoPagamento=${metodoPagamento}`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Falha ao processar pagamento')
    const data: ReservaBackend = await response.json()
    return convertReserva(data)
  },

  async cancelarReserva(reservaId: number): Promise<Reserva> {
    const response = await fetch(`${API_URL}/pousada/reservas/${reservaId}/cancelar`, {
      method: 'PUT',
    })
    if (!response.ok) throw new Error('Falha ao cancelar reserva')
    const data: ReservaBackend = await response.json()
    return convertReserva(data)
  },

  async createReserva(reserva: {
  hospedeId: number
  numeroQuarto: number
  dataCheckIn: string
  dataCheckOut: string
  metodoPagamento?: string
}): Promise<Reserva> {
  const response = await fetch(`${API_URL}/pousada/reservas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hospedeId: reserva.hospedeId,
      numeroQuarto: reserva.numeroQuarto,
      dataCheckIn: reserva.dataCheckIn,
      dataCheckOut: reserva.dataCheckOut,
      metodoPagamento: reserva.metodoPagamento || 'DINHEIRO',
    }),
  })
  
  if (!response.ok) {
    let errorMessage = 'Falha ao criar reserva'
    
    try {
      const errorData = await response.text()
      if (errorData) {
        errorMessage = errorData
      }
    } catch (e) {
      // Ignora erro ao parsear
    }
    
    throw new Error(errorMessage)
  }
  
  const data: ReservaBackend = await response.json()
  return convertReserva(data)
  },
}