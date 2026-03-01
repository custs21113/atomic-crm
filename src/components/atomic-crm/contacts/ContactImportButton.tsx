import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Form, useRefresh, useTranslate } from "ra-core";
import { Link } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormToolbar } from "@/components/admin/simple-form";
import { FileInput } from "@/components/admin/file-input";
import { FileField } from "@/components/admin/file-field";

import { usePapaParse } from "../misc/usePapaParse";
import type { ContactImportSchema } from "./useContactImport";
import { useContactImport } from "./useContactImport";
import * as sampleCsv from "./contacts_export.csv?raw";

export const ContactImportButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const translate = useTranslate();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpenModal}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Upload /> {translate("crm.import_modal.btn_import_csv")}
      </Button>
      <ContactImportDialog open={modalOpen} onClose={handleCloseModal} />
    </>
  );
};

const SAMPLE_URL = `data:text/csv;name=crm_contacts_sample.csv;charset=utf-8,${encodeURIComponent(
  sampleCsv.default,
)}`;

type ContactImportModalProps = {
  open: boolean;
  onClose(): void;
};

export function ContactImportDialog({
  open,
  onClose,
}: ContactImportModalProps) {
  const refresh = useRefresh();
  const translate = useTranslate();
  const processBatch = useContactImport();
  const { importer, parseCsv, reset } = usePapaParse<ContactImportSchema>({
    batchSize: 10,
    processBatch,
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (importer.state === "complete") {
      refresh();
    }
  }, [importer.state, refresh]);

  const handleFileChange = (file: File | null) => {
    setFile(file);
  };

  const startImport = () => {
    if (!file) return;
    parseCsv(file);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <Form className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{translate("crm.import_modal.title")}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-2">
            {importer.state === "running" && (
              <div className="flex flex-col gap-2">
                <Alert>
                  <AlertDescription className="flex flex-row gap-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {translate("crm.import_modal.running_message")}
                  </AlertDescription>
                </Alert>

                <div className="text-sm">
                  {translate("crm.import_modal.imported_stats", {
                    current: importer.importCount,
                    total: importer.rowCount,
                    errors: importer.errorCount,
                  })}
                  {importer.remainingTime !== null && (
                    <>
                      {" "}
                      {translate("crm.import_modal.estimated_time", {
                        time: millisecondsToTime(importer.remainingTime),
                      })}{" "}
                      <button
                        onClick={handleReset}
                        className="text-red-600 underline hover:text-red-800"
                      >
                        {translate("crm.import_modal.stop_import")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {importer.state === "error" && (
              <Alert variant="destructive">
                <AlertDescription>
                  {translate("crm.import_modal.error_message")}
                </AlertDescription>
              </Alert>
            )}

            {importer.state === "complete" && (
              <Alert>
                <AlertDescription>
                  {translate("crm.import_modal.complete_message", {
                    imported: importer.importCount,
                    errors: importer.errorCount,
                  })}
                </AlertDescription>
              </Alert>
            )}

            {importer.state === "idle" && (
              <>
                <Alert>
                  <AlertDescription className="flex flex-col gap-4">
                    {translate("crm.import_modal.idle_message")}
                    <Button asChild variant="outline" size="sm">
                      <Link
                        to={SAMPLE_URL}
                        download={"crm_contacts_sample.csv"}
                      >
                        {translate("crm.import_modal.download_sample")}
                      </Link>
                    </Button>{" "}
                  </AlertDescription>
                </Alert>

                <FileInput
                  source="csv"
                  label={translate("crm.import_modal.csv_file")}
                  accept={{ "text/csv": [".csv"] }}
                  onChange={handleFileChange}
                >
                  <FileField source="src" title="title" target="_blank" />
                </FileInput>
              </>
            )}
          </div>
        </Form>

        <div className="flex justify-start pt-6">
          <FormToolbar>
            {importer.state === "idle" ? (
              <Button onClick={startImport} disabled={!file}>
                {translate("crm.import_modal.btn_import")}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={importer.state === "running"}
              >
                {translate("crm.import_modal.btn_close")}
              </Button>
            )}
          </FormToolbar>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function millisecondsToTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (60 * 1000)) % 60);

  return `${minutes}m ${seconds}s`;
}
