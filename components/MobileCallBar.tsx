import Icon from "@/components/ui/Icon";
import { siteConfig, telHref } from "@/site.config";

export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-line bg-white p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
      <a
        href="#consult"
        className="flex h-12 items-center justify-center gap-2 rounded-full border-2 border-brand text-sm font-bold text-brand"
      >
        상담 신청
      </a>
      <a
        href={telHref(siteConfig.contact.phone)}
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand text-base font-black text-white"
      >
        <Icon name="phone" className="h-5 w-5" /> {siteConfig.contact.phoneDisplay}
      </a>
    </div>
  );
}
