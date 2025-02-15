import { CSSProperties, useCallback, useEffect, useRef, useState } from 'react'
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
  // Track if user is currently dragging the thumb
  const [isDragging, setIsDragging] = useState(false)
  
  // Refs to access the DOM elements for calculations
  const trackRef = useRef<HTMLDivElement>(null)  // Reference to the track element
  const thumbRef = useRef<HTMLDivElement>(null)  // Reference to the thumb element

  // Calculate the percentage position based on current value
  const getPercentage = useCallback((value: number) => {
    // Convert the current value to a percentage position (0-100)
    // Example: if value=50, min=0, max=100 → ((50-0)/(100-0))*100 = 50%
    return ((value - min) / (max - min)) * 100
  }, [max, min])

  // Convert mouse position to slider value
  const getValueFromPosition = useCallback((position: number) => {
    const trackRect = trackRef.current?.getBoundingClientRect()
    if (!trackRect) return value

    // Calculate percentage based on mouse position relative to track
    // position = mouse X coordinate
    // trackRect.left = left edge of track
    // trackRect.width = width of track
    const percentage = Math.max(0, Math.min(100, 
      (position - trackRect.left) / trackRect.width * 100
    ))
    
    // Convert percentage back to actual value
    const rawValue = (percentage / 100) * (max - min) + min
    // Round to nearest step increment
    const steppedValue = Math.round(rawValue / step) * step
    // Ensure value stays within bounds
    return Math.max(min, Math.min(max, steppedValue))
  }, [max, min, step, value])

  // Handle mouse down on track
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    const newValue = getValueFromPosition(e.clientX)
    onChange(newValue)
  }

  // Set up mouse move and mouse up listeners
  useEffect(() => {
    // Update value while dragging
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newValue = getValueFromPosition(e.clientX)
      onChange(newValue)
    }

    // Stop dragging on mouse up
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
  const thumbStyle: CSSProperties = {
    left: `${percentage}%`,  // Position thumb based on current value percentage
  }

  const progressStyle: CSSProperties = {
    width: `${percentage}%`,  // Width of progress bar based on current value
  }

  // Format display value based on unit type
  const displayValue = unit === '%' ? Math.round(value) : value.toFixed(2)

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.sliderContainer}>
        <div
          ref={trackRef}
          className={styles.track}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.progress} style={progressStyle} />
          <div
            ref={thumbRef}
            className={styles.thumb}
            style={thumbStyle}
          >
            <div className={styles.valueLabel}>
              {displayValue}{unit}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 