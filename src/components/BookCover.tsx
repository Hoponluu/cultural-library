export default function BookCover({
  src,
  title,
  className,
  zoomOnHover,
}: {
  src: string;
  title: string;
  className?: string;
  zoomOnHover?: boolean;
}) {
  return (
    <div
      className={
        (className ?? "h-full w-full") +
        " relative overflow-hidden rounded-[3px] bg-neutral-100"
      }
      style={{
        boxShadow: "2px 8px 16px -5px rgba(0,0,0,0.55), 0 2px 5px rgba(0,0,0,0.3)",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          className={
            "h-full w-full object-cover" +
            (zoomOnHover ? " transition duration-300 group-hover:scale-105" : "")
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-3 text-center text-sm font-medium text-neutral-500">
          {title}
        </div>
      )}
      {/* Gáy sách: mép trang tạo cảm giác độ dày quyển sách */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[8%] bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-black/15" />
      {/* Ánh sáng hắt nhẹ lên bìa */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
    </div>
  );
}
