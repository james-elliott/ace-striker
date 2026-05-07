import { AddPilotForm } from "@/src/components/pilots/pilots";

export default async function Page(props) {
  const params = await props.params;

  return (
    <main>
      <AddPilotForm campaignId={params.id} />
    </main>
  );
}