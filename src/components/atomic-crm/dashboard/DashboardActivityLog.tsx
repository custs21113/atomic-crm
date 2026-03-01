import { useGetList, useTranslate } from "ra-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLogIterator } from "../activity/ActivityLogIterator";
import type { Activity } from "../types";

export const DashboardActivityLog = () => {
  const translate = useTranslate();
  const { data, isPending, error } = useGetList<Activity>("activity", {
    pagination: { page: 1, perPage: 10 },
    sort: { field: "date", order: "DESC" },
  });

  if (isPending || error) return null;

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{translate("crm.dashboard.latest_activity")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ActivityLogIterator activities={data} />
      </CardContent>
    </Card>
  );
};
