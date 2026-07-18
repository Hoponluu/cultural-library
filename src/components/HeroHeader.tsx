export const HERO_HEIGHT_CLASS = "h-56 sm:h-72";

export default function HeroHeader() {
  return (
    <div className={`fixed inset-x-0 top-0 z-0 ${HERO_HEIGHT_CLASS} w-full overflow-hidden bg-gradient-to-b from-neutral-900 to-background`}>
      {/*
        Chỗ chèn ảnh header thật, ví dụ:
        <img src="/header.jpg" alt="" className="h-full w-full object-cover" />
        Khi có ảnh, xoá div placeholder bên dưới.
      */}
      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-600">
        Ảnh header sẽ được bổ sung sau
      </div>
    </div>
  );
}
