import React, { useRef, useEffect } from "react"
import "./style.css"
import DragElement from "./Drag"

function Resize(props: any) {
  const { children } = props
  const ref = useRef<HTMLDivElement>(null)
  const refLeft = useRef<HTMLDivElement>(null)
  const refTop = useRef<HTMLDivElement>(null)
  const refRight = useRef<HTMLDivElement>(null)
  const refBottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !refLeft.current || !refTop.current || !refRight.current || !refBottom.current) {
      return
    }

    let resizeableEle = ref.current
    const styles = window.getComputedStyle(resizeableEle)
    let width = parseInt(styles.width, 10)
    let height = parseInt(styles.height, 10)
    let x = 0
    let y = 0

    resizeableEle.style.top = "50px"
    resizeableEle.style.left = "50px"

    // Right resize
    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - x
      x = event.clientX
      width = width + dx
      resizeableEle.style.width = `${width}px`
    }

    const onMouseUpRightResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveRightResize)
    }

    const onMouseDownRightResize = (event: MouseEvent) => {
      x = event.clientX
      resizeableEle.style.left = styles.left
      resizeableEle.style.right = null as any
      document.addEventListener("mousemove", onMouseMoveRightResize)
      document.addEventListener("mouseup", onMouseUpRightResize)
    }

    // Top resize
    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = event.clientY - y
      height = height - dy
      y = event.clientY
      resizeableEle.style.height = `${height}px`
    }

    const onMouseUpTopResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveTopResize)
    }

    const onMouseDownTopResize = (event: MouseEvent) => {
      y = event.clientY
      const styles = window.getComputedStyle(resizeableEle)
      resizeableEle.style.bottom = styles.bottom
      resizeableEle.style.top = null as any
      document.addEventListener("mousemove", onMouseMoveTopResize)
      document.addEventListener("mouseup", onMouseUpTopResize)
    }

    // Bottom resize
    const onMouseMoveBottomResize = (event: MouseEvent) => {
      const dy = event.clientY - y
      height = height + dy
      y = event.clientY
      resizeableEle.style.height = `${height}px`
    }

    const onMouseUpBottomResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize)
    }

    const onMouseDownBottomResize = (event: MouseEvent) => {
      y = event.clientY
      const styles = window.getComputedStyle(resizeableEle)
      resizeableEle.style.top = styles.top
      resizeableEle.style.bottom = null as any
      document.addEventListener("mousemove", onMouseMoveBottomResize)
      document.addEventListener("mouseup", onMouseUpBottomResize)
    }

    // Left resize
    const onMouseMoveLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - x
      x = event.clientX
      width = width - dx
      resizeableEle.style.width = `${width}px`
    }

    const onMouseUpLeftResize = (event: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize)
    }

    const onMouseDownLeftResize = (event: MouseEvent) => {
      x = event.clientX
      resizeableEle.style.right = styles.right
      resizeableEle.style.left = null as any
      document.addEventListener("mousemove", onMouseMoveLeftResize)
      document.addEventListener("mouseup", onMouseUpLeftResize)
    }

    // Add mouse down event listener
    const resizerRight = refRight.current
    resizerRight.addEventListener("mousedown", onMouseDownRightResize)
    const resizerTop = refTop.current
    resizerTop.addEventListener("mousedown", onMouseDownTopResize)
    const resizerBottom = refBottom.current
    resizerBottom.addEventListener("mousedown", onMouseDownBottomResize)
    const resizerLeft = refLeft.current
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize)

    return () => {
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize)
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize)
      resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize)
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize)
    }
  }, [])

  return (
    <div {...props} style={{ position: "relative" }}>
      <div ref={ref} className="resizeable">
        {children}
        <div ref={refLeft} className="resizer resizer-l"></div>
        <div ref={refTop} className="resizer resizer-t"></div>
        <div ref={refRight} className="resizer resizer-r"></div>
        <div ref={refBottom} className="resizer resizer-b"></div>
      </div>
    </div>
  )
}

export default Resize
