import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { getTransactionsForCurrentUser } from "@/data/transactions";

function currentMonth() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; }

export default async function Home({ searchParams }: { searchParams: Promise<{ mes?: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const requested = (await searchParams).mes;
  const selectedMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(requested ?? "") ? requested! : currentMonth();
  const transactions = await getTransactionsForCurrentUser();
  return <Dashboard initialTransactions={transactions} selectedMonth={selectedMonth} userName={session.user.name ?? null} />;
}
