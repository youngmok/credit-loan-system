import { serverContractApi } from "@/lib/api-server";
import RepayClient from "@/components/features/repayment/RepayClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RepayPage({ params }: PageProps) {
  const { id } = await params;
  const contractId = parseInt(id, 10);

  try {
    const [contract, schedules] = await Promise.all([
      serverContractApi.getById(contractId),
      serverContractApi.getSchedules(contractId).catch(() => []),
    ]);

    return (
      <RepayClient
        contractId={contractId}
        initialData={{ contract, schedules }}
      />
    );
  } catch (error) {
    return (
      <RepayClient
        contractId={contractId}
        initialData={{ contract: null, schedules: [] }}
        serverError={error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다."}
      />
    );
  }
}
