import { X, ZoomIn } from 'lucide-react'

export default function ImageModal({ src, title, onClose }) {
  if (!src) return null

  return (
    <div className="imageModalOverlay" onClick={onClose}>
      <div className="imageModalContent" onClick={e => e.stopPropagation()}>
        <div className="imageModalHeader">
          <div className="imageModalTitle">
            <ZoomIn size={18} />
            <span>{title || 'Evidence Photo'}</span>
          </div>
          <button className="modalCloseBtn" onClick={onClose} aria-label="Close photo view">
            <X size={20} />
          </button>
        </div>
        <div className="imageModalBody">
          <img src={src} alt={title || 'Evidence'} />
        </div>
      </div>
    </div>
  )
}
