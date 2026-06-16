type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-app-bg">
      <div className="mx-auto py-8 flex max-w-4xl flex-col gap-8">
        {children}
      </div>
    </main>
  );
}
