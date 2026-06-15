import { STATUS_CLASS } from '@/lib/constants';

export default function Tag({ value }) {
  const cls = STATUS_CLASS[value] || 'tag-pending';
  return <span className={`tag ${cls}`}>{value || '—'}</span>;
}
