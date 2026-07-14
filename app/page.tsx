"use client";

import { useEffect, useState } from "react";
import { ImageObjectService } from "../services/image-object.service";
import { ImageObject } from "@/entities/image-object.entity";
import Link from "next/link";
import ImageCard from "@/components/image-card";
import Pagination from "@/components/pagination";
import { EnumStatusCode } from "../enums/response-status-code";
import { IOrchestrationResult } from "@/interfaces/orchestration-result";
import { AxiosError } from "axios";
import { showErrorToast } from "@/utils/toasts";
import { IPagination } from "@/interfaces/pagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function Home() {
  const { newImageObject } = useSelector(
    (state: RootState) => state.notification,
  );

  const [images, setImages] = useState<ImageObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<IPagination<ImageObject> | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await ImageObjectService.list(
          currentPage,
          itemsPerPage,
        );
        if (
          response.data.statusCode === EnumStatusCode.RECOVERED_SUCCESSFULLY &&
          response.data.data
        ) {
          setImages(response.data.data.items);
          setPagination(response.data.data);
        }
      } catch (error) {
        const err = error as AxiosError<IOrchestrationResult<string>>;
        setError(err.response?.data.message || "Failed to load images");
        showErrorToast(err.response?.data.message || "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentPage]);

  useEffect(() => {
    if (newImageObject && images.find((i) => i.id !== newImageObject.id)) {
      setImages((prev) => [newImageObject, ...prev]);
    }
  }, [newImageObject]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
            Image Objects
          </h1>
          <Link
            href="/create-image-object"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New
          </Link>
        </div>

        {loading && (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            Loading...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            No images found
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <ImageCard key={image.id} image={image} onDelete={handleDelete} />
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
