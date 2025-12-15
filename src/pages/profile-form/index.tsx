import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useProfile } from "@/hooks/use-profile";
import { getInitials } from "@/utils/formatters";
import {
  AtSign,
  Building2,
  ChevronLeft,
  Delete,
  KeyRound,
  Pencil,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router";
import { ProfilePictureEditDialog } from "./profile-picture-edit-dialog";
import { ChangeEmailDialog } from "./change-email-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { ChangeInstitutionDialog } from "./change-institution-dialog";

function ProfileForm() {
  const {
    user,
    isLoading,
    isSavingPicture,
    isDeletingPicture,
    register,
    errors,
    handleProfileSubmit,
    handleResetForm,
    isEditDialogOpen,
    openPictureEditDialog,
    closePictureEditDialog,
    handleSavePicture,
    handleDeletePicture,
    isPasswordDialogOpen,
    openPasswordDialog,
    closePasswordDialog,
    handleChangePassword,
    isChangingPassword,
    isEmailDialogOpen,
    closeEmailDialog,
    handleChangeEmail,
    isChangingEmail,
    isInstitutionDialogOpen,
    openInstitutionDialog,
    closeInstitutionDialog,
    handleChangeInstitution,
    isChangingInstitution,
    handleEmailEditClick,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
  } = useProfile();

  const displayName = user?.socialName || user?.name;

  const navigate = useNavigate();

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
        <h1 className="text-3xl font-semibold">Perfil</h1>
      </div>

      <div className="flex w-full flex-col gap-6 lg:flex-row">
        <Card className="w-full lg:w-[35%]">
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="size-32">
                <AvatarImage
                  src={user?.profilePictureUrl}
                  alt="Foto de Perfil"
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <AppButton
                className="absolute right-0 bottom-0 size-8 rounded-full"
                variant="secondary"
                onClick={openPictureEditDialog}
              >
                <Pencil />
              </AppButton>
            </div>

            <p className="text-xl font-semibold">{displayName}</p>
            <Badge variant="outline">{user?.role}</Badge>

            <Card className="w-full py-4" onClick={handleEmailEditClick}>
              <CardContent className="flex items-center justify-between gap-3 px-4">
                <AtSign className="shrink-0 text-green-600" />
                <div className="flex flex-1 flex-col">
                  <p className="text-muted-foreground text-sm">E-mail</p>
                  <p className="text-sm font-semibold break-all">
                    {user?.email}
                  </p>
                </div>
                <AppButton className="size-8 rounded-full" variant="ghost">
                  <Pencil />
                </AppButton>
              </CardContent>
            </Card>

            <Card className="w-full py-4" onClick={openPasswordDialog}>
              <CardContent className="flex items-center justify-between gap-3 px-4">
                <KeyRound className="shrink-0 text-green-600" />
                <div className="flex flex-1 flex-col">
                  <p className="text-muted-foreground text-sm">Senha</p>
                  <p className="text-sm font-semibold break-all">••••••••</p>
                </div>
                <AppButton className="size-8 rounded-full" variant="ghost">
                  <Pencil />
                </AppButton>
              </CardContent>
            </Card>

            <Card className="w-full py-4" onClick={openInstitutionDialog}>
              <CardContent className="flex items-center justify-between gap-3 px-4">
                <Building2 className="shrink-0 text-green-600" />
                <div className="flex flex-1 flex-col">
                  <p className="text-muted-foreground text-sm">Instituição</p>
                  <p className="text-sm font-semibold break-all">
                    {user?.institution?.name}
                  </p>
                </div>
                <AppButton className="size-8 rounded-full" variant="ghost">
                  <Pencil />
                </AppButton>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent>
            <form onSubmit={handleProfileSubmit} noValidate>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>Informações Pessoais</FieldLegend>
                  <FieldGroup>
                    <Field>
                      <AppInput
                        label="Nome"
                        placeholder="Ex: Nome"
                        register={register("name")}
                        error={errors.name?.message}
                      />
                    </Field>
                    <Field>
                      <AppInput
                        label="Nome Social"
                        placeholder="Ex: Nome Social"
                        register={register("socialName")}
                        error={errors.socialName?.message}
                      />
                    </Field>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <AppInput
                          label="CPF"
                          placeholder="000.000.000-00"
                          mask="999.999.999-99"
                          register={register("cpf")}
                          error={errors.cpf?.message}
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Data de Nascimento"
                          type="date"
                          register={register("dateOfBirth")}
                          error={errors.dateOfBirth?.message}
                        />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field>
                        <AppInput
                          label="SIAPE"
                          placeholder="Número do SIAPE"
                          error={errors.siape?.message}
                          register={register("siape")}
                        />
                      </Field>
                      <Field>
                        <AppInput
                          label="Telefone"
                          placeholder="(00)90000-0000"
                          mask="(99)99999-9999"
                          error={errors.phoneNumber?.message}
                          register={register("phoneNumber")}
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>

                <div className="flex w-full justify-between gap-4">
                  <AppButton
                    type="button"
                    icon={<Delete />}
                    variant="secondary"
                    onClick={handleResetForm}
                  >
                    Desfazer
                  </AppButton>
                  <AppButton
                    type="submit"
                    icon={<Save />}
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    Salvar alterações
                  </AppButton>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <ProfilePictureEditDialog
        open={isEditDialogOpen}
        onClose={closePictureEditDialog}
        onSave={handleSavePicture}
        onDelete={handleDeletePicture}
        isSaving={isSavingPicture}
        isDeleting={isDeletingPicture}
        hasCurrentPicture={!!user?.profilePictureUrl}
      />

      <ChangeEmailDialog
        open={isEmailDialogOpen}
        onClose={closeEmailDialog}
        onSave={handleChangeEmail}
        isSaving={isChangingEmail}
        currentEmail={user?.email}
        initialValues={{ email: user?.pendingEmail || "" }}
      />

      <ChangePasswordDialog
        open={isPasswordDialogOpen}
        onClose={closePasswordDialog}
        onSave={handleChangePassword}
        isSaving={isChangingPassword}
      />

      <ChangeInstitutionDialog
        open={isInstitutionDialogOpen}
        onClose={closeInstitutionDialog}
        onSave={handleChangeInstitution}
        isSaving={isChangingInstitution}
        currentInstitutionName={user?.institution?.name}
        institutionOptions={institutionOptions}
        isLoading={isInstitutionsLoading}
        onInputChange={setInstitutionInput}
      />
    </>
  );
}

export { ProfileForm };
