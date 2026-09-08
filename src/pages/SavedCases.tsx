import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, RotateCcw } from "lucide-react";
import AsiaNavbar from "@/components/AsiaNavbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { useAsia } from "@/lib/asia-i18n";
import { useSavedCases } from "@/lib/saved-cases";
import { getSavedCasesCopy } from "@/lib/saved-cases-copy";
import { savedPublishedIds, useSavedCaseCatalog } from "@/lib/saved-case-catalog";

const SavedCases = () => {
  const { lang } = useAsia();
  const copy = getSavedCasesCopy(lang);
  const { ids, error, scope, signedIn, retry, setCaseSaved } = useSavedCases();
  const catalog = useSavedCaseCatalog(ids, lang);
  const [removed, setRemoved] = useState<{ id: string; title: string; scope: string | null } | null>(null);
  useEffect(() => { setRemoved(null); }, [scope]);
  const pendingIds = new Set(savedPublishedIds(ids));
  const storageMessage = error === "corrupt" ? copy.corruptError : copy.storageError;

  return <>
    <PageMeta title={copy.title} description={copy.localOnly} path="/saved" robots="noindex, nofollow" />
    <AsiaNavbar />
    <main className="container min-h-[60vh] py-8 md:py-12">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-medium leading-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-3 max-w-[65ch] text-body text-foreground">{copy.localOnly}</p>
        <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">{signedIn ? copy.account : copy.guest}</p>
        <Link to="/cases" className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-brand underline underline-offset-4">{copy.browse}<ArrowRight className="size-4" aria-hidden="true" /></Link>

        {error && <div role="alert" className="mt-6 rounded-xl border border-border bg-muted p-4 text-foreground">
          <p>{storageMessage}</p><Button variant="outline" className="mt-3" onClick={retry}>{copy.retry}</Button>
        </div>}
        {catalog.error && <div role="alert" className="mt-6 rounded-xl border border-border bg-muted p-4 text-foreground">
          <p>{copy.loadError}</p><Button variant="outline" className="mt-3" onClick={catalog.retry}>{copy.retry}</Button>
        </div>}
        {catalog.loading && <p role="status" className="mt-6 text-sm text-foreground">{copy.loading}</p>}
        {removed && removed.scope === scope && <div role="status" className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-accent p-4 text-foreground">
          <p className="min-w-0 break-words">{copy.removed}: {removed.title}</p>
          <Button variant="outline" onClick={() => { if (setCaseSaved(removed.id, true)) setRemoved(null); }}><RotateCcw className="mr-2 size-4" aria-hidden="true" />{copy.undo}</Button>
        </div>}

        {!error && ids.length === 0 && <section className="mt-8 border-t border-border py-8">
          <Heart className="size-7 text-foreground" aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl">{copy.empty}</h2><p className="mt-2 text-body text-muted-foreground">{copy.emptyHelp}</p>
        </section>}
        {ids.length > 0 && <ul className="mt-6 divide-y divide-border border-y border-border">
          {catalog.entries.map((entry) => {
            const unresolved = entry.kind === "unavailable" && pendingIds.has(entry.id) && (catalog.loading || catalog.error);
            const title = entry.title || (unresolved ? (catalog.loading ? copy.loading : copy.loadError) : copy.unavailable);
            return <li key={entry.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                {entry.kind !== "unavailable" && <p className="text-label font-semibold text-muted-foreground">{entry.kind === "demo" ? copy.demo : copy.published}</p>}
                <h2 className="mt-1 break-words font-display text-xl font-semibold">{title}</h2>
                {entry.city && <p className="mt-1 text-sm text-foreground">{entry.city}</p>}
                {entry.caption && <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">{entry.caption}</p>}
                {entry.kind === "unavailable" ? <>
                  {!unresolved && <p className="mt-2 text-sm text-muted-foreground">{copy.unavailableHelp}</p>}
                  <code className="mt-2 block break-all text-xs text-muted-foreground">{entry.id}</code>
                </> : <Link to={`/cases/${encodeURIComponent(entry.id)}`} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4" aria-label={`${copy.view}: ${title}`}>{copy.view}<ArrowRight className="size-4" aria-hidden="true" /></Link>}
              </div>
              <Button variant="outline" className="min-h-11 w-fit max-w-full shrink-0 whitespace-normal text-foreground" aria-label={`${copy.remove}: ${entry.title || entry.id}`} onClick={() => {
                if (setCaseSaved(entry.id, false)) setRemoved({ id: entry.id, title: entry.title || entry.id, scope });
              }}>{copy.remove}</Button>
            </li>;
          })}
        </ul>}
      </div>
    </main>
    <Footer />
  </>;
};
export default SavedCases;
