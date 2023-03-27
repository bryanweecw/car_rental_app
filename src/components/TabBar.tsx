import { useEffect } from "react";
import {
  StaffTabSelectionString,
  useStaffTabContext,
} from "~/context/StaffTabContext";

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
const tabs = [
  { name: "Hire Agreements", value: "hire_agreements" },
  { name: "Fleet Management", value: "fleet_management" },
  { name: "Client Management", value: "client_management" },
  { name: "Billing", value: "billing" },
  { name: "To Do", value: "to_do" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function TabBar() {
  const { activeTab, setActiveTab } = useStaffTabContext();

  useEffect(() => {
    const selectElement = document.getElementById("tabs") as HTMLSelectElement;

    if (selectElement) {
      selectElement.value = activeTab;
    }
  }, [activeTab]);
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab) => tab.value == activeTab)?.value}
          onChange={(e) =>
            setActiveTab(e.target.value as StaffTabSelectionString)
          }
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav
          className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
          aria-label="Tabs"
        >
          {tabs.map((tab, tabIdx) => (
            <a
              key={tab.name}
              onClick={() => setActiveTab(tab.value as StaffTabSelectionString)}
              className={classNames(
                tab.value == activeTab
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700",
                tabIdx === 0 ? "rounded-l-lg" : "",
                tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
              )}
              aria-current={tab.value == activeTab ? "page" : undefined}
            >
              <span>{tab.name}</span>
              <span
                aria-hidden="true"
                className={classNames(
                  tab.value == activeTab ? "bg-indigo-500" : "bg-transparent",
                  "absolute inset-x-0 bottom-0 h-0.5"
                )}
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
