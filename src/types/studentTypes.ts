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
};

export type CreateStudentResponse = {
  id: string;
  message?: string;
};

export type Institution = {
  id: string;
  name: string;
};

export type Student = {
  institution: Institution;
  id: string;
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
};


export type UpdateStudentPayload = Partial<Omit<Student, 'id'>>;

export type StudentSummary = {
  id: string;
  name: string;
};