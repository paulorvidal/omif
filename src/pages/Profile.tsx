import { useState } from "react";
import { H2 } from "../components/ui/H2";
import { Pencil } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { ProfilePictureEditDialog } from "../components/ui/ProfilePictureEditDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { saveMyProfilePicture, deleteMyProfilePicture, getMyData } from "../services/educatorService";
import { showToast } from "../utils/events";
import { ProgressDialog } from "../components/ui/ProgressDialog";


const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    const names = name.split(' ');
    const firstInitial = names[0][0];
    const lastInitial = names.length > 1 ? names[names.length - 1][0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
};

export const Profile = () => {
    const { data: user, isLoading } = useQuery({
        queryKey: ["myData"],
        queryFn: getMyData,
    });

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: uploadPicture, isPending: isSaving } = useMutation({
        mutationFn: (variables: { pictureFile: File; id: string }) => 
            saveMyProfilePicture(variables.pictureFile, variables.id),
        onSuccess: () => {
            showToast("Foto de perfil atualizada com sucesso!", "success");
            queryClient.invalidateQueries({ queryKey: ["myData"] });
            setIsEditDialogOpen(false);
        },
        onError: (error) => {
            showToast(`Erro ao salvar a foto: ${error.message}`, "error");
        },
    });

    const { mutate: deletePicture, isPending: isDeleting } = useMutation({
        mutationFn: (id: string) => deleteMyProfilePicture(id),
        onSuccess: () => {
            showToast("Foto de perfil excluída com sucesso!", "success");
            queryClient.invalidateQueries({ queryKey: ["myData"] });
            setIsEditDialogOpen(false);
        },
        onError: (error) => {
            showToast(`Erro ao excluir a foto: ${error.message}`, "error");
        },
    });

    const handleSave = (file: File) => {
        if (user?.id) {
            uploadPicture({ pictureFile: file, id: user.id });
        }
    };

    const handleDelete = () => {
        if (user?.id) { 
            deletePicture(user.id);
        }
    };
    

    return (
        <div className="flex w-full flex-col gap-4 p-4 md:ms-14 md:gap-8 md:p-8">
            <H2>Perfil</H2>
            <div className="flex w-full h-full flex-col gap-4 md:flex-row md:gap-8">
                <div className="flex w-full flex-col items-center text-center gap-2 rounded-md bg-zinc-50 p-4 sm:p-8 md:w-auto md:gap-4">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                        {user?.profilePictureUrl ? (
                            <img
                                className="h-full w-full rounded-full object-cover"
                                src={user.profilePictureUrl}
                                alt="Foto de Perfil"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-green-500">
                                <span className="text-4xl font-bold text-white md:text-5xl">
                                    {getInitials(user?.name)}
                                </span>
                            </div>
                        )}
                        <button
                            onClick={() => setIsEditDialogOpen(true)}
                            className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
                            aria-label="Editar foto de perfil"
                        >
                            <Pencil className="h-5 w-5 text-gray-700" />
                        </button>
                    </div>
                    <p className="font-semibold">{user?.name}</p>
                    <Badge>{user?.role}</Badge>
                </div>
                <div className="flex w-full grow justify-center gap-4 rounded-md bg-zinc-50 p-4 sm:p-8 md:gap-8">
                    <div className="w-full">
                    </div>
                </div>
            </div>
            
            <ProfilePictureEditDialog 
                open={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleSave}
                onDelete={handleDelete}
                isSaving={isSaving}
                isDeleting={isDeleting}
                hasCurrentPicture={!!user?.profilePictureUrl}
            />
            <ProgressDialog open={isLoading} />
        </div>
    );
};