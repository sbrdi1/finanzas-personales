import type { ReactNode } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";

export function WorkspaceShell({ userName, children }: { userName: string | null; children: ReactNode }) {
  return <div className="shell"><Sidebar userName={userName} /><main>{children}<footer>Finova · Tus finanzas, más claras.</footer></main></div>;
}
