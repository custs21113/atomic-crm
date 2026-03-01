import { useRecordContext, useTranslate, WithRecord } from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { DateField } from "@/components/admin/date-field";
import { SaleName } from "../sales/SaleName";
import type { Contact } from "../types";

export const ContactBackgroundInfo = () => {
  const record = useRecordContext<Contact>();
  const translate = useTranslate();

  if (!record) return null;

  return (
    <div>
      <WithRecord<Contact>
        render={(record) =>
          record?.background ? (
            <div className="pb-2 text-sm">
              <TextField source="background" record={record} />
            </div>
          ) : null
        }
      />
      <div className="text-muted-foreground md:py-0.5">
        <span className="text-sm">{translate("crm.contacts.added_on")}</span>{" "}
        <DateField
          source="first_seen"
          options={{ year: "numeric", month: "long", day: "numeric" }}
          className="text-sm"
        />
      </div>

      <div className="text-muted-foreground md:py-0.5">
        <span className="text-sm">
          {translate("crm.contacts.last_activity_on")}
        </span>{" "}
        <DateField
          source="last_seen"
          options={{ year: "numeric", month: "long", day: "numeric" }}
          className="text-sm"
        />
      </div>

      <div className="inline-flex text-muted-foreground text-sm md:py-0.5">
        {translate("crm.contacts.followed_by")}&nbsp;
        <ReferenceField source="sales_id" reference="sales">
          <SaleName />
        </ReferenceField>
      </div>
    </div>
  );
};
