import type { StudentSummary } from "./student-types";
import type { InstitutionSummary } from "./institution-types";

export type CreateStudentRequest = {
  institutionId: string;
  name: string;
  socialName: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: string;
  bolsaFamilia: string;
  grade: number;
  ethnicity: string;
  completionElementarySchoolCategory: string;
  incomeRange: string;
  captchaToken: string;
};

export type CreateStudentResponse = {
  id: string;
};

export type EnrollmentStudent = {
  id: string;
  gender: string;
  bolsaFamilia: string;
  grade: number;
  ethnicity: string;
  completionElementarySchoolCategory: string;
  incomeRange: string;
  student: StudentSummary;
  institution: InstitutionSummary;
  status: "PENDING" | "APPROVED" | "REFUSED";
  enrollmentDate: string;
};
