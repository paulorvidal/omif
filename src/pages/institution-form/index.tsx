/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { Delete, Save, ChevronLeft } from "lucide-react";
import { useInstitutionForm } from "../../hooks/use-institution-form";
import { useNavigate, useParams } from "react-router-dom";
import { AppAsyncSelect } from "@/components/app-async-select";
import { useWatch } from "react-hook-form";

function InstitutionForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        errors,
        handleFormSubmit,
        handleReset,
        isSubmitting,
        control,
        loadEducatorOptions,
        isEditMode,
        setValue,
    } = useInstitutionForm({ institutionId: id });

    const [localOptions, setLocalOptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const currentCoordinator = useWatch({ control, name: "coordinator" });

    useEffect(() => {
        if (isEditMode && currentCoordinator) {
            const coordObj = currentCoordinator as any;
            if (coordObj.value && coordObj.label) {

                setLocalOptions((prev) => {
                    const exists = prev.some((op) => String(op.value) === String(coordObj.value));

                    return exists ? prev : [{ label: coordObj.label, value: coordObj.value }, ...prev];
                });
                setValue("coordinator", coordObj.value, {
                    shouldDirty: false,
                    shouldValidate: true
                });
            }
        }
    }, [currentCoordinator, isEditMode, setValue]);

    const handleSearch = async (query: string) => {
        setIsLoading(true);
        try {
            const results = await loadEducatorOptions(query);

            setLocalOptions((prevOptions) => {
                const currentVal = (currentCoordinator as any)?.value || currentCoordinator;

                const selectedOption = prevOptions.find(
                    (op) => String(op.value) === String(currentVal)
                );

                if (selectedOption && !results.some((r: any) => String(r.value) === String(selectedOption.value))) {
                    return [selectedOption, ...results];
                }

                return results;
            });

        } catch (error) {
            console.error("Erro na busca", error);
        } finally {
            setIsLoading(false);
        }
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
                    <ChevronLeft />
                </AppButton>
                <h1 className="text-3xl font-semibold">
                    {isEditMode ? "Editar Instituição" : "Cadastro da Instituição"}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleFormSubmit} noValidate>
                        <FieldGroup>
                            <FieldSet>
                                <FieldGroup className="md:grid md:grid-cols-2 md:gap-x-6 gap-y-4">

                                    <Field className="md:col-span-2">
                                        <AppInput
                                            label="Nome da Instituição *"
                                            placeholder="Ex: Escola Municipal de Ensino Fundamental"
                                            error={errors.name?.message}
                                            register={register("name")}
                                        />
                                    </Field>

                                    <Field className="md:col-span-2">
                                        <AppInput
                                            label="Código INEP (Opcional)"
                                            placeholder="Ex: 12345678"
                                            error={errors.inep?.message}
                                            register={register("inep")}
                                        />
                                    </Field>

                                    <Field className="md:col-span-2">
                                        <AppInput
                                            label="Telefone Institucional *"
                                            placeholder="(00)90000-0000"
                                            mask="(99)99999-9999"
                                            error={errors.phoneNumber?.message}
                                            register={register("phoneNumber")}
                                            className="bg-white"
                                        />
                                    </Field>

                                    <Field className="md:col-span-2">
                                        <AppInput
                                            label="E-mail Institucional Principal *"
                                            type="email"
                                            placeholder="exemplo@escola.edu.br"
                                            error={errors.email1?.message}
                                            register={register("email1")}
                                        />
                                    </Field>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 md:col-span-2">
                                        <Field>
                                            <AppInput
                                                label="E-mail Secundário (Opcional)"
                                                type="email"
                                                placeholder="exemplo2@escola.edu.br"
                                                error={errors.email2?.message}
                                                register={register("email2")}
                                            />
                                        </Field>
                                        <Field>
                                            <AppInput
                                                label="E-mail Terciário (Opcional)"
                                                type="email"
                                                placeholder="exemplo3@escola.edu.br"
                                                error={errors.email3?.message}
                                                register={register("email3")}
                                            />
                                        </Field>
                                    </div>

                                    {isEditMode && (
                                        <Field className="md:col-span-2">
                                            <AppAsyncSelect
                                                control={control}
                                                name="coordinator"
                                                label="Coordenador da Instituição"
                                                placeholder="Digite para buscar um educador..."
                                                options={localOptions}
                                                isLoading={isLoading}
                                                onInputChange={handleSearch}
                                                error={errors.coordinator?.message}
                                                isClearable
                                            />
                                        </Field>
                                    )}

                                </FieldGroup>
                            </FieldSet>

                            <Field
                                orientation="horizontal"
                                className="flex flex-col gap-4 md:flex-row md:justify-end"
                            >
                                <div className="flex w-full justify-end gap-4">
                                    {!isEditMode && (
                                        <AppButton
                                            type="button"
                                            icon={<Delete />}
                                            variant="secondary"
                                            onClick={handleReset}
                                            disabled={isSubmitting}
                                        >
                                            Limpar
                                        </AppButton>
                                    )}

                                    <AppButton
                                        type="submit"
                                        icon={<Save />}
                                        isLoading={isSubmitting}
                                    >
                                        {isEditMode ? "Salvar Alterações" : "Cadastrar Instituição"}
                                    </AppButton>
                                </div>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

export { InstitutionForm };