import { Mars, NonBinary, Venus } from "lucide-react";

import type { ContactGender } from "../types";

export const contactGender = [
  { value: "male", label: "resources.contacts.gender.male", icon: Mars },
  { value: "female", label: "resources.contacts.gender.female", icon: Venus },
  { value: "nonbinary", label: "resources.contacts.gender.nonbinary", icon: NonBinary },
];
