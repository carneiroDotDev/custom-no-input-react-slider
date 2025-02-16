import { SliderProvider } from './context/SliderContext'
import { SliderControls } from './components/SliderControls'
import styles from './App.module.css'

export const App = () => {
  return (
    <SliderProvider>
      <div className={styles.container}>
        <div className={styles.values}>
          {/* <span>Percentage Value: {percentageValue}%</span>
          <span>Proportional Value: {proportionalValue}</span> */}
        </div>
        <SliderControls />
      </div>
    </SliderProvider>
  )
}
