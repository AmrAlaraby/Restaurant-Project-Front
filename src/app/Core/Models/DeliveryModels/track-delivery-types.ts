export type DeliveryStatus = 'Assigned' | 'PickedUp' | 'OnTheWay' | 'Delivered';

export interface TimelineStep {
  key: string;
  label: string;
  doneDesc: string;
  activeDesc: string;
  pendingDesc: string;
  timestamp?: string | null;
}