import { Controller } from "react-hook-form";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { AppAsyncSelect } from "@/components/app-async-select";
import { AppCaptcha } from "@/components/app-captcha";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { useEducatorForm } from "../../hooks/use-educator-form";
import { Delete, Plus } from "lucide-react";

function EducatorForm() {
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
  } = useEducatorForm();

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-5xl">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend className="mb-4">Cadastre-se</FieldLegend>
                  <FieldGroup>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <AppInput
                          label="Nome Completo"
                          placeholder="Ex Nome Completo"
                          error={errors.name?.message}
                          register={register("name")}
                          className="bg-white"
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Nome Social (Opcional)"
                          placeholder="Ex Nome Social"
                          error={errors.socialName?.message}
                          register={register("socialName")}
                          className="bg-white"
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
                          className="bg-white"
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Data de Nascimento"
                          type="date"
                          error={errors.dateOfBirth?.message}
                          register={register("dateOfBirth")}
                          className="bg-white"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <AppInput
                          label="Telefone"
                          placeholder="(00)90000-0000"
                          mask="(99)99999-9999"
                          error={errors.phoneNumber?.message}
                          register={register("phoneNumber")}
                          className="bg-white"
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="SIAPE"
                          placeholder="Número do SIAPE"
                          error={errors.siape?.message}
                          register={register("siape")}
                          className="bg-white"
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>

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
                          className="bg-white"
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Confirme o E-mail"
                          type="email"
                          placeholder="exemplo@email.com"
                          error={errors.confirmEmail?.message}
                          register={register("confirmEmail")}
                          className="bg-white"
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
                          className="bg-white"
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Confirme a Senha"
                          type="password"
                          placeholder="Digite a senha novamente"
                          error={errors.confirmPassword?.message}
                          register={register("confirmPassword")}
                          className="bg-white"
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>

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
                        className="bg-white"
                      />
                    </Field>
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
                      Cadastrar
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
