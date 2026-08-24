import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getTransactionsForCurrentUser } from "@/data/transactions";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const now = new Date();
  const selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const transactions = await getTransactionsForCurrentUser();
  return <Dashboard initialTransactions={transactions} selectedMonth={selectedMonth} userName={session.user.name ?? null} movementsOnly />;
}
