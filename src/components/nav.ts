import {
  Bell, CalendarDays, Home, Info, LineChart, ListChecks, NotebookPen, ShieldCheck, Timer, UserCog, Workflow,
  BookOpenCheck, LifeBuoy, LayoutDashboard, Users, KeyRound,
} from "lucide-react";

export const studentNav = [
  { href: "/siswa", label: "Dashboard", icon: Home },
  { href: "/siswa/tugas", label: "Daftar Tugas", icon: ListChecks },
  { href: "/siswa/jadwal", label: "Jadwal Mingguan", icon: CalendarDays },
  { href: "/siswa/pengingat", label: "Pengingat", icon: Bell },
  { href: "/siswa/fokus", label: "Fokus Belajar", icon: Timer },
  { href: "/siswa/progres", label: "Progres", icon: LineChart },
  { href: "/siswa/refleksi", label: "Refleksi", icon: NotebookPen },
];

export const studentInfoNav = [
  { href: "/tentang", label: "Tentang", icon: Info },
  { href: "/etika", label: "Etika & Privasi", icon: ShieldCheck },
  { href: "/addie", label: "Pengembangan ADDIE", icon: Workflow },
  { href: "/siswa/profil", label: "Akun & Data", icon: UserCog },
];

export const teacherNav = [
  { href: "/guru", label: "Beranda", icon: Home },
  { href: "/guru/panduan", label: "Panduan", icon: BookOpenCheck },
  { href: "/guru/bantuan", label: "Permintaan Bantuan", icon: LifeBuoy },
  { href: "/guru/akun", label: "Akun", icon: KeyRound },
  { href: "/etika", label: "Etika & Privasi", icon: ShieldCheck },
  { href: "/addie", label: "ADDIE & Evaluasi", icon: Workflow },
];

export const adminNav = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/pengguna", label: "Pengguna", icon: Users },
  { href: "/admin/bantuan", label: "Permintaan Bantuan", icon: LifeBuoy },
  { href: "/admin/akun", label: "Akun", icon: KeyRound },
];

export const publicNav = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/tentang", label: "Tentang" },
  { href: "/etika", label: "Etika & Privasi" },
  { href: "/addie", label: "ADDIE" },
];

// Beranda (dashboard) tiap peran.
export const homeByRole = { STUDENT: "/siswa", TEACHER: "/guru", ADMIN: "/admin" } as const;
