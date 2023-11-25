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
        xTranslate !== 0 && setXTranslate(0)
      }
      if (isTouchBottomBorderWindow) {
        setYTranslate(coordWindowOfBorder.bottom)
      }
      if (isTouchRightBorderWindow) {
        setXTranslate(coordWindowOfBorder.right)
      }
    }

    checkBounds()

    return () => {}
  }, [isResize, windowHeight, windowWidth, xTranslate, yTranslate])

  // Определение ширины и высоты перетаскиваемого элемента
  useEffect(() => {
    // Отслеживание изменения размеров children
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
      resizeObserverForElemDraggable.disconnect() // Отписка от изменения размеров
    }
  }, [refElementDraggable])

  /* RESIZE */
  const refLeft = useRef<HTMLDivElement>(null)
  const refTop = useRef<HTMLDivElement>(null)
  const refRight = useRef<HTMLDivElement>(null)
  const refBottom = useRef<HTMLDivElement>(null)

  const refTopLeft = useRef<HTMLDivElement>(null)

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
    let initX = 0
    let initY = 0

    // Top-Left resize
    const onMouseMoveTopLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - x
      const dy = event.clientY - y
      x = event.clientX
      y = event.clientY
      widthResizeableEle = widthResizeableEle - dx
      heightResizeableEle = heightResizeableEle - dy
      resizeableEle.style.width = `${widthResizeableEle}px`
      resizeableEle.style.height = `${heightResizeableEle}px`
      setWindowWidthWidth(widthResizeableEle)
      setWindowHeight(heightResizeableEle)
      setXTranslate((prev) => prev - dx)
      setYTranslate((prev) => prev - dy)
    }

    const onMouseUpTopLeftResize = (event: MouseEvent) => {
      setIsResize(false)
      document.removeEventListener("mousemove", onMouseMoveTopLeftResize)
    }

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

      initY = initY + dy

      resizeableEle.style.transform = `translate(${xTranslate}px, ${initY}px)`
      setYTranslate(initY)
    }

    const onMouseDownTopResize = (event: MouseEvent) => {
      setIsResize(true)

      y = event.clientY

      initY = resizeableEle.getClientRects()[0]!.y

      document.addEventListener("mousemove", onMouseMoveTopResize)
      document.addEventListener("mouseup", onMouseUpTopResize)
    }

    const onMouseUpTopResize = (event: MouseEvent) => {
      setIsResize(false)

      document.removeEventListener("mousemove", onMouseMoveTopResize)
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

      initX = initX + dx

      resizeableEle.style.transform = `translate(${initX}px, ${yTranslate}px)`
      setXTranslate(initX)
    }

    const onMouseUpLeftResize = (event: MouseEvent) => {
      setIsResize(false)
      document.removeEventListener("mousemove", onMouseMoveLeftResize)
    }

    const onMouseDownLeftResize = (event: MouseEvent) => {
      setIsResize(true)

      x = event.clientX
      initX = resizeableEle.getClientRects()[0]!.x

      document.addEventListener("mousemove", onMouseMoveLeftResize)
      document.addEventListener("mouseup", onMouseUpLeftResize)
    }

    // const onMouseDownTopLeftResize = (event: MouseEvent) => {
    //   setIsResize(true)
    //   x = event.clientX
    //   y = event.clientY
    //   // setInitialMousePosition({ x: event.clientX, y: event.clientY })

    //   document.addEventListener("mousemove", onMouseMoveTopLeftResize)
    //   document.addEventListener("mouseup", onMouseUpTopLeftResize)
    // }

    // Add mouse down event listener
    const resizerRight = refRight.current
    resizerRight.addEventListener("mousedown", onMouseDownRightResize)
    const resizerTop = refTop.current
    resizerTop.addEventListener("mousedown", onMouseDownTopResize)
    const resizerBottom = refBottom.current
    resizerBottom.addEventListener("mousedown", onMouseDownBottomResize)
    const resizerLeft = refLeft.current
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize)

    const resizerTopLeft = refTopLeft.current
    // resizerTopLeft.addEventListener("mousedown", onMouseDownTopLeftResize)

    return () => {
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize)
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize)
      resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize)
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize)

      // resizerTopLeft.removeEventListener("mousedown", onMouseDownTopLeftResize)
    }
  }, [refElementDraggable, xTranslate, yTranslate])

  return (
    <div
      ref={refElementDraggable}
      className={`fixed left-0 top-0 z-50 select-none`}
      style={{ transform: `translate(${xTranslate}px,${yTranslate}px)`, transition: "none 0s ease 0s" }}
      onMouseDown={onMouseDown}
      draggable={false}
      {...props}
    >
      {children}
      {/* <div ref={refTopLeft} className="absolute bg-purple-800 cursor-ew-resize w-10 h-10 top-0 left-0 z-10" /> */}
      <div ref={refLeft} className="absolute bg-blue-800 cursor-col-resize h-full left-0 top-0 w-1" />
      <div ref={refTop} className="absolute bg-blue-800 cursor-row-resize w-full top-0 h-1" />
      <div ref={refRight} className="absolute bg-blue-800 cursor-col-resize h-full right-0 top-0 w-1" />
      <div ref={refBottom} className="absolute bg-blue-800 cursor-row-resize w-full bottom-0 h-1 " />
    </div>
  )
}

export default DragElement

/* TODO 
1. Добавить бордеры в список и маппить 
2. При ресайзе окна предотвратить выход ресайза за окно
3. Добавить     resizeableEle.style.transform = `translate(${xTranslate}px, ${y}px)` для всех чтоб не было подергивания
*/
