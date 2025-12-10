import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { AppTextEditor } from "@/components/app-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { useNoticeForm } from "@/hooks/use-notice-form";
import DOMPurify from "dompurify";
import { ChevronLeft } from "lucide-react";
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
          <form onSubmit={handleSubmit} noValidate>
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
                </FieldGroup>
              </FieldSet>

              <Field
                orientation="horizontal"
                className="mt-6 flex flex-col gap-4 md:flex-row md:justify-end"
              >
                <div className="flex w-full justify-end gap-4">
                  <AppButton
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700"
                    isLoading={isLoading}
                  >
                    Cadastrar Aviso
                  </AppButton>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <AppTextEditor />
    </>
  );
}

export { NoticeForm };
