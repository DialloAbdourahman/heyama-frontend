import { useState } from "react";
import { ImageObject } from "@/entities/image-object.entity";
import { ImageObjectService } from "@/services/image-object.service";
import Link from "next/link";
import { AxiosError } from "axios";
import { IOrchestrationResult } from "@/interfaces/orchestration-result";
import { showErrorToast, showSuccessToast } from "@/utils/toasts";
import { EnumStatusCode } from "@/enums/response-status-code";

interface ImageCardProps {
  image: ImageObject;
  onDelete: (id: string) => void;
}

export default function ImageCard({ image, onDelete }: ImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        setIsDeleting(true);
        const { data } = await ImageObjectService.delete(image.id);
        if (data.statusCode === EnumStatusCode.DELETED_SUCCESSFULLY) {
          showSuccessToast("Image deleted successfully");
          onDelete(image.id);
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

  return (
    <Link
      href={`/image-objects/${image.id}`}
      className="block bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <img
        src={image.imageUrl}
        alt={image.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
          {image.title}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          {image.description}
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDelete();
          }}
          disabled={isDeleting}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Link>
  );
}
