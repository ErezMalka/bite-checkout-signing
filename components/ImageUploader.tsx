'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import Button from './ui/Button'
import Spinner from './ui/Spinner'

interface ImageUploaderProps {
  productId: string
  mode: 'main' | 'gallery'
  existingImages?: Array<{
    id: string
    path: string
    url: string | null
    is_primary: boolean
    sort_order: number
  }>
  onUploadComplete?: () => void
}

/**
 * Image uploader component with drag-and-drop support
 */
export default function ImageUploader({ 
  productId, 
  mode, 
  existingImages = [], 
  onUploadComplete 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(existingImages)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setError(null)

    try {
      for (const file of acceptedFiles) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('גודל הקובץ לא יכול לעלות על 5MB')
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `product-images/${productId}/${fileName}`

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error('שגיאה בהעלאת הקובץ')
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        // If mode is 'main', ensure no other image is primary
        if (mode === 'main') {
          await supabase
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId)
            .eq('is_primary', true)
        }

        // Create database record
        const { data: imageRecord, error: dbError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            path: filePath,
            url: publicUrl,
            is_primary: mode === 'main',
            sort_order: images.length,
          })
          .select()
          .single()

        if (dbError) {
          console.error('Database error:', dbError)
          throw new Error('שגיאה בשמירת התמונה')
        }

        // Update local state
        setImages(prev => [...prev, imageRecord])
      }

      onUploadComplete?.()
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'שגיאה בהעלאת התמונה')
    } finally {
      setUploading(false)
    }
  }, [productId, mode, images.length, supabase, onUploadComplete])

  const handleDelete = async (imageId: string, imagePath: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק תמונה זו?')) return
    
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([imagePath])

      if (storageError) {
        console.error('Storage delete error:', storageError)
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId)

      if (dbError) {
        throw dbError
      }

      // Update local state
      setImages(prev => prev.filter(img => img.id !== imageId))
      onUploadComplete?.()
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'שגיאה במחיקת התמונה')
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      // Update all images to non-primary
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId)

      // Set selected as primary
      await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId)

      // Update local state
      setImages(prev => prev.map(img => ({
        ...img,
        is_primary: img.id === imageId
      })))

      onUploadComplete?.()
    } catch (err) {
      console.error('Set primary error:', err)
      setError(err instanceof Error ? err.message : 'שגיאה בהגדרת תמונה ראשית')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: mode === 'main' ? 1 : 10,
    disabled: uploading
  })

  return (
    <div className="space-y-4" dir="rtl">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {isDragActive ? (
          <p className="text-blue-600">שחרר כדי להעלות...</p>
        ) : (
          <>
            <p className="text-gray-600">
              גרור תמונות לכאן או לחץ לבחירה
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {mode === 'main' ? 'תמונה ראשית אחת' : 'עד 10 תמונות לגלריה'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP, GIF עד 5MB
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Uploading Status */}
      {uploading && (
        <div className="text-center">
          <Spinner size="md" />
          <p className="mt-2 text-gray-600">מעלה תמונות...</p>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.sort((a, b) => a.sort_order - b.sort_order).map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                {image.url ? (
                  <img
                    src={image.url}
                    alt="Product image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                )}
                
                {image.is_primary && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    ראשית
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {!image.is_primary && mode === 'gallery' && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="bg-white text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-100"
                    title="הגדר כראשית"
                  >
                    ⭐
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(image.id, image.path)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                  title="מחק"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
