import Link from "next/link";
import LoginForm from "@/components/LoginForm";
import AuthButtons from "@/components/AuthButtons";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-125px)]">
      <h2 className="mb-10 text-3xl font-bold">Login</h2>
      <LoginForm />
      {/* <AuthButtons /> removed google github auth for now*/} 
      <p className="mt-7 text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="text-green-600 hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}