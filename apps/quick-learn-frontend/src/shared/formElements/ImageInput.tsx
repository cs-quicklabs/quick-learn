'use client';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fileUploadApiCall } from '@src/apiServices/fileUploadService';
import { showApiErrorInToast } from '@src/utils/toastUtils';
import { FilePathType } from 'lib/shared/src';
import Image from 'next/image';
import React, { FC, useEffect, useRef, useState } from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { z } from 'zod';
import { getInitials } from '@src/utils/helpers';
import ConformationModal from '../modals/conformationModal'; // Assuming this is your confirmation modal component
import { AxiosSuccessResponse } from '@src/apiServices/axios';
import { FileUploadResponse } from '@src/shared/types/utilTypes';

interface Props {
  watch: UseFormWatch<z.TypeOf<z.ZodTypeAny>>;
  setValue: UseFormSetValue<z.TypeOf<z.ZodTypeAny>>;
  src?: string;
  name: string;
  label: string;
  imageType: FilePathType;
  firstName?: string;
  lastName?: string;
  readonly onChangeImage?: (
    res: AxiosSuccessResponse<FileUploadResponse> | undefined,
  ) => void;
}

const ImageInput: FC<Props> = ({
  watch,
  setValue,
  name,
  label,
  src = null,
  imageType,
  firstName,
  lastName,
  onChangeImage,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(src);
  const [error, setError] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false); // State to manage modal visibility
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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
      // Note: You'll need to implement fileUploadApiCall
      fileUploadApiCall(formData, imageType)
        .then((res) => {
          setValue(name, res.data.file, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          return res;
        })
        .then((res) => {
          if (onChangeImage) {
            //runs API call to update the Image
            onChangeImage(res);
          }
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

  // Handle Trash Icon Click - Open the confirmation modal
  const handleImagedeletion = (e: React.MouseEvent) => {
    if (imagePreview) {
      e.stopPropagation(); // Prevent triggering `handleImageClick`
      setIsDeleteModalOpen(true); // Open the confirmation modal
    }
  };

  // Handle Deletion Confirmation - Remove the image and close the modal
  const handleConfirmDeletion = async () => {
    setIsLoading(true);
    try {
      if (onChangeImage) {
        await onChangeImage(undefined);
      }
      // Update form value
      setValue(name, '', {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      // Clear image preview
      setImagePreview(null);
    } finally {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
    }
  };

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
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile"
              fill
              className="object-cover"
              sizes="(max-width: 5rem) 5rem, 5rem"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                {getInitials(firstName, lastName)}
              </span>
            </div>
          )}
          <div
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ${
              isLoading ? 'opacity-100' : ''
            }`}
            onClick={handleImagedeletion}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : imagePreview ? (
              <TrashIcon className="text-white w-8 h-8" />
            ) : (
              <CameraIcon className="text-white w-8 h-8" />
            )}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          id={'file_' + name}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          File should be less than 1MB.
        </p>
      )}

      {isDeleteModalOpen && (
        <ConformationModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onConfirm={handleConfirmDeletion}
          title="Delete Image"
          subTitle="Are you sure you want to delete this image?"
        />
      )}
    </div>
  );
};

export default ImageInput;
