  import { useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { z } from "zod";
  import {
    createInstitution,
    updateInstitution,
    getInstitutionById,
    type CreateInstitutionRequest,
    type UpdateInstitutionRequest,
  } from "../../services/institutionService";
  import { fetchEducators } from "../../services/educatorService";
  import { Field } from "../form/Field";
  import { AsyncSelectField } from "../form/AsyncSelectField";
  import { Button } from "../ui/Button";
  import { scrollToTop } from "../../utils/scrollToTop";
  import { redirectTo, showToast } from "../../utils/events";
  import { AxiosError } from "axios";

  const InstitutionFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    inep: z.string(),
    email1: z.string().nonempty("Informe ao menos um e‑mail").email("Email inválido"),
    email2: z.string().email("Email inválido").optional().or(z.literal("")),
    email3: z.string().email("Email inválido").optional().or(z.literal("")),
    phoneNumber: z
      .string()
      .nonempty("O telefone é obrigatório")
      .regex(
        /^\(\d{2}\)\s?(?:\d{4,5}-\d{4})$/,
        "Formato inválido. Use (XX)XXXX-XXXX ou (XX)XXXXX-XXXX",
      ),
    coordinator: z
      .object({ label: z.string(), value: z.string() })
      .nullable()
      .optional(),
  });

  type FormData = z.infer<typeof InstitutionFormSchema>;


  type Props = { institutionId?: string };

  export const InstitutionForm = ({ institutionId }: Props) => {
    const isEditMode = Boolean(institutionId);

    const {
      register,
      handleSubmit,
      control,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<FormData>({
      resolver: zodResolver(InstitutionFormSchema),
      defaultValues: {
        name: "",
        inep: "",
        email1: "",
        email2: "",
        email3: "",
        phoneNumber: "",
        coordinator: null,
      },
    });

    useEffect(() => {
      if (!isEditMode) return;
      (async () => {
        try {
          const institution = await getInstitutionById(institutionId!);
          reset({
            name: institution.name,
            inep: institution.inep,
            email1: institution.email1,
            email2: institution.email2 ?? "",
            email3: institution.email3 ?? "",
            phoneNumber: institution.phoneNumber,
            coordinator: institution.coordinator
              ? {
                label: institution.coordinator.socialName,
                value: institution.coordinator.id,
              }
            : null,
          });
        } catch {
          showToast("Não foi possível carregar a instituição", "error");
        }
      })();
    }, [isEditMode, institutionId, reset]);

    const onSubmit = async (data: FormData) => {
      const basePayload: CreateInstitutionRequest = {
        name: data.name,
        inep: data.inep,
        phoneNumber: data.phoneNumber,
        email1: data.email1,
        email2: data.email2 || undefined,
        email3: data.email3 || undefined
      };

      try {
        if (isEditMode) {
          await updateInstitution(institutionId!, {
            ...basePayload,
            coordinatorId: data.coordinator?.value,
          } as UpdateInstitutionRequest);
          showToast("Instituição atualizada com sucesso", "success");
        } else {
          await createInstitution(basePayload);
          showToast("Instituição criada com sucesso", "success");
        }
        redirectTo("/instituicoes");
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message = axiosErr.response?.data?.message || axiosErr.message || "Erro desconhecido";
        showToast(message, "error");
      }
    };

    const onReset = () => {
      reset();
      scrollToTop();
    };

    return (
      <form className="flex w-full flex-col justify-center gap-4" onSubmit={handleSubmit(onSubmit)}>
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
            placeholder="Digite o INEP da instituição"
            register={register("inep")}
            error={errors.inep?.message}
            helpText="Informe o INEP da instituição"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="E-mail:"
            type="text"
            placeholder="Digite o e‑mail da instituição"
            register={register("email1")}
            error={errors.email1?.message}
            helpText="Usaremos para comunicações importantes."
          />
          <Field
            label="Telefone:"
            type="text"
            placeholder="Digite o telefone."
            mask={["(99)9999-9999", "(99)99999-9999"]}
            register={register("phoneNumber")}
            error={errors.phoneNumber?.message}
            helpText="Formato (XX)XXXXX-XXXX"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="E-mail reserva:"
            type="text"
            placeholder="Digite o e‑mail reserva"
            register={register("email2")}
            error={errors.email2?.message}
          />
          <Field
            label="E-mail reserva:"
            type="text"
            placeholder="Digite o e‑mail reserva"
            register={register("email3")}
            error={errors.email3?.message}
          />
        </div>

        {isEditMode && (
          <AsyncSelectField
            name="coordinator"
            label="Coordenador:"
            placeholder="Selecione um educador"
            control={control}
            loadOptions={(input) => fetchEducators(input, institutionId!)} 
            error={errors.coordinator?.message}
            helpText="Informe o coordenador da instituição."
          />
        )}

        <div className="flex justify-between">
          <Button secondary type="button" onClick={onReset} disabled={isSubmitting}>
            Limpar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditMode ? "Salvar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    );
  };