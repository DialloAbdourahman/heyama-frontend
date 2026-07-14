import { ImageObject } from "@/entities/image-object.entity";
import { axiosBaseClient } from "../lib/axios";
import { IPagination } from "@/interfaces/pagination";
import { IOrchestrationResult } from "@/interfaces/orchestration-result";

export const ImageObjectService = {
  list: (page: number = 1, limit: number = 10) => {
    return axiosBaseClient.get<IOrchestrationResult<IPagination<ImageObject>>>(
      "/image-objects",
      {
        params: { page, limit },
      },
    );
  },

  create: (formData: FormData) => {
    return axiosBaseClient.post<IOrchestrationResult<ImageObject>>(
      "/image-objects",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  delete: (id: string) => {
    return axiosBaseClient.delete<IOrchestrationResult<null>>(
      `/image-objects/${id}`,
    );
  },

  findOne: (id: string) => {
    return axiosBaseClient.get<IOrchestrationResult<ImageObject>>(
      `/image-objects/${id}`,
    );
  },
};
