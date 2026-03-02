import { useState, useEffect } from "react";
import { Merge, CircleX, AlertTriangle, ArrowDown } from "lucide-react";
import {
  useDataProvider,
  useRecordContext,
  useGetList,
  useGetManyReference,
  required,
  Form,
  useNotify,
  useRedirect,
  useTranslate,
} from "ra-core";
import type { Identifier } from "ra-core";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Contact } from "../types";
import { contactOptionText } from "../misc/ContactOption";

export const ContactMergeButton = () => {
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const translate = useTranslate();
  return (
    <>
      <Button
        variant="outline"
        className="h-6 cursor-pointer"
        size="sm"
        onClick={() => setMergeDialogOpen(true)}
      >
        <Merge className="w-4 h-4" />
        {translate("crm.action.merge_with_another_contact")}
      </Button>
      <ContactMergeDialog
        open={mergeDialogOpen}
        onClose={() => setMergeDialogOpen(false)}
      />
    </>
  );
};

interface ContactMergeDialogProps {
  open: boolean;
  onClose: () => void;
}

const ContactMergeDialog = ({ open, onClose }: ContactMergeDialogProps) => {
  const loserContact = useRecordContext<Contact>();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const [winnerId, setWinnerId] = useState<Identifier | null>(null);
  const [suggestedWinnerId, setSuggestedWinnerId] = useState<Identifier | null>(
    null,
  );
  const [isMerging, setIsMerging] = useState(false);
  const { mutateAsync } = useMutation({
    mutationKey: ["contacts", "merge", { loserId: loserContact?.id, winnerId }],
    mutationFn: async () => {
      return dataProvider.mergeContacts(loserContact?.id, winnerId);
    },
  });

  // Find potential contacts with matching first and last name
  const { data: matchingContacts } = useGetList(
    "contacts",
    {
      filter: {
        first_name: loserContact?.first_name,
        last_name: loserContact?.last_name,
        "id@neq": `${loserContact?.id}`, // Exclude current contact
      },
      pagination: { page: 1, perPage: 10 },
    },
    { enabled: open && !!loserContact },
  );

  // Get counts of items to be merged
  const canFetchCounts = open && !!loserContact && !!winnerId;
  const { total: tasksCount } = useGetManyReference(
    "tasks",
    {
      target: "contact_id",
      id: loserContact?.id,
      pagination: { page: 1, perPage: 1 },
    },
    { enabled: canFetchCounts },
  );

  const { total: notesCount } = useGetManyReference(
    "contact_notes",
    {
      target: "contact_id",
      id: loserContact?.id,
      pagination: { page: 1, perPage: 1 },
    },
    { enabled: canFetchCounts },
  );

  const { total: dealsCount } = useGetList(
    "deals",
    {
      filter: { "contact_ids@cs": `{${loserContact?.id}}` },
      pagination: { page: 1, perPage: 1 },
    },
    { enabled: canFetchCounts },
  );

  useEffect(() => {
    if (matchingContacts && matchingContacts.length > 0) {
      const suggestedWinnerId = matchingContacts[0].id;
      setSuggestedWinnerId(suggestedWinnerId);
      setWinnerId(suggestedWinnerId);
    }
  }, [matchingContacts]);

  const handleMerge = async () => {
    if (!winnerId || !loserContact) {
      notify("crm.action.select_contact_merge", { type: "warning" });
      return;
    }

    try {
      setIsMerging(true);
      await mutateAsync();
      setIsMerging(false);
      notify("crm.action.merge_success", { type: "success" });
      redirect(`/contacts/${winnerId}/show`);
      onClose();
    } catch (error) {
      setIsMerging(false);
      notify("crm.action.merge_error", { type: "error" });
      console.error("Merge failed:", error);
    }
  };

  if (!loserContact) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="md:min-w-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle>{translate("crm.action.merge_contact")}</DialogTitle>
          <DialogDescription>
            {translate("crm.action.merge_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="font-medium text-sm">
              {translate("crm.action.current_contact_deleted")}
            </p>
            <div className="font-medium text-sm mt-4">{contactOptionText}</div>

            <div className="flex justify-center my-4">
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="font-medium text-sm mb-2">
              {translate("crm.action.target_contact_kept")}
            </p>
            <Form>
              <ReferenceInput
                source="winner_id"
                reference="contacts"
                filter={{ "id@neq": loserContact.id }}
              >
                <AutocompleteInput
                  label=""
                  optionText={contactOptionText}
                  validate={required()}
                  onChange={setWinnerId}
                  defaultValue={suggestedWinnerId}
                  helperText={false}
                />
              </ReferenceInput>
            </Form>
          </div>

          {winnerId && (
            <>
              <div className="space-y-2">
                <p className="font-medium text-sm">{translate("crm.action.what_will_be_merged")}</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  {notesCount != null && notesCount > 0 && (
                    <li>
                      • {translate("crm.action.notes_reassigned", { smart_count: notesCount })}
                    </li>
                  )}
                  {tasksCount != null && tasksCount > 0 && (
                    <li>
                      • {translate("crm.action.tasks_reassigned", { smart_count: tasksCount })}
                    </li>
                  )}
                  {dealsCount != null && dealsCount > 0 && (
                    <li>
                      • {translate("crm.action.deals_updated", { smart_count: dealsCount })}
                    </li>
                  )}
                  {loserContact.email_jsonb?.length > 0 && (
                    <li>
                      • {translate("crm.action.emails_added", { smart_count: loserContact.email_jsonb.length })}
                    </li>
                  )}
                  {loserContact.phone_jsonb?.length > 0 && (
                    <li>
                      • {translate("crm.action.phones_added", { smart_count: loserContact.phone_jsonb.length })}
                    </li>
                  )}
                  {!notesCount &&
                    !tasksCount &&
                    !dealsCount &&
                    !loserContact.email_jsonb?.length &&
                    !loserContact.phone_jsonb?.length && (
                      <li className="text-muted-foreground/60">
                        {translate("crm.action.no_data_to_merge")}
                      </li>
                    )}
                </ul>
              </div>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{translate("crm.action.warning_destructive")}</AlertTitle>
                <AlertDescription>
                  {translate("crm.action.warning_description")}
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isMerging}>
            <CircleX />
            {translate("crm.action.cancel")}
          </Button>
          <Button onClick={handleMerge} disabled={!winnerId || isMerging}>
            <Merge />
            {isMerging ? translate("crm.action.merging") : translate("crm.action.merge_contacts")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
