import { useParams } from "react-router-dom";
import { useEditionForm } from "../../hooks/useEditionForm";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import { ProgressDialog } from "../dialog/ProgressDialog";


export const EditionForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const {
    errors,
    isPending,
    isEditionLoading,
    register,
    handleFormSubmit,
    handleReset,
  } = useEditionForm({ editionId: id });

  const isLoading = isPending || (isEditMode && isEditionLoading);

  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
      onSubmit={handleFormSubmit}
    >
      <Field
        label="Nome da Edição:"
        type="text"
        placeholder="Ex: Omif 2025"
        register={register("name")}
        error={errors.name?.message}
        helpText="Dê um nome claro para identificar esta edição."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Ano de Referência:"
          type="number"
          placeholder="Ex: 2025"
          register={register("year")}
          error={errors.year?.message}
          helpText="Informe o ano de vigência da edição."
        />
        <Field
          label="Salário Mínimo (R$):"
          type="text"
          placeholder="Ex: 1550,00"
          register={register("minimumWage")}
          error={errors.minimumWage?.message}
          helpText="Valor base para o formulário socioeconômico."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Início das Inscrições:"
          type="datetime-local"
          register={register("registrationStartDate")}
          error={errors.registrationStartDate?.message}
          helpText="A partir de quando os candidatos podem se inscrever."
        />
        <Field
          label="Fim das Inscrições:"
          type="datetime-local"
          register={register("registrationEndDate")}
          error={errors.registrationEndDate?.message}
          helpText="Prazo final para recebimento de novas inscrições."
        />
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          secondary
          type="button"
          onClick={handleReset}
          disabled={isLoading}
        >
          Limpar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isEditMode ? "Salvar" : "Cadastrar"}
        </Button>
      </div>

      <ProgressDialog open={isLoading} />
    </form>
  );
};
