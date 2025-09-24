import api from "./api";
import type { PageParams, PageResponse } from "../types/defaultTypes";
import type { Student, UpdateStudentPayload } from "../types/studentTypes"

export const findAllStudents = async (
  params: PageParams,
): Promise<PageResponse<Student>> => {
  const response = await api.get<PageResponse<Student>>(
    "/students",
    { params },
  );
  return response.data;
};

export const deleteStudent = async (
  id: string
) => {
  console.log(id)
};

export const getStudentById = async (
  id: string
) => {
  const response = await api.get<Student>(`/students/${id}`);
  return response.data;
};

export const updateStudent = async ({ id, data }: { id: string; data: UpdateStudentPayload; }) => {
  const resp = await api.patch<Student>(`/students/${id}`, data);
  return resp.data;
};