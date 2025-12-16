import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-3 inset-x-0 flex flex-col gap-3"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  scale: 0.8,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ 
                  delay: (items.length - 1 - idx) * 0.05,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  className="group relative h-12 w-12 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-xl border-2 border-gray-200/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/50 dark:hover:to-cyan-950/50 active:scale-95"
                >
                  <div className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110">
                    {item.icon}
                  </div>
                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute right-full mr-2 px-3 py-1.5 whitespace-nowrap rounded-lg bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 shadow-lg text-xs font-medium text-gray-700 dark:text-gray-300 pointer-events-none"
                  >
                    {item.title}
                  </motion.div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)]",
          open 
            ? "bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 scale-105 rotate-180" 
            : "bg-white/90 dark:bg-black/90 backdrop-blur-xl border-2 border-gray-200/60 dark:border-white/10 hover:scale-105 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)]"
        )}
      >
        <IconLayoutNavbarCollapse className={cn(
          "h-5 w-5 transition-all duration-300",
          open 
            ? "text-white rotate-180" 
            : "text-gray-700 dark:text-gray-300"
        )} />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden md:flex h-20 gap-6 items-end rounded-3xl bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-2 border-gray-200/60 dark:border-white/10 shadow-[0_20px_60px_rgb(0,0,0,0.25)] dark:shadow-[0_20px_60px_rgb(255,255,255,0.1)] px-6 pb-4 transition-all duration-500",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 40, 20]
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-2xl bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-neutral-800/95 dark:to-neutral-900/95 backdrop-blur-xl border-2 border-gray-200/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.05)] flex items-center justify-center relative transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.2)] hover:border-blue-400/60 dark:hover:border-blue-500/60 group"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-3 py-1.5 whitespace-pre rounded-xl bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl border-2 border-gray-200/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.1)] text-gray-700 dark:text-gray-200 absolute left-1/2 -translate-x-1/2 -top-12 w-fit text-xs font-medium"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
