import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createEducator, type CreateEducatorRequest } from "../../services/educatorService";
import { Field } from "../form/Field";
import { SelectField } from "../form/SelectField";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { scrollToTop } from "../../utils/scrollToTop";

import { AsyncSelectField } from "../form/AsyncSelectField";
import { fetchInstitutions } from "../../services/institutionService";

const educatorRegisterFormSchema = z
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
    socialName: z.string().optional(),
    gender: z.string().nonempty("Esse campo é obrigatório"),
    siape: z.string().nonempty("O SIAPE é obrigatório"),
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

const genderOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Feminino", value: "Feminino" },
  { label: "Masculino", value: "Masculino" },
  { label: "Outro", value: "Outro" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

export const EducatorRegister = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,          
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(educatorRegisterFormSchema),
    defaultValues: {
      socialName: "",
      name: "",
      cpf: "",
      gender: "",
      email: "",
      password: "",
      siape: "",
      confirmPassword: "",
      institution: null,
    },
  });

  type EducatorFormSchema = z.infer<typeof educatorRegisterFormSchema>;

  const onSubmit = async (data: EducatorFormSchema) => {
    const { institution, ...rest } = data;
    const payload: CreateEducatorRequest = {
      ...rest,
      institutionId: institution!.value, 
    };
    console.log(payload)
    try {
      const response = await createEducator(payload);
      toast.success(response.message);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
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
          label="E-mail:"
          type="text"
          placeholder="Digite seu e-mail"
          register={register("email")}
          error={errors.email?.message}
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
        <Field
          label="SIAPE:"
          type="text"
          placeholder="Digite seu SIAPE"
          register={register("siape")}
          error={errors.siape?.message}
        />
        <SelectField
          label="Gênero:"
          options={genderOptions}
          register={register("gender")}
          error={errors.gender?.message}
        />
      </div>


      <AsyncSelectField
        name="institution"
        label="Instituição:"
        placeholder="Selecione uma instituição"
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
