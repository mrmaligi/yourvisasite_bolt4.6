import { TrackerWizard } from '../../components/tracker/TrackerWizard';
import type { TrackerEntry } from '../../types/database';

interface Props {
  onSuccess: () => void;
  preselectedVisaId?: string;
  initialEntry?: TrackerEntry;
}

export function TrackerSubmitForm(props: Props) {
  // TrackerWizard handles the logic now.
  // preselectedVisaId is not currently used by TrackerWizard but could be passed if needed.
  return <TrackerWizard onSuccess={props.onSuccess} initialEntry={props.initialEntry} />;
}
