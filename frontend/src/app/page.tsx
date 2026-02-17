import { serverDashboardApi } from "@/lib/api-server";
import DashboardClient from "@/components/features/dashboard/DashboardClient";

export default async function DashboardPage() {
  try {
    const data = await serverDashboardApi.get();
    return <DashboardClient data={data} />;
  } catch {
    return <DashboardClient data={null} error="데이터를 불러오는데 실패했습니다." />;
  }
}
