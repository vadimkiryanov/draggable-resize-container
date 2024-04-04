import { useEffect, useRef, useState } from "react";

type Position = {
	x: number;
	y: number;
};

type DragElementProps = React.HTMLAttributes<HTMLDivElement> & {};
type Direction = "top" | "right" | "bottom" | "left" | "topRight" | "bottomRight" | "bottomLeft" | "topLeft" | "default";

const DragElement: React.FC<DragElementProps> = (props) => {
	const { children } = props;

	const refElementDraggable = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		// 👇 Костыль который нужно исправить
		// Это фиксит высоту хедер панели, когда контент пустой
		refElementDraggable.current!.style!.height = refElementDraggable.current!.getClientRects()[0]!.height + 1 + "px";
	}, []);

	const [windowWidth, setWindowWidthWidth] = useState(0);
	const [windowHeight, setWindowHeight] = useState(0);

	const [isDragging, setIsDragging] = useState(false);
	const [isResize, setIsResize] = useState(false);

	const [xTranslate, setXTranslate] = useState(200);
	const [yTranslate, setYTranslate] = useState(200);
	const [initialMousePosition, setInitialMousePosition] = useState<Position>({ x: 0, y: 0 });

	const onMouseDown = (e: React.MouseEvent) => {
		setInitialMousePosition({ x: e.clientX, y: e.clientY });
		setIsDragging(true);
	};

	// Событие при нажатии
	useEffect(() => {
		const onMouseMove = (e: WindowEventMap["mousemove"]) => {
			setXTranslate(xTranslate + e.clientX - initialMousePosition.x);
			setYTranslate(yTranslate + e.clientY - initialMousePosition.y);
		};
		if (isDragging && !isResize) {
			window.addEventListener("mousemove", onMouseMove);
		}
		return () => window.removeEventListener("mousemove", onMouseMove);
	}, [isDragging, initialMousePosition, isResize, refElementDraggable]);

	// Событие при отпускании
	useEffect(() => {
		const onMouseUp = () => setIsDragging(false);
		window.addEventListener("mouseup", onMouseUp);
		return () => window.removeEventListener("mouseup", onMouseUp);
	}, []);

	// Отключение перетаскивания за границы окна
	useEffect(() => {
		const checkBounds = () => {
			const coordWindowOfBorder = {
				leftAndTop: 0,
				right: document.body.clientWidth - windowWidth,
				bottom: document.body.clientHeight - windowHeight,
			};

			const isTouchLeftBorderWindow = xTranslate < coordWindowOfBorder.leftAndTop;
			const isTouchRightBorderWindow = xTranslate > coordWindowOfBorder.right;
			const isTouchTopBorderWindow = yTranslate < coordWindowOfBorder.leftAndTop;
			const isTouchBottomBorderWindow = yTranslate > coordWindowOfBorder.bottom;

			if (isTouchTopBorderWindow) {
				setYTranslate(0);
			}
			if (isTouchLeftBorderWindow) {
				xTranslate !== 0 && setXTranslate(0);
			}
			if (isTouchBottomBorderWindow) {
				setYTranslate(coordWindowOfBorder.bottom);
			}
			if (isTouchRightBorderWindow) {
				setXTranslate(coordWindowOfBorder.right);
			}
		};

		checkBounds();

		return () => {};
	}, [isResize, windowHeight, windowWidth, xTranslate, yTranslate]);

	// Определение ширины и высоты перетаскиваемого элемента
	useEffect(() => {
		// Отслеживание изменения размеров children
		const resizeObserverForElemDraggable = new ResizeObserver(() => {
			if (refElementDraggable.current) {
				setWindowWidthWidth(refElementDraggable.current.clientWidth);
				setWindowHeight(refElementDraggable.current.clientHeight);
			}
		});

		const getWidthAndHeightElementDraggable = () => {
			refElementDraggable.current && resizeObserverForElemDraggable.observe(refElementDraggable.current);
		};
		getWidthAndHeightElementDraggable();

		return () => {
			resizeObserverForElemDraggable.disconnect(); // Отписка от изменения размеров
		};
	}, [refElementDraggable]);

	/* RESIZE */
	const refLeft = useRef<HTMLDivElement>(null);
	const refTop = useRef<HTMLDivElement>(null);
	const refRight = useRef<HTMLDivElement>(null);
	const refBottom = useRef<HTMLDivElement>(null);

	const refTopLeft = useRef<HTMLDivElement>(null);
	const refBottomLeft = useRef<HTMLDivElement>(null);
	const refTopRight = useRef<HTMLDivElement>(null);
	const refBottomRight = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			!refElementDraggable.current ||
			!refLeft.current ||
			!refTop.current ||
			!refRight.current ||
			!refBottom.current ||
			!refTopLeft.current ||
			!refBottomLeft.current ||
			!refTopRight.current ||
			!refBottomRight.current
		) {
			return;
		}

		let resizeableEle = refElementDraggable.current;
		const styles = window.getComputedStyle(resizeableEle);
		let widthResizeableEle = parseInt(styles.width, 10);
		let heightResizeableEle = parseInt(styles.height, 10);
		let x = 0;
		let y = 0;
		let initX = 0;
		let initY = 0;

		// Отключение ресайза, когда тянем курсор за границей окна
		// todo Доделать, пока что не работает
		// нужно, чтобы положение координата каждого отдельно бордера при касании края окна отключало ресайз
		// const guardResizeOffScreen = (event: MouseEvent) => {
		// 	if (event.clientX >= event.view!.innerWidth) return true;
		// 	if (event.clientX <= 0) return true;
		// 	if (event.clientY <= 0) return true;
		// 	if (event.clientY >= event.view!.innerHeight) return true;
		// };

		// Top-Left resize
		const onMouseMoveTopLeftResize = (event: MouseEvent) => {
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
			widthResizeableEle = widthResizeableEle - dx;
			heightResizeableEle = heightResizeableEle - dy;
			resizeableEle.style.width = `${widthResizeableEle}px`;
			resizeableEle.style.height = `${heightResizeableEle}px`;
			setWindowWidthWidth(widthResizeableEle);
			setWindowHeight(heightResizeableEle);

			initX = initX + dx;
			initY = initY + dy;

			resizeableEle.style.transform = `translate(${initX}px, ${initY}px)`;

			setXTranslate(initX);
			setYTranslate(initY);
		};

		const onMouseUpTopLeftResize = (event: MouseEvent) => {
			setIsResize(false);
			document.removeEventListener("mousemove", onMouseMoveTopLeftResize);
		};

		const onMouseDownTopLeftResize = (event: MouseEvent) => {
			setIsResize(true);
			x = event.clientX;
			y = event.clientY;

			initX = resizeableEle.getClientRects()[0]!.x;
			initY = resizeableEle.getClientRects()[0]!.y;

			document.addEventListener("mousemove", onMouseMoveTopLeftResize);
			document.addEventListener("mouseup", onMouseUpTopLeftResize);
		};

		// Top-Right resize
		const onMouseMoveTopRightResize = (event: MouseEvent) => {
			const dy = event.clientY - y;
			const dx = event.clientX - x;

			heightResizeableEle = heightResizeableEle - dy;
			widthResizeableEle = widthResizeableEle + dx;
			y = event.clientY;
			x = event.clientX;
			resizeableEle.style.height = `${heightResizeableEle}px`;
			resizeableEle.style.width = `${widthResizeableEle}px`;

			setWindowHeight(heightResizeableEle);
			setWindowWidthWidth(widthResizeableEle);

			initY = initY + dy;
			initX = initX + dx;

			resizeableEle.style.transform = `translate(${xTranslate}px, ${initY}px)`;

			setYTranslate(initY);
		};

		const onMouseUpTopRightResize = (event: MouseEvent) => {
			setIsResize(false);
			document.removeEventListener("mousemove", onMouseMoveTopRightResize);
		};

		const onMouseDownTopRightResize = (event: MouseEvent) => {
			setIsResize(true);
			x = event.clientX;
			y = event.clientY;

			initX = resizeableEle.getClientRects()[0]!.x;
			initY = resizeableEle.getClientRects()[0]!.y;

			document.addEventListener("mousemove", onMouseMoveTopRightResize);
			document.addEventListener("mouseup", onMouseUpTopRightResize);
		};

		// Bottom-Left resize
		const onMouseMoveBottomLeftResize = (event: MouseEvent) => {
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
			widthResizeableEle = widthResizeableEle - dx;
			heightResizeableEle = heightResizeableEle + dy;
			resizeableEle.style.width = `${widthResizeableEle}px`;
			resizeableEle.style.height = `${heightResizeableEle}px`;
			setWindowWidthWidth(widthResizeableEle);
			setWindowHeight(heightResizeableEle);

			initX = initX + dx;
			initY = initY + dy;

			resizeableEle.style.transform = `translate(${initX}px, ${yTranslate}px)`;

			setXTranslate(initX);
		};

		const onMouseUpBottomLeftResize = (event: MouseEvent) => {
			setIsResize(false);
			document.removeEventListener("mousemove", onMouseMoveBottomLeftResize);
		};

		const onMouseDownBottomLeftResize = (event: MouseEvent) => {
			setIsResize(true);
			x = event.clientX;
			y = event.clientY;

			initX = resizeableEle.getClientRects()[0]!.x;
			initY = resizeableEle.getClientRects()[0]!.y;

			document.addEventListener("mousemove", onMouseMoveBottomLeftResize);
			document.addEventListener("mouseup", onMouseUpBottomLeftResize);
		};

		// Bottom-Right resize
		const onMouseMoveBottomRightResize = (event: MouseEvent) => {
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;

			widthResizeableEle = widthResizeableEle + dx;
			heightResizeableEle = heightResizeableEle + dy;
			resizeableEle.style.width = `${widthResizeableEle}px`;
			resizeableEle.style.height = `${heightResizeableEle}px`;
			setWindowWidthWidth(widthResizeableEle);
			setWindowHeight(heightResizeableEle);

			initX = initX + dx;
			initY = initY + dy;
		};

		const onMouseUpBottomRightResize = (event: MouseEvent) => {
			setIsResize(false);
			document.removeEventListener("mousemove", onMouseMoveBottomRightResize);
		};

		const onMouseDownBottomRightResize = (event: MouseEvent) => {
			setIsResize(true);
			x = event.clientX;
			y = event.clientY;

			initX = resizeableEle.getClientRects()[0]!.x;
			initY = resizeableEle.getClientRects()[0]!.y;

			document.addEventListener("mousemove", onMouseMoveBottomRightResize);
			document.addEventListener("mouseup", onMouseUpBottomRightResize);
		};

		// Right resize
		const onMouseMoveRightResize = (event: MouseEvent) => {
			const dx = event.clientX - x;
			x = event.clientX;
			widthResizeableEle = widthResizeableEle + dx;
			resizeableEle.style.width = `${widthResizeableEle}px`;
			setWindowWidthWidth(widthResizeableEle);
		};

		const onMouseUpRightResize = (event: MouseEvent) => {
			setIsResize(false);
			document.removeEventListener("mousemove", onMouseMoveRightResize);
		};

		const onMouseDownRightResize = (event: MouseEvent) => {
			x = event.clientX;

			setIsResize(true);

			document.addEventListener("mousemove", onMouseMoveRightResize);
			document.addEventListener("mouseup", onMouseUpRightResize);
		};

		// Top resize
		const onMouseMoveTopResize = (event: MouseEvent) => {
			const dy = event.clientY - y;
			heightResizeableEle = heightResizeableEle - dy;
			y = event.clientY;
			resizeableEle.style.height = `${heightResizeableEle}px`;

			setWindowHeight(heightResizeableEle);

			initY = initY + dy;

			resizeableEle.style.transform = `translate(${xTranslate}px, ${initY}px)`;
			setYTranslate(initY);
		};

		const onMouseDownTopResize = (event: MouseEvent) => {
			setIsResize(true);

			y = event.clientY;

			initY = resizeableEle.getClientRects()[0]!.y;

			document.addEventListener("mousemove", onMouseMoveTopResize);
			document.addEventListener("mouseup", onMouseUpTopResize);
		};

		const onMouseUpTopResize = (event: MouseEvent) => {
			setIsResize(false);

			document.removeEventListener("mousemove", onMouseMoveTopResize);
		};

		// Bottom resize
		const onMouseMoveBottomResize = (event: MouseEvent) => {
			const dy = event.clientY - y;
			heightResizeableEle = heightResizeableEle + dy;
			y = event.clientY;
			resizeableEle.style.height = `${heightResizeableEle}px`;
			setWindowHeight(heightResizeableEle);
		};

		const onMouseUpBottomResize = (event: MouseEvent) => {
			setIsResize(false);

			document.removeEventListener("mousemove", onMouseMoveBottomResize);
		};

		const onMouseDownBottomResize = (event: MouseEvent) => {
			setIsResize(true);

			y = event.clientY;

			document.addEventListener("mousemove", onMouseMoveBottomResize);
			document.addEventListener("mouseup", onMouseUpBottomResize);
		};

		// Left resize
		const onMouseMoveLeftResize = (event: MouseEvent) => {
			const dx = event.clientX - x;
			x = event.clientX;
			widthResizeableEle = widthResizeableEle - dx;
			resizeableEle.style.width = `${widthResizeableEle}px`;

			setWindowWidthWidth(widthResizeableEle);

			initX = initX + dx;

			resizeableEle.style.transform = `translate(${initX}px, ${yTranslate}px)`;
			setXTranslate(initX);
		};

		const onMouseUpLeftResize = (event: MouseEvent) => {
			setIsResize(false);
			document.removeEventListener("mousemove", onMouseMoveLeftResize);
		};

		const onMouseDownLeftResize = (event: MouseEvent) => {
			setIsResize(true);

			x = event.clientX;
			initX = resizeableEle.getClientRects()[0]!.x;

			document.addEventListener("mousemove", onMouseMoveLeftResize);
			document.addEventListener("mouseup", onMouseUpLeftResize);
		};

		// Add mouse down event listener
		const resizerRight = refRight.current;
		resizerRight.addEventListener("mousedown", onMouseDownRightResize);
		const resizerTop = refTop.current;
		resizerTop.addEventListener("mousedown", onMouseDownTopResize);
		const resizerBottom = refBottom.current;
		resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
		const resizerLeft = refLeft.current;
		resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

		const resizerTopLeft = refTopLeft.current;
		resizerTopLeft.addEventListener("mousedown", onMouseDownTopLeftResize);

		const resizerBottomLeft = refBottomLeft.current;
		resizerBottomLeft.addEventListener("mousedown", onMouseDownBottomLeftResize);

		const resizerTopRight = refTopRight.current;
		resizerTopRight.addEventListener("mousedown", onMouseDownTopRightResize);

		const resizerBottomRight = refBottomRight.current;
		resizerBottomRight.addEventListener("mousedown", onMouseDownBottomRightResize);

		return () => {
			resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
			resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
			resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
			resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);

			resizerTopLeft.removeEventListener("mousedown", onMouseDownTopLeftResize);
			resizerBottomLeft.removeEventListener("mousedown", onMouseDownBottomLeftResize);
			resizerTopRight.removeEventListener("mousedown", onMouseDownTopRightResize);
			resizerBottomRight.removeEventListener("mousedown", onMouseDownBottomRightResize);
		};
	}, [refElementDraggable, xTranslate, yTranslate]);

	const resizerHandles = [
		{ ref: refBottomLeft, className: "absolute cursor-nesw-resize w-4 h-4 -bottom-1 -left-1 z-10" },
		{ ref: refTopLeft, className: "absolute cursor-nwse-resize w-4 h-4 -top-1 -left-1 z-10" },
		{ ref: refTopRight, className: "absolute cursor-nesw-resize w-4 h-4 -top-1 -right-1 z-10" },
		{ ref: refBottomRight, className: "absolute cursor-nwse-resize w-4 h-4 -bottom-1 -right-1 z-10" },
		{ ref: refLeft, className: "absolute cursor-w-resize h-full -left-1 top-0 w-2" },
		{ ref: refTop, className: "absolute cursor-n-resize w-full -top-1 h-2" },
		{ ref: refRight, className: "absolute cursor-w-resize h-full -right-1 top-0 w-2" },
		{ ref: refBottom, className: "absolute cursor-n-resize w-full -bottom-1 h-2" },
	];

	return (
		<div
			ref={refElementDraggable}
			className={`fixed left-0 top-0 z-40 select-none`}
			style={{ transform: `translate(${xTranslate}px,${yTranslate}px)`, transition: "none 0s ease 0s" }}
			onMouseDown={onMouseDown}
			draggable={false}
			{...props}
		>
			{children}
			{/* 👇 Подложка */}
			{isResize && <div className="w-full h-full absolute top-0 left-0" />}
			{resizerHandles.map((handle, index) => (
				<div key={index} ref={handle.ref} className={handle.className} />
			))}
		</div>
	);
};

export default DragElement;

/* TODO 
1. Добавить бордеры в список и маппить ✅
2. При ресайзе окна предотвратить выход ресайза за окно
3. Добавить     resizeableEle.style.transform = `translate(${xTranslate}px, ${y}px)` для всех чтоб не было подергивания
*/
