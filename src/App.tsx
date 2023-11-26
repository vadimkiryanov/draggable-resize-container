import React from "react"
import DragElement from "./components/Drag"

function App() {
  const [isAppActive, setIsAppActive] = React.useState<number | null>(null)
  const [windows, setWindows] = React.useState<TWindows[]>([])

  // header actions
  const onCloseWindow = (winId: number) => {
    setWindows((prev) =>
      prev.filter((elem, id) => {
        return elem.id !== winId
      })
    )
  }

  const onAddWindow = (newWindow: TAppsIcon) => {
    setWindows([
      ...windows,
      {
        id: Math.random(),
        width: 600,
        height: 400,
        x: window.innerWidth / 3,
        y: window.innerHeight / 8,
        xPrev: 0,
        yPrev: 0,
        content: newWindow.content,
      },
    ])
  }

  return (
    /* Container */
    <div className="h-screen relative w-screen grid place-items-center content-center bg-cover bg-[url('https://free4kwallpapers.com/uploads/originals/2022/04/20/rubiks-cube-digital-art-wallpaper.jpg')]">
      {windows.map((elem, idx) => {
        return (
          <DragElement key={elem.id}>
            <section className={`h-full w-full ease-linear shadow-xl flex flex-col  rounded-lg cursor-auto `}>
              {/* Header bar */}
              <div className={`bg-[#1a1f35] w-full min-h-[28px] rounded-t-lg  flex justify-end items-center space-x-1.5 overflow-hidden`}>
                {/* <button className="w-3 h-3 border-2  border-green-400 rounded-full hover:bg-green-400 bg-transparent"></button> */}
                {/* <button className="w-3 h-3 border-2  border-yellow-400 rounded-full hover:bg-yellow-400 bg-transparent"></button> */}
                {/* <button
                  onClick={() => onCloseWindow(elem.id)}
                  className="w-3 h-3 border-2  border-red-400 rounded-full hover:bg-red-400 bg-transparent "
                ></button> */}
                <div className="flex h-full">
                  <span className="hover:bg-[#8883] transition-colors w-12">
                    <svg
                      className="h-full w-4 mx-auto opacity-60"
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M14 8v1H3V8h11z"></path>
                    </svg>
                  </span>
                  <span className="hover:bg-[#8883] transition-colors w-12">
                    <svg
                      className="h-full w-4 mx-auto opacity-60"
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z"></path>
                    </svg>
                  </span>
                  <span className="hover:bg-[#f00c] transition-colors w-12" onClick={() => onCloseWindow(elem.id)}>
                    <svg
                      className="h-full w-4 mx-auto opacity-60"
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.116 8l-4.558 4.558.884.884L8 8.884l4.558 4.558.884-.884L8.884 8l4.558-4.558-.884-.884L8 7.116 3.442 2.558l-.884.884L7.116 8z"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>

              <div
                className=" bg-gray-700 border-t-0 w-full h-full  p-4 rounded-b-lg grid place-items-center  z-0 overflow-auto "
                onMouseDown={(e) => e.stopPropagation()}
              >
                {elem.content()}
              </div>
            </section>
          </DragElement>
        )
      })}

      <div className="fixed  w-full bottom-0 flex-none z-10 flex justify-center shadow-lg bg-white bg-opacity-75 border-t border-gray-300 border-opacity-20 backdrop-filter backdrop-blur-lg px-56 dark:bg-gray-800 dark:bg-opacity-75 dark:backdrop-filter dark:backdrop-blur-lg dark:border-gray-600 dark:border-opacity-20">
        {/*   Apps  */}
        <nav className="flex items-center justify-center space-x-1 h-14">
          {appsIcon.map((app, index) => {
            return (
              <button
                key={app.id}
                onClick={() => {
                  isAppActive !== app.id ? setIsAppActive(app.id) : setIsAppActive(null)
                  onAddWindow(app)
                }}
                type="button"
                className="relative group focus:outline-none bg-white rounded transition duration-150 bg-opacity-0 hover:bg-opacity-50 active:bg-opacity-75 dark:bg-black dark:bg-opacity-0 dark:hover:bg-opacity-25 dark:active:bg-opacity-50"
              >
                {isAppActive === app.id && <span className="absolute bottom-0 left-0 right-0 mx-4 h-1 rounded bg-blue-500"></span>}
                <span className="block p-2 transform transition duration-75 active:scale-90">
                  <img className="relative w-8 h-8" src={app.image} alt="Start Menu" />
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default App

const appsIcon: TAppsIcon[] = [
  {
    id: 1,
    image: "img/icons/windows.png",
    content: () => <input type="range" min={0} max="100" value="40" />,
  },
  {
    id: 2,
    image: "img/icons/desktop.png",
    content: () => (
      <select className="select w-full max-w-xs">
        <option disabled selected>
          Pick your favorite Simpson
        </option>
        <option>Homer</option>
        <option>Marge</option>
        <option>Bart</option>
        <option>Lisa</option>
        <option>Maggie</option>
      </select>
    ),
  },
  {
    id: 3,
    image: "img/icons/computer-dark.png",
    content: () => (
      <div className="rating gap-1">
        <input type="radio" name="rating-3" className="mask mask-heart bg-red-400" />
        <input type="radio" name="rating-3" className="mask mask-heart bg-orange-400" checked />
        <input type="radio" name="rating-3" className="mask mask-heart bg-yellow-400" />
        <input type="radio" name="rating-3" className="mask mask-heart bg-lime-400" />
        <input type="radio" name="rating-3" className="mask mask-heart bg-green-400" />
      </div>
    ),
  },
  {
    id: 4,
    image: "img/icons/edge.png",
    content: () => <iframe className="w-full h-full" src="https://daisyui.com/components/range/" title="Chat AI"></iframe>, //
  },
  {
    id: 5,
    image: "img/icons/folder.png",
    content: () => (
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img
            src="https://media1.popsugar-assets.com/files/thumbor/r-H2D7LclaSMDAoEV9iBbODdRJs/fit-in/728xorig/filters:format_auto-!!-:strip_icc-!!-/2022/07/27/995/n/1922729/8d82874962e1c1ce7992d1.75767700_/i/best-nike-training-shoes.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    image: "img/icons/store.png",
    content: () => (
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/luxjt6DrWbc"
        title="A Normal Day In ENGLAND"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    ),
  },
]

type TWindows = {
  id: number
  width: number | string
  height: number | string
  x: number
  y: number
  xPrev: number | undefined
  yPrev: number | undefined
  content: () => React.JSX.Element
}

type TAppsIcon = {
  id: number
  image: string
  content: () => React.JSX.Element
}
