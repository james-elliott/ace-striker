import { AddOpForToSortieForm } from "@/src/components/sorties/sorties";
import Dialog from "@/src/components/ui/dialog/dialog";

export default async function Page(props) {
  const params = await props.params;

  return (
    <Dialog>
      <AddOpForToSortieForm campaignId={params.id} sortieId={params.sortieId} />
    </Dialog>
  );
}