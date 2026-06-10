type UserAvatarProps = {
  initials: string;
};

export function UserAvatar({
  initials,
}: UserAvatarProps) {
  return (
    <button
      type="button"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-800/60 bg-slate-800/60 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      {initials}
    </button>
  );
}
