import { PLACEHOLDERS } from '@/lib/constants';
import { notFound } from 'next/navigation';

export default function ProximamentePage({ params }) {
  const p = PLACEHOLDERS[params.modulo];
  if (!p) notFound();

  return (
    <div className="placeholder-box">
      <h3>{p.title} — próximamente</h3>
      <p className="muted">{p.desc}</p>
      <ul>
        {p.items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
