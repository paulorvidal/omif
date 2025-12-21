/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { AppAsyncSelect } from "@/components/app-async-select";
import { AppCaptcha } from "@/components/app-captcha";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet, FieldLegend } from "@/components/ui/field";
import { useEducatorForm } from "../../hooks/use-educator-form";
import { Eraser, Save, Loader2, ChevronLeft, GraduationCap } from "lucide-react";

function EducatorForm() {
  const navigate = useNavigate();

  const {
    control,
    register,
    errors,
    handleSubmit,
    handleReset,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
    isPending,
    isEditMode,
    isLoadingData
  } = useEducatorForm();

  if (isEditMode && isLoadingData) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center p-6 md:p-10">

      <div className="mb-6 flex w-full max-w-5xl items-center gap-4">
        <AppButton
          variant="secondary"
          className="size-8"
          size="icon"
          onClick={() => navigate(-1)}
          title="Voltar"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </AppButton>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? "Editar Educador" : "Cadastro de Educador"}
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>

                <FieldSet>
                  <FieldLegend className="mb-4">
                    Dados Pessoais
                  </FieldLegend>

                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <AppInput
                          label="Nome Completo"
                          placeholder="Ex: João da Silva"
                          error={errors.name?.message}
                          register={register("name")}
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Nome Social (Opcional)"
                          placeholder="Como prefere ser chamado"
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
                          error={errors.cpf?.message}
                          register={register("cpf")}
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Data de Nascimento"
                          placeholder="dd / mm / aaaa"
                          type="date"
                          error={errors.dateOfBirth?.message}
                          register={register("dateOfBirth")}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <AppInput
                          label="Telefone"
                          placeholder="(00) 90000-0000"
                          mask="(99)99999-9999"
                          error={errors.phoneNumber?.message}
                          register={register("phoneNumber")}
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="SIAPE"
                          placeholder="Número do SIAPE"
                          error={errors.siape?.message}
                          register={register("siape")}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>

                {!isEditMode && (
                  <FieldSet>
                    <FieldLegend>Contato e Acesso</FieldLegend>
                    <FieldGroup>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppInput
                            label="E-mail"
                            type="email"
                            placeholder="exemplo@email.com"
                            error={errors.email?.message}
                            register={register("email")}
                          />
                        </Field>
                        <Field>
                          <AppInput
                            label="Confirme o E-mail"
                            type="email"
                            placeholder="exemplo@email.com"
                            error={errors.confirmEmail?.message}
                            register={register("confirmEmail")}
                          />
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <AppInput
                            label="Senha"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            error={errors.password?.message}
                            register={register("password")}
                          />
                        </Field>
                        <Field>
                          <AppInput
                            label="Confirme a Senha"
                            type="password"
                            placeholder="Digite a senha novamente"
                            error={errors.confirmPassword?.message}
                            register={register("confirmPassword")}
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  </FieldSet>
                )}

                {!isEditMode && (
                  <FieldSet>
                    <FieldGroup>
                      <Field>
                        <AppAsyncSelect
                          name="institution"
                          label="Instituição"
                          control={control as any}
                          options={institutionOptions}
                          isLoading={isInstitutionsLoading}
                          onInputChange={setInstitutionInput}
                          error={errors.institution?.message}
                          placeholder="Digite para buscar sua instituição..."
                          helpText="Selecione a instituição onde você leciona"
                        />
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                )}

                <Field
                  orientation="horizontal"
                  className="flex flex-col gap-4 md:flex-row md:justify-end"
                >
                  {!isEditMode && (
                    <Field
                      orientation="horizontal"
                      className="flex w-full justify-start md:w-auto"
                    >
                      <Controller
                        name="captchaToken"
                        control={control}
                        render={({ field, fieldState }) => (
                          <AppCaptcha
                            onVerify={(token) => field.onChange(token)}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Field>
                  )}

                  <div className="flex w-full justify-end gap-4 items-center">
                    {!isEditMode && (
                      <AppButton
                        type="button"
                        icon={<Eraser className="w-4 h-4" />}
                        variant="secondary"
                        onClick={handleReset}
                        disabled={isPending}
                      >
                        Limpar
                      </AppButton>
                    )}
                    <AppButton
                      type="submit"
                      icon={<Save className="w-4 h-4" />}
                      isLoading={isPending}
                    >
                      {isEditMode ? "Salvar Alterações" : "Cadastrar"}
                    </AppButton>
                  </div>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { EducatorForm };