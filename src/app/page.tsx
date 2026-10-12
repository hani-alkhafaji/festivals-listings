import { HomeClient } from "@/components/HomeClient";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteConfig, uniqueCities } from "@/lib/festivals";
import { fetchPublishedFestivals } from "@/lib/loadPublished";

export const revalidate = 120;

export default async function HomePage() {
  const site = getSiteConfig();
  const festivals = await fetchPublishedFestivals();
  const cities = uniqueCities(festivals);

  return (
    <>
      <SiteHeader cityOptions={cities} />
      <HomeClient festivals={festivals} headline={site.headline} />
    </>
  );
}
