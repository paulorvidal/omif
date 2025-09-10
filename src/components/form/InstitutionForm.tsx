import { useParams } from "react-router-dom";
import { useInstitutionForm } from "../../hooks/useInstitutionForm";
import { Field } from "../ui/Field";
import { AsyncSelectField } from "../ui/AsyncSelectField";
import { Button } from "../ui/Button";


export const InstitutionForm = () => {

  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const {
    control,
    errors,
    isSubmitting,
    register,
    handleFormSubmit,
    handleReset,
    loadEducatorOptions,
  } = useInstitutionForm({ institutionId: id });

  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
      onSubmit={handleFormSubmit}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nome:"
          type="text"
          placeholder="Ex: NOME DA INSTITUIÇÃO"
          register={register("name")}
          error={errors.name?.message}
          helpText="Informe o nome da instituição"
        />
        <Field
          label="INEP:"
          type="text"
          placeholder="Ex: 00000000"
          register={register("inep")}
          error={errors.inep?.message}
          helpText="Informe o INEP da instituição"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail:"
          type="text"
          placeholder="Ex: instituicao@email.com"
          register={register("email1")}
          error={errors.email1?.message}
          helpText="Usaremos para comunicações importantes."
        />
        <Field
          label="Telefone:"
          type="text"
          placeholder="Ex: (00)00000-0000"
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
          placeholder="Ex: instituicao@email.com"
          register={register("email2")}
          error={errors.email2?.message}
        />
        <Field
          label="E-mail reserva:"
          type="text"
          placeholder="Ex: instituicao@email.com"
          register={register("email3")}
          error={errors.email3?.message}
        />
      </div>

      {isEditMode && (
        <AsyncSelectField
          name="coordinator"
          label="Coordenador:"
          placeholder="Ex: Nome do Coordenador"
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
