import { useEffect } from "react";
import {
  type ClientTabSelectionString,
  useClientTabContext,
} from "~/context/ClientTabContext";

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
  { name: "Profile", value: "profile" },
  { name: "My Hire Agreements", value: "hire_agreements" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ClientTabBar() {
  const { activeTab, setActiveTab } = useClientTabContext();

  useEffect(() => {
    const selectElement = document.getElementById("tabs") as HTMLSelectElement;

    if (selectElement) {
      selectElement.value = activeTab;
    }
  }, [activeTab]);
  return (
    <div className="mt-5 grid">
      <div className="place-self-center sm:hidden md:w-2/5 custxs:w-4/5 custsm:w-4/5 custmd:w-3/5">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 "
          defaultValue={tabs.find((tab) => tab.value == activeTab)?.value}
          onChange={(e) =>
            setActiveTab(e.target.value as ClientTabSelectionString)
          }
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden cursor-pointer place-self-center sm:block md:w-2/5 custxs:w-4/5  custsm:w-4/5 custmd:w-3/5 ">
        <nav
          className="isolate flex divide-x divide-gray-200 rounded-lg shadow"
          aria-label="Tabs"
        >
          {tabs.map((tab, tabIdx) => (
            <a
              key={tab.name}
              onClick={() =>
                setActiveTab(tab.value as ClientTabSelectionString)
              }
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
