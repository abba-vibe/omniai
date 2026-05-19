import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-950">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800",
            headerTitle: "text-zinc-50",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700",
            formFieldLabel: "text-zinc-300",
            formFieldInput:
              "bg-zinc-800 border-zinc-700 text-zinc-50 focus:ring-emerald-500/40",
            formButtonPrimary:
              "bg-emerald-600 hover:bg-emerald-500 text-white",
            footerActionLink: "text-emerald-400 hover:text-emerald-300",
          },
        }}
      />
    </div>
  );
}
