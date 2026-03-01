import type { ConfigurationContextValue } from "./ConfigurationContext";

export const defaultDarkModeLogo = "./logos/logo_atomic_crm_dark.svg";
export const defaultLightModeLogo = "./logos/logo_atomic_crm_light.svg";

export const defaultTitle = "Atomic CRM";

export const defaultCompanySectors = [
  { value: "communication-services", label: "resources.companies.sectors.communication-services" },
  { value: "consumer-discretionary", label: "resources.companies.sectors.consumer-discretionary" },
  { value: "consumer-staples", label: "resources.companies.sectors.consumer-staples" },
  { value: "energy", label: "resources.companies.sectors.energy" },
  { value: "financials", label: "resources.companies.sectors.financials" },
  { value: "health-care", label: "resources.companies.sectors.health-care" },
  { value: "industrials", label: "resources.companies.sectors.industrials" },
  { value: "information-technology", label: "resources.companies.sectors.information-technology" },
  { value: "materials", label: "resources.companies.sectors.materials" },
  { value: "real-estate", label: "resources.companies.sectors.real-estate" },
  { value: "utilities", label: "resources.companies.sectors.utilities" },
];

export const defaultDealStages = [
  { value: "opportunity", label: "resources.deals.stages.opportunity" },
  { value: "proposal-sent", label: "resources.deals.stages.proposal-sent" },
  { value: "in-negociation", label: "resources.deals.stages.in-negociation" },
  { value: "won", label: "resources.deals.stages.won" },
  { value: "lost", label: "resources.deals.stages.lost" },
  { value: "delayed", label: "resources.deals.stages.delayed" },
];

export const defaultDealPipelineStatuses = ["won"];

export const defaultDealCategories = [
  { value: "other", label: "resources.deals.categories.other" },
  { value: "copywriting", label: "resources.deals.categories.copywriting" },
  { value: "print-project", label: "resources.deals.categories.print-project" },
  { value: "ui-design", label: "resources.deals.categories.ui-design" },
  { value: "website-design", label: "resources.deals.categories.website-design" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "resources.notes.statuses.cold", color: "#7dbde8" },
  { value: "warm", label: "resources.notes.statuses.warm", color: "#e8cb7d" },
  { value: "hot", label: "resources.notes.statuses.hot", color: "#e88b7d" },
  { value: "in-contract", label: "resources.notes.statuses.in-contract", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "resources.tasks.types.none" },
  { value: "email", label: "resources.tasks.types.email" },
  { value: "demo", label: "resources.tasks.types.demo" },
  { value: "lunch", label: "resources.tasks.types.lunch" },
  { value: "meeting", label: "resources.tasks.types.meeting" },
  { value: "follow-up", label: "resources.tasks.types.follow-up" },
  { value: "thank-you", label: "resources.tasks.types.thank-you" },
  { value: "ship", label: "resources.tasks.types.ship" },
  { value: "call", label: "resources.tasks.types.call" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
