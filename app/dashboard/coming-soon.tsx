import { PageHeader, DashboardMain } from "./page-header";

function ComingSoon({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <DashboardMain>
      <PageHeader kicker={kicker} title={title} description={description} />
      <div className="rounded-2xl border border-[#dce9e4] bg-white px-6 py-16 text-center">
        <p className="text-sm text-[#6f837c]">
          This section is connected to the sidebar. Content comes next.
        </p>
      </div>
    </DashboardMain>
  );
}

export default ComingSoon;
