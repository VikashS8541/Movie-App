import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold text-blue">404</h1>
      <p className="text-xl md:text-2xl mt-4 mb-8">Page not found</p>
      <Link to="/" className="blue-btn">Back to Home</Link>
    </section>
  )
}

export default NotFound
