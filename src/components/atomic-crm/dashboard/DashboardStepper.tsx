import {
  useGetList,
  useTranslate,
} from "ra-core";
import { Link } from "react-router";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import type { Contact, ContactNote } from "../types";

export const DashboardStepper = () => {
  const translate = useTranslate();
  const { total: contactsTotal, isPending: contactsLoading } =
    useGetList<Contact>("contacts", {
      pagination: { page: 1, perPage: 1 },
    });
  const { total: notesTotal, isPending: notesLoading } = useGetList<ContactNote>(
    "contact_notes",
    {
      pagination: { page: 1, perPage: 1 },
    },
  );

  const pending = contactsLoading || notesLoading;

  if (pending) return null;

  const steps = [
    {
      label: translate("crm.dashboard.install_app"),
      value: true,
    },
    {
      label: translate("crm.empty.add_first_contact"),
      value: (contactsTotal ?? 0) > 0,
    },
    {
      label: translate("crm.dashboard.add_first_note"),
      value: (notesTotal ?? 0) > 0,
    },
  ];

  const currentStep = steps.findIndex((step) => !step.value);
  const isComplete = currentStep === -1;
  const progress = isComplete
    ? 100
    : Math.round((currentStep / steps.length) * 100);

  if (isComplete) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {translate("crm.dashboard.whats_next")}
          <span className="text-sm font-normal text-muted-foreground">
            {currentStep}/{steps.length} {translate("crm.dashboard.done")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-6 h-2" />
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                  step.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground",
                )}
              >
                {step.value ? <Check className="h-3 w-3" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  step.value ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="mt-6 ml-9">
            <Button asChild>
              <Link to="/contacts/create">
                {translate("crm.empty.new_contact")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="mt-6 ml-9 space-y-2">
            <p className="text-sm text-muted-foreground">
              {translate("crm.dashboard.add_note_instruction")}
            </p>
            <Button asChild>
              <Link to="/contacts">
                {translate("crm.filter.add_note")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
