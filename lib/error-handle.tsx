import { toast } from "sonner"

// Mapeamento das exceções do backend para mensagens amigáveis
const errorMessages: Record<string, { title: string; description: string }> = {
  // Hóspede
  CpfJaCadastradoException: {
    title: "CPF já cadastrado",
    description: "Este CPF já está registrado no sistema.",
  },
  HospedeNotFoundException: {
    title: "Hóspede não encontrado",
    description: "O hóspede solicitado não foi encontrado.",
  },

  // Quarto
  NumeroQuartoJaCadastradoException: {
    title: "Número de quarto já existe",
    description: "Já existe um quarto com este número.",
  },
  QuartoNotFoundException: {
    title: "Quarto não encontrado",
    description: "O quarto solicitado não foi encontrado.",
  },
  QuartoOcupadoException: {
    title: "Quarto ocupado",
    description: "Este quarto já possui reserva ativa para o período selecionado.",
  },

  // Reserva
  CheckInInvalidoException: {
    title: "Check-in inválido",
    description: "Ainda não é possível fazer check-in para esta reserva.",
  },
  PagamentoInvalidoException: {
    title: "Pagamento pendente",
    description: "O pagamento desta reserva ainda não foi processado.",
  },
  ReservaJaCanceladaException: {
    title: "Reserva cancelada",
    description: "Esta reserva já foi cancelada anteriormente.",
  },
  ReservaNotFoundExceptionById: {
    title: "Reserva não encontrada",
    description: "A reserva solicitada não foi encontrada.",
  },
  ReservaNotFoundExceptionByNumber: {
    title: "Reserva não encontrada",
    description: "Não foi encontrada reserva para o número informado.",
  },
  BusinessException: {
    title: "Erro de validação",
    description: "Não foi possível completar a operação.",
  },
}

export function handleApiError(error: any) {
  console.error("API Error:", error)

  // Tentar extrair mensagem do backend
  let errorType = "UnknownError"
  let errorMessage = "Ocorreu um erro inesperado."

  // Se o erro tem uma resposta do backend
  if (error.message) {
    // Procurar por nome de exceção na mensagem
    const foundError = Object.keys(errorMessages).find((key) => error.message.includes(key))

    if (foundError) {
      errorType = foundError
      const errorInfo = errorMessages[foundError]
      
      toast.error(errorInfo.title, {
        description: errorInfo.description,
        duration: 4000,
      })
      return
    }

    // Se não encontrou exceção conhecida, usar a mensagem do erro
    errorMessage = error.message
  }

  // Tratamento específico para erros HTTP
  if (error.message.includes("Failed to fetch")) {
    toast.error("Erro de conexão", {
      description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
      duration: 4000,
    })
    return
  }

  if (error.message.includes("Falha ao")) {
    toast.error("Erro na operação", {
      description: error.message,
      duration: 4000,
    })
    return
  }

  // Erro genérico
  toast.error("Erro", {
    description: errorMessage,
    duration: 4000,
  })
}

// Função helper para mostrar sucesso
export function showSuccess(title: string, description?: string) {
  toast.success(title, {
    description,
    duration: 3000,
  })
}

// Função helper para mostrar info
export function showInfo(title: string, description?: string) {
  toast.info(title, {
    description,
    duration: 3000,
  })
}

// Função helper para mostrar aviso
export function showWarning(title: string, description?: string) {
  toast.warning(title, {
    description,
    duration: 3000,
  })
}