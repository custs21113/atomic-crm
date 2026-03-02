import {
  type Identifier,
  useGetList,
  useTranslate,
  useUpdate,
  useLocaleState,
} from "ra-core";
import { format, isAfter, isBefore, isToday, isTomorrow, startOfToday, addDays } from "date-fns";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as dateFnsLocales from "date-fns/locale";

import { TaskCreateSheet } from "../tasks/TaskCreateSheet";
import { TaskEditSheet } from "../tasks/TaskEditSheet";
import type { Task } from "../types";

const getDateFnsLocale = (locale: string) => {
  if (locale === "zh") return dateFnsLocales.zhCN;
  return dateFnsLocales.enUS;
};

export const ContactTasksList = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<Identifier | null>(null);
  const translate = useTranslate();
  const [locale] = useLocaleState();

  const { data: tasks, isPending, refetch } = useGetList<Task>("tasks", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "due_date", order: "ASC" },
    filter: { done_date: null },
  });

  if (isPending) return null;

  const groupedTasks = (tasks || []).reduce(
    (acc, task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : null;
      const today = startOfToday();

      if (!dueDate) {
        acc.later.push(task);
      } else if (isBefore(dueDate, today)) {
        acc.overdue.push(task);
      } else if (isToday(dueDate)) {
        acc.today.push(task);
      } else if (isTomorrow(dueDate)) {
        acc.tomorrow.push(task);
      } else if (isBefore(dueDate, addDays(today, 7))) {
        acc.thisWeek.push(task);
      } else {
        acc.later.push(task);
      }
      return acc;
    },
    {
      overdue: [] as Task[],
      today: [] as Task[],
      tomorrow: [] as Task[],
      thisWeek: [] as Task[],
      later: [] as Task[],
      locale,
    },
  );

  return (
    <>
      <TaskCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
      {editTaskId && (
        <TaskEditSheet
          open={!!editTaskId}
          onOpenChange={(open) => !open && setEditTaskId(null)}
          taskId={editTaskId}
        />
      )}

      <div className="space-y-6">
        {tasks && tasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{translate("crm.empty.no_tasks")}</p>
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              {translate("crm.empty.add_task")}
            </Button>
          </div>
        )}

        <TaskGroup
          title={translate("crm.time.overdue")}
          tasks={groupedTasks.overdue}
          onEdit={setEditTaskId}
          variant="destructive"
          locale={locale}
        />
        <TaskGroup
          title={translate("crm.time.today")}
          tasks={groupedTasks.today}
          onEdit={setEditTaskId}
          locale={locale}
        />
        <TaskGroup
          title={translate("crm.time.tomorrow")}
          tasks={groupedTasks.tomorrow}
          onEdit={setEditTaskId}
          locale={locale}
        />
        <TaskGroup
          title={translate("crm.time.this_week")}
          tasks={groupedTasks.thisWeek}
          onEdit={setEditTaskId}
          locale={locale}
        />
        <TaskGroup
          title={translate("crm.time.later")}
          tasks={groupedTasks.later}
          onEdit={setEditTaskId}
          locale={locale}
        />
      </div>
    </>
  );
};

const TaskGroup = ({
  title,
  tasks,
  onEdit,
  variant = "default",
  locale,
}: {
  title: string;
  tasks: Task[];
  onEdit: (id: Identifier) => void;
  variant?: "default" | "destructive";
  locale: string;
}) => {
  const [update] = useUpdate();

  if (tasks.length === 0) return null;

  const handleToggle = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    update("tasks", {
      id: task.id,
      data: { done_date: new Date().toISOString() },
      previousData: task,
    });
  };

  return (
    <div>
      <h4
        className={cn(
          "text-sm font-medium mb-2",
          variant === "destructive" ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {title}
      </h4>
      <div className="space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onEdit(task.id)}
            className="group flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
          >
            <button
              onClick={(e) => handleToggle(e, task)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Circle className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium block truncate">
                {task.text}
              </span>
              {task.due_date && (
                <span
                  className={cn(
                    "text-xs flex items-center gap-1",
                    variant === "destructive"
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.due_date), "MMM d", { locale: getDateFnsLocale(locale) })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
