import { useState } from 'react'
import styles from './ProfileImage.module.css'

interface ProfileImageProps {
  src: string
  alt: string
  fallbackSrc: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  className?: string
}

export const ProfileImage = ({
  src,
  alt,
  fallbackSrc,
  loading = 'lazy',
  className = '',
}: ProfileImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <div className={`${styles.profileImageContainer} ${className}`}>
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onError={handleError}
        className={styles.profileImage}
      />
    </div>
  )
}

export default ProfileImage

