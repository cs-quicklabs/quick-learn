'use client';
import { CameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  watch: UseFormWatch<z.TypeOf<z.ZodTypeAny>>;
  setValue: UseFormSetValue<z.TypeOf<z.ZodTypeAny>>;
  src?: string;
  name: string;
  label: string;
}

const ImageInput: FC<Props> = ({
  watch,
  setValue,
  name,
  label,
  src = null,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(src);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const watchProfileImage = watch(name);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue(name, file);
    }
  };

  useEffect(() => {
    if (watchProfileImage && watchProfileImage instanceof File) {
      const objectUrl = URL.createObjectURL(watchProfileImage);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [watchProfileImage]);
  useEffect(() => {
    typeof src === 'string' && setImagePreview(src);
  }, [src]);

  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <div className="mt-2 flex justify-left">
        <div
          className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={imagePreview || ''}
            alt="Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <CameraIcon className="text-white" width="50px" />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ImageInput;
