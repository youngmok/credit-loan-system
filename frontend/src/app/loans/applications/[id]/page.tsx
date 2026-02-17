import { serverApplicationApi, serverCustomerApi } from "@/lib/api-server";
import ApplicationDetailClient from "@/components/features/application-detail/ApplicationDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const applicationId = parseInt(id, 10);

  try {
    const application = await serverApplicationApi.getById(applicationId);

    const [customer, history, assessment] = await Promise.all([
      serverCustomerApi.getById(application.customerId).catch(() => null),
      serverApplicationApi.getHistory(applicationId).catch(() => []),
      ["APPROVED", "REJECTED", "EXECUTED", "ACTIVE", "COMPLETED"].includes(application.status)
        ? serverApplicationApi.getAssessment(applicationId).catch(() => null)
        : Promise.resolve(null),
    ]);

    return (
      <ApplicationDetailClient
        applicationId={applicationId}
        initialData={{ application, customer, history, assessment }}
      />
    );
  } catch (error) {
    return (
      <ApplicationDetailClient
        applicationId={applicationId}
        initialData={{ application: null, customer: null, history: [], assessment: null }}
        serverError={error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다."}
      />
    );
  }
}
