import React from "react";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <React.Fragment key={index}>
            <div className="step-item">
              <div
                className={`step-circle ${
                  isActive
                    ? "step-circle-active"
                    : isCompleted
                    ? "step-circle-completed"
                    : "step-circle-inactive"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className="step-label"
                style={{
                  color: isActive
                    ? "#1d4ed8"
                    : isCompleted
                    ? "#16a34a"
                    : "var(--text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`step-connector ${
                  index < currentStep ? "step-connector-active" : ""
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
