import { AddUnitForm } from "@/src/components/units/units";
import Dialog from "@/src/components/ui/dialog/dialog";

export default async function Page(props) {
  const params = await props.params;
  
  return (
    <>
      <Dialog>
        <AddUnitForm campaignId={params.id} />
      </Dialog>
    </>
  );
}