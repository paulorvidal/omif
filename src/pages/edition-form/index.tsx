/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { Save, ChevronLeft, Eraser } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditionForm } from "../../hooks/use-edition-form";
import { maskCurrency } from "../../utils/formatters";

export function EditionForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleFormSubmit,
        handleReset,
        errors,
        isEditMode,
        isPending,
        isEditionLoading,
        setValue,
    } = useEditionForm({ editionId: id });

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const masked = maskCurrency(value);
        setValue("minimumWage", masked, { shouldValidate: true, shouldDirty: true });
    };

    if (isEditionLoading) {
        return <div className="p-8 text-center">Carregando dados da edição...</div>;
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <AppButton
                    variant="secondary"
                    className="size-8"
                    size="icon"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="size-4" />
                </AppButton>
                <h1 className="text-3xl font-semibold">
                    {isEditMode ? "Editar Edição" : "Nova Edição"}
                </h1>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleFormSubmit} noValidate>
                        <FieldGroup>
                            <FieldSet>
                                <Field>
                                    <AppInput
                                        label="Nome da Edição"
                                        placeholder="Ex: Omif 2025"
                                        error={errors.name?.message}
                                        register={register("name")}
                                        helpText="Nome identificador da edição."
                                    />
                                </Field>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Field>
                                        <AppInput
                                            type="number"
                                            label="Ano de Referência"
                                            placeholder="2025"
                                            error={errors.year?.message}
                                            register={register("year")}
                                            helpText="Ano fiscal da olimpíada."
                                        />
                                    </Field>

                                    <Field>
                                        <AppInput
                                            label="Salário Mínimo (R$)"
                                            placeholder="0,00"
                                            error={errors.minimumWage?.message}
                                            register={{
                                                ...register("minimumWage"),
                                                onChange: (e: any) => {
                                                    handleCurrencyChange(e);
                                                    return Promise.resolve();
                                                },
                                            }}
                                            helpText="Valor base para cálculos de isenção."
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Field>
                                        <AppInput
                                            type="datetime-local"
                                            label="Início da Edição"
                                            error={errors.startDate?.message}
                                            register={register("startDate")}
                                            helpText="Data oficial de abertura."
                                        />
                                    </Field>

                                    <Field>
                                        <AppInput
                                            type="datetime-local"
                                            label="Fim da Edição"
                                            error={errors.endDate?.message}
                                            register={register("endDate")}
                                            helpText="Data de encerramento geral."
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Field>
                                        <AppInput
                                            type="datetime-local"
                                            label="Início das Inscrições de Instituições"
                                            error={errors.institutionRegistrationStartDate?.message}
                                            register={register("institutionRegistrationStartDate")}
                                            helpText="Abertura para cadastro das escolas."
                                        />
                                    </Field>

                                    <Field>
                                        <AppInput
                                            type="datetime-local"
                                            label="Fim das Inscrições de Instituições"
                                            error={errors.institutionRegistrationEndDate?.message}
                                            register={register("institutionRegistrationEndDate")}
                                            helpText="Encerramento para escolas."
                                        />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <Field>
                                        <AppInput
                                            type="datetime-local"
                                            label="Início das Inscrições de Estudantes"
                                            error={errors.studentRegistrationStartDate?.message}
                                            register={register("studentRegistrationStartDate")}
                                            helpText="Quando os alunos podem ser inscritos."
                                        />
                                    </Field>

                                    <Field>
                                        <AppInput
                                            type="datetime-local"
                                            label="Fim das Inscrições de Estudantes"
                                            error={errors.studentRegistrationEndDate?.message}
                                            register={register("studentRegistrationEndDate")}
                                            helpText="Prazo final para alunos."
                                        />
                                    </Field>
                                </div>
                            </FieldSet>

                            <div className="flex justify-between pt-4">
                                <AppButton
                                    type="button"
                                    variant="secondary"
                                    onClick={handleReset}
                                    disabled={isPending}
                                    icon={<Eraser />}
                                >
                                    Limpar
                                </AppButton>

                                <AppButton
                                    type="submit"
                                    icon={<Save />}
                                    isLoading={isPending}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {isEditMode ? "Salvar Alterações" : "Cadastrar"}
                                </AppButton>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}   