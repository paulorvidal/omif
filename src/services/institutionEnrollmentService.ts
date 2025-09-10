import api from "./api";
import type { PageParams, PageResponse } from "../types/defaultTypes";
import type {
    EnrollmentPayload,
    EnrollmentStatusResponse,
    EnrollmentInstitution
} from "../types/institutionEnrollmentTypes"

export const enrollInEdition = async (editionYear: string, payload: EnrollmentPayload) => {
    console.log(payload)
    const response = await api.post(`/editions/${editionYear}/enrollments`, payload);
    return response.data;
};

export const getEnrollmentStatus = async (editionYear: string) => {
    const response = await api.get<EnrollmentStatusResponse>(`/editions/${editionYear}/enrollments/me`);
    return response.data;
};

export const findAllInstitutionEnrollments = async (
    editionYear: string,
    page: number,
    size: number = 10,
    q?: string,
    sort?: string,
): Promise<PageResponse<EnrollmentInstitution>> => {
    const params: PageParams = { page, size };

    if (q?.trim()) {
        params.q = q.trim();
    }

    if (sort?.trim()) {
        params.sort = sort.trim();
    }
    const response = await api.get<PageResponse<EnrollmentInstitution>>(
        `/editions/${editionYear}/enrollments`,
        { params },
    );
    return response.data;
}

export const approveEnrollment = async (editionYear: string, enrollmentId: string, confirmChange?: boolean) => {
    const response = await api.post(
      `/editions/${editionYear}/enrollments/${enrollmentId}/approve`,
      null,
      { params: { confirmChange } }
    );
    return response.data;
};

export const refuseEnrollment = async (editionYear: string, enrollmentId: string, confirmChange: boolean) => {
    const response = await api.post(
      `/editions/${editionYear}/enrollments/${enrollmentId}/refuse`,
      null,
      { params: { confirmChange } }
    );
    return response.data;
};