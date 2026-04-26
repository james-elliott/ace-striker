import { AddPilotForm } from "@/src/components/Pilots/Pilots";

export default async function Page(props) {
  const params = await props.params;
  
  return (
    <dialog open={true}>
      <AddPilotForm campaignId={params.id} />
    </dialog>
  );
}