import Link from "next/link";
import { BarChart3, BookOpen, BookOpenCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    name: "Industrial Protocols",
    icon: "📡",
    accent: "text-can",
    items: [
      { slug: "protocols/can-bus", title: "CAN Bus" },
      { slug: "protocols/spi", title: "SPI" },
    ],
  },
  {
    name: "RTOS & Multitasking",
    icon: "🧠",
    accent: "text-rtos",
    items: [{ slug: "rtos/freertos-basics", title: "FreeRTOS Basics" }],
  },
  {
    name: "Toolchain",
    icon: "🔧",
    accent: "text-spi",
    items: [],
  },
  {
    name: "Japanese Terms",
    icon: "🇯🇵",
    accent: "text-japanese",
    items: [{ slug: "japanese/technical-terms", title: "Technical Terms" }],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-white/10 bg-[#05070d]/95 shadow-2xl shadow-black/40 backdrop-blur transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-3 font-bold" onClick={onClose}>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-can/15 text-can ring-1 ring-can/30">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm uppercase tracking-[0.25em] text-can">Embedded</span>
                  <span className="block text-lg text-white">Study Hub</span>
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                ✕
              </Button>
            </div>
            <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs leading-5 text-muted-foreground">
              CAN • FreeRTOS • Toolchain • 日本語 — siap untuk HORIBA Kyoto.
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {categories.map((category) => (
              <div key={category.name} className="mb-6">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <span className={category.accent}>{category.icon}</span>
                  {category.name}
                </h3>
                <ul className="space-y-1">
                  {category.items.length > 0 ? (
                    category.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/study/${item.slug}`}
                          className="block rounded-xl px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                          onClick={onClose}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl px-3 py-2 text-xs text-muted-foreground/80">Coming soon</li>
                  )}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link href="/tests" className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10" onClick={onClose}>
              <BookOpenCheck className="h-4 w-4 text-can" />
              Test Center
            </Link>
            <Link href="/progress" className="mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10" onClick={onClose}>
              <BarChart3 className="h-4 w-4 text-rtos" />
              Progress
            </Link>
            <Link href="/settings" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-white/10" onClick={onClose}>
              <Settings className="h-4 w-4 text-japanese" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
