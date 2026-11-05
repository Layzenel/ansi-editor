/** Uses BetterDiscord's native Tooltip when available, otherwise the title attribute. */
export function Tip({
  text,
  children,
}: {
  text: string;
  children: (props: Record<string, unknown>) => ReactNode;
}) {
  const Native = BdApi.Components?.Tooltip;
  if (Native) return <Native text={text}>{(p) => children(p)}</Native>;
  return <>{children({ title: text })}</>;
}
