import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Controller, useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  useEnrollmentStudentForm,
  type SpecialNeedFormData,
} from "../../hooks/use-enrollment-student-form";
import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { AppSelect } from "@/components/app-select";
import { AppAsyncSelect } from "@/components/app-async-select";
import { Delete, Plus, Edit, FileText, Loader2 } from "lucide-react";
import { AppCaptcha } from "@/components/app-captcha";

import { AppCard } from "@/components/app-card";
import { getEditionStatusByYear } from "../../services/edition-service";
import { ApiError } from "../../services/api-error";
import { SpecialNeedDialog } from "./special-need-dialog";
import { Separator } from "@/components/ui/separator";

const bolsaFamiliaOptions = [
  { label: "Sim", value: "sim" },
  { label: "Não", value: "nao" },
];

const gradeOptions = [
  { label: "1º Ano", value: 1 },
  { label: "2º Ano", value: 2 },
  { label: "3º Ano", value: 3 },
  { label: "4º Ano", value: 4 },
];

const ethnicityOptions = [
  { label: "Amarela", value: "amarela" },
  { label: "Branca", value: "branca" },
  { label: "Indígena", value: "indigena" },
  { label: "Parda", value: "parda" },
  { label: "Preta", value: "preta" },
  { label: "Prefiro não informar", value: "nao_informar" },
];

const genderOptions = [
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
  { label: "Não-binário", value: "nao_binario" },
  { label: "Outro", value: "outro" },
  { label: "Prefiro não informar", value: "nao_informar" },
];

const completionSchoolOptions = [
  { label: "Pública", value: "publica" },
  { label: "Privada (bolsa integral)", value: "privada_bolsa_integral" },
  { label: "Privada (bolsa parcial)", value: "privada_bolsa_parcial" },
  { label: "Privada (sem bolsa)", value: "privada_sem_bolsa" },
  { label: "EJA / Supletivo", value: "eja" },
];

const specialNeedTypeOptions = [
  { label: "Visual", value: "visual" },
  { label: "Auditiva", value: "auditiva" },
  { label: "Motora", value: "motora" },
  { label: "Intelectual", value: "intelectual" },
  { label: "Outra", value: "outra" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const generateIncomeRangeOptions = (minimumWageInput: string | number) => {
  let wageString: string;

  if (typeof minimumWageInput === "number") {
    wageString = String(minimumWageInput);
  } else if (typeof minimumWageInput === "string") {
    wageString = minimumWageInput.replace(/\./g, "").replace(",", ".");
  } else {
    wageString = "0";
  }

  const wage = parseFloat(wageString);

  if (isNaN(wage) || wage === 0) {
    return [
      { label: "Até 1 salário mínimo", value: "ate_1_sm" },
      { label: "De 1 a 2 salários mínimos", value: "1_a_2_sm" },
      { label: "De 2 a 3 salários mínimos", value: "2_a_3_sm" },
      { label: "Acima de 3 salários mínimos", value: "acima_3_sm" },
    ];
  }

  const wage1x = wage;
  const wage2x = wage * 2;
  const wage3x = wage * 3;

  return [
    {
      label: `Até 1 salário mínimo (até ${formatCurrency(wage1x)})`,
      value: "ate_1_sm",
    },
    {
      label: `De 1 a 2 salários mínimos (${formatCurrency(
        wage1x + 0.01,
      )} - ${formatCurrency(wage2x)})`,
      value: "1_a_2_sm",
    },
    {
      label: `De 2 a 3 salários mínimos (${formatCurrency(
        wage2x + 0.01,
      )} - ${formatCurrency(wage3x)})`,
      value: "2_a_3_sm",
    },
    {
      label: `Acima de 3 salários mínimos (acima de ${formatCurrency(wage3x)})`,
      value: "acima_3_sm",
    },
  ];
};

function EnrollmentStudentForm() {
  const { editionYear } = useParams();
  const numericEditionYear = Number(editionYear);

  const {
    register,
    control,
    errors,
    handleSubmit,
    handleReset,
    isPending,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
  } = useEnrollmentStudentForm(numericEditionYear);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "specialNeeds",
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    editingIndex: number | null;
  }>({
    isOpen: false,
    editingIndex: null,
  });

  const {
    data: editionStatus,
    isLoading: isStatusLoading,
    isError: isStatusError,
    error: statusError,
  } = useQuery({
    queryKey: ["editionStatus", editionYear],
    queryFn: () => getEditionStatusByYear(editionYear!),
    enabled: !isNaN(numericEditionYear),
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const incomeRangeOptions = useMemo(() => {
    if (!editionStatus?.minimumWage) {
      return [];
    }
    return generateIncomeRangeOptions(editionStatus.minimumWage);
  }, [editionStatus?.minimumWage]);

  if (isNaN(numericEditionYear)) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <AppCard
          title="Edição Inválida"
          description="O ano da edição fornecido na URL não é válido. Por favor, verifique o link."
          type="error"
        />
      </div>
    );
  }

  if (isStatusLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <Loader2 className="text-primary size-10 animate-spin" />
        <span className="sr-only">Carregando dados da edição...</span>
      </div>
    );
  }

  if (isStatusError) {
    const errorMessage =
      statusError instanceof ApiError
        ? statusError.message
        : "Não foi possível carregar os dados da edição. Tente novamente.";
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <AppCard
          title="Erro ao carregar"
          description={errorMessage}
          type="error"
        />
      </div>
    );
  }

  if (!editionStatus?.isStudentEnrollmentOpen) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <AppCard
          title="Inscrições Encerradas"
          description={`As inscrições para a edição de ${editionStatus?.year} não estão abertas no momento.`}
          type="warning"
        />
      </div>
    );
  }

  const handleSaveSpecialNeed = (data: SpecialNeedFormData) => {
    if (modalState.editingIndex !== null) {
      update(modalState.editingIndex, data);
    } else {
      append(data);
    }
    setModalState({ isOpen: false, editingIndex: null });
  };

  const handleEditClick = (index: number) => {
    setModalState({ isOpen: true, editingIndex: index });
  };

  const handleAddClick = () => {
    setModalState({ isOpen: true, editingIndex: null });
  };

  const getLabelForValue = (
    options: { label: string; value: string | number }[],
    value: string,
  ) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <>
      <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
        <div className="w-full max-w-5xl">
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <FieldSet>
                    <FieldLegend>Formulário de Inscrição</FieldLegend>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Inscrição para: {editionStatus.name} ({editionStatus.year}
                      )
                    </p>
                    <FieldGroup>
                      <Field>
                        <AppInput
                          label="Nome Completo"
                          placeholder="Ex: Nome Completo"
                          error={errors.name?.message}
                          register={register("name")}
                        />
                      </Field>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppInput
                            label="Email"
                            type="email"
                            placeholder="Ex: exemplo@email.com"
                            error={errors.email?.message}
                            register={register("email")}
                          />
                        </Field>
                        <Field>
                          <AppInput
                            label="Nome Social (Opcional)"
                            placeholder="Como prefere ser chamado(a)"
                            error={errors.socialName?.message}
                            register={register("socialName")}
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppInput
                            label="CPF"
                            placeholder="000.000.000-00"
                            mask="999.999.999-99"
                            helpText="Use o formato com pontos e traço."
                            error={errors.cpf?.message}
                            register={register("cpf")}
                          />
                        </Field>
                        <Field>
                          <AppInput
                            label="Data de Nascimento"
                            type="date"
                            error={errors.birthDate?.message}
                            register={register("birthDate")}
                          />
                        </Field>
                      </div>
                      <Field>
                        <AppAsyncSelect
                          name="institution"
                          label="Instituição de Ensino"
                          control={control as any}
                          options={institutionOptions}
                          isLoading={isInstitutionsLoading}
                          onInputChange={setInstitutionInput}
                          error={errors.institution?.message}
                          placeholder="Digite para buscar sua instituição..."
                          helpText="Selecione a instituição."
                        />
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldLegend>Dados Adicionais</FieldLegend>
                    <FieldGroup>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppSelect
                            name="bolsaFamilia"
                            label="Recebe Bolsa Família?"
                            control={control as any}
                            options={bolsaFamiliaOptions}
                            error={errors.bolsaFamilia?.message}
                          />
                        </Field>
                        <Field>
                          <AppSelect
                            name="grade"
                            label="Série/Ano Atual"
                            control={control as any}
                            options={gradeOptions}
                            error={errors.grade?.message}
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppSelect
                            name="ethnicity"
                            label="Raça ou Cor"
                            control={control as any}
                            options={ethnicityOptions}
                            error={errors.ethnicity?.message}
                          />
                        </Field>
                        <Field>
                          <AppSelect
                            name="gender"
                            label="Sexo"
                            control={control as any}
                            options={genderOptions}
                            error={errors.gender?.message}
                          />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppSelect
                            name="completionElementarySchoolCategory"
                            label="Onde cursou o Ensino Fundamental?"
                            control={control as any}
                            options={completionSchoolOptions}
                            error={
                              errors.completionElementarySchoolCategory?.message
                            }
                          />
                        </Field>
                        <Field>
                          <AppSelect
                            name="incomeRange"
                            label="Faixa de Renda Familiar"
                            control={control as any}
                            options={incomeRangeOptions}
                            error={errors.incomeRange?.message}
                            disabled={incomeRangeOptions.length === 0}
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSet>
                    <FieldLegend>Necessidades Especiais (Opcional)</FieldLegend>
                    <FieldGroup>
                      <div className="space-y-4">
                        {fields.map((field, index) => (
                          <Card key={field.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                              <div>
                                <CardTitle className="text-lg">
                                  {field.description}
                                </CardTitle>
                                <CardDescription>
                                  Tipo:{" "}
                                  {getLabelForValue(
                                    specialNeedTypeOptions,
                                    field.type,
                                  )}
                                </CardDescription>
                              </div>
                              <div className="flex space-x-2">
                                <AppButton
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleEditClick(index)}
                                >
                                  <Edit />
                                </AppButton>
                                <AppButton
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Delete />
                                </AppButton>
                              </div>
                            </CardHeader>
                            <Separator />
                            <CardContent>
                              <div className="text-muted-foreground flex items-center space-x-2 text-sm">
                                <FileText className="h-4 w-4 shrink-0" />
                                <span>
                                  {field.medicalReportFile?.[0]?.name ||
                                    "Laudo anexado"}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <AppButton
                        type="button"
                        variant="outline"
                        onClick={handleAddClick}
                        icon={<Plus />}
                        className="w-full"
                      >
                        Adicionar Necessidade
                      </AppButton>

                      {errors.specialNeeds?.root && (
                        <p className="text-destructive mt-2 text-sm font-medium">
                          {errors.specialNeeds.root.message}
                        </p>
                      )}
                    </FieldGroup>
                  </FieldSet>

                  <Field
                    orientation="horizontal"
                    className="flex flex-col gap-4 md:flex-row md:justify-end"
                  >
                    <Field
                      orientation="horizontal"
                      className="flex w-full justify-start md:w-auto"
                    >
                      <Controller
                        name="captchaToken"
                        control={control}
                        render={({ field, fieldState }) => (
                          <AppCaptcha
                            onVerify={(token) => {
                              field.onChange(token);
                            }}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Field>
                    <div className="flex w-full justify-end gap-4">
                      <AppButton
                        type="button"
                        icon={<Delete />}
                        variant="secondary"
                        onClick={handleReset}
                        disabled={isPending}
                      >
                        Limpar
                      </AppButton>
                      <AppButton
                        type="submit"
                        icon={<Plus />}
                        isLoading={isPending}
                      >
                        Realizar Inscrição
                      </AppButton>
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <SpecialNeedDialog
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, editingIndex: null })}
        onSubmit={handleSaveSpecialNeed}
        defaultValues={
          modalState.editingIndex !== null
            ? fields[modalState.editingIndex]
            : undefined
        }
      />
    </>
  );
}

export { EnrollmentStudentForm };
