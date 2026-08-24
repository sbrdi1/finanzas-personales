import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getTransactionsForCurrentUser } from "@/data/transactions";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const transactions = await getTransactionsForCurrentUser();
  return <Dashboard initialTransactions={transactions} userName={session.user.name ?? null} />;
}
