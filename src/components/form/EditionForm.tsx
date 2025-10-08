import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEditionForm } from "../../hooks/useEditionForm";
import { Field } from "../Field";
import { Button } from "../Button";
import { ProgressDialog } from "../dialog/ProgressDialog";
import { maskCurrency } from "../../utils/formatters";
import { AppButton } from "../app-button";
import { Spinner } from "../ui/spinner";

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
    watch,
    setValue,
  } = useEditionForm({ editionId: id });
  const minimumWageValue = watch("minimumWage");
  useEffect(() => {
    const valueAsString = String(minimumWageValue || "");
    const formattedValue = maskCurrency(valueAsString);

    if (formattedValue !== valueAsString) {
      setValue("minimumWage", formattedValue, { shouldValidate: true });
    }
  }, [minimumWageValue, setValue]);

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
          placeholder="0,00"
          register={register("minimumWage")}
          error={errors.minimumWage?.message}
          helpText="Valor base para o formulário socioeconômico."
          inputProps={{ inputMode: "decimal" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Início da Edição:"
          type="datetime-local"
          register={register("startDate")}
          error={errors.startDate?.message}
          helpText="Data oficial de início da edição."
        />
        <Field
          label="Fim da Edição:"
          type="datetime-local"
          register={register("endDate")}
          error={errors.endDate?.message}
          helpText="Data oficial de encerramento da edição."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Início das Inscrições de Instituições:"
          type="datetime-local"
          register={register("institutionRegistrationStartDate")}
          error={errors.institutionRegistrationStartDate?.message}
          helpText="A partir de quando as instituições podem se inscrever."
        />
        <Field
          label="Fim das Inscrições de Instituições:"
          type="datetime-local"
          register={register("institutionRegistrationEndDate")}
          error={errors.institutionRegistrationEndDate?.message}
          helpText="Prazo final para inscrições de instituições."
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Início das Inscrições de Estudantes:"
          type="datetime-local"
          register={register("studentRegistrationStartDate")}
          error={errors.studentRegistrationStartDate?.message}
          helpText="A partir de quando os estudantes podem se inscrever."
        />
        <Field
          label="Fim das Inscrições de Estudantes:"
          type="datetime-local"
          register={register("studentRegistrationEndDate")}
          error={errors.studentRegistrationEndDate?.message}
          helpText="Prazo final para inscrições de estudantes."
        />
      </div>
      <div className="mt-6 flex justify-between">
        <AppButton
          variant="secondary"
          type="button"
          onClick={handleReset}
          disabled={isLoading}
        >
          Limpar
        </AppButton>
        <AppButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner />
              {isEditMode ? "Salvando..." : "Cadastrando..."}
            </>
          ) : isEditMode ? (
            "Salvar"
          ) : (
            "Cadastrar"
          )}
        </AppButton>
      </div>
    </form>
  );
};
