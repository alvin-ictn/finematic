import { useCallback, useRef, useState } from 'react'
interface UseInfiniteScrollOptions {
  threshold?: number
  initialPage?: number
}
export function useInfiniteScroll({ 
  threshold = 0.8,
  initialPage = 1
}: UseInfiniteScrollOptions = {}) {
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (!node) return
    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    }, {
      threshold
    })
    observer.current.observe(node)
  }, [hasMore, threshold])

  const resetPage = useCallback(() => {
    setPage(initialPage)
  }, [initialPage])
  
  return { page, setPage, hasMore, setHasMore, lastElementRef, resetPage }
}