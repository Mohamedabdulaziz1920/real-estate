'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { 
  FaCloudUploadAlt, 
  FaTimes, 
  FaSpinner,
  FaStar,
  FaRegStar,
  FaGripVertical
} from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ 
  images, 
  onChange, 
  maxImages = 10 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`الحد الأقصى ${maxImages} صور`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange([...images, ...data.images]);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('حدث خطأ في رفع الصور');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [images, onChange, maxImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const setMainImage = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.unshift(removed);
    onChange(newImages);
    toast.success('تم تعيين الصورة الرئيسية');
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50'
            : uploading || images.length >= maxImages
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-emerald-500 hover:bg-emerald-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <FaSpinner className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
            <p className="text-gray-600">جاري رفع الصور...</p>
            <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <FaCloudUploadAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isDragActive ? 'أفلت الصور هنا' : 'اسحب وأفلت الصور هنا'}
            </p>
            <p className="text-gray-500 mb-4">أو</p>
            <button
              type="button"
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
              disabled={images.length >= maxImages}
            >
              اختر الصور
            </button>
            <p className="text-sm text-gray-400 mt-4">
              PNG, JPG, WEBP حتى 5MB لكل صورة • الحد الأقصى {maxImages} صور
            </p>
          </>
        )}
      </div>

      {/* Images Counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {images.length} من {maxImages} صور
        </span>
        <span className={`font-medium ${
          images.length === 0 ? 'text-red-500' : 'text-emerald-600'
        }`}>
          {images.length === 0 ? 'صورة واحدة على الأقل مطلوبة' : 'الصورة الأولى هي الرئيسية'}
        </span>
      </div>

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative group rounded-xl overflow-hidden aspect-[4/3] ${
                index === 0 ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`صورة ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Set as Main */}
                <button
                  type="button"
                  onClick={() => setMainImage(index)}
                  className="p-2 bg-white rounded-full hover:bg-emerald-500 hover:text-white transition-colors"
                  title="تعيين كصورة رئيسية"
                >
                  {index === 0 ? (
                    <FaStar className="w-4 h-4 text-amber-500" />
                  ) : (
                    <FaRegStar className="w-4 h-4" />
                  )}
                </button>
                
                {/* Move */}
                <button
                  type="button"
                  className="p-2 bg-white rounded-full cursor-move"
                  title="اسحب للترتيب"
                >
                  <FaGripVertical className="w-4 h-4" />
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  title="حذف"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* Main Badge */}
              {index === 0 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">
                  الرئيسية
                </div>
              )}

              {/* Index */}
              <div className="absolute bottom-2 left-2 w-6 h-6 bg-black/50 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}