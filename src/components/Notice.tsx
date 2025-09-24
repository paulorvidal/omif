import { ChevronRight, Info } from "lucide-react";
import { ViewDialog } from "./dialog/ViewDialog";
import { useMemo, useState } from "react";
import { useNoticeDetails } from "./../hooks/useNoticeDetails";
import DOMPurify from "dompurify";
import { ProgressDialog } from "./dialog/ProgressDialog";

type NoticeProps = {
  id: string;
  title: string;
  date: string;
};

export const Notice = ({ id, title, date }: NoticeProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading } = useNoticeDetails(id, isDetailsOpen);

  const sanitizedContent = useMemo(() => {
    if (!data?.content) {
      return "";
    }

    return DOMPurify.sanitize(data.content);
  }, [data?.content]);

  return (
    <>
      <div
        className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-slate-50 p-4 duration-500 hover:bg-slate-50/50 focus:bg-slate-50/50 sm:min-w-96 md:p-8"
        onClick={() => setIsDetailsOpen(true)}
      >

        <div className="flex min-w-0 items-center gap-4">
          <Info className="size-8 text-blue-500" />
          <div className="flex flex-col justify-center">
            <h3 className="break-all text-xl font-semibold">{title}</h3>
            <p className="text-zinc-500">{date}</p>
          </div>
        </div>

        <ChevronRight className="size-8 text-zinc-500" />
      </div>
      <ProgressDialog open={isLoading} />
      <ViewDialog
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={data?.title ?? title}
        htmlContent={sanitizedContent || "<p>Sem conteúdo</p>"}
      />
    </>
  );
};
