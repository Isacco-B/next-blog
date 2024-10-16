interface HeaderProps {
  title: string
  label: string;
}

export function Header({ title, label }: HeaderProps) {
  return (
    <>
      <h1 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {title}
      </h1>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-30">
        {label}
      </p>
    </>
  );
}
