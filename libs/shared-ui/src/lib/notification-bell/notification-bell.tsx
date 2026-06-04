type NotificationBellProps = {
  hasUnread?: boolean;
};

export function NotificationBell({
  hasUnread = true,
}: NotificationBellProps) {
  return (
    <button
      type="button"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/60 bg-slate-800/60 text-slate-300 transition hover:bg-slate-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.311 6.022c1.733.64 3.562 1.082 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>

      {hasUnread && (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      )}
    </button>
  );
}
