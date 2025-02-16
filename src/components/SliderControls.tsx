import { Slider } from './Slider'
import { useSliderContext } from '../context/SliderContext'
import styles from './SliderControls.module.css'

export const SliderControls = () => {
  const { percentageValue, proportionalValue, setPercentageValue, setProportionalValue } = useSliderContext()

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