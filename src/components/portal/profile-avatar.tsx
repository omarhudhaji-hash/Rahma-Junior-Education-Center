import * as React from "react";
import { UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ProfileAvatar({ path, name, size = "md" }: { path?: string | null; name: string; size?: "sm" | "md" | "lg" }) {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    if (!path) { setUrl(null); return; }
    supabase.storage.from("profile-photos").createSignedUrl(path, 3600).then(({ data }) => {
      if (!cancelled) setUrl(data?.signedUrl ?? null);
    });
    return () => { cancelled = true; };
  }, [path]);
  const cls = size === "lg" ? "size-20" : size === "sm" ? "size-8" : "size-10";
  return <div className={`grid ${cls} shrink-0 place-items-center overflow-hidden rounded-full border bg-muted`}>
    {url ? <img src={url} alt={`${name} profile`} className="size-full object-cover" /> : <UserRound className="size-1/2 text-muted-foreground" />}
  </div>;
}
