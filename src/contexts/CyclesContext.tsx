import { createContext, ReactNode, useReducer, useState } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  currentCycle: Cycle | undefined
  currentCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // const [cycles, setCycles] = useState<Cycle[]>([])
  const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
    switch (action.type) {
      case 'ADD_NEW_CYCLE':
        return [...state, action.payload.newCycle]
    }

    return state
  }, [])
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const currentCycle = cycles.find((cycle) => cycle.id === currentCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        currentCycleId,
      },
    })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === currentCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // setCycles((state) => [...state, newCycle])
    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
    setCurrentCycleId(id)
    setAmountSecondsPassed(0)

    // reset()
  }

  function interruptCurrentCycle() {
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === currentCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        currentCycleId,
      },
    })
    setCurrentCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        currentCycle,
        currentCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
