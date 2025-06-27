import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createInstitution,
  type CreateInstitutionRequest,
} from "../../services/institutionService";
import { Field } from "../form/Field";
import { Button } from "../ui/Button";
import { scrollToTop } from "../../utils/scrollToTop";
import { AxiosError } from "axios";
import { redirectTo, showToast } from "../../utils/events";

const InstitutionFormSchema = z
  .object({
    name: z.string().nonempty("O nome é obrigatório"),
    inep: z.string(),
    email1: z.string().nonempty("Informe ao menos um e-mail").email("Email inválido"),
    email2: z.string().email("Email inválido").optional().or(z.literal("")),
    email3: z.string().email("Email inválido").optional().or(z.literal("")),    
    phoneNumber: z
      .string()
      .nonempty("O telefone é obrigatório")
      .regex(
        /^\(\d{2}\)\s?(?:\d{4,5}-\d{4})$/,
        "Formato de telefone inválido. Use (XX)XXXX-XXXX ou (XX)XXXXX-XXXX",
      ),
  });

export const InstitutionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(InstitutionFormSchema),
    defaultValues: {
      name: "",
      inep: "",
      email1: "",
      email2: "",
      email3: "",
      phoneNumber: ""
    },
  });

  type InstitutionFormSchema = z.infer<typeof InstitutionFormSchema>;

  const onSubmit = async (data: InstitutionFormSchema) => {
    const { name, inep, phoneNumber, email1, email2, email3 } = data;


    const payload: CreateInstitutionRequest = {
      name,
      inep,
      phoneNumber,
      email1: email1,
      email2: email2,
      email3: email3
    };
  
    console.log("Payload que será enviado para a API:", payload);
  
    try {
      const response = await createInstitution(payload);
  
      if (response.message) {
        showToast(response.message, "success");
      }
  
      redirectTo("/instituicoes");
  
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err.response?.data?.message || err.message || "Erro desconhecido";
      showToast(message, "error");
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
          placeholder="Digite o nome da instituição"
          register={register("name")}
          error={errors.name?.message}
          helpText="Informe o nome da instituição"
        />
        <Field
          label="INEP:"
          type="text"
          placeholder="Digite o inep da instituição"
          register={register("inep")}
          error={errors.inep?.message}
          helpText="Informe o INEP da instituição"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail:"
          type="text"
          placeholder="Digite o e-mail da instituição"
          register={register("email1")}
          error={errors.email1?.message}
          helpText="Informe um e-mail válido e de uso frequente. Usaremos para comunicações importantes."
        />
        <Field
          label="Telefone:"
          type="text"
          placeholder="Digite o telefone da instituição."
          mask={["(99)9999-9999", "(99)99999-9999"]}
          register={register("phoneNumber")}
          error={errors.phoneNumber?.message}
          helpText="Informe um telefone de contato no formato (XX)XXXX-XXXX ou (XX)XXXXX-XXXX. Usaremos para comunicações importantes."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail reserva:"
          type="text"
          placeholder="Digite o e-mail da instituição"
          register={register("email2")}
          error={errors.email2?.message}
        />
        <Field
          label="E-mail(opcional):"
          type="text"
          placeholder="Digite o e-mail da instituição"
          register={register("email3")}
          error={errors.email3?.message}
        />
      </div>

      <div className="flex justify-between">
        <Button secondary type="button" onClick={onReset}>
          Limpar
        </Button>
        <Button type="submit">Cadastrar</Button>
      </div>
    </form>
  );
};
