import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Slider.module.css'

interface ISliderProps {
  label: string        
  max: number         
  min: number        
  step: number      
  value: number       
  unit?: string
  onChange(value: number): void 
}

export const Slider = ({ label, max, min, step, value, unit = '', onChange }: ISliderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  
  // Refs to access the DOM elements for calculations
  const trackRef = useRef<HTMLDivElement>(null)  // Reference to the track element
  const thumbRef = useRef<HTMLDivElement>(null)  // Reference to the thumb element

  const getPercentage = useCallback((value: number) => {
    // if value=75, min=0, max=100 -> ((75-0)/(100-0))*100 -> 0.75 * 100= 75%
    return ((value - min) / (max - min)) * 100
  }, [max, min])

  // Convert mouse position to slider value + memoize the function
  const getValueFromPosition = useCallback((position: number) => {
    // THis is a way of getting the track div size
    const trackDivSize = trackRef.current?.getBoundingClientRect()
    if (!trackDivSize) return value

    // Calculate percentage based on mouse position relative to track
    // position = mouse X coordinate
    // trackDivSize.left = left edge of track
    // trackDivSize.width = width of track
    const percentage = Math.max(0, Math.min(100, 
      (position - trackDivSize.left) / trackDivSize.width * 100
    ))
    
    // Convert percentage back to actual value
    // The max and min are needed here to consider both
    // from 0 to 100 as well as from 0 to 1
    const rawValue = (percentage / 100) * (max - min) + min
    // Round to nearest step
    const steppedValue = Math.round(rawValue / step) * step
    // Ensure value stays within bounds
    const finalSelectedTrackValue = Math.max(min, Math.min(max, steppedValue))
    return finalSelectedTrackValue
  }, [max, min, step, value])

  // Handle mouse down on track
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const clientXAxisMouse = getValueFromPosition(e.clientX)
    onChange(clientXAxisMouse)
  }

  // Add mouse listeners
  useEffect(() => {
    // Update value while dragging
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const clientXAxisMouse = getValueFromPosition(e.clientX)
      onChange(clientXAxisMouse)
    }

    // Stop dragging
    const handleMouseUp = () => {
      setIsDragging(false)
    }

    // Add listeners when dragging starts
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // Clean up listeners when dragging ends
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, getValueFromPosition, onChange])

  // Calculate styles for positioning
  const percentage = getPercentage(value)

  // Formating value based in unit type
  const displayValue = unit === '%' ? Math.round(value) : value.toFixed(2)

  return (
    <div className={styles.container}>
      <span className={styles.sliderLabel}>{label}</span>
      <div className={styles.sliderContainer}>
        <div
          ref={trackRef}
          className={styles.track}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.progress} style={{ width: `${percentage}%` }} />
          <div
            ref={thumbRef}
            className={styles.thumb}
            style={{ left: `${percentage}%` }}
          >
            <div className={styles.thumbValue}>
              {displayValue}{unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 