import * as React from "react"
import "./textarea.css"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`textarea ${className || ''}`}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }