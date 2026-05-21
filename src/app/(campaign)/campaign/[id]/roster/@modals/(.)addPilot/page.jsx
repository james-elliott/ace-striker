import { AddPilotForm } from "@/src/components/pilots/pilots";
import Dialog from "@/src/components/ui/dialog/dialog";

export default async function Page(props) {
  const params = await props.params;
  
  return (
    <>
      <Dialog>
        <AddPilotForm campaignId={params.id} />
      </Dialog>
    </>
  );
}