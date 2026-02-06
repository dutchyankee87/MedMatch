import { Sidebar } from "@/components/layout/sidebar";

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar type="agency" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
