// components/Modal/Modal.tsx
import { createPortal } from 'react-dom'
import '../../styles/main/modal.css'

type Props = {
    isOpen: boolean
    title: string
    onClose: () => void
    children: React.ReactNode
    footer?: React.ReactNode
}

export function Modal({ isOpen, title, onClose, children, footer }: Props) {
    if (!isOpen) return null

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button type="button" className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body   // ← render thẳng vào <body>, thoát khỏi mọi parent
    )
}