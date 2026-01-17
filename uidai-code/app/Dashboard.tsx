"use client";

import React, { useState } from "react";
import Sidebar, { NavItem } from "./Sidebar";
import MainContent from "./MainContent";

const navItems: NavItem[] = [
    { label: "Overview", icon: "📊", badge: "Live", section: "overview" },
    { label: "Trends", icon: "📈", badge: "7d", section: "trends" },
    { label: "Anomalies", icon: "⚠️", badge: "12", section: "anomalies" },
    { label: "Demographics", icon: "👥", section: "demographics" },
    { label: "Regions", icon: "🗺️", section: "regions" },
    { label: "Data Quality", icon: "✅", section: "quality" },
    { label: "Settings", icon: "⚙️", section: "settings" },
];

const Dashboard = () => {
    const [activeSection, setActiveSection] = useState<string>(navItems[0].section);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="flex h-screen max-h-screen overflow-hidden">
                <Sidebar
                    items={navItems}
                    activeSection={activeSection}
                    onSelect={setActiveSection}
                />
                <MainContent activeSection={activeSection} />
            </div>
        </div>
    );
};

export default Dashboard;