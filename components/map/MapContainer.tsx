'use client'
import { useEffect, useRef, memo } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useServedAreas from '@/hooks/useServedAreas'
import { useAreaStore } from '@/store/useAreaStore'
import type { FeatureCollection, Polygon } from 'geojson'

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
    const { areas } = useServedAreas()
    const setActivePinCode = useAreaStore(state => state.setActivePinCode)

   

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return

        const initMap = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/areas/allAreas')
                const raw = await res.json()

                console.log('raw', raw)
                const geojson: FeatureCollection<Polygon> = {
                    type: 'FeatureCollection',
                    features: raw.map((area: any) => ({
                        type: 'Feature',
                        properties: {
                            name: area.name,
                            pinCode: area.pinCode,
                            isServed: area.isServed,
                            pocName: area.pocName,
                            pocPhone: area.pocPhone,
                            activeFrom: area.activeFrom,
                        },
                        geometry: area.geometry,
                    })),
                }

                const map = new mapboxgl.Map({
                    container: mapContainerRef.current!,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center,
                    zoom,
                    maxZoom: 17,
                })

                mapRef.current = map

                console.log(Array.isArray(raw))

                 const servedPinCodes = raw.filter((area: any) => area.isServed).map((area: any) => area.pinCode)
                 const lockedPinCodes = raw.filter((area: any) => !area.isServed).map((area: any) => area.pinCode)

                 console.log({
                    servedPinCodes,
                    lockedPinCodes,
                 })

                map.on('load', () => {
                    map.addSource('pincode-boundaries', {
                        type: 'geojson',
                        data: geojson,
                    })

                    map.addLayer({
                        id: 'pincode-outline',
                        type: 'line',
                        source: 'pincode-boundaries',
                        paint: {
                            'line-color': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', servedPinCodes]],
                                '#38b2ac',
                                '#e53e3e',
                            ],
                            'line-width': 1.5,
                            'line-dasharray': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', lockedPinCodes]],
                                ['literal', [1, 0]],
                                ['literal', [2, 2]],
                            ],
                        },
                    })

                    map.addLayer({
                        id: 'pincode-fill',
                        type: 'fill',
                        source: 'pincode-boundaries',
                        paint: {
                            'fill-color': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', servedPinCodes]],
                                '#38b2ac',
                                '#e53e3e',
                            ],
                            'fill-opacity': [
                                'case',
                                ['in', ['get', 'pinCode'], ['literal', lockedPinCodes]],
                                0.3,
                                0.4,
                            ],
                        },
                    })

                    map.on('mouseenter', 'pincode-fill', () => {
                        map.getCanvas().style.cursor = 'pointer'
                    })

                    map.on('mouseleave', 'pincode-fill', () => {
                        map.getCanvas().style.cursor = ''
                    })

                    map.on('click', 'pincode-fill', (e) => {
                        const pinCode = e.features?.[0]?.properties?.pinCode
                        if (pinCode) {
                            setActivePinCode(pinCode)
                        }
                    })
                })
            } catch (error) {
                console.error('Failed to load map:', error)
            }
        }

        initMap()

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
        }
    }, [center, zoom, areas])

    return <div ref={mapContainerRef} className="w-full h-full" />
}

export default memo(MapContainer)
