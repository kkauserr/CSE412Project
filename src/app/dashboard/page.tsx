import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome, {session.user?.email}!</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}