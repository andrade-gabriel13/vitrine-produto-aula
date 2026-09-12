// Regras comerciais da loja (simulação — nenhum pagamento real é processado).

export const FRETE_PADRAO = 29.9
export const FRETE_GRATIS_A_PARTIR_DE = 300

export const paymentMethods = [
  {
    id: 'pix',
    label: 'Pix',
    symbol: '⚡',
    discount: 0.05,
    maxInstallments: 1,
    condition: 'À vista · 5% de desconto · aprovação imediata',
  },
  {
    id: 'credito',
    label: 'Cartão de crédito',
    symbol: '💳',
    discount: 0,
    maxInstallments: 12,
    freeInstallmentsUpTo: 6,
    monthlyInterest: 0.0199,
    condition: 'Até 12x · sem juros até 6x · 1,99% a.m. acima disso',
  },
  {
    id: 'boleto',
    label: 'Boleto bancário',
    symbol: '🧾',
    discount: 0.02,
    maxInstallments: 1,
    condition: 'À vista · 2% de desconto · compensa em até 3 dias úteis',
  },
]

export function getShipping(subtotal) {
  if (subtotal === 0) return 0
  return subtotal >= FRETE_GRATIS_A_PARTIR_DE ? 0 : FRETE_PADRAO
}

/**
 * Calcula o valor final de acordo com a condição de pagamento escolhida.
 * Juros compostos só entram acima do limite de parcelas sem juros.
 */
export function getOrderSummary(subtotal, methodId, installments = 1) {
  const method = paymentMethods.find((m) => m.id === methodId) || paymentMethods[0]
  const shipping = getShipping(subtotal)
  const discount = subtotal * method.discount
  const base = subtotal - discount + shipping

  const freeUpTo = method.freeInstallmentsUpTo || method.maxInstallments
  const hasInterest = installments > freeUpTo
  const total = hasInterest
    ? base * Math.pow(1 + method.monthlyInterest, installments)
    : base

  return {
    method,
    subtotal,
    shipping,
    discount,
    installments,
    hasInterest,
    interest: total - base,
    total,
    installmentValue: total / installments,
  }
}

export function getInstallmentOptions(methodId) {
  const method = paymentMethods.find((m) => m.id === methodId) || paymentMethods[0]
  return Array.from({ length: method.maxInstallments }, (_, i) => i + 1)
}

/** Código do pedido no formato NG-A1B2C3 (NG = Nível Up Games). */
export function generateOrderId() {
  const random = Math.random().toString(36).toUpperCase().slice(2, 8)
  return `NG-${random}`
}

/**
 * URL codificada no QR Code. Ao escanear, o celular abre a própria vitrine
 * já na tela de pagamento confirmado.
 */
export function buildPaymentUrl(order) {
  const { origin, pathname } = window.location
  const params = new URLSearchParams({
    pedido: order.id,
    valor: order.total.toFixed(2),
    metodo: order.method.label,
    parcelas: String(order.installments),
  })
  return `${origin}${pathname}#pagamento?${params.toString()}`
}

/** Lê o hash da URL e devolve o pedido, se a pessoa chegou pelo QR Code. */
export function readOrderFromHash() {
  const hash = window.location.hash
  if (!hash.startsWith('#pagamento?')) return null

  const params = new URLSearchParams(hash.slice('#pagamento?'.length))
  const id = params.get('pedido')
  if (!id) return null

  return {
    id,
    total: Number(params.get('valor')) || 0,
    methodLabel: params.get('metodo') || 'Pix',
    installments: Number(params.get('parcelas')) || 1,
  }
}
