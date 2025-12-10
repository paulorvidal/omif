import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { Save, ChevronLeft, Trash2, Loader2, Eraser } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useStepForm } from "@/hooks/use-step-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { stepService } from "@/services/step-service";
import type { Step } from "@/types/step-types";
import { brasiliaTimezoneHelperText } from "@/utils/timezone";

export function StepForm() {
  const { editionId, stepId } = useParams<{
    editionId: string;
    stepId?: string;
  }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step | undefined>();
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [existingSteps, setExistingSteps] = useState<Step[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!editionId) {
    return (
      <div className="p-8 text-center text-red-600">
        ID da edição não encontrado
      </div>
    );
  }

  useEffect(() => {
    const fetchStep = async () => {
      setIsLoadingStep(true);
      try {
        const allSteps = await stepService.getAllSteps(editionId);
        setExistingSteps(allSteps);

        if (stepId) {
          const foundStep = await stepService.getStepById(editionId, stepId);
          setStep(foundStep);
        }
      } catch (error) {
        console.error("Erro ao buscar etapa:", error);
        toast.error("Erro ao carregar dados da etapa");
      } finally {
        setIsLoadingStep(false);
      }
    };

    fetchStep();
  }, [editionId, stepId]);

  const { form, isLoading, isDeleting, error, isEditing, onSubmit, onDelete } =
    useStepForm({
      editionId,
      step,
      existingSteps,
      onSuccess: () => {
        navigate(`/edicoes`);
      },
    });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const {
    register,
    formState: { errors },
    reset,
  } = form;

  const currentStepNumber = form.watch("number");

  if (isLoadingStep) {
    return <div className="p-8 text-center">Carregando dados da etapa...</div>;
  }

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <AppButton
          variant="secondary"
          className="size-8"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-4" />
        </AppButton>
        <h1 className="text-3xl font-semibold">
          {isEditing
            ? `Editar Etapa ${currentStepNumber}`
            : `Nova Etapa ${currentStepNumber}`}
        </h1>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <FieldSet>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field>
                    <AppInput
                      type="datetime-local"
                      label="Data de Início"
                      error={errors.startDate?.message}
                      register={register("startDate")}
                      helpText={brasiliaTimezoneHelperText}
                    />
                  </Field>

                  <Field>
                    <AppInput
                      type="datetime-local"
                      label="Data de Término"
                      error={errors.endDate?.message}
                      register={register("endDate")}
                      helpText={brasiliaTimezoneHelperText}
                    />
                  </Field>
                </div>

                {currentStepNumber === 1 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field>
                      <AppInput
                        type="datetime-local"
                        label="Data de Liberação da Nota"
                        error={errors.endDateForReleaseOfNote?.message}
                        register={register("endDateForReleaseOfNote")}
                        helpText={brasiliaTimezoneHelperText}
                      />
                    </Field>

                    <Field>
                      <AppInput
                        type="number"
                        label="Nota de Corte"
                        placeholder="0.0"
                        error={errors.cutOffScore?.message}
                        register={register("cutOffScore", {
                          setValueAs: (value) =>
                            value === "" ? undefined : parseFloat(value),
                        })}
                        step="0.1"
                        min="0"
                        max="100"
                        helpText="Nota mínima para aprovação na etapa"
                      />
                    </Field>
                  </div>
                )}
              </FieldSet>

              <div className="flex justify-between pt-4">
                <div className="flex gap-2">
                  <AppButton
                    type="button"
                    variant="secondary"
                    onClick={() => reset()}
                    disabled={isLoading}
                    icon={<Eraser />}
                  >
                    Limpar
                  </AppButton>

                  {isEditing && (
                    <AppButton
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isLoading || isDeleting}
                      icon={<Trash2 />}
                    >
                      Deletar
                    </AppButton>
                  )}
                </div>

                <AppButton
                  type="submit"
                  icon={<Save />}
                  isLoading={isLoading}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {isEditing ? "Salvar Alterações" : "Cadastrar"}
                </AppButton>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <AppDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AppDialogTitle description="Essa ação não pode ser desfeita. Isso irá deletar permanentemente a etapa.">
          Você tem certeza?
        </AppDialogTitle>
        <AppDialogFooter>
          <AppButton
            variant="secondary"
            type="button"
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancelar
          </AppButton>
          <AppButton
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar
          </AppButton>
        </AppDialogFooter>
      </AppDialog>
    </>
  );
}
