import { AddPilotForm } from "@/src/components/Pilots/Pilots";

export default async function Page(props) {
  const params = await props.params;

  return (
    <main className="home">
      <AddPilotForm campaignId={params.id} />
    </main>
  );
}