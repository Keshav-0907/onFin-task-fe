import React, { JSX } from 'react'

export const formatResponseText = (text: string) => {
  const normalized = text.replace(/\r\n|\r/g, '\n')

  // Attempt to extract JSON block at the end of the text if it exists
  const match = normalized.match(/({[\s\S]*})$/)
  const jsonPart = match ? match[1] : null
  const mainText = jsonPart ? normalized.replace(jsonPart, '') : normalized

  const parts = mainText.split(/(\*\*.*?\*\*|\n)/)

  const renderedMain = parts.map((part, index) => {
    if (!part) return null

    if (part === '\n') {
      return <br key={`br-${index}`} />
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`bold-${index}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return (
      <span key={`text-${index}`} className="block mb-3">
        {part}
      </span>
    )
  })

  let renderedJSON: JSX.Element[] = []
  if (jsonPart) {
    try {
      const obj = JSON.parse(jsonPart)
      renderedJSON = Object.entries(obj).map(([key, value], idx) => (
        <div key={`json-${idx}`} className="mt-4 text-sm">
          <strong className="font-semibold capitalize">{key}:</strong>{' '}
          <span>{String(value)}</span>
        </div>
      ))
    } catch (err) {
      renderedJSON = [
        <div key="json-error" className="text-red-500 text-sm mt-4">
          (Invalid JSON block)
        </div>,
      ]
    }
  }

  return (
    <div className="whitespace-pre-wrap leading-relaxed text-sm">
      {renderedMain}
      <div className="mt-6">{renderedJSON}</div>
    </div>
  )
}
