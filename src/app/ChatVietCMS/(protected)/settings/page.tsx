import { getSiteSettings } from "@/lib/db";
import HeaderImageUploader from "@/components/admin/HeaderImageUploader";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-highlight">Cài đặt trang</h1>
      <h2 className="mb-3 text-lg font-medium text-neutral-200">Ảnh header</h2>
      <HeaderImageUploader initialUrl={settings.headerImageUrl} />
    </div>
  );
}
