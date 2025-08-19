import { useForm } from "react-hook-form";

import { Button } from "../ui/Button";

import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";

import {
  createStudent,
  type CreateStudentRequest,
} from "../../services/studentService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { scrollToTop } from "../../utils/scrollToTop";

import { AsyncSelectField } from "../ui/AsyncSelectField";
import { fetchInstitutions } from "../../services/institutionService";
import { redirectTo, showToast } from "../../utils/events";

const studentFormSchema = z
  .object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    cpf: z
      .string()
      .nonempty("O CPF é obrigatório")
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido"),
    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .refine((s) => !/\s/.test(s), "A senha não pode conter espaços"),
    confirmPassword: z.string(),
    motherName: z.string().nonempty("O nome da mãe é obrigatório"),
    birthDate: z
      .string()
      .refine((v) => new Date(v) <= new Date(), "Data não pode ser no futuro"),
    socialName: z.string().optional(),
    auxilioBrasil: z.string().nonempty("Esse campo é obrigatório"),
    grade: z.coerce
      .number()
      .min(1, "Selecione uma série")
      .max(4, "Selecione uma série"),
    ethnicity: z.string().nonempty("Esse campo é obrigatório"),
    gender: z.string().nonempty("Esse campo é obrigatório"),
    elementarySchoolCompletionPlace: z
      .string()
      .nonempty("Esse campo é obrigatório"),
    incomeRange: z.string().nonempty("Esse campo é obrigatório"),
    institution: z
      .object({
        label: z.string(),
        value: z.string().uuid("ID inválido"),
      })
      .nullable()
      .refine((o) => o !== null, "A instituição é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const auxilioBrasilOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Sim", value: "Sim" },
  { label: "Não", value: "Não" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const gradeOptions = [
  { label: "Selecione a série", value: "" },
  { label: "1º ano", value: 1 },
  { label: "2º ano", value: 2 },
  { label: "3º ano", value: 3 },
];

const ethnicityOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Branco", value: "Branco" },
  { label: "Pardo", value: "Pardo" },
  { label: "Preto", value: "Preto" },
  { label: "Amarelo", value: "Amarelo" },
  { label: "Indígena", value: "Indigena" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const genderOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Feminino", value: "Feminino" },
  { label: "Masculino", value: "Masculino" },
  { label: "Outro", value: "Outro" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const elementarySchoolCompletionPlaceOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Escola pública municipal", value: "Escola pública municipal" },
  { label: "Escola pública estadual", value: "Escola pública estadual" },
  { label: "Escola particular", value: "Escola particular" },
  {
    label: "Parte em escola pública parte em escola particular",
    value: "Parte em escola pública parte em escola particular",
  },
  { label: "Supletivo", value: "Supletivo" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const incomeRangeOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Até meio salário mínimo", value: "Até meio salário mínimo" },
  {
    label: "De meio a um salário mínimo",
    value: "De meio a um salário mínimo",
  },
  {
    label: "De um a dois salários mínimos",
    value: "De um a dois salários mínimos",
  },
  {
    label: "De dois a três salários mínimos",
    value: "De dois a três salários mínimos",
  },
  {
    label: "Acima de três salários mínimos",
    value: "Acima de três salários mínimos",
  },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

export const StudentForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      motherName: "",
      birthDate: "",
      auxilioBrasil: "",
      grade: 0,
      elementarySchoolCompletionPlace: "",
      incomeRange: "",
      ethnicity: "",
      socialName: "",
      cpf: "",
      gender: "",
      confirmPassword: "",
      institution: null,
    },
  });

  type StudentFormSchema = z.infer<typeof studentFormSchema>;

  const onSubmit = async (data: StudentFormSchema) => {
    const { institution, ...rest } = data;
    const payload: CreateStudentRequest = {
      ...rest,
      institutionId: institution!.value,
    };
    console.log(payload);
    try {
      const response = await createStudent(payload);

      if (response.message) {
        showToast(response.message, "success");
      }

      redirectTo("/login");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const onReset = () => {
    reset();
    scrollToTop();
  };

  return (
    <form
      className="flex w-full flex-col justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        label="Nome:"
        type="text"
        placeholder="Ex: Nome Completo"
        register={register("name")}
        error={errors.name?.message}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="CPF:"
          type="text"
          placeholder="Ex: 000.000.000-00"
          mask="999.999.999-99"
          register={register("cpf")}
          error={errors.cpf?.message}
        />
        <Field
          label="Data de Nascimento:"
          type="date"
          register={register("birthDate")}
          error={errors.birthDate?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail:"
          type="text"
          placeholder="Ex: nome@email.com"
          register={register("email")}
          error={errors.email?.message}
        />
        <Field
          label="Nome da mãe:"
          type="text"
          placeholder="Ex: Nome Completo da Mãe"
          register={register("motherName")}
          error={errors.motherName?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Senha:"
          type="password"
          placeholder="Digite sua senha"
          register={register("password")}
          error={errors.password?.message}
        />
        <Field
          label="Confirmar Senha:"
          type="password"
          placeholder="Digite sua senha novamente"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="grade"
          label="Série:"
          control={control}
          options={gradeOptions}
          error={errors.grade?.message}
        />
        <SelectField
          name="gender"
          label="Gênero:"
          control={control}
          options={genderOptions}
          error={errors.gender?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="ethnicity"
          label="Você se considera:"
          control={control}
          options={ethnicityOptions}
          error={errors.ethnicity?.message}
        />
        <SelectField
          name="auxilioBrasil"
          label="Sua família é beneficiária do Bolsa Família?"
          control={control}
          options={auxilioBrasilOptions}
          error={errors.auxilioBrasil?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="elementarySchoolCompletionPlace"
          label="Onde você realizou seus estudos de ensino fundamental ou equivalente?"
          control={control}
          options={elementarySchoolCompletionPlaceOptions}
          error={errors.elementarySchoolCompletionPlace?.message}
        />
        <SelectField
          name="incomeRange"
          label="Em qual faixa de renda per capita sua família se encontra?"
          control={control}
          options={incomeRangeOptions}
          error={errors.incomeRange?.message}
        />
      </div>

      <AsyncSelectField
        name="institution"
        label="Instituição:"
        placeholder="Ex: NOME DA INSTITUIÇÃO"
        control={control}
        loadOptions={fetchInstitutions}
        error={errors.institution?.message}
      />

      <div className="flex justify-between">
        <Button secondary type="button" onClick={onReset}>
          Limpar
        </Button>
        <Button type="submit">Cadastrar</Button>
      </div>
    </form>
  );
};
