import api from "./api";

export type EnrollmentPayload = {
    name: string;
    inep?: string;
    email1: string;
    email2?: string;
    email3?: string;
    phoneNumber: string;
};

type InstitutionData = {
    id: string;
    name: string;
    inep: string | null;
    email1: string;
    email2: string | null;
    email3: string | null;
    phoneNumber: string;
};

export type EnrollmentStatusResponse = {
    isEnrolled: boolean;
    institution: InstitutionData;
    editionName: string;
    editionYear: number;
};

export const enrollInEdition = async (editionYear: string, payload: EnrollmentPayload) => {
    const response = await api.post(`/editions/${editionYear}/enrollments`, payload);
    return response.data;
};

export const getEnrollmentStatus = async (editionYear: string) => {
    const response = await api.get<EnrollmentStatusResponse>(`/editions/${editionYear}/enrollments`);
    return response.data; 
};