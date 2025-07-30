import { useEffect, useState } from "react";
import { useNoticeForm } from "../hooks/useNoticeForm";
import { ProgressDialog } from "../components/ui/ProgressDialog";
import { Sidebar } from "../components/sidebar/Sidebar";
import { H2 } from "../components/ui/H2";
import { ViewDialog } from "../components/ui/ViewDialog";
import { Controller } from "react-hook-form";
import { TextEditor } from "../components/ui/TextEditor";
import { Button } from "../components/ui/Button";
import { SendHorizonal, Eye } from "lucide-react";
import DOMPurify from "dompurify";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Field } from "../components/form/Field";
import { SelectField } from "../components/form/SelectField";

export const Notice = () => {
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
    <div className="flex w-full pb-14 md:pb-0">
      <ProgressDialog open={isLoading} />
      <Sidebar />
      <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
        <H2>Cadastrar Aviso</H2>

        <div className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8">
          <div className="w-full rounded-md">
            <form
              className="flex w-full flex-col justify-center gap-4"
              onSubmit={submitHandler}
            >
              <Field
                label="Título do Aviso"
                type="text"
                placeholder="Digite o título do aviso..."
                error={errors.title?.message}
                register={register("title")}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectField
                  name="deliveryMethod"
                  label="Método de Envio"
                  control={control}
                  options={deliveryMethodOptions}
                  error={errors.deliveryMethod?.message}
                />
                <SelectField
                  name="recipient"
                  label="Destinatário"
                  control={control}
                  options={availableRecipientOptions}
                  error={errors.recipient?.message}
                />
              </div>

              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextEditor
                    name="olamundo"
                    label="Conteúdo do aviso"
                    content={field.value}
                    onUpdate={field.onChange}
                    error={errors.content?.message}
                    placeholder="Digite o aviso aqui..."
                  />
                )}
              />

              <div className="mt-2 flex w-full flex-col items-end gap-4 md:flex-row md:items-center md:justify-between">
                <Button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  icon={<Eye />}
                  outline
                  className="w-full md:w-auto"
                >
                  Visualizar
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(handleOpenConfirmDialog)}
                  icon={<SendHorizonal />}
                  className="w-full md:w-auto"
                >
                  Publicar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ViewDialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Preview ${titleValue}`}
        htmlContent={sanitizedContent}
      />
      <ConfirmDialog
        open={isConfirmOpen}
        title="Publicar aviso"
        message="Tem certeza que deseja publicar o aviso? Esta ação não pode ser desfeita."
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
};
