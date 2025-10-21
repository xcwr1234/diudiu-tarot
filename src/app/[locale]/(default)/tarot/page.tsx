import TarotModeSelector from "@/components/blocks/tarot-mode-selector";
import { getTranslations } from "next-intl/server";

export default async function TarotPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return <TarotModeSelector />;
} 