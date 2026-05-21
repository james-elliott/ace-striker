import Dialog from "@/src/components/ui/dialog/dialog";
import { AddPilotForm } from "@/src/components/pilots/pilots";

export default async function Page(props) {
  const params = await props.params;
  
  return (
    <Dialog>
      <AddPilotForm campaignId={params.id} />
    </Dialog>
  );
}