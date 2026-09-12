import { useEffect, useState } from 'react'
import QrCode from './QrCode.jsx'
import { formatPrice } from '../utils/format.js'
import {
  buildPaymentUrl,
  generateOrderId,
  getInstallmentOptions,
  getOrderSummary,
  paymentMethods,
} from '../utils/payment.js'
import '../styles/CheckoutModal.css'

const SEGUNDOS_PARA_CONFIRMAR = 8

export default function CheckoutModal({ items, subtotal, onClose, onPaid }) {
  // useState — etapa do checkout: resumo → pagamento → sucesso
  const [step, setStep] = useState('resumo')
  const [methodId, setMethodId] = useState('pix')
  const [installments, setInstallments] = useState(1)
  const [order, setOrder] = useState(null)
  const [secondsLeft, setSecondsLeft] = useState(SEGUNDOS_PARA_CONFIRMAR)
  const [copied, setCopied] = useState(false)

  const summary = getOrderSummary(subtotal, methodId, installments)

  // Fecha o popup com a tecla Esc.
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Enquanto o QR está na tela, simula a confirmação do banco.
  useEffect(() => {
    if (step !== 'pagamento') return undefined

    if (secondsLeft <= 0) {
      confirmPayment()
      return undefined
    }

    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [step, secondsLeft])

  function handleMethodChange(id) {
    setMethodId(id)
    setInstallments(1)
  }

  function goToPayment() {
    setOrder({ id: generateOrderId(), ...summary })
    setSecondsLeft(SEGUNDOS_PARA_CONFIRMAR)
    setStep('pagamento')
  }

  function confirmPayment() {
    setStep('sucesso')
    onPaid(order) // zera o carrinho no App
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(buildPaymentUrl(order))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className="modal__box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        {step === 'resumo' && (
          <>
            <h2 className="modal__title" id="checkout-title">
              <span aria-hidden="true">🧾</span> Condições de pagamento
            </h2>

            <ul className="modal__items">
              {items.map(({ product, quantity }) => (
                <li key={product.id}>
                  <span>
                    {quantity}× {product.name}
                  </span>
                  <strong>{formatPrice(product.price * quantity)}</strong>
                </li>
              ))}
            </ul>

            <fieldset className="modal__methods">
              <legend className="modal__legend">Escolha como pagar</legend>
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`method ${method.id === methodId ? 'method--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="metodo"
                    value={method.id}
                    checked={method.id === methodId}
                    onChange={() => handleMethodChange(method.id)}
                  />
                  <span className="method__symbol" aria-hidden="true">
                    {method.symbol}
                  </span>
                  <span className="method__text">
                    <strong>{method.label}</strong>
                    <small>{method.condition}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            {summary.method.maxInstallments > 1 && (
              <label className="modal__installments">
                Parcelas
                <select
                  value={installments}
                  onChange={(event) => setInstallments(Number(event.target.value))}
                >
                  {getInstallmentOptions(methodId).map((n) => {
                    const option = getOrderSummary(subtotal, methodId, n)
                    return (
                      <option key={n} value={n}>
                        {n}x de {formatPrice(option.installmentValue)}
                        {option.hasInterest ? ' (com juros)' : ' sem juros'}
                      </option>
                    )
                  })}
                </select>
              </label>
            )}

            <dl className="modal__summary">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(summary.subtotal)}</dd>
              </div>
              {summary.discount > 0 && (
                <div className="modal__summary-discount">
                  <dt>Desconto {summary.method.label}</dt>
                  <dd>− {formatPrice(summary.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Frete</dt>
                <dd>{summary.shipping === 0 ? 'Grátis' : formatPrice(summary.shipping)}</dd>
              </div>
              {summary.hasInterest && (
                <div>
                  <dt>Juros do parcelamento</dt>
                  <dd>{formatPrice(summary.interest)}</dd>
                </div>
              )}
              <div className="modal__summary-total">
                <dt>Total</dt>
                <dd>{formatPrice(summary.total)}</dd>
              </div>
            </dl>

            {summary.installments > 1 && (
              <p className="modal__hint">
                {summary.installments}x de {formatPrice(summary.installmentValue)}
              </p>
            )}

            <button type="button" className="btn btn--primary modal__cta" onClick={goToPayment}>
              Gerar QR Code de pagamento
            </button>
          </>
        )}

        {step === 'pagamento' && order && (
          <>
            <h2 className="modal__title" id="checkout-title">
              <span aria-hidden="true">📱</span> Escaneie para pagar
            </h2>
            <p className="modal__subtitle">
              Pedido <strong>{order.id}</strong> · {order.method.label} ·{' '}
              <strong>{formatPrice(order.total)}</strong>
            </p>

            <div className="modal__qr">
              <QrCode value={buildPaymentUrl(order)} label={`QR Code do pedido ${order.id}`} />
            </div>

            <p className="modal__waiting">
              <span className="modal__spinner" aria-hidden="true" />
              Aguardando confirmação… {secondsLeft}s
            </p>

            <div className="modal__actions">
              <button type="button" className="btn btn--ghost" onClick={copyCode}>
                {copied ? '✅ Copiado!' : 'Copiar código'}
              </button>
              <button type="button" className="btn btn--primary" onClick={confirmPayment}>
                Já paguei
              </button>
            </div>

            <p className="modal__disclaimer">
              Simulação para fins de estudo — nenhum pagamento real é processado. O QR Code
              abre a tela de pedido confirmado no celular.
            </p>
          </>
        )}

        {step === 'sucesso' && order && (
          <div className="modal__success">
            <span className="modal__success-icon" aria-hidden="true">
              ✅
            </span>
            <h2 className="modal__title" id="checkout-title">
              Pagamento aprovado!
            </h2>
            <p className="modal__subtitle">
              Pedido <strong>{order.id}</strong> confirmado.
              <br />
              {order.installments > 1
                ? `${order.installments}x de ${formatPrice(order.installmentValue)}`
                : formatPrice(order.total)}{' '}
              no {order.method.label}.
            </p>
            <p className="modal__hint">
              Seu carrinho foi esvaziado e o pedido já está a caminho. 🚚
            </p>
            <button type="button" className="btn btn--primary modal__cta" onClick={onClose}>
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
