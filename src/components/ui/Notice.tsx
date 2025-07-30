import { ChevronRight, Info } from "lucide-react";

type NoticeProps = {
  title: string;
  date: string;
};

export const Notice = ({ title, date }: NoticeProps) => {
  return (
    <div className="flex w-full min-w-full flex-1 items-center justify-between gap-4 rounded-md bg-slate-50 p-4 duration-500 hover:bg-slate-50/50 focus:bg-slate-50/50 sm:min-w-96 md:p-8">
      <div className="flex items-center gap-4">
        <Info className="size-8 text-blue-500" />
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-zinc-500">{date}</p>
        </div>
      </div>
      <ChevronRight className="size-8 text-zinc-500" />
    </div>
  );
};
