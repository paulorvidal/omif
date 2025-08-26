import { H2 } from "../components/ui/H2";
import { Badge } from "../components/ui/Badge";
import { ProfilePictureEditDialog } from "../components/dialog/ProfilePictureEditDialog";
import { ProgressDialog } from "../components/dialog/ProgressDialog";
import { Field } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { useProfile } from "../hooks/useProfile";
import { getInitials } from "../utils/formatters";
import { InfoItem } from "../components/ui/InfoItem";
import { AtSign, KeyRound, Building2, Pencil } from "lucide-react";
import { ChangePasswordDialog } from "../components/dialog/ChangePasswordDialog";
import { ChangeEmailDialog } from "../components/dialog/ChangeEmailDialog";
import { ChangeInstitutionDialog } from "../components/dialog/ChangeInstitutionDialog"; 

export const Profile = () => {
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
        openEmailDialog,
        closeEmailDialog,
        handleChangeEmail,
        isChangingEmail,
        isInstitutionDialogOpen,
        openInstitutionDialog,
        closeInstitutionDialog,
        handleChangeInstitution,
        isChangingInstitution,
        loadInstitutions
    } = useProfile();

    return (
        <>
            <div className="flex w-full h-full flex-col gap-4 md:flex-row md:gap-8">
                <div className="flex w-full flex-col items-center text-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:w-96 md:flex-shrink-0">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                        {user?.profilePictureUrl ? (
                            <img className="h-full w-full rounded-full object-cover" src={user.profilePictureUrl} alt="Foto de Perfil" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-green-500">
                                <span className="text-4xl font-bold text-white md:text-5xl">{getInitials(user?.socialName)}</span>
                            </div>
                        )}
                        <button onClick={openPictureEditDialog} className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110" aria-label="Editar foto de perfil">
                            <Pencil className="h-5 w-5 text-gray-700" />
                        </button>
                    </div>
                    <p className="font-semibold">{user?.socialName}</p>
                    <Badge>{user?.role}</Badge>
                    <div className="mt-4 w-full pt-4 text-left flex flex-col gap-2">
                        <InfoItem
                            label="E-mail"
                            value={user?.email}
                            icon={<AtSign size={20} />}
                            onEdit={openEmailDialog}
                        />
                        <InfoItem
                            label="Senha"
                            value="********"
                            icon={<KeyRound size={20} />}
                            onEdit={openPasswordDialog}
                        />
                        <InfoItem
                            label="Instituição"
                            value={user?.institution?.name}
                            icon={<Building2 size={20} />}
                            onEdit={openInstitutionDialog}
                        />
                    </div>
                </div>
                <div className="flex w-full grow justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8">
                    <form onSubmit={handleProfileSubmit} className="w-full flex flex-col justify-center gap-4">
                        <H2>Informações Pessoais</H2>
                        <Field
                            label="Nome:"
                            type="text"
                            placeholder="Digite seu nome completo"
                            register={register("name")}
                            error={errors.name?.message}
                        />
                        <Field
                            label="Nome Social:"
                            type="text"
                            placeholder="Como prefere ser chamado"
                            register={register("socialName")}
                            error={errors.socialName?.message}
                        />
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                        <div className="grow"></div>
                        <div className="flex justify-between pt-4">
                            <Button secondary type="button" onClick={handleResetForm}>Desfazer  </Button>
                            <Button type="submit" disabled={isLoading}>
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </div>
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
            <ChangePasswordDialog
                open={isPasswordDialogOpen}
                onClose={closePasswordDialog}
                onSave={handleChangePassword}
                isSaving={isChangingPassword}
            />
            <ChangeEmailDialog
                open={isEmailDialogOpen}
                onClose={closeEmailDialog}
                onSave={handleChangeEmail}
                isSaving={isChangingEmail}
                currentEmail={user?.email}
            />
            <ChangeInstitutionDialog
                open={isInstitutionDialogOpen}
                onClose={closeInstitutionDialog}
                onSave={handleChangeInstitution}
                isSaving={isChangingInstitution}
                currentInstitutionName={user?.institution?.name}
                loadOptions={loadInstitutions}
            />

      <ProgressDialog open={isLoading} />
    </>
  );
};
