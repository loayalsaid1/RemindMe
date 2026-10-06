export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
      {children}
    </div>
  );
}
