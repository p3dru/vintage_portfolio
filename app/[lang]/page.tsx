import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import Home from "./home";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <Home lang={lang} dict={getDictionary(lang)} />;
}
