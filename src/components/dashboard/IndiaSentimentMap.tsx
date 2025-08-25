'use client'

import { useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { geoCentroid } from 'd3-geo'
import type { RegionalSentimentPoint, RegionKey } from '@/types/dashboard'
import { INDIA_TOPOJSON_URL, regionName } from '@/lib/regions'
import { formatNumber } from '@/lib/format'

interface Props {
  data: RegionalSentimentPoint[]
  onRegionSelect?: (r: RegionKey) => void
  selected?: RegionKey | null
}

export default function IndiaSentimentMap({ data, onRegionSelect, selected }: Props) {
  const maxVolume = useMemo(() => Math.max(...data.map((d) => d.volume)), [data])
  const size = useMemo(() => scaleLinear().domain([0, maxVolume]).range([4, 20]), [maxVolume])

  const color = (score: number) => {
    if (score > 0.2) return '#16a34a'
    if (score < -0.2) return '#dc2626'
    return '#9ca3af'
  }

  return (
    <ComposableMap
      projectionConfig={{ scale: 1000 }}
      className="border rounded"
      aria-label="India sentiment map"
    >
      <Geographies geography={INDIA_TOPOJSON_URL}>
        {({ geographies }) => (
          <>
            {geographies.map((geo) => {
              const region = geo.id as RegionKey
              const point = data.find((d) => d.region === region)
              const centroid = geoCentroid(geo)
              return (
                <g key={geo.rsmKey}>
                  <Geography
                    geography={geo}
                    fill="#f3f4f6"
                    stroke="#e5e7eb"
                    className="focus:outline-none"
                  />
                  {point && (
                    <Marker coordinates={centroid}>
                      <circle
                        r={size(point.volume)}
                        fill={color(point.score)}
                        fillOpacity={0.7}
                        stroke={selected === region ? '#000' : 'white'}
                        tabIndex={0}
                        aria-label={`Sentiment for ${regionName(region)}`}
                        onClick={() => onRegionSelect?.(region)}
                        title={`${regionName(region)}\nScore: ${point.score}\nVolume: ${formatNumber(point.volume)}\nTerms: ${point.topTerms
                          .slice(0, 3)
                          .join(', ')}`}
                      />
                    </Marker>
                  )}
                </g>
              )
            })}
          </>
        )}
      </Geographies>
    </ComposableMap>
  )
}
