import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslate } from "ra-core";

import { Status } from "../misc/Status";
import { useConfigurationContext } from "../root/ConfigurationContext";

export const StatusSelector = ({ status, setStatus }: any) => {
  const { noteStatuses } = useConfigurationContext();
  const translate = useTranslate();

  const currentStatus = noteStatuses.find((s) => s.value === status);

  return (
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-32">
        <SelectValue>
          {currentStatus && (
            <div className="flex items-center gap-2">
              <Status status={currentStatus.value} />{" "}
              {translate(currentStatus.label)}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {noteStatuses.map((statusOption) => (
          <SelectItem key={statusOption.value} value={statusOption.value}>
            <div className="flex items-center gap-2">
              <Status status={statusOption.value} />{" "}
              {translate(statusOption.label)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
