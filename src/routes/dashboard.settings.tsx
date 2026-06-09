import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Manage your profile, organization, and platform preferences.</p>
      <Tabs defaultValue="profile">
        <TabsList className="bg-card">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card title="Profile" desc="Update your personal information.">
            <div className="flex items-center gap-4">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="" className="h-16 w-16 rounded-full bg-muted" />
              <Button variant="outline" className="border-border/60">Change photo</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" defaultValue="Admin User" />
              <Field label="Email" defaultValue="admin@volunc.org" />
              <Field label="Phone" defaultValue="+1 555-0100" />
              <Field label="Role" defaultValue="Administrator" />
            </div>
            <SaveRow />
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="mt-6">
          <Card title="Organization" desc="Settings for your NGO or organization workspace.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Organization name" defaultValue="Volunc Foundation" />
              <Field label="Tax ID" defaultValue="12-3456789" />
              <Field label="Website" defaultValue="https://volunc.org" />
              <Field label="Founded" defaultValue="2019" />
            </div>
            <div className="space-y-2">
              <Label>Mission statement</Label>
              <Textarea rows={3} defaultValue="To empower communities by connecting people who care with causes that matter." />
            </div>
            <SaveRow />
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-6">
          <Card title="Appearance" desc="Customize the look of your workspace.">
            <Toggle label="Dark navy theme" desc="Premium enterprise dark mode (default)" defaultChecked />
            <Toggle label="Compact density" desc="Reduce spacing in tables and lists" />
            <Toggle label="Reduced motion" desc="Disable subtle animations" />
            <SaveRow />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card-gradient p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 p-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function SaveRow() {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button variant="outline" className="border-border/60">Cancel</Button>
      <Button className="bg-brand-gradient shadow-glow hover:opacity-90">Save changes</Button>
    </div>
  );
}