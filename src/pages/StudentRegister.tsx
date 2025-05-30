import { useForm } from "react-hook-form";

import { H1 } from "../components/ui/H1";
import { Button } from "../components/ui/Button";

import { Field } from "../components/form/Field";
import { SelectField } from "../components/form/SelectField";

import { createStudent } from "../services/studentService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const studentRegisterFormSchema = z
  .object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    cpf: z.string().min(11, "CPF deve ter pelo menos 11 dígitos"),
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

export const StudentRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentRegisterFormSchema),
    defaultValues: { socialName: "" },
  });

  const onSubmit = async (data: any) => {
    const { ...payload } = data;
    await createStudent(payload);
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center bg-slate-200 p-4 text-zinc-700 sm:p-16">
      <div className="flex w-full flex-col justify-center gap-4 rounded-md bg-slate-50 p-4 sm:p-8">
        <H1>Cadastre-se</H1>
        <form
          className="flex flex-col justify-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Field
            label="Nome:"
            type="text"
            placeholder="Digite seu nome"
            register={register("name")}
            error={errors.name?.message}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="CPF:"
              type="text"
              placeholder="Digite seu CPF"
              mask="999.999.999-99"
              register={register("cpf")}
              error={errors.cpf?.message}
            />
            <Field
              label="Data de Nascimento:"
              type="date"
              placeholder="Digite sua data de nascimento"
              register={register("birthDate")}
              error={errors.birthDate?.message}
            />
            <Field
              label="E-mail:"
              type="text"
              placeholder="Digite seu e-mail"
              register={register("email")}
              error={errors.email?.message}
            />
            <Field
              label="Nome da mãe:"
              type="text"
              placeholder="Digite o nome da sua mãe"
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
              label="Série:"
              options={gradeOptions}
              register={register("grade")}
              error={errors.grade?.message}
            />
            <SelectField
              label="Gênero:"
              options={genderOptions}
              register={register("gender")}
              error={errors.gender?.message}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Você se considera:"
              options={ethnicityOptions}
              register={register("ethnicity")}
              error={errors.ethnicity?.message}
            />
            <SelectField
              label="Sua família é beneficiária do Bolsa Família?"
              options={auxilioBrasilOptions}
              register={register("auxilioBrasil")}
              error={errors.auxilioBrasil?.message}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SelectField
              label="Onde você realizou seus estudos de ensino fundamental ou equivalente?"
              options={elementarySchoolCompletionPlaceOptions}
              register={register("elementarySchoolCompletionPlace")}
              error={errors.elementarySchoolCompletionPlace?.message}
            />
            <SelectField
              label="Em qual faixa de renda per capita sua família se encontra?"
              options={incomeRangeOptions}
              register={register("incomeRange")}
              error={errors.incomeRange?.message}
            />
          </div>
          <div className="flex justify-between">
            <Button secondary type="reset">
              Limpar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
