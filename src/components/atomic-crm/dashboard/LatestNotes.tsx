import { formatDistance } from "date-fns";
import * as dateFnsLocales from "date-fns/locale";
import { FileText } from "lucide-react";
import { useGetIdentity, useGetList, useTranslate, useLocaleState } from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent } from "@/components/ui/card";

import type { Contact, ContactNote } from "../types";

const getDateFnsLocale = (locale: string) => {
  if (locale === "zh") return dateFnsLocales.zhCN;
  return dateFnsLocales.enUS;
};

export const LatestNotes = () => {
  const { identity } = useGetIdentity();
  const translate = useTranslate();
  const [locale] = useLocaleState();
  const { data: contactNotesData, isPending: contactNotesLoading } = useGetList(
    "contact_notes",
    {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "date", order: "DESC" },
      filter: { sales_id: identity?.id },
    },
    { enabled: Number.isInteger(identity?.id) },
  );
  const { data: dealNotesData, isPending: dealNotesLoading } = useGetList(
    "deal_notes",
    {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "date", order: "DESC" },
      filter: { sales_id: identity?.id },
    },
    { enabled: Number.isInteger(identity?.id) },
  );
  if (contactNotesLoading || dealNotesLoading) {
    return null;
  }
  // TypeScript guards
  if (!contactNotesData || !dealNotesData) {
    return null;
  }

  const allNotes = ([] as any[])
    .concat(
      contactNotesData.map((note) => ({
        ...note,
        type: "contactNote",
      })),
      dealNotesData.map((note) => ({ ...note, type: "dealNote" })),
    )
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="ml-8 mr-8 flex">
          <FileText className="text-muted-foreground w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {translate("crm.dashboard.my_latest_notes")}
        </h2>
      </div>
      <Card>
        <CardContent>
          {allNotes.map((note) => (
            <div
              id={`${note.type}_${note.id}`}
              key={`${note.type}_${note.id}`}
              className="mb-8"
            >
              <div className="text-sm text-muted-foreground">
                {translate("crm.activity.on")}{" "}
                {note.type === "dealNote" ? (
                  <Deal note={note} />
                ) : (
                  <Contact note={note} />
                )}
                , {translate("crm.activity.added")}{" "}
                {formatDistance(note.date, new Date(), {
                  addSuffix: true,
                  locale: getDateFnsLocale(locale),
                })}
              </div>
              <div>
                <p className="text-sm line-clamp-3 overflow-hidden">
                  {note.text}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const Deal = ({ note }: any) => {
  const translate = useTranslate();
  return (
    <>
      {translate("resources.deals.name", { smart_count: 1 })}{" "}
      <ReferenceField
        record={note}
        source="deal_id"
        reference="deals"
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>
    </>
  );
};

const Contact = ({ note }: any) => {
  const translate = useTranslate();
  return (
    <>
      {translate("resources.contacts.name", { smart_count: 1 })}{" "}
      <ReferenceField<ContactNote, Contact>
        record={note}
        source="contact_id"
        reference="contacts"
        link="show"
      />
    </>
  );
};
