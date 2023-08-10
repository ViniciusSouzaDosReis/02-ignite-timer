import { useContext, useEffect, useState } from 'react'

import { CountdownContainer, Separator } from './styles'

import { CyclesContext } from '../..'
import { differenceInSeconds } from 'date-fns'

export function Countdown() {
  const { currentCycle, currentCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const totalSeconds = currentCycle ? currentCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number
    if (currentCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          currentCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [currentCycle, totalSeconds, markCurrentCycleAsFinished, currentCycleId])

  const currentSeconds = currentCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (currentCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, currentCycle])


  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}