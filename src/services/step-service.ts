import api from "./api";
import type { CreateStepDTO, Step, UpdateStepDTO } from "@/types/step-types";

export const stepService = {
  getAllSteps: async (editionId: string): Promise<Step[]> => {
    const response = await api.get(`/editions/${editionId}/steps`);
    return response.data;
  },

  getStepById: async (editionId: string, stepId: string): Promise<Step> => {
    const response = await api.get(`/editions/${editionId}/steps/${stepId}`);
    return response.data;
  },

  createStep: async (
    editionId: string,
    data: CreateStepDTO,
  ): Promise<Step> => {
    const response = await api.post(`/editions/${editionId}/steps`, data);
    return response.data;
  },

  updateStep: async (
    editionId: string,
    stepId: string,
    data: UpdateStepDTO,
  ): Promise<Step> => {
    const response = await api.patch(
      `/editions/${editionId}/steps/${stepId}`,
      data,
    );
    return response.data;
  },

  deleteStep: async (editionId: string, stepId: string): Promise<void> => {
    await api.delete(`/editions/${editionId}/steps/${stepId}`);
  },
};
