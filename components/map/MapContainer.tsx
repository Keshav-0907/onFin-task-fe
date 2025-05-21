'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    throw new Error('NEXT_PUBLIC_MAPBOX_TOKEN is not defined')
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface MapProps {
    center?: [number, number]
    zoom?: number
    className?: string
}

const MapContainer = ({
    center = [77.5946, 12.9716],
    zoom = 10,
}: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center,
            zoom,
        })

        mapRef.current.on('load', () => {
            mapRef.current?.addSource('pincode-boundaries', {
                type: 'geojson',
                data: '/boundary.geojson',
            })

            mapRef.current?.addLayer({
                id: 'pincode-outline',
                type: 'line',
                source: 'pincode-boundaries',
                paint: {
                    'line-color': '#e53e3e',
                    'line-width': 1,
                }
            })
        })

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [center, zoom])

    return (
        <div ref={mapContainerRef} className="w-full h-full" />
    )
}

export default MapContainer
