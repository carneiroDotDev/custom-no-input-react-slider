import { createContext, useContext, ReactNode, useState } from 'react'

interface ISliderContext {
  percentageValue: number
  proportionalValue: number
  setPercentageValue: (value: number) => void
  setProportionalValue: (value: number) => void
}

const SliderContext = createContext<ISliderContext | undefined>(undefined)

export const SliderProvider = ({ children }: { children: ReactNode }) => {
  const [percentageValue, setPercentageValue] = useState(0)
  const [proportionalValue, setProportionalValue] = useState(0)

  return (
    <SliderContext.Provider 
      value={{ 
        percentageValue, 
        proportionalValue, 
        setPercentageValue, 
        setProportionalValue 
      }}
    >
      {children}
    </SliderContext.Provider>
  )
}

export const useSliderContext = () => {
  const context = useContext(SliderContext)
  if (!context) {
    throw new Error('useSliderContext must be used within a SliderProvider')
  }
  return context
} 