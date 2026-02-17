import { serverContractApi } from "@/lib/api-server";
import ContractDetailClient from "@/components/features/contract-detail/ContractDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractDetailPage({ params }: PageProps) {
  const { id } = await params;
  const contractId = parseInt(id, 10);

  try {
    const [contract, schedules, transactions] = await Promise.all([
      serverContractApi.getById(contractId),
      serverContractApi.getSchedules(contractId).catch(() => []),
      serverContractApi.getTransactions(contractId).catch(() => []),
    ]);

    return (
      <ContractDetailClient
        initialData={{ contract, schedules, transactions }}
      />
    );
  } catch (error) {
    return (
      <ContractDetailClient
        initialData={{ contract: null, schedules: [], transactions: [] }}
        serverError={error instanceof Error ? error.message : "데이터를 불러오는데 실패했습니다."}
      />
    );
  }
}
