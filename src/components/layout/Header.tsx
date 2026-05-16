import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useChallengeStore } from '@/stores/challengeStore';
import { useRunCode } from '@/hooks/useRunCode';
import { useWorkerStore } from '@/stores/workerStore.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

export function Header() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const challenges = useChallengeStore((state) => state.challenges);
  const { triggerRun, triggerSubmit, triggerReset } = useRunCode();
  const isReady = useWorkerStore((state) => state.isReady);

  const isChallengePage = location.pathname.startsWith('/challenge/');
  const challengeLabel =
    id && isChallengePage
      ? (challenges.find((challenge) => challenge.id === id)?.title ?? `Challenge ${id}`)
      : null;

  return (
    <header
      className="
        flex items-center justify-between
        px-4 h-12 shrink-0
        bg-(--surface)
        border-b border-(--border)
        z-10
      "
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              to="/"
              className="text-(--accent) font-semibold text-sm tracking-wide select-none hover:opacity-90"
            >
              {'</>'} Python OOP
            </Link>
          </BreadcrumbItem>
          {isChallengePage && challengeLabel && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">{challengeLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {isChallengePage && (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-fit">
                <Button variant="secondary" size="sm" onClick={triggerRun} disabled={!isReady}>
                  Run
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>{isReady ? <p>Runs the code</p> : <p>Pyodide is loading...</p>}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-fit">
                <Button
                  className={'hover:bg-primary/80'}
                  size="sm"
                  onClick={triggerSubmit}
                  disabled={!isReady}
                >
                  Submit
                </Button>
              </div>
            </TooltipTrigger>
              <TooltipContent>{isReady ? <p>Runs and tests the code against testcases</p> : <p>Pyodide is loading...</p>}</TooltipContent>
          </Tooltip>
          <Button variant="outline" size="sm" onClick={triggerReset}>
            Reset
          </Button>
        </div>
      )}
    </header>
  );
}
