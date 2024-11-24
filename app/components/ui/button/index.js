// components/ui/button.jsx
import * as React from "react"
import "./button.css"

const Button = React.forwardRef(({ 
  className,
  variant = "default",
  size = "default",
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`button button--${variant} button--${size} ${className || ''}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }