interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({
  message = "Loading...",
}: LoadingScreenProps) {
  return (
    <div className="app-page">
      <div className="app-page-glow pointer-events-none" aria-hidden="true" />
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="loading-ring" aria-hidden="true" />
        <p className="label-caps text-warm-gray">{message}</p>
      </div>
    </div>
  );
}
