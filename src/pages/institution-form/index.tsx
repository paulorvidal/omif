/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { ChevronLeft, Eraser, Save, Building2 } from "lucide-react";
import { AppAsyncSelect } from "@/components/app-async-select";
import { useInstitutionForm } from "../../hooks/use-institution-form";
import { useNavigate, useParams } from "react-router-dom";
import { useWatch } from "react-hook-form";

function InstitutionForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    errors,
    handleFormSubmit,
    handleReset,
    isSubmitting,
    control,
    loadEducatorOptions,
    isEditMode,
    setValue,
  } = useInstitutionForm({ institutionId: id });

  const [localOptions, setLocalOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentCoordinator = useWatch({ control, name: "coordinator" });

  useEffect(() => {
    if (isEditMode && currentCoordinator) {
      const coordObj = currentCoordinator as any;

      if (coordObj.value && coordObj.label) {
        setLocalOptions((prev) => {
          const exists = prev.some(
            (op) => String(op.value) === String(coordObj.value),
          );

          return exists
            ? prev
            : [{ label: coordObj.label, value: coordObj.value }, ...prev];
        });

        setValue("coordinator", coordObj.value, {
          shouldDirty: false,
          shouldValidate: true,
        });
      }
    }
  }, [currentCoordinator, isEditMode, setValue]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const results = await loadEducatorOptions(query);

      setLocalOptions((prevOptions) => {
        const currentVal =
          (currentCoordinator as any)?.value || currentCoordinator;

        const selectedOption = prevOptions.find(
          (op) => String(op.value) === String(currentVal),
        );

        if (
          selectedOption &&
          !results.some(
            (r: any) => String(r.value) === String(selectedOption.value),
          )
        ) {
          return [selectedOption, ...results];
        }

        return results;
      });
    } catch (error) {
      console.error("Erro na busca", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <AppButton
          variant="secondary"
          className="size-8"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
        </AppButton>
        <div className="flex items-center gap-2">
          <Building2 className="text-primary size-8" />
          <h1 className="text-3xl font-semibold">
            {isEditMode ? "Editar Instituição" : "Cadastro da Instituição"}
          </h1>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleFormSubmit} noValidate>
            <FieldGroup>
              <FieldSet>
                <FieldGroup className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-x-6">
                  <Field className="md:col-span-12">
                    <AppInput
                      label="Nome *"
                      placeholder="Ex: Nome da Escola"
                      error={errors.name?.message}
                      register={register("name")}
                    />
                  </Field>

                  <Field className="md:col-span-12">
                    <AppInput
                      label="INEP"
                      placeholder="Ex: 35474885"
                      error={errors.inep?.message}
                      register={register("inep")}
                    />
                  </Field>

                  <Field className="md:col-span-12">
                    <AppInput
                      label="Telefone *"
                      placeholder="(00)0000-0000"
                      mask="(99)99999-9999"
                      error={errors.phoneNumber?.message}
                      register={register("phoneNumber")}
                      className="bg-white"
                    />
                  </Field>

                  <Field className="md:col-span-12">
                    <AppInput
                      label="E-mail *"
                      type="email"
                      placeholder="Ex: email@escola.com"
                      error={errors.email1?.message}
                      register={register("email1")}
                    />
                  </Field>

                  <Field className="md:col-span-6">
                    <AppInput
                      label="E-mail reserva"
                      type="email"
                      placeholder="Ex: email@escola.com"
                      error={errors.email2?.message}
                      register={register("email2")}
                    />
                  </Field>

                  <Field className="md:col-span-6">
                    <AppInput
                      label="E-mail reserva"
                      type="email"
                      placeholder="Ex: email@escola.com"
                      error={errors.email3?.message}
                      register={register("email3")}
                    />
                  </Field>

                  {isEditMode && (
                    <Field className="md:col-span-12">
                      <AppAsyncSelect
                        control={control}
                        name="coordinator"
                        label="Coordenador da Instituição"
                        placeholder="Digite para buscar um educador..."
                        options={localOptions}
                        isLoading={isLoading}
                        onInputChange={handleSearch}
                        error={errors.coordinator?.message}
                        isClearable
                      />
                    </Field>
                  )}
                </FieldGroup>
              </FieldSet>

              <Field
                orientation="horizontal"
                className="mt-6 flex flex-col gap-4 md:flex-row md:justify-end"
              >
                <div className="flex w-full justify-end gap-4">
                  <AppButton
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    icon={<Eraser className="size-4" />}
                  >
                    {isEditMode ? "Restaurar Dados" : "Limpar Formulário"}
                  </AppButton>

                  <AppButton
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700"
                    isLoading={isSubmitting}
                    icon={<Save className="size-4" />}
                  >
                    {isEditMode ? "Salvar Alterações" : "Cadastrar Instituição"}
                  </AppButton>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export { InstitutionForm };
