import { useState, useRef, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { ImageUp, X, RotateCw, Check, Trash2 } from "lucide-react";
import { Button } from "../Button";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CircularProgress from "@mui/material/CircularProgress";

export interface ProfilePictureEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  hasCurrentPicture: boolean;
}

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

export function ProfilePictureEditDialog(props: ProfilePictureEditDialogProps) {
  const {
    open,
    onClose,
    onSave,
    onDelete,
    isSaving,
    isDeleting,
    hasCurrentPicture,
  } = props;

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

  const handleClose = () => {
    setImgSrc("");
    onClose();
  };
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
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent className="p-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900">
            Alterar Foto de Perfil
          </h1>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className="text-zinc-400"
          >
            <X size={24} />
          </IconButton>
        </div>
        <div className="my-5 h-px w-full bg-zinc-200" />
        <div className="flex flex-col items-center px-4 pb-6 text-center">
          {!imgSrc ? (
            <>
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <ImageUp className="h-8 w-8 text-green-600" strokeWidth={2} />
              </div>
              <p className="text-sm text-zinc-500">
                Escolha uma nova imagem para o seu perfil.
              </p>
              <div className="mt-6 flex w-full flex-col gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 w-full text-base"
                >
                  Selecionar Imagem
                </Button>
                {hasCurrentPicture && (
                  <Button
                    onClick={onDelete}
                    destructive
                    className="h-12 w-full text-base"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" /> Excluir Foto
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full">
              <ReactCrop
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
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {imgSrc && (
            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleReselectImage}
                secondary
                className="h-12 w-full text-base"
                disabled={isSaving}
              >
                <RotateCw className="mr-2 h-4 w-4" />
                Trocar
              </Button>
              <Button
                onClick={handleSaveCrop}
                className="h-12 w-full text-base"
                disabled={isSaving}
              >
                {isSaving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Salvar
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
