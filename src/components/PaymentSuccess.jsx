import ThemeToggle from './ThemeToggle.jsx'
import { formatPrice } from '../utils/format.js'
import '../styles/PaymentSuccess.css'

/**
 * Tela aberta quando alguém escaneia o QR Code do pedido:
 * o celular cai direto aqui, com a confirmação do pagamento.
 */
export default function PaymentSuccess({ order, onBack, theme, onToggleTheme }) {
  return (
    <div className="success">
      <div className="success__theme">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="success__card">
        <span className="success__icon" aria-hidden="true">
          ✅
        </span>
        <h1 className="success__title">Pagamento confirmado!</h1>
        <p className="success__text">
          Obrigado pela compra na <strong>Nível Up Games</strong>. Recebemos seu pagamento
          e o pedido já está sendo separado.
        </p>

        <dl className="success__details">
          <div>
            <dt>Pedido</dt>
            <dd>{order.id}</dd>
          </div>
          <div>
            <dt>Forma de pagamento</dt>
            <dd>{order.methodLabel}</dd>
          </div>
          <div>
            <dt>Valor</dt>
            <dd>
              {formatPrice(order.total)}
              {order.installments > 1 && ` em ${order.installments}x`}
            </dd>
          </div>
        </dl>

        <button type="button" className="btn btn--primary success__btn" onClick={onBack}>
          Voltar para a loja
        </button>

        <p className="success__disclaimer">
          Simulação para fins de estudo — nenhum pagamento real é processado.
        </p>
      </div>
    </div>
  )
}
