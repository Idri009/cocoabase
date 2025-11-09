"use client";

import { cn } from "@/lib/cn";

type StepperStep = {
  id: string;
  label: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  interactive?: boolean;
};

export default function Stepper({
  steps,
  currentStep,
  className,
  onStepClick,
  interactive = false,
}: StepperProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <button
                type="button"
                onClick={() => interactive && onStepClick && onStepClick(index)}
                disabled={!interactive}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all",
                  isCompleted &&
                    "bg-cocoa-600 text-white",
                  isActive &&
                    "bg-cocoa-600 text-white ring-4 ring-cocoa-200",
                  isUpcoming &&
                    "bg-cream-200 text-cocoa-600",
                  interactive && !isActive && "hover:bg-cocoa-100 cursor-pointer",
                  !interactive && "cursor-default"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </button>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isActive || isCompleted
                      ? "text-cocoa-800"
                      : "text-cocoa-400"
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-cocoa-500 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors",
                  isCompleted ? "bg-cocoa-600" : "bg-cream-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

