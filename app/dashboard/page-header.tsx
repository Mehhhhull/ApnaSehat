import type { ReactNode } from "react";

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f7a62]">
          {kicker}
        </div>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.045em] text-[#163c34] sm:text-[40px]">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-6 text-[#6f837c]">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function DashboardMain({ children }: { children: ReactNode }) {
  return <div className="px-5 py-8 lg:px-10 lg:py-10">{children}</div>;
}
