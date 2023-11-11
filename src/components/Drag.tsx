import { useEffect, useRef, useState } from "react"

type Position = {
  x: number
  y: number
}

type DragElementProps = React.HTMLAttributes<HTMLDivElement> & {}
type Direction = "top" | "right" | "bottom" | "left" | "topRight" | "bottomRight" | "bottomLeft" | "topLeft" | "default"

const DragElement: React.FC<DragElementProps> = (props) => {
  const { children } = props

  const refElementDraggable = useRef<HTMLDivElement | null>(null)

  const [windowWidth, setWindowWidthWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

  const [isDragging, setIsDragging] = useState(false)
  const [isResize, setIsResize] = useState(false)

  const [xTranslate, setXTranslate] = useState(0)
  const [yTranslate, setYTranslate] = useState(0)
  const [initialMousePosition, setInitialMousePosition] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    console.log({ isResize })
  }, [isResize])

  const onMouseDown = (e: React.MouseEvent) => {
    setInitialMousePosition({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
  }

  // Событие при нажатии
  useEffect(() => {
    const onMouseMove = (e: WindowEventMap["mousemove"]) => {
      setXTranslate(xTranslate + e.clientX - initialMousePosition.x)
      setYTranslate(yTranslate + e.clientY - initialMousePosition.y)
    }
    if (isDragging && !isResize) {
      window.addEventListener("mousemove", onMouseMove)
    }
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [isDragging, initialMousePosition, isResize])

  // Событие при отпускании
  useEffect(() => {
    const onMouseUp = () => setIsDragging(false)
    window.addEventListener("mouseup", onMouseUp)
    return () => window.removeEventListener("mouseup", onMouseUp)
  }, [])

  // Отключение перетаскивания за границы окна
  useEffect(() => {
    const checkBounds = () => {
      const coordWindowOfBorder = {
        leftAndTop: 0,
        right: document.body.clientWidth - windowWidth,
        bottom: document.body.clientHeight - windowHeight,
      }

      const isTouchLeftBorderWindow = xTranslate < coordWindowOfBorder.leftAndTop
      const isTouchRightBorderWindow = xTranslate > coordWindowOfBorder.right
      const isTouchTopBorderWindow = yTranslate < coordWindowOfBorder.leftAndTop
      const isTouchBottomBorderWindow = yTranslate > coordWindowOfBorder.bottom

      if (isTouchTopBorderWindow) {
        setYTranslate(0)
      }
      if (isTouchLeftBorderWindow) {
        setXTranslate(0)
      }
      if (isTouchBottomBorderWindow) {
        setYTranslate(coordWindowOfBorder.bottom)
      }
      if (isTouchRightBorderWindow) {
        setXTranslate(coordWindowOfBorder.right)
      }
    }

    !isResize && checkBounds()

    return () => {}
  }, [windowHeight, windowWidth, xTranslate, yTranslate])

  // Определение ширины и высоты перетаскиваемого элемента
  useEffect(() => {
    const resizeObserverForElemDraggable = new ResizeObserver(() => {
      if (refElementDraggable.current) {
        setWindowWidthWidth(refElementDraggable.current.clientWidth)
        setWindowHeight(refElementDraggable.current.clientHeight)
      }
    })

    const getWidthAndHeightElementDraggable = () => {
      refElementDraggable.current && resizeObserverForElemDraggable.observe(refElementDraggable.current)
    }

    getWidthAndHeightElementDraggable()

    return () => {
      resizeObserverForElemDraggable.disconnect()
    }
  }, [refElementDraggable])

  /* RESIZE */
  const refLeft = useRef<HTMLDivElement>(null)
  const refTop = useRef<HTMLDivElement>(null)
  const refRight = useRef<HTMLDivElement>(null)
  const refBottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!refElementDraggable.current || !refLeft.current || !refTop.current || !refRight.current || !refBottom.current) {
      return
    }

    let resizeableEle = refElementDraggable.current
    const styles = window.getComputedStyle(resizeableEle)
    let widthResizeableEle = parseInt(styles.width, 10)
    let heightResizeableEle = parseInt(styles.height, 10)
    let x = 0
    let y = 0

    // Right resize
    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - x
      x = event.clientX
      widthResizeableEle = widthResizeableEle + dx
      resizeableEle.style.width = `${widthResizeableEle}px`
      setWindowWidthWidth(widthResizeableEle)
    }

    const onMouseUpRightResize = (event: MouseEvent) => {
      setIsResize(false)
      document.removeEventListener("mousemove", onMouseMoveRightResize)
    }

    const onMouseDownRightResize = (event: MouseEvent) => {
      x = event.clientX

      setIsResize(true)

      document.addEventListener("mousemove", onMouseMoveRightResize)
      document.addEventListener("mouseup", onMouseUpRightResize)
    }

    // Top resize
    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = event.clientY - y
      heightResizeableEle = heightResizeableEle - dy
      y = event.clientY
      resizeableEle.style.height = `${heightResizeableEle}px`
      setWindowHeight(heightResizeableEle)
      setYTranslate(y)
    }

    const onMouseUpTopResize = (event: MouseEvent) => {
      setIsResize(false)

      document.removeEventListener("mousemove", onMouseMoveTopResize)
    }

    const onMouseDownTopResize = (event: MouseEvent) => {
      setIsResize(true)

      y = event.clientY

      document.addEventListener("mousemove", onMouseMoveTopResize)
      document.addEventListener("mouseup", onMouseUpTopResize)
    }

    // Bottom resize
    const onMouseMoveBottomResize = (event: MouseEvent) => {
      const dy = event.clientY - y
      heightResizeableEle = heightResizeableEle + dy
      y = event.clientY
      resizeableEle.style.height = `${heightResizeableEle}px`
      setWindowHeight(heightResizeableEle)
    }

    const onMouseUpBottomResize = (event: MouseEvent) => {
      setIsResize(false)

      document.removeEventListener("mousemove", onMouseMoveBottomResize)
    }

    const onMouseDownBottomResize = (event: MouseEvent) => {
      setIsResize(true)

      y = event.clientY

      document.addEventListener("mousemove", onMouseMoveBottomResize)
      document.addEventListener("mouseup", onMouseUpBottomResize)
    }

    // Left resize
    const onMouseMoveLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - x
      x = event.clientX
      widthResizeableEle = widthResizeableEle - dx
      resizeableEle.style.width = `${widthResizeableEle}px`

      setWindowWidthWidth(widthResizeableEle)

      setXTranslate(x)
    }

    const onMouseUpLeftResize = (event: MouseEvent) => {
      setIsResize(false)
      document.removeEventListener("mousemove", onMouseMoveLeftResize)
    }

    const onMouseDownLeftResize = (event: MouseEvent) => {
      setIsResize(true)

      x = event.clientX

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
  }, [refElementDraggable, xTranslate, yTranslate])

  return (
    <div
      ref={refElementDraggable}
      style={{
        transform: `translate(${xTranslate}px,${yTranslate}px)`,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 100,
        userSelect: "none",
      }}
      onMouseDown={onMouseDown}
      draggable={false}
      {...props}
    >
      {children}
      <div ref={refLeft} className="absolute bg-blue-800 cursor-col-resize h-full left-0 top-0 w-1" />
      <div ref={refTop} className="absolute bg-blue-800 cursor-row-resize w-full top-0 h-1  " />
      <div ref={refRight} className="absolute bg-blue-800 cursor-col-resize h-full right-0 top-0 w-1" />
      <div ref={refBottom} className="absolute bg-blue-800 cursor-row-resize w-full bottom-0 h-1 " />
    </div>
  )
}

export default DragElement

/* TODO 
1. Добавить бордеры в список и маппить 
2. При ресайзе окна предотвратить выход ресайза за окно
*/
