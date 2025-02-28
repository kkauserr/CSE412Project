import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-125px)]">
      <h2 className="mb-10 text-3xl font-bold">Sign Up</h2>
      <SignupForm />
    </div>
  );
}