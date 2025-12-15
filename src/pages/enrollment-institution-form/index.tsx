/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { Save, ChevronLeft, Building2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { AppCard } from "@/components/app-card";
import { Separator } from "@/components/ui/separator";
import { useEnrollmentInstitutionForm } from "../../hooks/use-enrollment-institution-form";

export function EnrollmentInstitutionForm() {
  const { editionId } = useParams();
  const navigate = useNavigate();

  const editionIdStr = editionId || "";
  const isValidYear = /^\d{4}$/.test(editionIdStr);
  const hookEditionYear = isValidYear ? editionIdStr : "";

  const {
    register,
    handleFormSubmit,
    errors,
    isSubmitting,
    isLoadingStatus,
    isError,
    enrollmentData,
  } = useEnrollmentInstitutionForm({ editionYear: hookEditionYear });

  const institutionEmail = enrollmentData?.institution?.email1;
  const hasRequiredInfo = !!institutionEmail && institutionEmail.trim() !== "";

  const isAlreadyEnrolled = !!enrollmentData?.isEnrolled;

  if (!isValidYear) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <AppCard
            title="URL Incorreta"
            description={`Por favor, acesse usando o ANO da edição (ex: /edicoes/2024/...).`}
            type="error"
          />
          <div className="mt-4 flex justify-center">
            <AppButton variant="secondary" onClick={() => navigate(-1)}>
              <ChevronLeft className="mr-2 size-4" />
              Voltar
            </AppButton>
          </div>
        </div>
      </div>
    );
  }

  if (isLoadingStatus) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center gap-2 p-6 md:p-10">
        <Loader2 className="text-primary size-8 animate-spin" />
        <span className="text-muted-foreground">Carregando dados...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <AppCard
          title="Erro ao carregar"
          description="Não foi possível encontrar os dados. Verifique sua conexão ou se a edição existe."
          type="error"
        />
      </div>
    );
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

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              Inscrição Institucional
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Ano da Edição: {editionId}
          </p>
        </div>
      </div>

      {isAlreadyEnrolled && (
        <div className="mb-6 flex w-full justify-center">
          <AppCard
            title="Inscrição Realizada"
            description="Sua instituição já está registrada nesta edição."
            type="success"
          />
        </div>
      )}

      {!isAlreadyEnrolled && !hasRequiredInfo && (
        <div className="mb-6 flex w-full justify-center">
          <AppCard
            title="Dados Cadastrais Incompletos"
            description="Sua instituição não possui um e-mail principal cadastrado no sistema. Para realizar a inscrição na edição, é necessário que o cadastro da instituição esteja completo. Entre em contato com o suporte ou atualize o cadastro geral da instituição."
            type="warning"
          />
        </div>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleFormSubmit} noValidate>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>
                  Dados da Instituição (Somente Leitura)
                </FieldLegend>

                <Field>
                  <AppInput
                    label="Nome da Instituição"
                    placeholder="Carregando..."
                    error={errors.name?.message}
                    register={register("name")}
                    disabled={true}
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <AppInput
                      label="Código INEP"
                      placeholder="-"
                      error={errors.inep?.message}
                      register={register("inep")}
                      disabled={true}
                    />
                  </Field>

                  <Field>
                    <AppInput
                      label="Telefone Institucional"
                      placeholder="-"
                      mask="(99)99999-9999"
                      error={errors.phoneNumber?.message}
                      register={register("phoneNumber")}
                      disabled={true}
                    />
                  </Field>
                </div>
              </FieldSet>

              <FieldSet>
                <FieldLegend>Contatos Oficiais</FieldLegend>

                <Field>
                  <AppInput
                    type="email"
                    label="E-mail Principal"
                    placeholder="-"
                    className={
                      !hasRequiredInfo ? "border-destructive opacity-100" : ""
                    }
                    error={errors.email1?.message}
                    register={register("email1")}
                    disabled={true}
                  />
                  {!hasRequiredInfo && (
                    <p className="text-destructive mt-1 text-sm font-medium">
                      * E-mail obrigatório não encontrado no cadastro.
                    </p>
                  )}
                </Field>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field>
                    <AppInput
                      type="email"
                      label="E-mail Secundário"
                      placeholder="-"
                      error={errors.email2?.message}
                      register={register("email2")}
                      disabled={true}
                    />
                  </Field>

                  <Field>
                    <AppInput
                      type="email"
                      label="E-mail Adicional"
                      placeholder="-"
                      error={errors.email3?.message}
                      register={register("email3")}
                      disabled={true}
                    />
                  </Field>
                </div>
              </FieldSet>

              {!isAlreadyEnrolled && hasRequiredInfo && (
                <div className="mt-4 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                  <AppButton
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    icon={<Save />}
                    isLoading={isSubmitting}
                  >
                    Registrar na Edição
                  </AppButton>
                </div>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
