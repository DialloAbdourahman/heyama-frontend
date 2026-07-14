"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createImageObjectSchema,
  CreateImageObjectDto,
} from "@/dto/create-image-object.dto";
import { ImageObjectService } from "@/services/image-object.service";
import { KEYS } from "@/utils/keys";
import { EnumStatusCode } from "../../enums/response-status-code";
import { AxiosError } from "axios";
import { IOrchestrationResult } from "@/interfaces/orchestration-result";
import { showErrorToast, showSuccessToast } from "@/utils/toasts";

export default function CreateImageObjectPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CreateImageObjectDto>({
    resolver: zodResolver(createImageObjectSchema),
    defaultValues: { title: "", description: "", image: undefined },
  });

  const imageFile = watch("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
    }
  };

  useEffect(() => {
    if (imageFile && imageFile instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreview(null);
    }
  }, [imageFile]);

  const onSubmit = async (data: CreateImageObjectDto) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("image", data.image);

      const response = await ImageObjectService.create(formData);

      if (response.data.statusCode === EnumStatusCode.CREATED_SUCCESSFULLY) {
        showSuccessToast("Image object created successfully");
        router.push("/");
      }
    } catch (error) {
      const err = error as AxiosError<IOrchestrationResult<string>>;
      showErrorToast(
        err.response?.data.message || "Failed to create image object",
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to list
        </button>
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
          Create Image Object
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black dark:text-zinc-50 uppercase tracking-wide">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              {...register("title")}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 outline-none transition-colors ${
                errors.title
                  ? "border-red-400"
                  : "border-gray-200 dark:border-zinc-700 focus:border-blue-500"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500">
                {typeof errors.title.message === "string"
                  ? errors.title.message
                  : "Title is required"}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black dark:text-zinc-50 uppercase tracking-wide">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              rows={4}
              {...register("description")}
              className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 outline-none transition-colors resize-none ${
                errors.description
                  ? "border-red-400"
                  : "border-gray-200 dark:border-zinc-700 focus:border-blue-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {typeof errors.description.message === "string"
                  ? errors.description.message
                  : "Description is required"}
              </p>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black dark:text-zinc-50 uppercase tracking-wide">
              Image
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.image
                  ? "border-red-400"
                  : "border-gray-300 dark:border-zinc-700 hover:border-blue-500"
              }`}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                {...register("image", { value: undefined })}
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 object-contain"
                  />
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-zinc-400">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">
                      JPG, JPEG, PNG, WEBP (max {KEYS.MAX_IMAGE_SIZE_IN_MB}MB)
                    </span>
                  </>
                )}
              </label>
            </div>
            {errors.image && (
              <p className="text-xs text-red-500">
                {typeof errors.image.message === "string"
                  ? errors.image.message
                  : "Image is required"}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold rounded-lg py-3.5 text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Image Object"}
          </button>
        </form>
      </main>
    </div>
  );
}
