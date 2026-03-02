import {
  useCreate,
  useGetIdentity,
  useNotify,
  useTranslate,
} from "ra-core";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import type { InputProps } from "ra-core";
import { useIsMobile } from "@/hooks/use-mobile";

export const AutocompleteCompanyInput = (props: Omit<InputProps, "source">) => {
  const [create] = useCreate();
  const { identity } = useGetIdentity();
  const notify = useNotify();
  const translate = useTranslate();
  const handleCreateCompany = async (name?: string) => {
    if (!name) return;
    try {
      const newCompany = await create(
        "companies",
        {
          data: {
            name,
            sales_id: identity?.id,
            created_at: new Date().toISOString(),
          },
        },
        { returnPromise: true },
      );
      return newCompany;
    } catch {
      notify(translate("crm.companies.create_error"), {
        type: "error",
      });
    }
  };
  const isMobile = useIsMobile();

  return (
    <AutocompleteInput
      optionText="name"
      helperText={false}
      onCreate={handleCreateCompany}
      createItemLabel={translate("crm.companies.create_item", {
        item: "%{item}",
      })}
      createLabel={translate("crm.companies.start_typing")}
      {...props}
    />
  );
};
