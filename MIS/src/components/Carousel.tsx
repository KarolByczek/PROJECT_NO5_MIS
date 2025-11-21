import React, { useRef, useState, useEffect, useCallback } from "react";
import { collection, QueryDocumentSnapshot, getDocs } from "firebase/firestore";
import { primaryDb } from "./../../AUXILIARY_OBJECTS/CarouselDB";
import "./Carousel.scss";

const TRANSITION_MS = 900;
const AUTOPLAY_MS = 3500;
const DRAG_THRESHOLD_PX = 40;

const parsePx = (s: string) => {
  if (!s) return 0;
  return Number(s.replace("px", "").trim()) || 0;
};

const Carousel: React.FC = () => {
  // refs
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const autoRef = useRef<number | null>(null);

  // data
  const [slides, setSlides] = useState<string[]>([]);
  const [slidesPerView, setSlidesPerView] = useState<number>(1);

  const [cloneCount, setCloneCount] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // geometry
  const [slideWidthPx, setSlideWidthPx] = useState<number>(0);
  const [gapPx, setGapPx] = useState<number>(8);

  // drag
  const startXRef = useRef<number | null>(null);
  const draggingRef = useRef<boolean>(false);

  // --- fetch slides ---
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const snapshot = await getDocs(collection(primaryDb, "CarouselURLs"));
        const arr: string[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          arr.push(...Object.values(doc.data()));
        });
        setSlides(arr);
      } catch (err) {
        console.error("Error fetching slides:", err);
      }
    };
    fetchSlides();
  }, []);

  // responsive slidesPerView
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 720) setSlidesPerView(1);
      else if (w <= 1100) setSlidesPerView(2);
      else setSlidesPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // cloneCount sync
  useEffect(() => {
    setCloneCount(slidesPerView);
  }, [slidesPerView]);

  // extended slides (clones)
  const extendedSlides = React.useMemo(() => {
    if (!slides.length) return [];
    const N = slides.length;
    const arr: string[] = [];
    for (let i = cloneCount; i > 0; i--) arr.push(slides[(N - i + N) % N]);
    arr.push(...slides);
    for (let i = 0; i < cloneCount; i++) arr.push(slides[i % N]);
    return arr;
  }, [slides, cloneCount]);

  // geometry calc
  const recalcGeometry = useCallback(() => {
  const vp = viewportRef.current;
  const slider = sliderRef.current;
  if (!vp || !slider) return;

  const vpW = vp.clientWidth;
  // read gap from computed style of slider
  const style = getComputedStyle(slider);
  const gapRaw = style.getPropertyValue("gap") || style.getPropertyValue("--slide-gap");
  const gap = parsePx(gapRaw) || 8;
  setGapPx(gap);

  const totalGap = gap * (slidesPerView - 1);

  // compute candidate width
  const rawW = Math.max(0, (vpW - totalGap) / slidesPerView);

  // clamp to vpW to avoid oversized width on mobile
  const w = Math.min(rawW, vpW);

  setSlideWidthPx(Math.round(w));
}, [slidesPerView]);

 useEffect(() => {
  recalcGeometry(); // initial try

  const vp = viewportRef.current;
  if (!vp) {
    // fallback to window resize in case viewportRef not mounted yet
    const id = window.setTimeout(recalcGeometry, 40);
    window.addEventListener("resize", recalcGeometry);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", recalcGeometry);
    };
  }

  // create ResizeObserver so we re-measure when the viewport element changes size
  const ro = new ResizeObserver(() => {
    recalcGeometry();
  });
  ro.observe(vp);

  // also watch window resize for safety
  window.addEventListener("resize", recalcGeometry);

  // small delayed recalculation to catch dynamic chrome on mobile
  const id = window.setTimeout(recalcGeometry, 80);

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", recalcGeometry);
    clearTimeout(id);
  };
}, [recalcGeometry, extendedSlides.length]);

  // initialize index to cloneCount and position slider (no transition)
  useEffect(() => {
    if (!extendedSlides.length) return;
    const s = sliderRef.current;
    if (!s) return;
    s.style.transition = "none";
    setCurrentIndex(cloneCount);
    const x = -(cloneCount * (slideWidthPx + gapPx));
    s.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(() => {
      s.style.transition = `transform ${TRANSITION_MS}ms ease`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendedSlides.length, cloneCount, slideWidthPx, gapPx]);

  // apply transform when index changes (or geometry changes)
  useEffect(() => {
    const s = sliderRef.current;
    if (!s) return;
    // if we don't have slideWidthPx yet, don't apply a meaningful transform
    if (slideWidthPx === 0) {
      s.style.transform = `translateX(0px)`;
      return;
    }
    const x = -(currentIndex * (slideWidthPx + gapPx));
    s.style.transform = `translateX(${x}px)`;
  }, [currentIndex, slideWidthPx, gapPx]);

  // next / prev
  const next = useCallback(() => {
    if (isTransitioning || !extendedSlides.length) return;
    setIsTransitioning(true);
    setCurrentIndex((i) => i + 1);
  }, [isTransitioning, extendedSlides.length]);

  const prev = useCallback(() => {
    if (isTransitioning || !extendedSlides.length) return;
    setIsTransitioning(true);
    setCurrentIndex((i) => i - 1);
  }, [isTransitioning, extendedSlides.length]);

  // teleport on clones (silent reposition)
  useEffect(() => {
    const s = sliderRef.current;
    if (!s || !extendedSlides.length) return;

    const onEnd = () => {
      // if geometry not ready, just reset transition flag
      if (slideWidthPx === 0) {
        setIsTransitioning(false);
        return;
      }

      const firstReal = cloneCount;
      const lastReal = cloneCount + slides.length - 1;

      if (currentIndex > lastReal) {
        // moved into right clones -> teleport to firstReal
        const newIndex = firstReal;
        s.style.transition = "none";
        const x = -(newIndex * (slideWidthPx + gapPx));
        s.style.transform = `translateX(${x}px)`;
        // force reflow, then re-enable
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        s.offsetHeight;
        s.style.transition = `transform ${TRANSITION_MS}ms ease`;
        setCurrentIndex(newIndex);
        setTimeout(() => setIsTransitioning(false), 20);
        return;
      }

      if (currentIndex < firstReal) {
        // moved into left clones -> teleport to lastReal
        const newIndex = lastReal;
        s.style.transition = "none";
        const x = -(newIndex * (slideWidthPx + gapPx));
        s.style.transform = `translateX(${x}px)`;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        s.offsetHeight;
        s.style.transition = `transform ${TRANSITION_MS}ms ease`;
        setCurrentIndex(newIndex);
        setTimeout(() => setIsTransitioning(false), 20);
        return;
      }

      // normal end inside real slides
      setIsTransitioning(false);
    };

    s.addEventListener("transitionend", onEnd);
    return () => s.removeEventListener("transitionend", onEnd);
  }, [currentIndex, cloneCount, slides.length, slideWidthPx, gapPx, extendedSlides.length]);

  // autoplay
  useEffect(() => {
    if (!extendedSlides.length) return;
    if (autoRef.current) window.clearInterval(autoRef.current);
    autoRef.current = window.setInterval(() => next(), AUTOPLAY_MS);
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
    };
  }, [next, extendedSlides.length]);

  const stopAuto = () => {
    if (autoRef.current) {
      window.clearInterval(autoRef.current);
      autoRef.current = null;
    }
  };

  // pointer handlers (threshold)
  const pointerDown = (clientX: number) => {
    stopAuto();
    startXRef.current = clientX;
    draggingRef.current = true;
  };

  const pointerMove = (clientX: number) => {
    if (!draggingRef.current || startXRef.current == null) return;
    const dx = clientX - startXRef.current;
    if (Math.abs(dx) >= DRAG_THRESHOLD_PX) {
      dx < 0 ? next() : prev();
      draggingRef.current = false;
      startXRef.current = null;
    }
  };

  const pointerUp = () => {
    draggingRef.current = false;
    startXRef.current = null;
  };

  // Render even if slideWidthPx is 0 (we no longer block rendering)
  if (!extendedSlides.length) {
    return <div className="carousel-loading">Ładowanie...</div>;
  }

  return (
    <div
      className="carousel"
      onMouseDown={(e) => {
        e.preventDefault();   // stops focus highlight
        pointerDown(e.clientX);
      }}
      onMouseMove={(e) => pointerMove(e.clientX)}
      onMouseUp={pointerUp}
      onMouseLeave={pointerUp}
      onTouchStart={(e) => pointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => pointerMove(e.touches[0].clientX)}
      onTouchEnd={pointerUp}
    >
      <button
        className="slider_button left"
        onClick={() => {
          stopAuto();
          prev();
        }}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <div className="carousel-viewport" ref={viewportRef}>
        <div
          className="carousel-slider"
          ref={sliderRef}
          style={{ gap: "var(--slide-gap)" }}
        >
          {extendedSlides.map((src, idx) => (
            <div
              className="carousel-slide"
              key={idx}
              style={{ width: slideWidthPx ? `${slideWidthPx}px` : "100%" }}
            >
              <img src={src} alt={`slide-${idx}`} draggable={false} />
            </div>
          ))}
        </div>
      </div>

      <button
        className="slider_button right"
        onClick={() => {
          stopAuto();
          next();
        }}
        aria-label="Next slide"
      >
        ›
      </button>
    </div>
  );
};

export default Carousel;
