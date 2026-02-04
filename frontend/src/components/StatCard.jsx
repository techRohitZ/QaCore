import InteractiveCard from "./InteractiveCard";

export default function StatCard({ label, value, icon: Icon }) {
  return (
    <InteractiveCard className="p-5 bg-slate-900/80 border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="mt-1 text-3xl font-semibold text-slate-100">
            {value}
          </div>
        </div>
        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400">
          <Icon size={20} />
        </div>
      </div>
    </InteractiveCard>
  );
}
