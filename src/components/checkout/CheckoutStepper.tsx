"use client";

const STEPS = [
  { id: 1, label: "Contact" },
  { id: 2, label: "Address" },
  { id: 3, label: "Payment" },
] as const;

interface CheckoutStepperProps {
  currentStep: number;
  completed?: boolean;
}

function StepIcon({
  stepId,
  active,
  completed,
}: {
  stepId: number;
  active: boolean;
  completed: boolean;
}) {
  if (completed) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M2.5 7L5.5 10L11.5 4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <span className={`text-[0.65rem] font-medium ${active ? "text-gold" : "text-warm-gray"}`}>
      {stepId}
    </span>
  );
}

export default function CheckoutStepper({ currentStep, completed = false }: CheckoutStepperProps) {
  const effectiveStep = completed ? STEPS.length + 1 : currentStep;

  return (
    <div className="checkout-stepper mb-12">
      <div className="checkout-stepper-track" aria-hidden="true">
        <div
          className="checkout-stepper-progress"
          style={{
            width: `${Math.min(100, ((effectiveStep - 1) / (STEPS.length - 1)) * 100)}%`,
          }}
        />
      </div>

      <ol className="checkout-stepper-steps">
        {STEPS.map((step) => {
          const active = !completed && currentStep === step.id;
          const done = completed || effectiveStep > step.id;

          return (
            <li
              key={step.id}
              className={`checkout-stepper-item ${active ? "is-active" : ""} ${done ? "is-complete" : ""}`}
            >
              <span className="checkout-stepper-dot">
                <StepIcon stepId={step.id} active={active} completed={done} />
              </span>
              <span className="checkout-stepper-label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export { STEPS };
