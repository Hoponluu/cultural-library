export default function BookCover({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={title}
        className={className ?? "h-full w-full object-cover"}
      />
    );
  }

  return (
    <div
      className={
        (className ?? "h-full w-full") +
        " flex items-center justify-center bg-white/5 p-3 text-center text-sm font-medium text-neutral-500"
      }
    >
      {title}
    </div>
  );
}
