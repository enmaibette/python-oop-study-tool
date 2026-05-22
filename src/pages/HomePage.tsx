import { ChallengeList } from '@/features/challenge-list/ChallengeList';

export default function HomePage() {
  return (
    <div className="flex flex-col overflow-y-auto items-center gap-8 h-full bg-(--background) px-4 py-8">
      <h1 className="text-2xl font-bold text-(--accent)">{'</>'} Python OOP</h1>
      <ChallengeList />
    </div>
  );
}
