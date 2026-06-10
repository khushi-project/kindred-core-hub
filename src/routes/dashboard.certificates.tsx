import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Award, Download } from "lucide-react";
import { downloadCertificate } from "@/lib/certificate";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/dashboard/certificates")({ component: CertsPage });

function CertsPage() {
  const { user, profile } = useAuth();
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from("certificates")
        .select("id, certificate_code, hours, issued_at, event_id, events(title, event_date)")
        .eq("volunteer_id", user.id)
        .order("issued_at", { ascending: false });
      setCerts(data ?? []);
    })();
  }, [user?.id]);

  function download(c: any) {
    downloadCertificate({
      volunteerName: profile?.full_name || user?.email || "Volunteer",
      eventTitle: c.events?.title ?? "Volunteer Event",
      eventDate: c.events?.event_date ?? c.issued_at,
      hours: Number(c.hours || 0),
      certificateCode: c.certificate_code,
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Certificates are issued automatically when an event is marked completed and your attendance is "present".</p>
      {certs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">No certificates yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {certs.map((c) => (
            <div key={c.id} className="rounded-xl border border-border/60 bg-card-gradient p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient shadow-glow"><Award className="h-5 w-5 text-primary-foreground" /></div>
                <div className="flex-1">
                  <div className="font-display text-base font-semibold">{c.events?.title ?? "Volunteer Event"}</div>
                  <div className="text-xs text-muted-foreground">{c.hours} hours • Issued {formatDate(c.issued_at)}</div>
                  <div className="mt-1 text-[10px] text-muted-foreground">ID {c.certificate_code}</div>
                </div>
              </div>
              <Button onClick={() => download(c)} size="sm" className="mt-4 w-full bg-brand-gradient shadow-glow"><Download className="mr-1 h-3.5 w-3.5" /> Download PDF</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}