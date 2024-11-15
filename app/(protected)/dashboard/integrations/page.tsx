import DiscordDialog from "./_components/discord-dialog";
import { getDiscordId } from "@/actions/profile/discord";
import { redirect } from "next/navigation";
import SecretGeneratorDialog from "./_components/secret-generator-dialog";

async function IntegrationsPage() {
  const data = await getDiscordId();

  if (data.error) {
    return redirect("/");
  }

  return (
    <div className="mt-4 space-y-8">
      <div className="border-b">
        <div className="flex w-full items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Integrate with Discord
          </h2>
          <DiscordDialog discordId={data.discordId} />
        </div>
        <p className="text-muted-foreground mb-6">
          Connect your Discord account to receive notifications and updates
          about your projects directly in your Discord server. Stay updated with
          project activities and collaborate more effectively with your team.
        </p>
      </div>
      <div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            API Integration
          </h2>
          <p className="text-muted-foreground mb-6">
            Access your project reviews programmatically through our REST API.
            Here&apos;s what you need:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Project ID</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You can find your project ID in the URL when viewing a project:{" "}
                <br />
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  /dashboard/project/
                  <span className="text-primary">your-project-id</span>/settings
                </code>
              </p>
            </div>
            <div className="flex w-full items-center justify-between">
              <h3 className="font-medium mb-2">API Secret Key</h3>
              <SecretGeneratorDialog apiKey={data.apiKey} />
            </div>
            <div>
              <h3 className="font-medium mb-2">Example API Request</h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                {`// Get reviews
fetch('${process.env.NEXT_PUBLIC_APP_URL}/api/projects/{projectId}/reviews?page=1&limit=10', {
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  }
})`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntegrationsPage;
