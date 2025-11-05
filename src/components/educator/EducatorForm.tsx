import { AppInput } from "@/components/app-input";
import { AppDatePicker } from "@/components/app-date-picker";
import { AppAsyncSelect } from "@/components/app-async-select";
import { AppButton } from "@/components/app-button";
import { AppCaptcha } from "../app-captcha";

import { useEducatorForm } from "@/hooks/use-educator-form";
type EducatorFormProps = ReturnType<typeof useEducatorForm>;

export function EducatorForm({
    control,
    register,
    errors,
    setValue,
    handleSubmit,
    handleReset,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
    isPending,
    captchaError,

}: EducatorFormProps) {
    const captchaRegister = register("captchaToken");

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Cadastre-se</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <AppInput
                        label="Nome:"
                        placeholder="Ex: Nome Completo"
                        register={register("name")}
                        error={errors.name?.message}
                    />
                    <AppInput
                        label="Nome Social (Opcional):"
                        placeholder="Ex: Nome"
                        register={register("socialName")}
                        error={errors.socialName?.message}
                    />

                    <AppInput
                        label="CPF:"
                        placeholder="Ex: 000.000.000-00"
                        mask="999.999.999-99"
                        register={register("cpf")}
                        error={errors.cpf?.message}
                    />
                    <AppDatePicker
                        label="Data de Nascimento:"
                        register={register("dateOfBirth")}
                        error={errors.dateOfBirth?.message}
                    />

                    <AppInput
                        label="E-mail:"
                        type="email"
                        placeholder="Ex: nome@email.com"
                        register={register("email")}
                        error={errors.email?.message}
                    />
                    <AppInput
                        label="Confirme seu e-mail:"
                        type="email"
                        placeholder="Ex: nome@email.com"
                        register={register("confirmEmail")}
                        error={errors.confirmEmail?.message}
                    />

                    <AppInput
                        label="Senha:"
                        type="password"
                        placeholder="Digite sua senha"
                        register={register("password")}
                        error={errors.password?.message}
                    />
                    <AppInput
                        label="Confirmar Senha:"
                        type="password"
                        placeholder="Digite sua senha novamente"
                        register={register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                    />

                    <AppInput
                        label="SIAPE:"
                        placeholder="Ex: 0"
                        register={register("siape")}
                        error={errors.siape?.message}
                    />
                    <AppInput
                        label="Telefone:"
                        placeholder="Ex: (00)00000-0000"
                        mask="(99) 99999-9999"
                        register={register("phoneNumber")}
                        error={errors.phoneNumber?.message}
                    />
                </div>

                <div className="pt-6">
                    <AppAsyncSelect
                        name="institution"
                        label="Instituição:"
                        control={control}
                        options={institutionOptions}
                        isLoading={isInstitutionsLoading}
                        onInputChange={setInstitutionInput}
                        placeholder="Digite para buscar sua instituição..."
                        error={errors.institution?.message}
                    />
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 mt-6 border-t">
                    <div>
                        <input type="hidden" {...captchaRegister} />
                        <AppCaptcha
                            onVerify={(token: string) => {
                                setValue("captchaToken", token, { shouldValidate: true });
                            }}
                            error={errors.captchaToken?.message || captchaError}
                        />
                    </div>
                    <div className="flex gap-4">
                        <AppButton
                            type="button"
                            onClick={handleReset}
                            disabled={isPending}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                        >
                            Limpar
                        </AppButton>
                        <AppButton
                            type="submit"
                            isLoading={isPending}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            Cadastrar
                        </AppButton>
                    </div>
                </div>
            </form>
        </>
    );
}