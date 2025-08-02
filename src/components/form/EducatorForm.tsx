import { useEducatorForm } from "../../hooks/useEducatorForm";
import { fetchInstitutions } from "../../services/institutionService";
import { AsyncSelectField } from "../ui/AsyncSelectField";
import { Field } from "../ui/Field";
import { Button } from "../ui/Button";
import Captcha from "../ui/Captcha";
import { ProgressDialog } from "../ui/ProgressDialog";

export const EducatorForm = () => {
  const {
    register,
    control,
    errors,
    handleSubmit,
    handleReset,
    setCaptchaToken,
    captchaResetKey,
    captchaError,
    isPending,
  } = useEducatorForm();

  return (
    <form
      className="flex w-full flex-col justify-center gap-4"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nome:"
          type="text"
          placeholder="Digite seu nome completo"
          register={register("name")}
          error={errors.name?.message}
        />
        <Field
          label="Nome Social (Opcional):"
          type="text"
          placeholder="Como prefere ser chamado"
          register={register("socialName")}
          error={errors.socialName?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="CPF:"
          type="text"
          placeholder="Digite seu CPF"
          mask="999.999.999-99"
          register={register("cpf")}
          error={errors.cpf?.message}
        />
        <Field
          label="Data de Nascimento:"
          type="date"
          register={register("dateOfBirth")}
          error={errors.dateOfBirth?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="E-mail:"
          type="email"
          placeholder="Digite seu e-mail"
          register={register("email")}
          error={errors.email?.message}
        />
        <Field
          label="Confirme seu e-mail:"
          type="email"
          placeholder="Digite seu e-mail novamente"
          register={register("confirmEmail")}
          error={errors.confirmEmail?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Senha:"
          type="password"
          placeholder="Digite sua senha"
          register={register("password")}
          error={errors.password?.message}
        />
        <Field
          label="Confirmar Senha:"
          type="password"
          placeholder="Digite sua senha novamente"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="SIAPE:"
          type="text"
          placeholder="Digite seu SIAPE"
          register={register("siape")}
          error={errors.siape?.message}
        />
        <Field
          label="Telefone:"
          type="text"
          placeholder="(00)00000-0000"
          mask={["(99)9999-9999", "(99)99999-9999"]}
          register={register("phoneNumber")}
          error={errors.phoneNumber?.message}
        />
      </div>

      <AsyncSelectField
        name="institution"
        label="Instituição:"
        placeholder="Selecione uma instituição"
        control={control}
        loadOptions={fetchInstitutions}
        error={errors.institution?.message}
      />

      <Captcha
        key={captchaResetKey}
        onVerify={setCaptchaToken}
        theme="light"
        error={captchaError}
      />

      <div className="flex justify-between">
        <Button secondary type="button" onClick={handleReset}>
          Limpar
        </Button>
        <Button type="submit">Cadastrar</Button>
      </div>
      <ProgressDialog open={isPending} />
    </form>
  );
};
