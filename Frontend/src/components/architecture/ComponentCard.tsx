'use client';

interface ComponentCardProps {
  title: string;
  icon: string;
  language: string;
  description: string;
  features: string[];
  color: string;
}

export default function ComponentCard({
  title,
  icon,
  language,
  description,
  features,
  color,
}: ComponentCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} p-0.5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="bg-slate-900 rounded-2xl p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-4xl">{icon}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 mt-1">{language}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-5 line-clamp-2">
          {description}
        </p>

        {/* Features */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Features</p>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Learn More CTA */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <button className={`w-full py-2 px-3 rounded-lg text-sm font-medium text-white transition-all bg-gradient-to-r ${color} hover:opacity-90`}>
            Saiba Mais →
          </button>
        </div>
      </div>
    </div>
  );
}
