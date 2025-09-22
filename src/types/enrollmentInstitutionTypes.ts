import type {
    CreateInstitutionRequest
} from "./institutionTypes"

export type EnrollmentPayload = {
    name: string | null;
    inep: string | null;
    phoneNumber: string | null;
    email1: string | null;
    email2: string | null;
    email3: string | null;
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
    status: string;
};


export type EnrollmentInstitution = {
    id: string;
    enrollmentDate: string;
    status: string;
    institution: CreateInstitutionRequest;
    changedInstitutionData: CreateInstitutionRequest | null;
};