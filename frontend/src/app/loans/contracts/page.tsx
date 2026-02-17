import { serverContractApi } from "@/lib/api-server";
import ContractListClient from "@/components/features/contracts/ContractListClient";

export default async function ContractListPage() {
  try {
    const contracts = await serverContractApi.getAll();
    return <ContractListClient contracts={contracts} />;
  } catch {
    return <ContractListClient contracts={[]} error="데이터를 불러오는데 실패했습니다." />;
  }
}
