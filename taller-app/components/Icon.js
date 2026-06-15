const PATHS = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></>,
  box: <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
  doc: <><path d="M6 2h9l3 3v17H6z" /><path d="M14 2v4h4" /><path d="M9 13h6M9 17h6" /></>,
  truck: <><rect x="2" y="7" width="13" height="9" /><path d="M15 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 2v6M16 2v6" /></>,
  folder: <path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />,
  layers: <><path d="M12 2 3 7l9 5 9-5z" /><path d="M3 12l9 5 9-5M3 17l9 5 9-5" /></>,
  cube: <><path d="M12 2 4 6v8l8 4 8-4V6z" /><path d="M4 6l8 4 8-4M12 10v8" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.3 3.1-5 7-5s7 1.7 7 5" /><path d="M17 8.5a3 3 0 1 0 0-5.9" /><path d="M22 20c0-2.6-2-4.3-5-4.8" /></>,
  chart: <><path d="M3 21h18" /><rect x="5" y="11" width="3.5" height="8" /><rect x="11" y="6" width="3.5" height="13" /><rect x="17" y="14" width="3.5" height="5" /></>,
  report: <><path d="M6 2h9l3 3v17H6z" /><path d="M14 2v4h4" /><path d="M9 12l2 2 4-4" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  menu: <><path d="M3 12h18M3 6h18M3 18h18" /></>,
};

export default function Icon({ name, size = 17 }) {
  return (
    <svg
      className="ic"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] || PATHS.box}
    </svg>
  );
}
