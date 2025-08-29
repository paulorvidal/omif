import { useParams } from "react-router-dom";
import { useStepsForm } from "../../hooks/useStepsForm";
import { ProgressDialog } from "../dialog/ProgressDialog";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";


export const StepsForm = () => {
  const { id } = useParams<{ id?: string }>();

  const {
    editionData,
    isLoading,
    isError,
    isSaving,
    register,
    handleSubmit,
    onSubmit,
    errors,
    handleReset,
  } = useStepsForm(id);

  if (isError) {
    return (
      <p style={{ color: "red" }}>Ocorreu um erro ao carregar os dados.</p>
    );
  }

  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Etapas - Edição {editionData?.year}
          </h2>
          <p className="text-gray-500">{editionData?.name}</p>
        </div>
      </div>
      <fieldset
        disabled={isLoading || isSaving}
        className="border-none p-0"
      >
        <div className="mb-4 rounded-lg border border-gray-300 p-4">
          <h4>Etapa 1</h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Data de Início"
              type="datetime-local"
              register={register("steps.0.startDate")}
              error={errors.steps?.[0]?.startDate?.message}
            />
            <Field
              label="Data de Encerramento"
              type="datetime-local"
              register={register("steps.0.endDate")}
              error={errors.steps?.[0]?.endDate?.message}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Nota de Corte"
              type="number"
              register={register("steps.0.cutOffScore")}
              error={errors.steps?.[0]?.cutOffScore?.message}
            />
            <Field
              label="Lançamento da Nota"
              type="datetime-local"
              register={register("steps.0.endDateForReleaseOfNote")}
              error={errors.steps?.[0]?.endDateForReleaseOfNote?.message}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-300 p-4">
          <h4>Etapa 2</h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Data de Início"
              type="datetime-local"
              register={register("steps.1.startDate")}
              error={errors.steps?.[1]?.startDate?.message}
            />
            <Field
              label="Data de Encerramento"
              type="datetime-local"
              register={register("steps.1.endDate")}
              error={errors.steps?.[1]?.endDate?.message}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex justify-between">
        <Button secondary type="button" onClick={handleReset}>
          Limpar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
      <ProgressDialog open={isLoading || isSaving} />
    </form>
  );
};
