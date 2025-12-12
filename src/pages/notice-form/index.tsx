import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { AppTextEditor } from "@/components/app-text-editor";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
                  <Field>
                    <AppInput
                      label="Título do Aviso"
                      placeholder="Ex: Título do Aviso"
                      error={errors.title?.message}
                      register={register("title")}
                    />
                  </Field>
                </FieldGroup>
                <FieldGroup>
                  <FieldSet>
                    <FieldLabel htmlFor="compute-environment-p8w">
                      Método de Envio
                    </FieldLabel>
                    <FieldDescription>
                      Selecione o método de envio...
                    </FieldDescription>
                    <RadioGroup className="sm:flex" defaultValue="SYSTEM">
                      <FieldLabel htmlFor="SYSTEM" className="bg-input/30">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Via Sistema</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value="SYSTEM" id="SYSTEM" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="EMAIL" className="bg-input/30">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Via Email</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value="EMAIL" id="EMAIL" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="ALL" className="bg-input/30">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>Ambos</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value="ALL" id="ALL" />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>
                  </FieldSet>
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
