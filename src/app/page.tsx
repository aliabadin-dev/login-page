import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex flex-col">
      {/* Subtle top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" aria-hidden />

      <div className="flex-1 flex items-center justify-center py-12 sm:py-16 px-4">
        <LoginForm />
      </div>

      {/* Footer */}
      <footer className="pb-8 px-4 text-center">
        <p className="text-xs text-zinc-600">
          Protected by industry-standard encryption
        </p>
      </footer>
    </main>
  );
}
