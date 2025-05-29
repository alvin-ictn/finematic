import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  onIntersect,
  hasMore,
  loading,
  threshold = 0.8,
}: UseInfiniteScrollOptions) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      if (node) {
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasMore) {
              onIntersect();
            }
          },
          {
            threshold,
          }
        );
        observer.current.observe(node);
      }
    },
    [onIntersect, hasMore, loading, threshold]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
}
