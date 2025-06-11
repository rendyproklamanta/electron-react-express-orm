import { useState, useEffect } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Badge } from "@/app/components/ui/badge"
import { MapPin, Layers, ZoomIn, ZoomOut } from "lucide-react"
import "leaflet/dist/leaflet.css"

// Mock data struktur wilayah Indonesia
interface IndonesiaRegions {
  [province: string]: {
    kabupaten: {
      [kabupaten: string]: {
        kecamatan: {
          [kecamatan: string]: string[];
        };
      };
    };
  };
}

const indonesiaRegions: IndonesiaRegions = {
  "Jawa Barat": {
    kabupaten: {
      Bandung: {
        kecamatan: {
          Coblong: ["Dago", "Lebak Gede", "Sadang Serang"],
          Cidadap: ["Hegarmanah", "Ledeng", "Ciumbuleuit"],
        },
      },
      Bogor: {
        kecamatan: {
          "Bogor Tengah": ["Paledang", "Sempur", "Babakan"],
          "Bogor Utara": ["Tegal Gundil", "Ciparigi", "Bantarjati"],
        },
      },
    },
  },
  "DKI Jakarta": {
    kabupaten: {
      "Jakarta Pusat": {
        kecamatan: {
          Menteng: ["Menteng", "Pegangsaan", "Cikini"],
          Gambir: ["Gambir", "Cideng", "Petojo Utara"],
        },
      },
      "Jakarta Selatan": {
        kecamatan: {
          "Kebayoran Baru": ["Senayan", "Melawai", "Kramat Pela"],
          Tebet: ["Tebet Barat", "Tebet Timur", "Kebon Baru"],
        },
      },
    },
  },
  Bali: {
    kabupaten: {
      Badung: {
        kecamatan: {
          Kuta: ["Kuta", "Legian", "Seminyak"],
          Mengwi: ["Mengwi", "Sobangan", "Bongkasa"],
        },
      },
      Denpasar: {
        kecamatan: {
          "Denpasar Selatan": ["Sanur", "Renon", "Sesetan"],
          "Denpasar Utara": ["Ubung", "Peguyangan", "Tonja"],
        },
      },
    },
  },
}

// Mock GeoJSON data untuk batas wilayah
const mockGeoJSONData = {
  "Jawa Barat": {
    type: "Feature",
    properties: { name: "Jawa Barat", type: "province" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.5, -6.2],
          [108.5, -6.2],
          [108.5, -7.8],
          [106.5, -7.8],
          [106.5, -6.2],
        ],
      ],
    },
  },
  "DKI Jakarta": {
    type: "Feature",
    properties: { name: "DKI Jakarta", type: "province" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.6, -6.0],
          [107.0, -6.0],
          [107.0, -6.4],
          [106.6, -6.4],
          [106.6, -6.0],
        ],
      ],
    },
  },
  Bali: {
    type: "Feature",
    properties: { name: "Bali", type: "province" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [114.5, -8.0],
          [115.8, -8.0],
          [115.8, -8.9],
          [114.5, -8.9],
          [114.5, -8.0],
        ],
      ],
    },
  },
}

// Tambahkan data GeoJSON untuk kabupaten
const kabupatenGeoJSONData = {
  Bandung: {
    type: "Feature",
    properties: { name: "Bandung", type: "kabupaten", province: "Jawa Barat" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [107.4, -6.8],
          [107.8, -6.8],
          [107.8, -7.2],
          [107.4, -7.2],
          [107.4, -6.8],
        ],
      ],
    },
  },
  Bogor: {
    type: "Feature",
    properties: { name: "Bogor", type: "kabupaten", province: "Jawa Barat" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.6, -6.5],
          [107.0, -6.5],
          [107.0, -6.9],
          [106.6, -6.9],
          [106.6, -6.5],
        ],
      ],
    },
  },
  "Jakarta Pusat": {
    type: "Feature",
    properties: { name: "Jakarta Pusat", type: "kabupaten", province: "DKI Jakarta" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.8, -6.15],
          [106.9, -6.15],
          [106.9, -6.25],
          [106.8, -6.25],
          [106.8, -6.15],
        ],
      ],
    },
  },
  Badung: {
    type: "Feature",
    properties: { name: "Badung", type: "kabupaten", province: "Bali" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [115.0, -8.5],
          [115.3, -8.5],
          [115.3, -8.8],
          [115.0, -8.8],
          [115.0, -8.5],
        ],
      ],
    },
  },
}

// Mock data untuk batas lama vs baru
const oldBoundariesData = {
  "Jawa Barat": {
    type: "Feature",
    properties: { name: "Jawa Barat (Lama)", type: "old_boundary" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [106.4, -6.1],
          [108.6, -6.1],
          [108.6, -7.9],
          [106.4, -7.9],
          [106.4, -6.1],
        ],
      ],
    },
  },
}

interface MapControlsProps {
  map: any
}

function MapControls({ map }: MapControlsProps) {
  const handleZoomIn = () => {
    if (map) map.zoomIn()
  }

  const handleZoomOut = () => {
    if (map) map.zoomOut()
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <Button size="sm" variant="outline" onClick={handleZoomIn}>
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="outline" onClick={handleZoomOut}>
        <ZoomOut className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default function MapsPage() {
  const [selectedProvince, setSelectedProvince] = useState<string>("")
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>("")
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>("")
  const [selectedDesa, setSelectedDesa] = useState<string>("")
  const [showOldBoundaries, setShowOldBoundaries] = useState(false)
  const [showNewBoundaries, setShowNewBoundaries] = useState(true)
  const [clickedRegion, setClickedRegion] = useState<string>("")
  const [map, setMap] = useState<any>(null)

  const provinces = Object.keys(indonesiaRegions)
  const kabupaten = selectedProvince
    ? Object.keys(indonesiaRegions[selectedProvince as keyof typeof indonesiaRegions]?.kabupaten || {})
    : []
  const kecamatan =
    selectedProvince && selectedKabupaten
      ? Object.keys(
          indonesiaRegions[selectedProvince as keyof typeof indonesiaRegions]?.kabupaten[
            selectedKabupaten as keyof (typeof indonesiaRegions)[typeof selectedProvince]
          ]?.kecamatan || {},
        )
      : []
  const desa =
    selectedProvince && selectedKabupaten && selectedKecamatan
      ? indonesiaRegions[selectedProvince as keyof typeof indonesiaRegions]?.kabupaten[
          selectedKabupaten as keyof (typeof indonesiaRegions)[typeof selectedProvince]
        ]?.kecamatan[
          selectedKecamatan as keyof (typeof indonesiaRegions)[typeof selectedProvince]["kabupaten"][typeof selectedKabupaten]
        ] || []
      : []

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedKabupaten("")
    setSelectedKecamatan("")
    setSelectedDesa("")
  }

  const handleKabupatenChange = (value: string) => {
    setSelectedKabupaten(value)
    setSelectedKecamatan("")
    setSelectedDesa("")
  }

  const handleKecamatanChange = (value: string) => {
    setSelectedKecamatan(value)
    setSelectedDesa("")
  }

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => {
        setClickedRegion(feature.properties.name)
        if (map) {
          map.fitBounds(layer.getBounds())
        }
      },
      mouseover: (e: any) => {
        const layer = e.target
        layer.setStyle({
          weight: 3,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.7,
        })
      },
      mouseout: (e: any) => {
        const layer = e.target
        layer.setStyle({
          weight: 2,
          color: feature.properties.type === "old_boundary" ? "#ef4444" : "#3b82f6",
          dashArray: feature.properties.type === "old_boundary" ? "5, 5" : "",
          fillOpacity: 0.3,
        })
      },
    })

    layer.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold">${feature.properties.name}</h3>
        <p class="text-sm text-gray-600">Klik untuk zoom ke wilayah ini</p>
      </div>
    `)
  }

  const getFeatureStyle = (feature: any) => {
    if (feature.properties.type === "old_boundary") {
      return {
        fillColor: "#ef4444",
        weight: 2,
        opacity: 1,
        color: "#ef4444",
        dashArray: "5, 5",
        fillOpacity: 0.3,
      }
    }
    return {
      fillColor: "#3b82f6",
      weight: 2,
      opacity: 1,
      color: "#3b82f6",
      fillOpacity: 0.3,
    }
  }

  // Fungsi untuk mendapatkan GeoJSON yang sesuai dengan filter
  const getFilteredGeoJSON = () => {
    if (!selectedProvince) return Object.values(mockGeoJSONData)

    // Filter berdasarkan provinsi yang dipilih
    const filteredData = Object.values(mockGeoJSONData).filter(
      (feature: any) => feature.properties.name === selectedProvince,
    )

    // Jika kabupaten dipilih, tambahkan data kabupaten
    if (selectedKabupaten && kabupatenGeoJSONData[selectedKabupaten]) {
      return [...filteredData, kabupatenGeoJSONData[selectedKabupaten]]
    }

    return filteredData
  }

  // Fungsi untuk menyorot wilayah yang dipilih
  const highlightSelectedRegion = (feature: any) => {
    const isProvinceSelected = feature.properties.name === selectedProvince
    const isKabupatenSelected = feature.properties.name === selectedKabupaten

    return {
      ...getFeatureStyle(feature),
      fillColor: isKabupatenSelected ? "#f59e0b" : isProvinceSelected ? "#10b981" : "#3b82f6",
      fillOpacity: isKabupatenSelected ? 0.6 : isProvinceSelected ? 0.5 : 0.3,
      weight: isKabupatenSelected || isProvinceSelected ? 3 : 2,
    }
  }

  // Effect untuk zoom ke wilayah yang dipilih dari dropdown
  useEffect(() => {
    if (map && selectedProvince) {
      const selectedFeature = Object.values(mockGeoJSONData).find(
        (feature: any) => feature.properties.name === selectedProvince,
      )

      if (selectedFeature) {
        // Buat bounds dari koordinat polygon
        const coordinates = selectedFeature.geometry.coordinates[0]
        const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]])

        // Zoom ke bounds wilayah yang dipilih
        map.fitBounds(latLngs)

        // Update clickedRegion untuk konsistensi UI
        setClickedRegion(selectedProvince)
      }
    }
  }, [selectedProvince, map])

  // Effect untuk zoom ke kabupaten yang dipilih
  useEffect(() => {
    if (map && selectedKabupaten && kabupatenGeoJSONData[selectedKabupaten]) {
      const selectedFeature = kabupatenGeoJSONData[selectedKabupaten]

      if (selectedFeature) {
        // Buat bounds dari koordinat polygon
        const coordinates = selectedFeature.geometry.coordinates[0]
        const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]])

        // Zoom ke bounds wilayah yang dipilih
        map.fitBounds(latLngs)

        // Update clickedRegion untuk konsistensi UI
        setClickedRegion(selectedKabupaten)
      }
    }
  }, [selectedKabupaten, map])

  const resetFilters = () => {
    setSelectedProvince("")
    setSelectedKabupaten("")
    setSelectedKecamatan("")
    setSelectedDesa("")
    setClickedRegion("")
  }

  return (
    <div className="w-full h-screen flex">
      {/* Panel Filter */}
      <Card className="w-80 h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Layer Batas Wilayah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Kontrol Overlay */}
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new-boundaries"
                  checked={showNewBoundaries}
                  onCheckedChange={(checked) => setShowNewBoundaries(checked === true)}
                />
                <label htmlFor="new-boundaries" className="text-sm">
                  Batas Wilayah Baru
                </label>
                <Badge variant="outline" className="text-blue-600">
                  Biru
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="old-boundaries"
                  checked={showOldBoundaries}
                  onCheckedChange={(checked) => setShowOldBoundaries(checked === true)}
                />
                <label htmlFor="old-boundaries" className="text-sm">
                  Batas Wilayah Lama
                </label>
                <Badge variant="outline" className="text-red-600">
                  Merah
                </Badge>
              </div>
            </div>
          </div>

          {/* Filter Hierarkis */}
          <div className="space-y-3">
            <h3 className="font-semibold">Filter Administratif</h3>

            {/* Provinsi */}
            <div>
              <label className="text-sm font-medium mb-1 block">Provinsi</label>
              <Select value={selectedProvince} onValueChange={handleProvinceChange} >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Provinsi" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kabupaten */}
            {selectedProvince && (
              <div>
                <label className="text-sm font-medium mb-1 block">Kabupaten/Kota</label>
                <Select value={selectedKabupaten} onValueChange={handleKabupatenChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kabupaten/Kota" />
                  </SelectTrigger>
                  <SelectContent>
                    {kabupaten.map((kab) => (
                      <SelectItem key={kab} value={kab}>
                        {kab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Kecamatan */}
            {selectedKabupaten && (
              <div>
                <label className="text-sm font-medium mb-1 block">Kecamatan</label>
                <Select value={selectedKecamatan} onValueChange={handleKecamatanChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kecamatan.map((kec) => (
                      <SelectItem key={kec} value={kec}>
                        {kec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Desa */}
            {selectedKecamatan && (
              <div>
                <label className="text-sm font-medium mb-1 block">Desa/Kelurahan</label>
                <Select value={selectedDesa} onValueChange={setSelectedDesa}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Desa/Kelurahan" />
                  </SelectTrigger>
                  <SelectContent>
                    {desa.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={resetFilters} variant="outline" className="w-full">
              Reset Filter
            </Button>
          </div>

          {/* Info Wilayah Terpilih */}
          {(selectedProvince || clickedRegion) && (
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <h3 className="font-semibold text-sm">Wilayah Terpilih:</h3>
              {clickedRegion && <Badge variant="secondary">Diklik: {clickedRegion}</Badge>}
              {selectedProvince && (
                <div className="text-sm space-y-1">
                  <div>
                    Provinsi: <span className="font-medium">{selectedProvince}</span>
                  </div>
                  {selectedKabupaten && (
                    <div>
                      Kabupaten: <span className="font-medium">{selectedKabupaten}</span>
                    </div>
                  )}
                  {selectedKecamatan && (
                    <div>
                      Kecamatan: <span className="font-medium">{selectedKecamatan}</span>
                    </div>
                  )}
                  {selectedDesa && (
                    <div>
                      Desa: <span className="font-medium">{selectedDesa}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Peta */}
      <div className="flex-1 relative">
        <MapContainer center={[-2.5, 118]} zoom={5} style={{ height: "100%", width: "100%" }} whenCreated={setMap}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Batas Wilayah Baru */}
          {showNewBoundaries &&
            getFilteredGeoJSON().map((geoData, index) => (
              <GeoJSON
                key={`new-${index}-${selectedProvince}`}
                data={geoData}
                style={highlightSelectedRegion}
                onEachFeature={onEachFeature}
              />
            ))}

          {/* Batas Wilayah Lama */}
          {showOldBoundaries &&
            Object.values(oldBoundariesData)
              .filter((feature: any) => !selectedProvince || feature.properties.name.includes(selectedProvince))
              .map((geoData, index) => (
                <GeoJSON
                  key={`old-${index}-${selectedProvince}`}
                  data={geoData}
                  style={getFeatureStyle}
                  onEachFeature={onEachFeature}
                />
              ))}
        </MapContainer>

        {/* Kontrol Zoom */}
        {map && <MapControls map={map} />}

        {/* Info Panel */}
        <div className="z-[999] absolute bottom-15 left-4 bg-white p-3 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold text-gray-600 text-sm mb-2">Petunjuk Penggunaan:</h3>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• Klik wilayah pada peta untuk zoom</li>
            <li>• Gunakan filter untuk navigasi hierarkis</li>
            <li>• Toggle layer untuk melihat batas lama/baru</li>
            <li>• Hover pada wilayah untuk highlight</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
