interface AuthDividerProps {
  label?: string;
}

export default function AuthDivider({ label = "or continue with email" }: AuthDividerProps) {
  return (
    <div className="auth-divider">
      <span>{label}</span>
    </div>
  );
}
