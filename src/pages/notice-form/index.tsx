import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { AppTextEditor } from "@/components/app-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { useNoticeForm } from "@/hooks/use-notice-form";
import DOMPurify from "dompurify";
import { ChevronLeft, Eraser, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NoticeForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    errors,
    submitHandler,
    setValue,
    watch,
    handleSubmit,
    handleReset,
    register,
  } = useNoticeForm({ setIsLoading });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const titleValue = watch("title");
  const contentValue = watch("content");

  const sanitizedContent = DOMPurify.sanitize(contentValue || "");

  const deliveryMethodOptions = [
    { value: "", label: "Selecione o método de envio..." },
    { value: "SYSTEM", label: "Via Sistema" },
    { value: "EMAIL", label: "Via Email" },
    { value: "ALL", label: "Ambos" },
  ];

  const allRecipientOptions = [
    { value: "", label: "Selecione o destinatário..." },
    { value: "ALL", label: "Para Todos" },
    { value: "STUDENT", label: "Apenas Estudantes" },
    { value: "EDUCATOR", label: "Apenas Educadores" },
  ];

  const deliveryMethod = watch("deliveryMethod");

  useEffect(() => {
    if (deliveryMethod === "SYSTEM") {
      setValue("recipient", "EDUCATOR");
    }
  }, [deliveryMethod, setValue]);

  const availableRecipientOptions =
    deliveryMethod === "SYSTEM"
      ? allRecipientOptions.filter(
          (opt) => opt.value === "EDUCATOR" || opt.value === "",
        )
      : allRecipientOptions;

  const handleOpenConfirmDialog = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSubmit = () => {
    submitHandler();
    setIsConfirmOpen(false);
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
        <h1 className="text-3xl font-semibold">Cadastro de Aviso</h1>
      </div>
      <Card>
        <CardContent>
          <form onSubmit={submitHandler} noValidate>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field>
                      <AppInput
                        label="Nome Completo"
                        placeholder="Ex Nome Completo"
                        error={errors.name?.message}
                        register={register("name")}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        label="Nome Social (Opcional)"
                        placeholder="Ex Nome Social"
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
                        placeholder="(00)90000-0000"
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
                <FieldGroup>
                  <Field>
                    <FieldLabel>Conteúdo</FieldLabel>
                    <AppTextEditor />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <div className="flex justify-between">
                <AppButton
                  type="button"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={isLoading}
                  icon={<Eraser />}
                >
                  Limpar
                </AppButton>

                <AppButton type="submit" isLoading={isLoading} icon={<Save />}>
                  Cadastrar
                </AppButton>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export { NoticeForm };
