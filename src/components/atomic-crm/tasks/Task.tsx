import {
  useTranslate,
  useUpdate,
  useNotify,
  useRefresh,
  useRecordContext,
} from "ra-core";
import { format, isAfter } from "date-fns";
import { Trash2, MoreVertical, Edit } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar as ContactAvatar } from "../contacts/Avatar";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Task as TaskType } from "../types";
import { TaskEditSheet } from "./TaskEditSheet";

export const Task = ({
  task,
  showContact = false,
}: {
  task: TaskType;
  showContact?: boolean;
}) => {
  const translate = useTranslate();
  const [update] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();
  const { taskTypes } = useConfigurationContext();
  const [editOpen, setEditOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    update(
      "tasks",
      {
        id: task.id,
        data: { done_date: checked ? new Date().toISOString() : null },
        previousData: task,
      },
      {
        onSuccess: () => {
          notify("ra.notification.updated", {
            type: "info",
            messageArgs: { smart_count: 1 },
          });
          refresh();
        },
      },
    );
  };

  const handleDelete = () => {
    update(
      "tasks",
      {
        id: task.id,
        data: { deleted_at: new Date().toISOString() },
        previousData: task,
      },
      {
        onSuccess: () => {
          notify("crm.tasks.deleted");
          refresh();
        },
      },
    );
  };

  const isOverdue =
    task.due_date && isAfter(new Date(), new Date(task.due_date)) && !task.done_date;

  return (
    <>
      <div className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm group">
        <Checkbox
          checked={!!task.done_date}
          onCheckedChange={handleToggle}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {translate(taskTypes.find((t) => t.value === task.type)?.label ?? task.type)}
            </span>
            {task.due_date && (
              <span
                className={`text-xs ${
                  isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
                }`}
              >
                {translate("crm.tasks.due_at")} {format(new Date(task.due_date), "MMM d")}
              </span>
            )}
          </div>
          <p
            className={`text-sm ${
              task.done_date ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.text}
          </p>
          {showContact && task.contact && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="opacity-70">{translate("crm.tasks.regarding")}</span>
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <ContactAvatar
                  record={task.contact}
                  width={16}
                  height={16}
                  className="text-[8px]"
                />
                {task.contact.first_name} {task.contact.last_name}
              </div>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">
                {translate("crm.action.show_options")}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              {translate("ra.action.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {translate("ra.action.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TaskEditSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        taskId={task.id}
      />
    </>
  );
};
