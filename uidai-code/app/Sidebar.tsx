import React from "react";

export type NavItem = {
  label: string;
  icon: string;
  badge?: string;
  section: string;
};

type Props = {
  items: NavItem[];
  activeSection: string;
  onSelect: (section: string) => void;
};

const Sidebar = ({ items, activeSection, onSelect }: Props) => {
  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl overflow-hidden">
          <img
            src="/aadhaar-logo.png"
            alt="Aadhaar Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            UIDAI Hackathon
          </p>
          <p className="text-base font-semibold text-slate-900">
            Aadhaar Insights
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const isActive = item.section === activeSection;
          return (
            <button
              key={item.section}
              onClick={() => onSelect(item.section)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
              type="button"
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </span>
              {item.badge ? (
                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="m-3 rounded-2xl bg-indigo-600 p-4 text-white shadow-lg">
        <p className="text-sm font-semibold">Quick Insight</p>
        <p className="mt-1 text-sm text-indigo-100">
          Enrolment spikes on weekends; suggest flexible staffing and extended
          hours.
        </p>
        <button
          type="button"
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
        >
          View playbook
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
