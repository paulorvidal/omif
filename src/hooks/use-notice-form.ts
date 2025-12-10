import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createNotice,
  type CreateNoticeRequest,
} from "../services/notice-service";
import { showToast } from "../utils/events";
import { scrollToTop } from "@/utils/scroll-to-top";

type UseNoticeFormParams = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const avisoFormSchema = z
  .object({
    title: z.string().min(2, "O título deve ter no mínimo 2 caracteres."),
    content: z.string().min(10, "O conteúdo do aviso é obrigatório."),
    recipient: z.string().nonempty("Você precisa selecionar um destinatário."),
    deliveryMethod: z.string().nonempty("Selecione um método de envio."),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "SYSTEM") {
        return data.recipient === "EDUCATOR";
      }
      return true;
    },
    {
      message:
        "Para envio via sistema, o destinatário deve ser 'Apenas Educadores'",
      path: ["recipient"],
    },
  );

type AvisoFormSchema = z.infer<typeof avisoFormSchema>;

export const useNoticeForm = ({ setIsLoading }: UseNoticeFormParams) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
    register,
  } = useForm<AvisoFormSchema>({
    resolver: zodResolver(avisoFormSchema),
    defaultValues: {
      content: "",
      deliveryMethod: "ALL",
      recipient: "EDUCATOR",
    },
  });

  const onFormSubmit = async (data: AvisoFormSchema) => {
    setIsLoading(true);
    try {
      reset();

      const apiData: CreateNoticeRequest = {
        title: data.title,
        content: data.content,
        deliveryMethod: data.deliveryMethod,
        recipient: data.recipient,
      };

      const response = await createNotice(apiData);

      showToast(response.message, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao publicar aviso",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = handleSubmit(onFormSubmit);

  const handleReset = () => {
    reset();
    scrollToTop();
  };

  return {
    control,
    errors,
    submitHandler,
    setValue,
    watch,
    handleSubmit,
    handleReset,
    register,
  };
};
