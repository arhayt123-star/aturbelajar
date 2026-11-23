export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 340" className={className} role="img" aria-label="Siswa belajar dengan kalender dan jam">
      <ellipse cx="210" cy="312" rx="190" ry="16" fill="#245B45" opacity=".12" />
      {/* kalender */}
      <g>
        <rect x="236" y="30" width="150" height="120" rx="14" fill="#fff" stroke="#183153" strokeWidth="3" />
        <rect x="236" y="30" width="150" height="30" rx="14" fill="#183153" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={262 + i * 24} cy="26" r="5" fill="#F2C14E" />
        ))}
        {[0, 1, 2, 3, 4].map((c) =>
          [0, 1].map((r) => (
            <g key={`${c}-${r}`}>
              <rect x={250 + c * 25} y={72 + r * 36} width="20" height="26" rx="5" fill={c + r === 3 ? "#4C956C" : "#F5F3EB"} />
              {(c + r) % 2 === 0 && (
                <path d={`M${255 + c * 25} ${85 + r * 36} l4 4 8-9`} stroke="#245B45" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </g>
          )),
        )}
      </g>
      {/* jam */}
      <circle cx="360" cy="190" r="34" fill="#fff" stroke="#183153" strokeWidth="5" />
      <path d="M360 170v22l14 8" stroke="#183153" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* meja */}
      <rect x="40" y="260" width="340" height="14" rx="7" fill="#183153" />
      {/* siswa */}
      <path d="M96 262 q10-80 70-84 q60 4 66 84z" fill="#fff" stroke="#183153" strokeWidth="3" />
      <path d="M150 180 l16 34 16-34z" fill="#183153" />
      <circle cx="166" cy="140" r="34" fill="#F6D2B0" />
      <path d="M132 136 q4-40 40-38 q30 2 28 38 q-20-22-68 0z" fill="#183153" />
      <circle cx="154" cy="144" r="3" fill="#263238" />
      <circle cx="178" cy="144" r="3" fill="#263238" />
      <path d="M156 156 q10 8 20 0" stroke="#263238" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* laptop */}
      <path d="M190 262 l18-62 h96 l16 62z" fill="#245B45" />
      <rect x="196" y="204" width="100" height="52" rx="4" fill="#183153" />
      <path d="M232 244 l12-28 12 28 M236 238 h16" stroke="#F2C14E" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* tanaman */}
      <path d="M52 260 q-6-40 10-62 q14 22 8 62z" fill="#4C956C" />
      <path d="M72 260 q10-34 34-44 q-2 28-20 44z" fill="#245B45" />
    </svg>
  );
}

export function CounselorIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 200" className={className} role="img" aria-label="Guru BK mendampingi siswa">
      <rect x="20" y="170" width="260" height="10" rx="5" fill="#183153" opacity=".15" />
      <circle cx="90" cy="80" r="26" fill="#F6D2B0" />
      <path d="M62 78 q4-30 30-28 q24 2 22 28 q-14-16-52 0z" fill="#263238" />
      <path d="M52 172 q4-62 38-64 q34 2 38 64z" fill="#245B45" />
      <circle cx="205" cy="96" r="22" fill="#F6D2B0" />
      <path d="M183 94 q3-26 24-24 q20 2 20 24 q-12-12-44 0z" fill="#183153" />
      <path d="M176 172 q2-52 29-54 q27 2 30 54z" fill="#F2C14E" />
      <path d="M120 130 q18-12 50 0" stroke="#4C956C" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="120" y="40" width="64" height="40" rx="10" fill="#fff" stroke="#183153" strokeWidth="3" />
      <path d="M132 62 l8 8 16-18 M164 56h12 M164 66h12" stroke="#4C956C" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
