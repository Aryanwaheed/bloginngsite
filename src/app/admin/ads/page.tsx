import { createClient } from "../../../../supabase/server";
import AdsManager from "./ads-manager";

export default async function AdminAdsPage() {
  const supabase = await createClient();
  const { data: ads } = await supabase.from("ad_placements").select("*").order("slot_name");

  return (
    <div className="p-6 md:p-8">
      <AdsManager initialAds={ads || []} />
    </div>
  );
}
