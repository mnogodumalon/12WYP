import Goals from "../../_components/goals";
import { getData } from "../../actions/goalActions";
import { columns } from "../../tasks/columns";
import { DataTable } from "../../tasks/data-table";
import { getDataTaskAll, getDataTaskForCycle } from "~/app/actions/todoActions";
import { useRouter } from "next/router";
import { cycle } from "~/server/db/schema";
import TaskWeekView from "~/app/_components/TaskWeekView";

export default async function CycleDashboard({
  params: { id: cycleId },
}: {
  params: { id: number };
}) {
  const data = await getData(cycleId);
  const goalIds = data.map((goal) => goal.id);
  const dataTask = await getDataTaskForCycle(goalIds);

  return (
    <div className="flex flex-col items-start p-4 md:flex-row md:p-16">
      <Goals goals={data} cycleId={cycleId} />
      <div className="flex flex-col">
        <div className="w-screen overflow-x-auto md:w-auto">
          <DataTable cycleId={cycleId} columns={columns} data={dataTask} />
        </div>
        <div className="w-screen overflow-x-auto md:w-auto">
          <TaskWeekView dataTask={dataTask} />
        </div>
      </div>
    </div>
  );
}
