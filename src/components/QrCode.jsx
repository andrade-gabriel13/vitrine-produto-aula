import { useEffect, useState } from 'react'
import QRCodeLib from 'qrcode'

export default function QrCode({ value, size = 220, label }) {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    let active = true

    QRCodeLib.toDataURL(value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#17171c', light: '#ffffff' },
    })
      .then((url) => {
        if (active) setDataUrl(url)
      })
      .catch(() => {
        if (active) setDataUrl('')
      })

    return () => {
      active = false
    }
  }, [value, size])

  if (!dataUrl) {
    return <div className="qrcode qrcode--loading">Gerando QR Code…</div>
  }

  return <img className="qrcode" src={dataUrl} alt={label || 'QR Code de pagamento'} />
}
