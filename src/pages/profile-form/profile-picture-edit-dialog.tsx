import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { Check, Image, ImageUp, RotateCw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ProfilePictureEditDialog = {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  hasCurrentPicture: boolean;
};

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  const newWidthInPixels = Math.min(mediaWidth, mediaHeight) * 0.9;

  return centerCrop(
    makeAspectCrop(
      {
        unit: "px",
        width: newWidthInPixels,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

function ProfilePictureEditDialog({
  open,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  hasCurrentPicture,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setImgSrc("");
      setCrop(undefined);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || ""),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleReselectImage = () => {
    setImgSrc("");
    fileInputRef.current?.click();
  };

  const handleSaveCrop = async () => {
    const image = imgRef.current;
    if (!image || !crop || !crop.width || !crop.height) {
      return;
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const canvas = document.createElement("canvas");
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], "profile.jpg", {
          type: "image/jpeg",
        });
        onSave(croppedFile);
      }
    }, "image/jpeg");
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1 / 1));
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={(state) => {
        if (!state) onClose();
      }}
    >
      {!imgSrc ? (
        <>
          <div className="flex justify-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <ImageUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <AppDialogTitle>Alterar Foto de Perfil</AppDialogTitle>
          <AppDialogContent>
            <DialogDescription className="text-center">
              Escolha uma nova imagem para o seu perfil.
            </DialogDescription>
          </AppDialogContent>
          <AppDialogFooter>
            {hasCurrentPicture && (
              <AppButton
                onClick={onDelete}
                disabled={isDeleting}
                icon={<Trash2 />}
                variant="secondary"
              >
                Excluir Foto
              </AppButton>
            )}
            <AppButton
              onClick={() => fileInputRef.current?.click()}
              icon={<Image />}
            >
              Selecionar Imagem
            </AppButton>
          </AppDialogFooter>
        </>
      ) : (
        <>
          <AppDialogTitle>Alterar Foto de Perfil</AppDialogTitle>
          <AppDialogContent>
            <ReactCrop
              className="mx-auto aspect-square max-h-64"
              crop={crop}
              onChange={(pixelCrop) => setCrop(pixelCrop)}
              circularCrop
              aspect={1}
              minWidth={100}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Imagem para recortar"
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </AppDialogContent>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imgSrc && (
        <AppDialogFooter>
          <AppButton
            onClick={handleReselectImage}
            variant="secondary"
            disabled={isSaving}
            icon={<RotateCw />}
          >
            Trocar
          </AppButton>
          <AppButton
            onClick={handleSaveCrop}
            disabled={isSaving}
            icon={<Check />}
          >
            Salvar
          </AppButton>
        </AppDialogFooter>
      )}
    </AppDialog>
  );
}

export { ProfilePictureEditDialog };
