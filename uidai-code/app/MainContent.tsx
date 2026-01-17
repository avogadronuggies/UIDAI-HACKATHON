import React from "react";

type Props = {
    activeSection: string;
};

const metrics = [
    { label: "Total Enrolments", value: "2.07M", change: "+4.2% vs last month" },
    { label: "Updates Processed", value: "1.86M", change: "+2.1% vs last month" },
    { label: "Biometric Success", value: "97.8%", change: "+0.6% stability" },
    { label: "Data Quality Score", value: "92 / 100", change: "3 flags open" },
];

const insights = [
    {
        title: "Weekend surges",
        detail: "Enrolments +18% on Saturdays; rural centers show the largest lift.",
    },
    {
        title: "Urban vs rural",
        detail: "Updates skew urban (62%), but enrolment growth is rural-first this month.",
    },
    {
        title: "Youth onboarding",
        detail: "Ages 18-25 drive 28% of new enrolments; consider university outreach.",
    },
];

const actions = [
    "Staff rural centers Fri–Sun; deploy mobile kits in top 5 districts",
    "Pre-warn for data quality checks where addresses mismatch utility proofs",
    "Pilot biometric QA workflow during high-traffic windows",
    "Publish weekly micro-report for stakeholders with anomalies and fixes",
];

const placeholders: Record<string, React.ReactNode> = {
    trends: (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Trend deep-dive (dummy content)</p>
            <div className="h-64 rounded-2xl border border-slate-200 bg-slate-50" />
            <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Seasonality</p>
                    <p className="text-sm text-slate-600">Weekend uplift and festival spikes expected.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Channel mix</p>
                    <p className="text-sm text-slate-600">Mobile vans contribute 23% of new enrolments.</p>
                </div>
            </div>
        </div>
    ),
    anomalies: (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Real-time alert rail (dummy)</p>
            <ul className="space-y-3">
                <li className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Biometric retries high in Zone 3 (+12%)</li>
                <li className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Document mismatch spike in Tier-2 addresses</li>
                <li className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Queue wait times &gt;30m in 4 districts</li>
            </ul>
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700" type="button">
                Open anomaly triage
            </button>
        </div>
    ),
    demographics: (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Demographic slices (dummy)</p>
            <div className="grid gap-3 md:grid-cols-3">
                {["18-25", "26-40", "41+"].map((age) => (
                    <div key={age} className="rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                        <p className="font-semibold text-slate-900">Age {age}</p>
                        <p className="text-slate-600">Share placeholder — plug real split later.</p>
                    </div>
                ))}
            </div>
        </div>
    ),
    regions: (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Regional map placeholder</p>
            <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-slate-400">
                Map / heatmap goes here
            </div>
            <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Top districts</p>
                    <p className="text-sm text-slate-600">List + sparkline once data is wired.</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">Capacity view</p>
                    <p className="text-sm text-slate-600">Idle vs. peak center utilization.</p>
                </div>
            </div>
        </div>
    ),
    quality: (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Data quality radar</p>
            <div className="grid gap-3 md:grid-cols-3">
                {[
                    { label: "Duplicates", status: "Low" },
                    { label: "Address mismatch", status: "Medium" },
                    { label: "Biometric retries", status: "High" },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-sm text-slate-600">Status: {item.status}</p>
                    </div>
                ))}
            </div>
            <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700" type="button">
                Run QA playbook
            </button>
        </div>
    ),
    settings: (
        <div className="space-y-4">
            <p className="text-sm text-slate-600">Pick a ready-made ops mode; tweak thresholds later.</p>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <p className="text-sm font-semibold text-slate-900">One-click presets</p>
                <div className="grid gap-3 md:grid-cols-3">
                    {["Quiet", "Standard", "War-room"].map((preset) => (
                        <button
                            key={preset}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-white hover:text-indigo-700"
                            type="button"
                        >
                            {preset}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500">Quiet = fewer pings, War-room = alert on any spike. Replace with real config later.</p>
            </div>
        </div>
    ),
};

const MainContent = ({ activeSection }: Props) => {
    const body = placeholders[activeSection];

    return (
        <div className="flex-1 overflow-y-auto">
            <header className="flex flex-col gap-4 border-b border-slate-200 bg-white/80 px-8 py-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Unlocking societal trends</p>
                    <h1 className="text-2xl font-semibold text-slate-900">Aadhaar Enrolment & Updates</h1>
                    <p className="text-sm text-slate-600">Dummy dashboard scaffold for trends, anomalies, and decision support.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>YTD</option>
                    </select>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                        Export snapshot
                    </button>
                </div>
            </header>

            <div className="space-y-6 p-8">
                {activeSection === "overview" && (
                    <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {metrics.map((metric) => (
                                <div
                                    key={metric.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <p className="text-sm text-slate-500">{metric.label}</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
                                    <p className="mt-1 text-xs font-semibold text-emerald-600">{metric.change}</p>
                                </div>
                            ))}
                        </section>

                        <section className="grid gap-4 xl:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Enrolment vs Update (placeholder)</p>
                                        <p className="text-xs text-slate-500">Time-series chart slot</p>
                                    </div>
                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Mock</span>
                                </div>
                                <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 text-slate-400">Chart placeholder</div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-900">Regional anomalies</p>
                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Alerting</span>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-700">
                                    <li className="rounded-xl bg-amber-50/80 px-3 py-3 text-amber-800">Biometric retries high in Zone 3 (+12%)</li>
                                    <li className="rounded-xl bg-slate-50 px-3 py-3">Address mismatches rising in Tier-2 cities</li>
                                    <li className="rounded-xl bg-slate-50 px-3 py-3">Mobile enrolment van downtime 6% last week</li>
                                </ul>
                            </div>
                        </section>

                        <section className="grid gap-4 xl:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-sm font-semibold text-slate-900">Key insights</p>
                                <div className="mt-3 space-y-3 text-sm text-slate-700">
                                    {insights.map((item) => (
                                        <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                                            <p className="font-semibold text-slate-900">{item.title}</p>
                                            <p className="text-slate-600">{item.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-900">Action playbook</p>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Suggested</span>
                                </div>
                                <ol className="space-y-2 text-sm text-slate-700">
                                    {actions.map((action, idx) => (
                                        <li key={action} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3">
                                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                                {idx + 1}
                                            </span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>
                    </>
                )}

                {activeSection !== "overview" && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        {body || <p className="text-sm text-slate-600">Section coming soon.</p>}
                    </section>
                )}
            </div>
        </div>
    );
};

export default MainContent;