import { serverApplicationApi } from "@/lib/api-server";
import ApplicationListClient from "@/components/features/applications/ApplicationListClient";

export default async function ApplicationListPage() {
  try {
    const applications = await serverApplicationApi.getAll();
    return <ApplicationListClient applications={applications} />;
  } catch {
    return <ApplicationListClient applications={[]} error="데이터를 불러오는데 실패했습니다." />;
  }
}
