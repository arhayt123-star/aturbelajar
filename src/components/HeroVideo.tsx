// Video diputar langsung di halaman (embed), tanpa membuka YouTube.
const VIDEO_ID = "LIgxpDhAflo";

export function HeroVideo({ className = "" }: { className?: string }) {
  return (
    <div className={"overflow-hidden rounded-card bg-navy shadow-soft ring-1 ring-navy/10 " + className}>
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
          title="Video pengenalan AturBelajar"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
