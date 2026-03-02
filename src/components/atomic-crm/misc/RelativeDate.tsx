import { differenceInDays, formatRelative } from "date-fns";
import { useTranslate } from "ra-core";
import { zhCN, enUS } from "date-fns/locale";

export function RelativeDate({ date }: { date: string }) {
  const translate = useTranslate();
  const locale = translate("ra.action.close") === "关闭" ? zhCN : enUS;

  const dateObj = new Date(date);
  const now = new Date();

  if (differenceInDays(now, dateObj) > 6) {
    return dateObj.toLocaleDateString(locale === zhCN ? "zh-CN" : "en-US");
  }

  return formatRelative(dateObj, now, { locale });
}
