import HireAgreementTable from "~/components/HireAgreementTable";
import TabBar from "~/components/TabBar";
import { useStaffTabContext } from "~/context/StaffTabContext";

export default function StaffDashboard() {
  const { activeTab } = useStaffTabContext();

  return (
    <>
      <div className="min-h-full">
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                Dashboard
              </h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <TabBar />
              {activeTab === "hire_agreements" ? (
                <HireAgreementTable />
              ) : activeTab === "fleet_management" ? (
                <div>Fleet Management</div>
              ) : activeTab === "client_management" ? (
                <div>Client Management</div>
              ) : activeTab === "billing" ? (
                <div>Billing</div>
              ) : (
                <></>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
