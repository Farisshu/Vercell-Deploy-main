import Link from "next/link";
import { BookOpen, BarChart3, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  {
    name: "Industrial Protocols",
    icon: "📡",
    color: "can",
    items: [
      { slug: "protocols/can-bus", title: "CAN Bus" },
      { slug: "protocols/spi", title: "SPI" },
      { slug: "protocols/modbus", title: "Modbus" },
    ],
  },
  {
    name: "RTOS & Multitasking",
    icon: "🧠",
    color: "rtos",
    items: [
      { slug: "rtos/freertos-basics", title: "FreeRTOS Basics" },
    ],
  },
  {
    name: "Toolchain",
    icon: "🔧",
    color: "spi",
    items: [
      { slug: "toolchain/platformio", title: "PlatformIO" },
      { slug: "toolchain/git", title: "Git & CI/CD" },
    ],
  },
  {
    name: "Japanese Terms",
    icon: "🇯🇵",
    color: "japanese",
    items: [
      { slug: "japanese/technical-terms", title: "Technical Terms" },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r bg-background transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <BookOpen className="h-6 w-6" />
              <span>Embedded Hub</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              ✕
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {categories.map((category) => (
              <div key={category.name} className="mb-6">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <span>{category.icon}</span>
                  {category.name}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/study/${item.slug}`}
                        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
                        onClick={onClose}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <Link
              href="/progress"
              className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <BarChart3 className="h-4 w-4" />
              Progress
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
