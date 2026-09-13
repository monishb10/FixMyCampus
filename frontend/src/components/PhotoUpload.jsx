import { useState, useRef } from 'react'
import { Camera, UploadCloud, X, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { api } from '../services/api'

export default function PhotoUpload({ imageUrl, onImageChange }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(imageUrl || '')
  const fileInputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setError('')

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, GIF).')
      return
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be smaller than 10MB.')
      return
    }

    // Generate local preview immediately
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target.result
      setPreview(dataUrl)

      // Try uploading to backend /api/upload
      setUploading(true)
      try {
        const uploadRes = await api.uploadPhoto(file)
        if (uploadRes && uploadRes.url) {
          onImageChange(uploadRes.url)
        } else {
          // Fallback to dataUrl if upload endpoint didn't return url
          onImageChange(dataUrl)
        }
      } catch (err) {
        console.warn('Backend file upload fell back to data URL:', err)
        // Ensure seamless operation: store the base64 dataUrl directly!
        onImageChange(dataUrl)
      } finally {
        setUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  function removePhoto(e) {
    e.stopPropagation()
    setPreview('')
    setError('')
    onImageChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="photoUploadContainer">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
      />

      {preview ? (
        <div className="photoPreviewCard">
          <div className="previewImageWrapper" onClick={() => fileInputRef.current?.click()}>
            <img src={preview} alt="Upload preview" className="previewThumbnail" />
            <div className="previewOverlay">
              <Camera size={18} />
              <span>Click to change photo</span>
            </div>
          </div>
          <div className="previewInfo">
            <div className="previewStatus">
              <CheckCircle2 size={16} color="#13a56f" />
              <strong>Photo attached successfully</strong>
            </div>
            <small>Evidence photo ready to submit with this ticket.</small>
            {uploading && <span className="uploadBadge">Saving image...</span>}
          </div>
          <button
            type="button"
            className="photoRemoveBtn"
            onClick={removePhoto}
            title="Remove photo"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`photoDropzone ${dragOver ? 'dragOver' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
        >
          <div className="dropzoneIcon">
            <UploadCloud size={28} />
          </div>
          <div className="dropzoneText">
            <strong>Upload evidence photo</strong>
            <p>Drag and drop an image here, or <span>browse from your device</span></p>
            <small>Supports JPG, PNG, WebP up to 10MB • Clear evidence speeds up resolution</small>
          </div>
        </div>
      )}

      {error && <div className="uploadError">{error}</div>}
    </div>
  )
}
