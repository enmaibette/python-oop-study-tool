import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIcon } from './StatusIcon';
import type { TestCase } from '@/types';

interface TestCaseCardProps {
  testCase: TestCase;
}

export function TestCaseCard({ testCase }: TestCaseCardProps) {
  return (
      <Card className="w-full flex-row justify-between pr-3 items-center">
        <div className="flex-1 min-w-0">
          <CardHeader>
            <CardTitle className={'text-sm'}>{testCase.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-x-2 flex-wrap">
            <span className="text-xs text-(--muted)">
              Expected: <span className="text-(--text)">{testCase.expected}</span>
            </span>
            <span className="text-xs text-(--muted)">
              Got: <span className="text-(--text)">{testCase.got}</span>
            </span>
          </CardContent>
        </div>
        <StatusIcon status={testCase.status} />
      </Card>
  );
}
