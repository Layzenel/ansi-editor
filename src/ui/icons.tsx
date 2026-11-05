const svg = (size: number, children: ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/** Text-area button icon: a palette-coloured "A" over a code bracket. */
export const AnsiIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M4 3h3v2H5v14h2v2H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm16 0h-3v2h2v14h-2v2h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z"
    />
    <path
      fill="currentColor"
      d="M11.1 6h1.8l4 11h-2.1l-.9-2.6H10l-.9 2.6H7.1l4-11Zm-.5 6.6h2.8L12 8.6l-1.4 4Z"
    />
  </svg>
);

export const BoldIcon = () =>
  svg(20, <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />);
export const UnderlineIcon = () => svg(20, <path d="M7 4v6a5 5 0 0 0 10 0V4M5 20h14" />);
export const ResetIcon = () => svg(20, <path d="M4 7h11M9 7v12M14 13l6 6M20 13l-6 6" />);
export const TrashIcon = () => svg(20, <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />);
export const UndoIcon = () => svg(20, <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />);
export const RedoIcon = () => svg(20, <path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />);
export const SparkIcon = () =>
  svg(
    20,
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
  );
export const StarIcon = () =>
  svg(20, <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />);
export const FileIcon = () => svg(20, <path d="M6 3h8l4 4v14H6zM14 3v4h4" />);
export const ClipboardIcon = () => svg(20, <path d="M9 4h6v3H9zM9 5H6v16h12V5h-3" />);
export const CloseIcon = () => svg(24, <path d="M6 6l12 12M18 6 6 18" />);
export const ChevronIcon = () => svg(16, <path d="m6 9 6 6 6-6" />);
export const InfoIcon = () =>
  svg(16, <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01" />);
