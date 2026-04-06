import packageJson from "../../package.json";

export function AppVersion({ className }: { className?: string }) {
  return (
    <span className={className ?? "text-[10px] text-muted-foreground/50"}>
      v{packageJson.version}
    </span>
  );
}
