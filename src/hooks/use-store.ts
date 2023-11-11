import { useState, useMemo } from "react"

class EventEmitter<T extends string | number | symbol> extends EventTarget {
  emit(key: T) {
    this.dispatchEvent(new Event(String(key)))
  }
}

export const createStore = <T extends Record<string | number | symbol, any>>(initialState: T = {} as T) => {
  const instance = new EventEmitter<keyof T>()

  return <K extends keyof T>(key: K): { state: T[K]; setState: (cb: (prev: T[K]) => T[K]) => void } => {
    const [, setCount] = useState(0)

    useMemo(() => {
      const eventListener = () => {
        setCount((c) => (c + 1) % Number.MAX_SAFE_INTEGER)
      }
      instance.addEventListener(String(key), eventListener)
      return () => {
        instance.removeEventListener(String(key), eventListener)
      }
    }, [key])

    return {
      state: initialState[key],
      setState: (cb) => {
        initialState[key] = cb(initialState[key])
        instance.emit(key)
      },
    }
  }
}

export const useStore = createStore({
  value: 0,
})
