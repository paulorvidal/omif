import api from "./api";
import type {
    CreateStudentRequest,
    CreateStudentResponse,
    EnrollmentStudent
} from "../types/enrollmentStudentTypes";
import type { PageParams, PageResponse } from "../types/defaultTypes";

export const createStudentAndEnrollmentInEdition = async (
    data: CreateStudentRequest,
    editionYear: number,
): Promise<CreateStudentResponse> => {
    const response = await api.post<CreateStudentResponse>(
        `/editions/${editionYear}/student-enrollments`,
        data,
    );
    return response.data;
};

export const findAllEnrollments = async (
    editionYear: number,
    params: PageParams,
): Promise<PageResponse<EnrollmentStudent>> => {
    const response = await api.get<PageResponse<EnrollmentStudent>>(
        `/editions/${editionYear}/student-enrollments`,
        { params },
    );
    return response.data;
};

export const approveEnrollmentStudent = async (editionYear: string, enrollmentId: string): Promise<void> => {
    await api.post(`/editions/${editionYear}/student-enrollments/${enrollmentId}/approve`);
};

export const refuseEnrollmentStudent = async (editionYear: string, enrollmentId: string): Promise<void> => {
    await api.post(`/editions/${editionYear}/student-enrollments/${enrollmentId}/refuse`);
};