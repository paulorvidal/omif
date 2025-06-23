import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createEducator,
  type CreateEducatorRequest,
} from "../../services/educatorService";
import { Field } from "../form/Field";
import { Button } from "../ui/Button";
import { scrollToTop } from "../../utils/scrollToTop";

import { AsyncSelectField } from "../form/AsyncSelectField";
import { fetchInstitutions } from "../../services/institutionService";
import { redirectTo, showToast } from "../../utils/events";

const EducatorFormFormSchema = z
  .object({
    name: z.string().nonempty("O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    confirmEmail: z.string(),   
    cpf: z
      .string()
      .nonempty("O CPF é obrigatório")
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido"),
    password: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .refine((s) => !/\s/.test(s), "A senha não pode conter espaços"),
    confirmPassword: z.string(),
    socialName: z
      .string()
      .optional() 
      .transform((v) => {
        if (typeof v === "string") {
          const trimmed = v.trim();
          return trimmed === "" ? null : trimmed;
        }
        return null;
      })
      .nullable(),
    siape: z.string().nonempty("O SIAPE é obrigatório"),
    institution: z
      .object({
        label: z.string(),
        value: z.string().uuid("ID inválido"),
      })
      .nullable()
      .refine((o) => o !== null, "A instituição é obrigatória"),
    phoneNumber: z
      .string()
      .nonempty("O telefone é obrigatório")
      .regex(/^\(\d{2}\)\s?(?:\d{4,5}-\d{4})$/, "Formato de telefone inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX"),
    dateOfBirth: z
      .string()
      .refine((v) => new Date(v) <= new Date(), "Data inválida"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os e-mails não coincidem",
    path: ["confirmEmail"],
  });


export const EducatorForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(EducatorFormFormSchema),
    defaultValues: {
      socialName: "",
      name: "",
      cpf: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      siape: "",
      institution: null,
      phoneNumber: "",
      dateOfBirth: ""
    },
  });

  type EducatorFormSchema = z.infer<typeof EducatorFormFormSchema>;

  const onSubmit = async (data: EducatorFormSchema) => {
    const { institution, ...rest } = data;

    const payload: CreateEducatorRequest = {
      ...rest,
      institutionId: institution!.value,
    };
    console.log(payload)
    try {
      const response = await createEducator(payload);
      
      if (response.message) {
        showToast(response.message, "success");
      }

      redirectTo("/login");
    } catch (error: any) {
      if (error.message) {
        showToast(error.message, "error");
      }
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nome:"
          type="text"
          placeholder="Digite seu nome"
          register={register("name")}
          error={errors.name?.message}
          helpText="Informe seu nome completo. Será usado para identificação no sistema e comunicações internas."
        />
        <Field
          label="Nome Social (Opcional):"
          type="text"
          placeholder="Como prefere ser chamado"
          register={register("socialName")}
          error={errors.socialName?.message}
          helpText="Caso prefira ser chamado de outra forma, informe aqui um nome social. Usaremos para nos referirmos a você conforme sua preferência."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="CPF:"
          type="text"
          placeholder="Digite seu CPF"
          mask="999.999.999-99"
          register={register("cpf")}
          error={errors.cpf?.message}
          helpText="Digite seu CPF formatado. Será utilizado como identificador único no sistema para evitar duplicidades e realizar conferências cadastrais."
        />
        <Field
          label="Data de Nascimento:"
          type="date"
          placeholder="Digite sua data de nascimento"
          register={register("dateOfBirth")}
          error={errors.dateOfBirth?.message}
          helpText="Informe sua data de nascimento para validarmos seus dados pessoais e melhorar a segurança do seu perfil. Sua informação será usada apenas para esse fim e tratada com confidencialidade."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail:"
          type="text"
          placeholder="Digite seu e-mail"
          register={register("email")}
          error={errors.email?.message}
          helpText="Informe um e-mail válido e de uso frequente. Usaremos para comunicações importantes (confirmação de cadastro e avisos)."
        />
        <Field
          label="Confirme seu e-mail:"
          type="text"
          placeholder="Digite seu e-mail novamente"
          register={register("confirmEmail")}
          error={errors.confirmEmail?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Senha:"
          type="password"
          placeholder="Digite sua senha"
          register={register("password")}
          error={errors.password?.message}
          helpText="Crie uma senha forte (mínimo 8 caracteres, contendo letras, números e símbolos) para proteger sua conta. Será usada somente para autenticação e criptografada em nosso sistema."
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
          helpText="Informe seu número de SIAPE conforme consta no registro da instituição. Será usado para validar seu vínculo."
        />
        <Field
          label="Telefone:"
          type="text"
          placeholder="Digite seu telefone"
          mask="(99) 9999-9999"
          register={register("phoneNumber")}
          error={errors.phoneNumber?.message}
          helpText="Informe seu telefone de contato no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX. Usaremos para comunicações importantes."
        />
      </div>

      <AsyncSelectField
        name="institution"
        label="Instituição:"
        placeholder="Selecione uma instituição"
        control={control}
        loadOptions={fetchInstitutions}
        error={errors.institution?.message}
        helpText="Busque e selecione a instituição à qual você está vinculado. Usaremos isso para direcionar seus acessos conforme sua instituição."
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
