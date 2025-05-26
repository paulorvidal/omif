import { useForm } from "react-hook-form";
import { H1 } from "../components/ui/H1";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Button } from "../components/ui/Button";
import { createStudent } from "../services/studentService";
import type { CreateStudentRequest } from "../services/studentService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "../components/form/Field";

const studentSchema = z
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


type FormData = CreateStudentRequest & { confirmPassword: string };

export const StudentRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { socialName: "" },
  });

  const onSubmit = async (data: FormData) => {
    const {...payload } = data;
    await createStudent(payload);
  };

  return (
    <div>
      <H1>Cadastro de Estudante</H1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field
            label="Nome:"
            type="text"
            placeholder="Digite seu nome"
            register={register("name")}
            error={errors.name?.message}
          />

        <Field
            label="E-mail:"
            type="text"
            placeholder="Digite seu e-mail"
            register={register("email")}
            error={errors.email?.message}
          />
          
        <Field
            label="CPF:"
            type="text"
            placeholder="Digite seu CPF"
            register={register("cpf")}
            error={errors.cpf?.message}
          />  

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

        <Field
            label="Nome da mãe:"
            type="text"
            placeholder="Digite o nome da sua mãe"
            register={register("motherName")}
            error={errors.motherName?.message}
          />

        <Field
            label="Data de Nascimento:"
            type="date"
            placeholder="Digite sua data de nascimento"
            register={register("birthDate")}
            error={errors.birthDate?.message}
          />

        

        <div>
          <Label>Sua família é beneficiária do Bolsa Família?</Label>
          <select
            {...register("auxilioBrasil", {
              required: "Esse campo é obrigatório",
            })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Selecione uma opção</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="prefiro_nao_responder">Prefiro não responder</option>
          </select>

          {errors.auxilioBrasil && (
            <span className="text-sm text-red-500">
              {errors.auxilioBrasil.message}
            </span>
          )}
        </div>

        <div>
          <Label>Série</Label>
          <select
            {...register("grade", { required: "A série é obrigatória" })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Selecione a série</option>
            <option value={1}>1º ano</option>
            <option value={2}>2º ano</option>
            <option value={3}>3º ano</option>
            <option value={4}>4º ano</option>
          </select>

          {errors.grade && (
            <span className="text-sm text-red-500">{errors.grade.message}</span>
          )}
        </div>

        <div>
          <Label>Você se considera</Label>
          <select
            {...register("ethnicity", { required: "Esse campo é obrigatório" })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Selecione uma opção</option>
            <option value="Branco">Branco</option>
            <option value="Pardo">Pardo</option>
            <option value="Preto">Preto</option>
            <option value="Amarelo">Amarelo</option>
            <option value="Indigena">Indigena</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>

          {errors.ethnicity && (
            <span className="text-sm text-red-500">
              {errors.ethnicity.message}
            </span>
          )}
        </div>

        <div>
          <Label>Gênero</Label>
          <select
            {...register("gender", { required: "Esse campo é obrigatório" })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Selecione uma opção</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>

          {errors.gender && (
            <span className="text-sm text-red-500">
              {errors.gender.message}
            </span>
          )}
        </div>

        <div>
          <Label>
            Onde você realizou seus estudos de ensino fundamental ou equivalente
          </Label>
          <select
            {...register("elementarySchoolCompletionPlace", {
              required: "Esse campo é obrigatório",
            })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Selecione uma opção</option>
            <option value="Escola pública municipal">
              Escola pública municipal
            </option>
            <option value="Escola pública estadual">
              Escola pública estadual
            </option>
            <option value="Escola particular">Escola particular</option>
            <option value="Parte em escola pública parte em escola particular">
              Parte em escola pública parte em escola particular
            </option>
            <option value="Supletivo">Supletivo</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>

          {errors.elementarySchoolCompletionPlace && (
            <span className="text-sm text-red-500">
              {errors.elementarySchoolCompletionPlace.message}
            </span>
          )}
        </div>

        <div>
          <Label>
            Em qual faixa de renda per capita sua família se encontra
          </Label>
          <select
            {...register("incomeRange", {
              required: "Esse campo é obrigatório",
            })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            <option value="">Selecione uma opção</option>
            <option value="Até meio salário mínimo">
              até meio salário mínimo
            </option>
            <option value="De meio a um salário mínimo">
              de um a meio salário mínimo
            </option>
            <option value="De um a dois salários mínimos">
              de um a dois salários mínimos
            </option>
            <option value="De dois a três salários mínimos">
              de dois a três salários mínimos
            </option>
            <option value="Acima de três salários mínimos">
              acima de três salários mínimos
            </option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>

          {errors.incomeRange && (
            <span className="text-sm text-red-500">
              {errors.incomeRange.message}
            </span>
          )}
        </div>

        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
};
