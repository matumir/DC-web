import { useEffect, useRef, useState } from "react";

export default function Animable({ className = "", children }) {
  const ref = useRef(null);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setAnimar(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} animable${animar ? " animar" : ""}`}>
      {children}
    </div>
  );
}
