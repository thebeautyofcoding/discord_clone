import React from "react"

type UseScrollToBottomProps = {
  dependency: any
}

export const useScrollToBottom = ({ dependency }: UseScrollToBottomProps) => {
  const viewport = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!viewport.current) return
    const scrollHeight = viewport.current.scrollHeight
    viewport.current.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    })
  }, [dependency])

  return viewport
}
