"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImageObjectService } from "@/services/image-object.service";
import { ImageObject } from "@/entities/image-object.entity";
import { showErrorToast, showSuccessToast } from "@/utils/toasts";
import { EnumStatusCode } from "@/enums/response-status-code";
import { AxiosError } from "axios";
import { IOrchestrationResult } from "@/interfaces/orchestration-result";

export default function ImageObjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [image, setImage] = useState<ImageObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await ImageObjectService.findOne(id);
        if (response.data.data) {
          setImage(response.data.data);
        }
      } catch (err) {
        setError("Failed to load image");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        setIsDeleting(true);
        const { data } = await ImageObjectService.delete(id);
        if (data.statusCode === EnumStatusCode.DELETED_SUCCESSFULLY) {
          showSuccessToast("Image deleted successfully");
          router.push("/");
        }
      } catch (error) {
        const err = error as AxiosError<IOrchestrationResult<string>>;
        showErrorToast(
          err.response?.data.message || "Failed to create image object",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            Loading...
          </div>
        </main>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600 dark:text-red-400">
            {error || "Image not found"}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to list
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-auto max-h-[600px] object-contain"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-black dark:text-zinc-50">
              {image.title}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {image.description}
            </p>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Image"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
