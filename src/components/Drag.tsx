import { useEffect, useRef, useState } from "react"
import Aaaaaaa from "./Resize"
import Resize from "./Resize"
import "./style.css"

type Position = {
  x: number
  y: number
}

type DragElementProps = React.HTMLAttributes<HTMLDivElement> & {}
type Direction = "top" | "right" | "bottom" | "left" | "topRight" | "bottomRight" | "bottomLeft" | "topLeft" | "default"

const DragElement: React.FC<DragElementProps> = (props) => {
  const { children } = props
  const [isDragging, setIsDragging] = useState(false)
  const [xTranslate, setXTranslate] = useState(0)
  const [yTranslate, setYTranslate] = useState(0)
  const [initialMousePosition, setInitialMousePosition] = useState<Position>({ x: 0, y: 0 })

  const [isResize, setIsResize] = useState(false)
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

  const refElementDraggable = useRef<HTMLDivElement | null>(null)
  const [windowWidth, setWindowWidthWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

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
    // console.log({ windowWidth })
    return () => {}
  }, [windowHeight, windowWidth, xTranslate, yTranslate])

  // Определение ширины и высоты перетаскиваемого элемента
  useEffect(() => {
    const getWidthAndHeightElementDraggable = () => {
      if (refElementDraggable.current) {
        setWindowWidthWidth(refElementDraggable.current.clientWidth)
        setWindowHeight(refElementDraggable.current.clientHeight)
      }
    }

    getWidthAndHeightElementDraggable()
  }, [refElementDraggable])

  // RESIZE

  const [initialPosX, setInitialPosX] = useState<number>(0)
  const [initialPosY, setInitialPosY] = useState<number>(0)
  const [initialWidth, setInitialWidth] = useState<number>(0)
  const [initialHeight, setInitialHeight] = useState<number>(0)

  const initial = (e: React.MouseEvent, direction: Direction) => {
    let resizable = refElementDraggable.current
    if (!resizable) {
      return
    }
    if (!resizable.offsetWidth) {
      return
    }
    if (!resizable.offsetHeight) {
      return
    }
    if (direction === "right") {
      setInitialPosX(e.clientX)
      setInitialWidth(resizable.offsetWidth)
    }
    if (direction === "left") {
      setInitialPosX(e.clientX)
      setInitialWidth(resizable.offsetWidth)
    }
    if (direction === "bottom") {
      setInitialPosY(e.clientY)
      setInitialHeight(resizable.offsetHeight)
    }
    if (direction === "top") {
      setInitialPosY(e.clientY)
      setInitialHeight(resizable.offsetHeight)
    }

    // setInitialPos(e.clientX)
    // setInitialWidth(resizable.offsetWidth)
  }

  const resize = (e: React.MouseEvent, direction: Direction) => {
    let resizable = refElementDraggable.current

    if (!resizable) {
      return
    }
    if (!resizable.offsetWidth) {
      return
    }

    if (!resizable.offsetHeight) {
      return
    }

    if (direction === "right") {
      resizable.style.width = `${parseInt(initialWidth.toString()) + parseInt((e.clientX - initialPosX).toString())}px`

      // console.log(parseInt(initialWidth.toString()) + parseInt((e.clientX - initialPosX).toString()))
      // setWindowHeight(resizable.style.height)
    }
    if (direction === "left") {
      resizable.style.width = `${parseInt(initialWidth.toString()) - parseInt((e.clientX - initialPosX).toString())}px`
      setXTranslate(e.clientX)
    }
    if (direction === "bottom") {
      resizable.style.height = `${parseInt(initialHeight.toString()) + parseInt((e.clientY - initialPosY).toString())}px`
      console.log(initialHeight + (e.clientY - initialPosY), e.clientY, initialPosY)
    }
    if (direction === "top") {
      resizable.style.height = `${parseInt(initialHeight.toString()) - parseInt((e.clientY - initialPosY).toString())}px`
      // resizable.style.top = `${parseInt((yTranslate + e.clientY).toString())}px`
      // resizable.style.transform = `translate(${xTranslate}px,${e.clientY}px)`
      setYTranslate(e.clientY)
      // console.log(
      //   initialHeight,
      //   e.clientY,
      //   initialPosY,
      //   { windowHeight },
      //   parseInt(initialHeight.toString()) + parseInt((e.clientY - initialPosY).toString())
      // )
    }
  }

  /* RESIZE */
  const ref = refElementDraggable
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

    // resizeableEle.style.top = "50px"
    // resizeableEle.style.left = "50px"

    // Right resize
    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - x
      x = event.clientX
      width = width + dx
      resizeableEle.style.width = `${width}px`
      setWindowWidthWidth(width)
    }

    const onMouseUpRightResize = (event: MouseEvent) => {
      setIsResize(false)
      document.removeEventListener("mousemove", onMouseMoveRightResize)
    }

    const onMouseDownRightResize = (event: MouseEvent) => {
      x = event.clientX
      resizeableEle.style.left = styles.left
      resizeableEle.style.right = null as any

      setIsResize(true)

      document.addEventListener("mousemove", onMouseMoveRightResize)
      document.addEventListener("mouseup", onMouseUpRightResize)
    }

    // Top resize
    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = event.clientY - y
      height = height - dy
      y = event.clientY
      resizeableEle.style.height = `${height}px`
      setWindowHeight(height)
    }

    const onMouseUpTopResize = (event: MouseEvent) => {
      setIsResize(false)

      document.removeEventListener("mousemove", onMouseMoveTopResize)
    }

    const onMouseDownTopResize = (event: MouseEvent) => {
      setIsResize(true)

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
      setWindowHeight(height)
    }

    const onMouseUpBottomResize = (event: MouseEvent) => {
      setIsResize(false)

      document.removeEventListener("mousemove", onMouseMoveBottomResize)
    }

    const onMouseDownBottomResize = (event: MouseEvent) => {
      setIsResize(true)

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

      setWindowWidthWidth(width)

      setXTranslate(x)
    }

    const onMouseUpLeftResize = (event: MouseEvent) => {
      setIsResize(false)
      document.removeEventListener("mousemove", onMouseMoveLeftResize)
    }

    const onMouseDownLeftResize = (event: MouseEvent) => {
      setIsResize(true)

      x = event.clientX

      setXTranslate(x)

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
  }, [ref, xTranslate, yTranslate])

  return (
    <div
      ref={refElementDraggable}
      style={{ transform: `translate(${xTranslate}px,${yTranslate}px)`, position: "fixed", left: 0, top: 0, zIndex: 100 }}
      onMouseDown={onMouseDown}
      {...props}
    >
      {children}
      <div ref={refLeft} className="resizer resizer-l" />
      <div ref={refTop} className="resizer resizer-t" />
      <div ref={refRight} className="resizer resizer-r" />
      <div ref={refBottom} className="resizer resizer-b" />
    </div>
  )
}

export default DragElement

/* TODO 
1. Добавить бордеры в список и маппить 
2. При ресайзе окна предотвратить выход ресайза за окно
*/

{
  /* TOP */
}
// <span
//   className="absolute left-0 top-0 block z-50 h-1 w-full bg-blue-500 cursor-n-resize"
//   onMouseDown={(e) => {
//     e.stopPropagation()
//     // console.log(e.clientY, refElementDraggable.current?.clientHeight)
//   }}
//   draggable="true"
//   onDragStart={(e) => {
//     initial(e, "top")
//   }}
//   onDrag={(e) => {
//     resize(e, "top")
//     setIsResize(true)
//   }}
//   onDragEnd={(e) => {
//     resize(e, "top")
//     setWindowHeight(parseInt(initialHeight.toString()) - parseInt((e.clientY - initialPosY).toString()))
//     setIsResize(false) // TODO Доделать disabled перетаскивания за окно после ресайза
//   }}
// ></span>
// {/* RIGHT */}
// <span
//   onMouseDown={(e) => {
//     e.stopPropagation()
//   }}
//   className="absolute  top-0 right-0 block z-50 w-1 h-full bg-blue-500 cursor-w-resize"
//   draggable="true"
//   onDragStart={(e) => {
//     initial(e, "right")
//   }}
//   onDrag={(e) => {
//     resize(e, "right")
//   }}
//   onDragEnd={(e) => {
//     // Необходимо для обновления ширины и блокирования перетаскивания за окно
//     setWindowWidthWidth(parseInt(initialWidth.toString()) + parseInt((e.clientX - initialPosX).toString()))
//   }}
// ></span>
// {/* LEFT */}
// <span
//   className="absolute left-0 top-0 block z-50 w-1 h-full bg-blue-500 cursor-e-resize"
//   onMouseDown={(e) => {
//     e.stopPropagation()
//   }}
//   draggable="true"
//   onDragStart={(e) => {
//     initial(e, "left")
//   }}
//   onDrag={(e) => {
//     resize(e, "left")
//   }}
//   onDragEnd={(e) => {
//     resize(e, "left")
//     setWindowWidthWidth(parseInt(initialWidth.toString()) - parseInt((e.clientX - initialPosX).toString()))
//   }}
// ></span>
// {/* BOTTOM */}
// <span
//   className="absolute left-0 bottom-0 block z-50 h-1 w-full bg-blue-500 cursor-s-resize"
//   onMouseDown={(e) => {
//     e.stopPropagation()
//   }}
//   draggable="true"
//   onDragStart={(e) => {
//     initial(e, "bottom")
//   }}
//   onDrag={(e) => {
//     resize(e, "bottom")
//   }}
//   onDragEnd={(e) => {
//     setWindowHeight(parseInt(initialHeight.toString()) + parseInt((e.clientY - initialPosY).toString()))
//   }}
// ></span>
