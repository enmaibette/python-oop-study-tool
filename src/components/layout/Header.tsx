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
import {
  ALL_CHALLENGES_COMPLETED,
  ALL_TESTS_PASSED,
  NEXT_CHALLENGE,
  PYODIDE_LOADING_TEXT,
  RUN_TOOLTIP_TEXT,
  SUBMIT_TOOLTIP_TEXT,
  TESTS_FAILED,
} from '@/lib/constants';
import { useUIStore } from '@/stores/uiStore.ts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog.tsx';
import { Spinner } from '@/components/ui/spinner.tsx';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const challenges = useChallengeStore((state) => state.challenges);
  const { triggerRun, triggerSubmit, triggerReset } = useRunCode();
  const isReady = useWorkerStore((state) => state.isReady);

  const isSubmitPopoverOpen = useUIStore((state) => state.isSubmitPopoverOpen);
  const testCaseResults = useUIStore((state) => state.testCaseResults);
  const setSubmitPopoverOpen = useUIStore((state) => state.setSubmitPopoverOpen);

  const [resetPopoverOpen, setResetPopoverOpen] = useState(false)

  const passed = testCaseResults.filter((t) => t.status === 'pass').length;
  const total = testCaseResults.length;
  const allPassed = total > 0 && passed === total;
  const currentIndex = challenges.findIndex((c) => c.id === id);
  const nextChallenge = challenges[currentIndex + 1] ?? null;

  const isChallengePage = location.pathname.startsWith('/challenge/');
  const challengeLabel =
    id && isChallengePage
      ? (challenges.find((challenge) => challenge.id === id)?.title ?? `Challenge ${id}`)
      : null;

  const dialogNextChallenge = (
    <Dialog open={isSubmitPopoverOpen} onOpenChange={setSubmitPopoverOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {passed} / {total} tests passed
          </DialogTitle>
          <DialogDescription>{allPassed ? ALL_TESTS_PASSED : TESTS_FAILED}</DialogDescription>
        </DialogHeader>
        {allPassed && (
          <DialogFooter>
            {nextChallenge ? (
              <Link
                to={`/challenge/${nextChallenge.id}`}
                onClick={() => setSubmitPopoverOpen(false)}
              >
                <Button className="w-full">
                  {NEXT_CHALLENGE}: {nextChallenge.title}
                </Button>
              </Link>
            ) : (
              <DialogDescription>{ALL_CHALLENGES_COMPLETED}</DialogDescription>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );

  const dialogReset = (
    <Dialog open={resetPopoverOpen} onOpenChange={setResetPopoverOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you really want to reset your code?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={'destructive'}
            onClick={() => {
              setResetPopoverOpen(!resetPopoverOpen);
              triggerReset();
            }}
          >
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

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
          {dialogNextChallenge}
          {dialogReset}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-fit">
                <Button variant="secondary" size="sm" onClick={triggerRun} disabled={!isReady}>
                  Run
                  {!isReady && <Spinner data-icon="inline-end" />}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isReady ? RUN_TOOLTIP_TEXT : PYODIDE_LOADING_TEXT}</p>
            </TooltipContent>
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
                  {!isReady && <Spinner data-icon="inline-end" />}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isReady ? <p>{SUBMIT_TOOLTIP_TEXT}</p> : <p>{PYODIDE_LOADING_TEXT}</p>}
            </TooltipContent>
          </Tooltip>
          <Button variant="outline" size="sm" onClick={() => setResetPopoverOpen(true)}>
            Reset
          </Button>
        </div>
      )}
    </header>
  );
}
