import type { Step } from "@/types/steps-types";
import { Calendar, Plus } from "lucide-react";

interface StepCardProps {
  step?: Step;
  editionId: string;
  variant?: "default" | "empty";
  existingStepsCount?: number;
  onClick?: (stepId: string, editionId: string) => void;
  onEmptyClick?: (editionId: string) => void;
}

export function StepCard({ 
  step, 
  editionId, 
  variant = "default", 
  existingStepsCount = 0,
  onClick, 
  onEmptyClick 
}: StepCardProps) {
  const handleClick = () => {
    if (variant === "empty" && onEmptyClick) {
      onEmptyClick(editionId);
    } else if (step && onClick) {
      onClick(step.id, editionId);
    } else if (step) {
      console.log(`Clicado na etapa ${step.number} da edição ${editionId}`);
    }
  };

  if (variant === "empty") {
    const emptyText = existingStepsCount === 0 ? "Sem etapas" : "Adicionar etapa";
    
    return (
      <div
        className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 min-w-[140px]"
        onClick={handleClick}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground font-bold text-sm shadow-sm group-hover:scale-110 transition-all">
          <Plus className="w-4 h-4" />
        </div>
        
        <div className="flex flex-col gap-0.5 flex-1">
          <span className="text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
            {emptyText}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className="whitespace-nowrap">Clique para criar</span>
          </div>
        </div>

        <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  if (!step) return null;

  const startDate = new Date(step.startDate);
  const endDate = new Date(step.endDate);

  return (
    <div
      className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-primary/20 bg-linear-to-br from-primary/5 to-primary/10 cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 min-w-[140px]"
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
        {step.number}
      </div>
      
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
          Etapa {step.number}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span className="whitespace-nowrap">
            {startDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            {" - "}
            {endDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
        </div>
      </div>

      <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
