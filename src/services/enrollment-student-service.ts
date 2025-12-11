import api from "./api";
import type {
  CreateStudentResponse,
  EnrollmentStudent,
} from "../types/enrollment-student-types";
import type { PageParams, PageResponse } from "../types/default-types";

export const createStudentAndEnrollmentInEdition = async (
  data: FormData, 
  editionYear: number
): Promise<CreateStudentResponse> => {
  console.log(data)
  const response = await api.post<CreateStudentResponse>(
    `/editions/${editionYear}/student-enrollments`,
    data
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

export const approveEnrollmentStudent = async (
  editionYear: string,
  enrollmentId: string,
): Promise<void> => {
  await api.post(
    `/editions/${editionYear}/student-enrollments/${enrollmentId}/approve`,
  );
};

export const refuseEnrollmentStudent = async (
  editionYear: string,
  enrollmentId: string,
): Promise<void> => {
  await api.post(
    `/editions/${editionYear}/student-enrollments/${enrollmentId}/refuse`,
  );
};

export const approveEnrollmentStudentsBulk = async (
  editionYear: string,
  enrollmentIds: string[],
): Promise<void> => {
  await api.post(
    `/editions/${editionYear}/student-enrollments/approve`,
    enrollmentIds 
  );
};

export const refuseEnrollmentStudentsBulk = async (
  editionYear: string,
  enrollmentIds: string[],
): Promise<void> => {
  await api.post(
    `/editions/${editionYear}/student-enrollments/refuse`,
    enrollmentIds 
  );
};
