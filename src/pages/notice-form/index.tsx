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
import {
  Bell,
  ChevronLeft,
  Eraser,
  Eye,
  Save,
  SendHorizonal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
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
    handleReset,
    register,
  } = useNoticeForm({ setIsLoading });

  const deliveryMethod = watch("deliveryMethod");
  const recipient = watch("recipient");

  const titleValue = watch("title");
  const contentValue = watch("content");

  const sanitizedContent = DOMPurify.sanitize(contentValue || "");

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (deliveryMethod === "ALL_METHOD") {
      setValue("deliveryMethod", "ALL");
    }

    if (recipient === "ALL_RECIPIENT") {
      setValue("recipient", "ALL");
    }

    submitHandler();
  };

  return (
    <>
      <div className="flex items-center gap-4">
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
            <Bell className="text-primary h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">Novo Aviso</h1>
          </div>
        </div>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
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
                    <FieldLabel>Método de Envio</FieldLabel>
                    <FieldDescription>
                      Selecione o método de envio
                    </FieldDescription>

                    <Controller
                      name="deliveryMethod"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          className="sm:flex"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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

                          <FieldLabel
                            htmlFor="ALL_METHOD"
                            className="bg-input/30"
                          >
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Ambos</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value="ALL_METHOD"
                                id="ALL_METHOD"
                              />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      )}
                    />
                  </FieldSet>
                </FieldGroup>

                <FieldGroup>
                  <FieldSet>
                    <FieldLabel>Destinatário</FieldLabel>
                    <FieldDescription>
                      Selecione o destinatário
                    </FieldDescription>

                    <Controller
                      name="recipient"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          className="sm:flex"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FieldLabel
                            htmlFor="EDUCATOR"
                            className="bg-input/30"
                          >
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Apenas Educadores</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem value="EDUCATOR" id="EDUCATOR" />
                            </Field>
                          </FieldLabel>

                          <FieldLabel htmlFor="STUDENT" className="bg-input/30">
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Apenas Estudantes</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem value="STUDENT" id="STUDENT" />
                            </Field>
                          </FieldLabel>

                          <FieldLabel
                            htmlFor="ALL_RECIPIENT"
                            className="bg-input/30"
                          >
                            <Field orientation="horizontal">
                              <FieldContent>
                                <FieldTitle>Para Todos</FieldTitle>
                              </FieldContent>
                              <RadioGroupItem
                                value="ALL_RECIPIENT"
                                id="ALL_RECIPIENT"
                              />
                            </Field>
                          </FieldLabel>
                        </RadioGroup>
                      )}
                    />
                  </FieldSet>
                </FieldGroup>

                <FieldGroup>
                  <Field>
                    <FieldLabel>Conteúdo</FieldLabel>
                    <Controller
                      name="content"
                      control={control}
                      render={({ field }) => (
                        <AppTextEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
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

                <div className="flex gap-3">
                  <AppButton
                    type="button"
                    variant="secondary"
                    isLoading={isLoading}
                    icon={<Eye />}
                  >
                    Visualizar
                  </AppButton>

                  <AppButton
                    type="submit"
                    isLoading={isLoading}
                    icon={<SendHorizonal />}
                  >
                    Publicar
                  </AppButton>
                </div>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

export { NoticeForm };
