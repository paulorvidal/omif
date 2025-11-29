/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { ChevronLeft } from "lucide-react";
import { AppAsyncSelect } from "@/components/app-async-select";
import { useInstitutionForm } from "../../hooks/use-institution-form";
import { useNavigate, useParams } from "react-router-dom";
import { useWatch } from "react-hook-form";

function InstitutionForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        errors,
        handleFormSubmit,
        isSubmitting,
        control,
        loadEducatorOptions,
        isEditMode,
    } = useInstitutionForm({ institutionId: id });

    const [localOptions, setLocalOptions] = useState<{ label: string; value: string | number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const currentCoordinator = useWatch({ control, name: "coordinator" });

    useEffect(() => {
        if (isEditMode && currentCoordinator && localOptions.length === 0) {
            setLocalOptions([currentCoordinator as any]);
        }
    }, [currentCoordinator, localOptions.length, isEditMode]);

    const handleSearch = async (query: string) => {
        setIsLoading(true);
        try {
            const results = await loadEducatorOptions(query);
            setLocalOptions(results);
        } catch (error) {
            console.error("Erro ao buscar", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
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
                                            placeholder="Ex: email@escola.com"
                                            type="email"
                                            error={errors.email2?.message}
                                            register={register("email2")}
                                        />
                                    </Field>
                                    <Field className="md:col-span-6">
                                        <AppInput
                                            label="E-mail reserva"
                                            placeholder="Ex: email@escola.com"
                                            type="email"
                                            error={errors.email3?.message}
                                            register={register("email3")}
                                        />
                                    </Field>

                                    {isEditMode && (
                                        <Field className="md:col-span-12">
                                            <AppAsyncSelect
                                                control={control}
                                                name="coordinator"
                                                label="Coordenador"
                                                placeholder="Digite para buscar..."
                                                options={localOptions}
                                                onInputChange={handleSearch}
                                                isLoading={isLoading}
                                                error={errors.coordinator?.message}
                                                isClearable
                                            />
                                        </Field>
                                    )}

                                </FieldGroup>
                            </FieldSet>

                            <Field
                                orientation="horizontal"
                                className="flex flex-col gap-4 mt-6 md:flex-row md:justify-end"
                            >
                                <div className="flex w-full justify-end gap-4">
                                    <AppButton
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        isLoading={isSubmitting}
                                    >
                                        {isEditMode ? "Salvar" : "Realizar Inscrição"}
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