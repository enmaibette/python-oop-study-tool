import { Circle, CheckCircle2, XCircle } from 'lucide-react';
import type { TestCaseStatus } from 'src/types';

interface StatusIconProps {
  status: TestCaseStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  if (status === 'pass') {
    return <CheckCircle2 className={`h-5 w-5 stroke-(--success)`} />;
  }
  if (status === 'fail') {
    return <XCircle className={`h-5 w-5 stroke-(--destructive)`} />;
  }

  return <Circle className={`h-5 w-5 stroke-(--muted)`} />;
}
