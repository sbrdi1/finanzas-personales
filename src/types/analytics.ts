export type MonthlyPoint = { month: string; income: number; expense: number; balance: number; savingRate: number | null };
export type AnalyticsData = { series: MonthlyPoint[]; categories: { category: string; color: string; amount: number }[] };
