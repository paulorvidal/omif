import { useInstitutionForm } from "./useInstitutionForm";
import { Field } from "../form/Field";
import { AsyncSelectField } from "../form/AsyncSelectField";
import { Button } from "../ui/Button";

type Props = {
  institutionId?: string;
};

export const InstitutionForm = ({ institutionId }: Props) => {
  const {
    control,
    errors,
    isEditMode,
    isSubmitting,
    register,
    handleFormSubmit,
    handleReset,
    loadEducatorOptions,
  } = useInstitutionForm({ institutionId });

  return (
    <form
      className="flex w-full flex-col justify-center gap-4"
      onSubmit={handleFormSubmit}
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
          loadOptions={loadEducatorOptions}
          error={errors.coordinator?.message}
          helpText="Informe o coordenador da instituição."
        />
      )}

      <div className="flex justify-between">
        <Button
          secondary
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Limpar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Salvar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};