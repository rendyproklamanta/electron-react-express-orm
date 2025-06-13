import { 
  ChevronRight, 
  ChevronDown, 
  Layers, 
  Filter, 
  Settings, 
  Info,
  Map,
  Satellite,
  Grid,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize, 
  Download, 
  Ruler,
  Navigation,
  X,
  MapPin
} from 'lucide-react';

interface LayerGroup {
  id: string;
  name: string;
  expanded: boolean;
  layers: Layer[];
}

interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  opacity: number;
}

interface SidebarProps {
  onLayerToggle?: (groupId: string, layerId: string, enabled: boolean) => void;
  onBasemapChange?: (basemap: string) => void;
  onFilterApply?: (filters: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLayerToggle, onBasemapChange, onFilterApply }) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'filter' | 'info'>('layers');
  const [selectedBasemap, setSelectedBasemap] = useState('topographic');
  const [filters, setFilters] = useState({
    province: '',
    regency: '',
    landUse: [] as string[]
  });
  
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>([
    {
      id: 'administrative',
      name: 'Batas Administrasi',
      expanded: true,
      layers: [
        { id: 'provinces', name: 'Batas Provinsi', enabled: true, opacity: 100 },
        { id: 'regencies', name: 'Batas Kabupaten/Kota', enabled: true, opacity: 80 },
        { id: 'districts', name: 'Batas Kecamatan', enabled: false, opacity: 60 }
      ]
    },
    {
      id: 'landuse',
      name: 'Penggunaan Lahan',
      expanded: false,
      layers: [
        { id: 'agricultural', name: 'Lahan Pertanian', enabled: false, opacity: 70 },
        { id: 'forest', name: 'Kawasan Hutan', enabled: false, opacity: 80 },
        { id: 'urban', name: 'Kawasan Perkotaan', enabled: false, opacity: 60 }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastruktur',
      expanded: false,
      layers: [
        { id: 'roads', name: 'Jalan', enabled: true, opacity: 90 },
        { id: 'railways', name: 'Jalur Kereta Api', enabled: false, opacity: 85 },
        { id: 'airports', name: 'Bandara', enabled: false, opacity: 100 }
      ]
    }
  ]);

  const toggleGroup = (groupId: string) => {
    setLayerGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, expanded: !group.expanded }
        : group
    ));
  };

  const toggleLayer = (groupId: string, layerId: string) => {
    setLayerGroups(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            layers: group.layers.map(layer => 
              layer.id === layerId 
                ? { ...layer, enabled: !layer.enabled }
                : layer
            )
          }
        : group
    ));
    
    // Find the layer and call the callback
    const group = layerGroups.find(g => g.id === groupId);
    const layer = group?.layers.find(l => l.id === layerId);
    if (layer && onLayerToggle) {
      onLayerToggle(groupId, layerId, !layer.enabled);
    }
  };

  const updateOpacity = (groupId: string, layerId: string, opacity: number) => {
    setLayerGroups(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            layers: group.layers.map(layer => 
              layer.id === layerId 
                ? { ...layer, opacity }
                : layer
            )
          }
        : group
    ));
  };

  const handleBasemapChange = (basemap: string) => {
    setSelectedBasemap(basemap);
    if (onBasemapChange) {
      onBasemapChange(basemap);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLandUseToggle = (landUse: string) => {
    setFilters(prev => ({
      ...prev,
      landUse: prev.landUse.includes(landUse)
        ? prev.landUse.filter(item => item !== landUse)
        : [...prev.landUse, landUse]
    }));
  };

  const applyFilters = () => {
    if (onFilterApply) {
      onFilterApply(filters);
    }
    // Show notification
    alert('Filter berhasil diterapkan!');
  };

  const resetFilters = () => {
    setFilters({
      province: '',
      regency: '',
      landUse: []
    });
    if (onFilterApply) {
      onFilterApply({
        province: '',
        regency: '',
        landUse: []
      });
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'layers'
              ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Layer</span>
        </button>
        <button
          onClick={() => setActiveTab('filter')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'filter'
              ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'info'
              ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Info className="h-4 w-4" />
          <span>Info</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'layers' && (
          <div className="p-4 space-y-4">
            {/* Base Map Selection */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Peta Dasar</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="basemap" 
                    value="topographic"
                    checked={selectedBasemap === 'topographic'}
                    onChange={(e) => handleBasemapChange(e.target.value)}
                    className="text-red-600" 
                  />
                  <Map className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Topografi</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="basemap" 
                    value="satellite"
                    checked={selectedBasemap === 'satellite'}
                    onChange={(e) => handleBasemapChange(e.target.value)}
                    className="text-red-600" 
                  />
                  <Satellite className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Satelit</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="basemap" 
                    value="hybrid"
                    checked={selectedBasemap === 'hybrid'}
                    onChange={(e) => handleBasemapChange(e.target.value)}
                    className="text-red-600" 
                  />
                  <Grid className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">Hybrid</span>
                </label>
              </div>
            </div>

            {/* Layer Groups */}
            <div className="space-y-2">
              {layerGroups.map(group => (
                <div key={group.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700">{group.name}</span>
                    {group.expanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  
                  {group.expanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {group.layers.map(layer => (
                        <div key={layer.id} className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={layer.enabled}
                                onChange={() => toggleLayer(group.id, layer.id)}
                                className="text-red-600 rounded"
                              />
                              <span className="text-sm text-gray-700">{layer.name}</span>
                            </label>
                            <button
                              onClick={() => toggleLayer(group.id, layer.id)}
                              className="p-1 hover:bg-gray-200 rounded"
                              title={layer.enabled ? 'Sembunyikan layer' : 'Tampilkan layer'}
                            >
                              {layer.enabled ? (
                                <Eye className="h-3 w-3 text-gray-600" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                          {layer.enabled && (
                            <div className="pl-6">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Transparansi:</span>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={layer.opacity}
                                  onChange={(e) => updateOpacity(group.id, layer.id, parseInt(e.target.value))}
                                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-xs text-gray-500 w-8">{layer.opacity}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'filter' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi</label>
              <select 
                value={filters.province}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Semua Provinsi</option>
                <option value="jakarta">DKI Jakarta</option>
                <option value="jabar">Jawa Barat</option>
                <option value="jateng">Jawa Tengah</option>
                <option value="jatim">Jawa Timur</option>
                <option value="banten">Banten</option>
                <option value="yogya">DI Yogyakarta</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kabupaten/Kota</label>
              <select 
                value={filters.regency}
                onChange={(e) => handleFilterChange('regency', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={!filters.province}
              >
                <option value="">Semua Kabupaten/Kota</option>
                {filters.province === 'jakarta' && (
                  <>
                    <option value="jakpus">Jakarta Pusat</option>
                    <option value="jaksel">Jakarta Selatan</option>
                    <option value="jakut">Jakarta Utara</option>
                    <option value="jakbar">Jakarta Barat</option>
                    <option value="jaktim">Jakarta Timur</option>
                  </>
                )}
                {filters.province === 'jabar' && (
                  <>
                    <option value="bandung">Kota Bandung</option>
                    <option value="bogor">Kota Bogor</option>
                    <option value="bekasi">Kota Bekasi</option>
                    <option value="depok">Kota Depok</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Penggunaan Lahan</label>
              <div className="space-y-2">
                {['Pertanian', 'Perumahan', 'Industri', 'Komersial', 'Hutan', 'Perairan'].map(landUse => (
                  <label key={landUse} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.landUse.includes(landUse)}
                      onChange={() => handleLandUseToggle(landUse)}
                      className="text-red-600 rounded" 
                    />
                    <span className="text-sm">{landUse}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={applyFilters}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Terapkan Filter
              </button>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="p-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Tentang Peta Bhumi</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Portal peta digital yang menyediakan informasi spasial pertanahan Indonesia
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Koordinat</span>
                <span className="text-sm font-mono">-6.175°, 106.827°</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Skala</span>
                <span className="text-sm font-mono">1:50,000</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Proyeksi</span>
                <span className="text-sm">Web Mercator</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Sumber Data</span>
                <span className="text-sm">BPN RI</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">Legenda</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-xs text-yellow-800">Kawasan Hutan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs text-yellow-800">Badan Air</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-xs text-yellow-800">Kawasan Terbangun</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-xs text-yellow-800">Lahan Pertanian</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-xs text-yellow-800">Kawasan Industri</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Statistik</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total Layer Aktif:</span>
                  <span className="font-mono">{layerGroups.reduce((acc, group) => acc + group.layers.filter(l => l.enabled).length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Zoom Level:</span>
                  <span className="font-mono">10</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolusi:</span>
                  <span className="font-mono">~38m/pixel</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapContainerProps {
  searchQuery?: string;
  basemap?: string;
  layers?: any;
}

// Component to handle map events and updates
const MapEventHandler: React.FC<{
  onMove: (center: L.LatLng, zoom: number) => void;
}> = ({ onMove }) => {
  const map = useMap();
  
  useMapEvents({
    move: () => {
      onMove(map.getCenter(), map.getZoom());
    },
    zoom: () => {
      onMove(map.getCenter(), map.getZoom());
    }
  });

  return null;
};

// Measurement tool component
const MeasurementTool: React.FC<{
  isActive: boolean;
  onClose: () => void;
}> = ({ isActive, onClose }) => {
  const map = useMap();
  const [measurements, setMeasurements] = useState<L.LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);

  useMapEvents({
    click: (e) => {
      if (isActive) {
        const newMeasurements = [...measurements, e.latlng];
        setMeasurements(newMeasurements);
        
        if (newMeasurements.length > 1) {
          let total = 0;
          for (let i = 1; i < newMeasurements.length; i++) {
            total += newMeasurements[i-1].distanceTo(newMeasurements[i]);
          }
          setTotalDistance(total);
        }
      }
    }
  });

  const clearMeasurements = () => {
    setMeasurements([]);
    setTotalDistance(0);
  };

  if (!isActive) return null;

  return (
    <div className="absolute top-20 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-64">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Alat Ukur</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2 text-sm">
        <p>Klik pada peta untuk mulai mengukur jarak</p>
        <div className="bg-gray-50 p-2 rounded">
          <div className="flex justify-between">
            <span>Total Jarak:</span>
            <span className="font-mono">{(totalDistance / 1000).toFixed(2)} km</span>
          </div>
          <div className="flex justify-between">
            <span>Titik:</span>
            <span className="font-mono">{measurements.length}</span>
          </div>
        </div>
        <button 
          onClick={clearMeasurements}
          className="w-full bg-gray-100 hover:bg-gray-200 py-1 px-2 rounded text-xs"
        >
          Hapus Pengukuran
        </button>
      </div>
    </div>
  );
};

const MapContainer: React.FC<MapContainerProps> = ({ searchQuery, basemap = 'topographic', layers }) => {
  const [center, setCenter] = useState<[number, number]>([-6.175, 106.827]);
  const [zoom, setZoom] = useState(10);
  const [currentCenter, setCurrentCenter] = useState<L.LatLng | null>(null);
  const [currentZoom, setCurrentZoom] = useState(10);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample polygon data for demonstration
  const samplePolygon: [number, number][] = [
    [-6.1, 106.8],
    [-6.1, 106.9],
    [-6.2, 106.9],
    [-6.2, 106.8],
    [-6.1, 106.8]
  ];

  // Handle search functionality
  useEffect(() => {
    if (searchQuery && mapRef.current) {
      // Simple geocoding simulation - in real app, use a geocoding service
      const locations: { [key: string]: [number, number] } = {
        'jakarta': [-6.175, 106.827],
        'bandung': [-6.917, 107.619],
        'surabaya': [-7.257, 112.752],
        'medan': [3.595, 98.672],
        'semarang': [-6.966, 110.417],
        'makassar': [-5.147, 119.432],
        'palembang': [-2.998, 104.756],
        'tangerang': [-6.178, 106.631],
        'bekasi': [-6.238, 106.975],
        'depok': [-6.402, 106.794]
      };

      const searchLower = searchQuery.toLowerCase();
      const foundLocation = Object.keys(locations).find(key => 
        key.includes(searchLower) || searchLower.includes(key)
      );

      if (foundLocation) {
        const [lat, lng] = locations[foundLocation];
        mapRef.current.setView([lat, lng], 12);
        
        // Add a temporary marker
        const marker = L.marker([lat, lng])
          .addTo(mapRef.current)
          .bindPopup(`Hasil pencarian: ${searchQuery}`)
          .openPopup();
        
        // Remove marker after 5 seconds
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.removeLayer(marker);
          }
        }, 5000);
      }
    }
  }, [searchQuery]);

  const handleMapMove = (newCenter: L.LatLng, newZoom: number) => {
    setCurrentCenter(newCenter);
    setCurrentZoom(newZoom);
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleMeasure = () => {
    setIsMeasuring(!isMeasuring);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    try {
      // In a real app, you would capture the map as an image
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple download
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.fillText('Peta Bhumi - Screenshot', 50, 50);
        ctx.fillText(`Koordinat: ${currentCenter?.lat.toFixed(4)}, ${currentCenter?.lng.toFixed(4)}`, 50, 100);
        ctx.fillText(`Zoom: ${currentZoom.toFixed(2)}`, 50, 150);
        ctx.fillText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 50, 200);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `peta-bhumi-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      });
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Gagal mengunduh peta. Silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  // Get tile layer URL based on basemap selection
  const getTileLayerUrl = () => {
    switch (basemap) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'hybrid':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (basemap) {
      case 'satellite':
      case 'hybrid':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  return (
    <div ref={containerRef} className="flex-1 relative">
      <LeafletMapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        {/* Base tile layers */}
        <TileLayer
          attribution={getTileLayerAttribution()}
          url={getTileLayerUrl()}
        />
        
        {/* Hybrid overlay for street names */}
        {basemap === 'hybrid' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            opacity={0.3}
          />
        )}

        {/* Sample marker */}
        <Marker position={[-6.175, 106.827]}>
          <Popup>
            <div className="text-center">
              <strong>Jakarta, Indonesia</strong><br />
              Ibu Kota Negara<br />
              <small>Koordinat: -6.175, 106.827</small>
            </div>
          </Popup>
        </Marker>

        {/* Additional sample markers */}
        <Marker position={[-6.917, 107.619]}>
          <Popup>
            <div className="text-center">
              <strong>Bandung, Jawa Barat</strong><br />
              Kota Kembang
            </div>
          </Popup>
        </Marker>

        {/* Sample polygon */}
        <Polygon
          positions={samplePolygon}
          pathOptions={{
            color: '#dc2626',
            fillColor: '#dc2626',
            fillOpacity: 0.3,
            weight: 2
          }}
        >
          <Popup>
            <div className="text-center">
              <strong>Area Contoh</strong><br />
              Kawasan Demonstrasi<br />
              <small>Luas: ~1,234 Ha</small>
            </div>
          </Popup>
        </Polygon>

        {/* Map event handler */}
        <MapEventHandler onMove={handleMapMove} />
        
        {/* Measurement tool */}
        <MeasurementTool isActive={isMeasuring} onClose={() => setIsMeasuring(false)} />
      </LeafletMapContainer>

      {/* Coordinate Display */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm font-mono z-[1000]">
        <div className="flex items-center space-x-4">
          <span>Lng: {currentCenter?.lng.toFixed(4) || center[1].toFixed(4)}</span>
          <span>Lat: {currentCenter?.lat.toFixed(4) || center[0].toFixed(4)}</span>
          <span>Zoom: {currentZoom.toFixed(2)}</span>
        </div>
      </div>

      {/* Custom Controls */}
      <div className="absolute top-4 right-4 space-y-2 z-[1000]">
        <div className="bg-white rounded-lg shadow-lg p-1">
          <button
            onClick={handleZoomIn}
            className="block w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Perbesar"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="block w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Perkecil"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-1">
          <button
            onClick={handleResetView}
            className="block w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Reset View"
          >
            <Navigation className="h-4 w-4" />
          </button>
          <button
            onClick={handleFullscreen}
            className="block w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
            title="Layar Penuh"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tools Panel */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 z-[1000]">
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleMeasure}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              isMeasuring 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Ruler className="h-4 w-4" />
            <span>Ukur</span>
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? 'Mengunduh...' : 'Unduh'}</span>
          </button>
          <button 
            onClick={handleAnalysis}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              showAnalysis 
                ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Analisis</span>
          </button>
        </div>
      </div>

      {/* Analysis Panel */}
      {showAnalysis && (
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Panel Analisis</h3>
            <button onClick={() => setShowAnalysis(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-medium mb-2">Statistik Area Tampilan</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Luas Area:</span>
                  <span className="font-mono">~{Math.round(Math.pow(2, 20 - currentZoom) * 0.1)} km²</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolusi:</span>
                  <span className="font-mono">~{Math.round(156543.03392 / Math.pow(2, currentZoom))}m/pixel</span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-medium mb-2">Analisis Cepat</h4>
              <div className="space-y-2">
                <button className="w-full text-left p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                  📊 Analisis Penggunaan Lahan
                </button>
                <button className="w-full text-left p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                  🌍 Analisis Perubahan Temporal
                </button>
                <button className="w-full text-left p-2 bg-white rounded hover:bg-gray-50 transition-colors">
                  📈 Laporan Statistik
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scale Bar */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-2 text-sm z-[1000]">
        <div className="flex items-center space-x-2">
          <span>Skala:</span>
          <span className="font-mono">1:{Math.round(591657527.591555 / Math.pow(2, currentZoom))}</span>
        </div>
      </div>
    </div>
  );
};


function MapGisTwo() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [basemap, setBasemap] = useState<string>('topographic');
  const [layers, setLayers] = useState<any>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.warn('Searching for:', query);
  };

  const handleLayerToggle = (groupId: string, layerId: string, enabled: boolean) => {
    console.warn('Layer toggled:', { groupId, layerId, enabled });
    // In a real app, this would update the map layers
  };

  const handleBasemapChange = (newBasemap: string) => {
    setBasemap(newBasemap);
    console.warn('Basemap changed to:', newBasemap);
  };

  const handleFilterApply = (filters: any) => {
    console.warn('Filters applied:', filters);
    // In a real app, this would filter the map data
  };

  return (
    <div className="min-h-[95vh] bg-gray-50 flex flex-col">
      <div className="flex-1 flex relative">
        <Sidebar 
          onLayerToggle={handleLayerToggle}
          onBasemapChange={handleBasemapChange}
          onFilterApply={handleFilterApply}
        />
        <MapContainer 
          searchQuery={searchQuery}
          basemap={basemap}
          layers={layers}
        />
      </div>
    </div>
  );
}

export default MapGisTwo;