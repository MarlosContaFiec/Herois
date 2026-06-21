import { skeleton, skeletonText, skeletonCard, skeletonCircle } from '../styles/components';

export function SkeletonCard() {
  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 space-y-3">
      <div className={`${skeleton} h-32 w-full`} />
      <div className={skeletonText} />
      <div className={`${skeleton} h-3 w-1/2`} />
    </div>
  );
}

export function SkeletonLista({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonLinha() {
  return <div className={`${skeleton} h-10 w-full`} />;
}

export function SkeletonAvatar() {
  return <div className={`${skeletonCircle} w-10 h-10`} />;
}