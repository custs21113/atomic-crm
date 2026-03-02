import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "ra-core";

export const Welcome = () => {
  const translate = useTranslate();
  return (
    <Card className="bg-gradient-to-l from-indigo-100 to-white dark:from-indigo-900 dark:to-background border-l-4 border-l-primary mt-2">
      <CardHeader>
        <CardTitle>
          {translate("crm.welcome.title")}{" "}
          <span className="font-normal text-muted-foreground">
            {translate("crm.welcome.subtitle")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground max-w-4xl">
          {translate("crm.welcome.demo_message")}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          {translate("crm.welcome.powered_by")}{" "}
          <a
            href="https://marmelab.com/react-admin"
            target="_blank"
            className="text-primary hover:underline"
          >
            react-admin
          </a>
          {translate("crm.welcome.open_source")}{" "}
          <a
            href="https://github.com/marmelab/atomic-crm"
            target="_blank"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
};
