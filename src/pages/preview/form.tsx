import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Delete, Plus } from "lucide-react";
import { AppSelect } from "@/components/app-select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AppAsyncSelect } from "@/components/app-async-select";
import { AppTextarea } from "@/components/app-textarea";

const allOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
];

function Form() {
  const { control, register } = useForm();
  const [options, setOptions] = useState(allOptions);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = allOptions.filter((opt) =>
        opt.label.toLowerCase().includes(query.toLowerCase()),
      );
      setOptions(filtered);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardContent>
            <form>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Formulário de Cadastro</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <AppInput
                        placeholder="Ex: Input"
                        label="Input"
                        helpText="Texto de Ajuda"
                        register={register("input")}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        placeholder="Ex: Input com Erro"
                        label="Input com Erro"
                        error="Erro: Algo inesperado aconteceu."
                        helpText="Texto de Ajuda"
                        register={register("inputComErro")}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        type="date"
                        label="Data"
                        helpText="Texto de Ajuda"
                        register={register("data")}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        type="date"
                        label="Data com Erro"
                        error="Erro: Algo inesperado aconteceu."
                        helpText="Texto de Ajuda"
                        register={register("dataComErro")}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        type="datetime-local"
                        label="Data e Hora"
                        helpText="Texto de Ajuda"
                        register={register("dataEHora")}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        type="datetime-local"
                        label="Data e Hora com Erro"
                        error="Erro: Algo inesperado aconteceu."
                        helpText="Texto de Ajuda"
                        register={register("dataEHoraComErro")}
                      />
                    </Field>
                    <Field>
                      <AppSelect
                        name="select"
                        label="Select"
                        control={control}
                        options={allOptions}
                        helpText="Texto de Ajuda"
                      />
                    </Field>
                    <Field>
                      <AppSelect
                        name="selectError"
                        label="Select com Erro"
                        control={control}
                        options={allOptions}
                        error="Erro: Algo inesperado aconteceu."
                        helpText="Texto de Ajuda"
                      />
                    </Field>
                    <Field>
                      <AppAsyncSelect
                        name="asyncSelect"
                        label="Select Assíncrono"
                        control={control}
                        options={options}
                        isLoading={loading}
                        onInputChange={handleSearch}
                        helpText="Texto de Ajuda"
                      />
                    </Field>
                    <Field>
                      <AppAsyncSelect
                        name="asyncSelectError"
                        label="Select Assíncrono com Erro"
                        control={control}
                        options={options}
                        isLoading={loading}
                        onInputChange={handleSearch}
                        error="Erro: Algo inesperado aconteceu."
                      />
                    </Field>
                    <Field>
                      <AppTextarea
                        label="Textarea"
                        helpText="Texto de Ajuda"
                        register={register("textarea")}
                      />
                    </Field>
                    <Field>
                      <AppTextarea
                        label="Textarea com Erro"
                        helpText="Texto de Ajuda"
                        register={register("textareaComErro")}
                        error="Erro: Algo inesperado aconteceu."
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                  <AppButton icon={<Plus />}>Cadastrar</AppButton>
                  <AppButton icon={<Plus />} isLoading={true}>
                    Cadastrar
                  </AppButton>
                </Field>
                <Field orientation="horizontal">
                  <AppButton icon={<Delete />} variant="secondary">
                    Limpar
                  </AppButton>
                  <AppButton
                    icon={<Delete />}
                    variant="secondary"
                    isLoading={true}
                  >
                    Limpar
                  </AppButton>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { Form };
