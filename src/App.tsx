import { useState } from 'react'
import { Slider } from './components/Slider'
import styles from './App.module.css'

export const App = () => {
  const [percentageValue, setPercentageValue] = useState(67)
  const [proportionalValue, setProportionalValue] = useState(0.33)

  return (
    <div className={styles.container}>
      <Slider
        label="Percentage Label"
        min={0}
        max={100}
        step={1}
        value={percentageValue}
        unit="%"
        onChange={setPercentageValue}
      />
      
      <Slider
        label="Proportional Label"
        min={0}
        max={1}
        step={0.01}
        value={proportionalValue}
        onChange={setProportionalValue}
      />
    </div>
  )
}
