import { Button } from "../ui/Button";

import { Field } from "../ui/Field";
import { SelectField } from "../ui/SelectField";

import { AsyncSelectField } from "../ui/AsyncSelectField";
import { fetchInstitutions } from "../../services/institutionService";
import { useStudentForm } from "../../hooks/useStudentForm";
import { ProgressDialog } from "../dialog/ProgressDialog";
import Captcha from "../ui/Captcha";

export const StudentForm = () => {
  const {
    bolsaFamiliaOptions,
    gradeOptions,
    ethnicityOptions,
    genderOptions,
    completionElementarySchoolCategoryOptions,
    incomeRangeOptions,
    register,
    control,
    errors,
    handleSubmit,
    handleReset,
    isPending,
    setCaptchaToken,
    captchaResetKey,
    captchaError,
  } = useStudentForm();

  return (
    <form
      className="flex w-full flex-col justify-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Nome:"
          type="text"
          placeholder="Ex: Nome Completo"
          register={register("name")}
          error={errors.name?.message}
        />
        <Field
          label="E-mail:"
          type="text"
          placeholder="Ex: nome@email.com"
          register={register("email")}
          error={errors.email?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="CPF:"
          type="text"
          placeholder="Ex: 000.000.000-00"
          mask="999.999.999-99"
          register={register("cpf")}
          error={errors.cpf?.message}
        />
        <Field
          label="Data de Nascimento:"
          type="date"
          register={register("birthDate")}
          error={errors.birthDate?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="grade"
          label="Série:"
          control={control}
          options={gradeOptions}
          error={errors.grade?.message}
        />
        <SelectField
          name="gender"
          label="Gênero:"
          control={control}
          options={genderOptions}
          error={errors.gender?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="ethnicity"
          label="Você se considera:"
          control={control}
          options={ethnicityOptions}
          error={errors.ethnicity?.message}
        />
        <SelectField
          name="bolsaFamilia"
          label="Sua família é beneficiária do Bolsa Família?"
          control={control}
          options={bolsaFamiliaOptions}
          error={errors.bolsaFamilia?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          name="completionElementarySchoolCategory"
          label="Onde você realizou seus estudos de ensino fundamental ou equivalente?"
          control={control}
          options={completionElementarySchoolCategoryOptions}
          error={errors.completionElementarySchoolCategory?.message}
        />
        <SelectField
          name="incomeRange"
          label="Em qual faixa de renda per capita sua família se encontra?"
          control={control}
          options={incomeRangeOptions}
          error={errors.incomeRange?.message}
        />
      </div>

      <AsyncSelectField
        name="institution"
        label="Instituição:"
        placeholder="Ex: NOME DA INSTITUIÇÃO"
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
