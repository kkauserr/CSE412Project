import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6 mt-20">
      <h1 className="text-3xl font-bold">Welcome, {session.user?.name}!</h1>
      <p>This is the dashboard WORK IN PROGRESS</p>
    </div>
  );
}
