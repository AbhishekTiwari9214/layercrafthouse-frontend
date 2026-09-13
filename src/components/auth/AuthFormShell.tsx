import Link from "next/link";
import type { ReactNode } from "react";
import PageShell from "@/components/ui/PageShell";
import FormField from "@/components/ui/FormField";

interface AuthFormShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthFormShell({
  title,
  subtitle,
  children,
  footer,
}: AuthFormShellProps) {
  return (
    <PageShell maxWidth="sm">
      <Link
        href="/"
        className="label-caps mb-10 inline-flex items-center gap-2 text-warm-gray transition-colors duration-500 hover:text-gold"
      >
        <span aria-hidden="true">←</span>
        Back to home
      </Link>

      <div className="mb-10">
        <p className="label-caps mb-4 text-gold/80">Account</p>
        <h1 className="editorial-headline text-4xl md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-warm-gray">{subtitle}</p>
      </div>

      <div className="app-card">{children}</div>

      <div className="mt-8 text-center text-sm leading-relaxed text-warm-gray">{footer}</div>
    </PageShell>
  );
}

function AuthField({
  label,
  id,
  type = "text",
  value,
  onChange,
  required = true,
  autoComplete,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <FormField
      label={label}
      id={id}
      type={type}
      value={value}
      required={required}
      autoComplete={autoComplete}
      onValueChange={onChange}
    />
  );
}

export { AuthField };
