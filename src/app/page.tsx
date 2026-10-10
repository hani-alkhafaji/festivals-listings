import { HomeClient } from "@/components/HomeClient";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocalFestivals, getSiteConfig, uniqueCities } from "@/lib/festivals";

async function loadFestivals() {
  const gasUrl = process.env.GAS_WEB_APP_URL;
  if (gasUrl) {
    try {
      const url = new URL(gasUrl);
      url.searchParams.set("action", "festivals");
      const res = await fetch(url.toString(), { next: { revalidate: 120 } });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.festivals)) {
          return data.festivals;
        }
      }
    } catch {
      /* fallback */
    }
  }
  return getLocalFestivals();
}

export default async function HomePage() {
  const site = getSiteConfig();
  const festivals = await loadFestivals();
  const cities = uniqueCities(festivals);

  return (
    <>
      <SiteHeader cityOptions={cities} />
      <HomeClient festivals={festivals} headline={site.headline} />
    </>
  );
}
