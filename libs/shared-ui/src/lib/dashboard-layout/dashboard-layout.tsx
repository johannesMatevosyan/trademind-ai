type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-app-bg">
      <div className="bg-wrapper-bg mx-auto py-8 px-4 flex max-w-6xl flex-col gap-8">
        {children}
      </div>
    </main>
  );
}
