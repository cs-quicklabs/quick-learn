'use client';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { FilePathType } from 'lib/shared/src';
import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { z } from 'zod';
import { Loader } from '../components/UIElements';

interface Props {
  watch: UseFormWatch<z.TypeOf<z.ZodTypeAny>>;
  setValue: UseFormSetValue<z.TypeOf<z.ZodTypeAny>>;
  src?: string;
  name: string;
  label: string;
  imageType: FilePathType;
}

const ImageInput: FC<Props> = ({
  watch,
  setValue,
  name,
  label,
  src = null,
  imageType,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(src);
  const [error, setError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const watchProfileImage = watch(name);

  const handleImageClick = () => {
    if (isLoading) return;
    if (!imagePreview) {
      fileInputRef.current?.click();
    } else {
      setIsLoading(true);
      setValue(name, '', {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setImagePreview(null);
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > 1024 * 1024) {
        setError(true);
        return;
      }
      setError(false);
      const formData = new FormData();
      formData.append('file', file);
      setIsLoading(true);
      fileUploadApiCall(formData, imageType)
        .then((res) => {
          setValue(name, res.data.file, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        })
        .catch((err) => showApiErrorInToast(err))
        .finally(() => setIsLoading(false));
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
          className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={imagePreview || '/placeholder.png'}
            alt="Image"
            fill={true}
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 5rem) 5rem, 5rem"
          />
          <div
            className={
              'absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity' +
              (isLoading ? ' opacity-100' : '')
            }
          >
            {isLoading ? (
              <Loader className="w-6" />
            ) : imagePreview ? (
              <TrashIcon className="text-white" width="32px" />
            ) : (
              <CameraIcon className="text-white" width="32px" />
            )}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*"
          id={'file_' + name}
        />
      </div>
      {error && (
        <p className="mt-1 text-red-500 text-sm">
          File should be less than 1MB.
        </p>
      )}
    </div>
  );
};

export default ImageInput;
