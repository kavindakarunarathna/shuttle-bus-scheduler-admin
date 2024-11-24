// components/ui/card.jsx
import * as React from "react"
import "./card.css"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`card ${className || ''}`}
    style={{ marginTop: 20, borderLeftWidth: 10, borderLeftColor: "#000000" }}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`card-header ${className || ''}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`card-title ${className || ''}`}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`card-content ${className || ''}`} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }