import { serverCustomerApi } from "@/lib/api-server";
import ApplyClient from "@/components/features/apply/ApplyClient";

export default async function LoanApplyPage() {
  let customers: Awaited<ReturnType<typeof serverCustomerApi.getAll>> = [];
  try {
    customers = await serverCustomerApi.getAll();
  } catch {
    // Continue with empty customer list
  }
  return <ApplyClient initialCustomers={customers} />;
}
