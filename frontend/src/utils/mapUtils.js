// src/utils/mapUtils.js
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const getTileLayerUrl = (mapStyle) => {
  const styles = {
    default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };
  return styles[mapStyle] || styles.default;
};

export const createCustomMarkerIcon = (priority, status) => {
  const priorityConfig = {
    High: {
      color: "#dc2626",
      size: 40,
      innerSize: 16,
      pulseSize: 60,
      opacity: 0.7
    },
    Medium: {
      color: "#ea580c", 
      size: 32,
      innerSize: 12,
      pulseSize: 48,
      opacity: 0.6
    },
    Low: {
      color: "#16a34a",
      size: 24,
      innerSize: 8,
      pulseSize: 36,
      opacity: 0.5
    }
  };

  const config = priorityConfig[priority] || priorityConfig.Low;
  
  // Reduce opacity for resolved issues
  const statusOpacity = status === "Resolved" ? 0.3 : 
                       status === "In Progress" ? 0.8 : 1.0;
  
  const finalOpacity = config.opacity * statusOpacity;

  return L.divIcon({
    className: "hotspot-marker",
    html: `
      <div class="hotspot-container" style="position: relative; width: ${config.pulseSize}px; height: ${config.pulseSize}px;">
        <!-- Outer pulsing ring -->
        <div class="hotspot-pulse" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${config.pulseSize}px;
          height: ${config.pulseSize}px;
          border-radius: 50%;
          background: radial-gradient(circle, ${config.color}20 0%, ${config.color}10 50%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: hotspotPulse 2s infinite ease-out;
        "></div>
        
        <!-- Middle ring -->
        <div class="hotspot-middle" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${config.size}px;
          height: ${config.size}px;
          border-radius: 50%;
          background: radial-gradient(circle, ${config.color}60 0%, ${config.color}30 60%, transparent 80%);
          transform: translate(-50%, -50%);
          opacity: ${finalOpacity};
        "></div>
        
        <!-- Inner solid circle -->
        <div class="hotspot-center" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${config.innerSize}px;
          height: ${config.innerSize}px;
          border-radius: 50%;
          background: ${config.color};
          transform: translate(-50%, -50%);
          opacity: ${finalOpacity};
          box-shadow: 0 0 8px ${config.color}60;
        "></div>
        
        <!-- Priority indicator -->
        ${priority === "High" ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: white;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 4px rgba(0,0,0,0.3);
          "></div>
        ` : ''}
      </div>
      
      <style>
        @keyframes hotspotPulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.0);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }
        
        .hotspot-marker {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .hotspot-container:hover .hotspot-middle {
          transform: translate(-50%, -50%) scale(1.2);
          transition: transform 0.3s ease;
        }
        
        .hotspot-container:hover .hotspot-center {
          transform: translate(-50%, -50%) scale(1.3);
          transition: transform 0.3s ease;
        }
      </style>
    `,
    iconSize: [config.pulseSize, config.pulseSize],
    iconAnchor: [config.pulseSize / 2, config.pulseSize / 2],
  });
};

// Alternative: Simpler circular hotspot marker
export const createSimpleHotspotIcon = (priority, status) => {
  const priorityConfig = {
    High: { color: "#dc2626", size: 36, stroke: 3 },
    Medium: { color: "#ea580c", size: 28, stroke: 2 },
    Low: { color: "#16a34a", size: 20, stroke: 1 }
  };

  const config = priorityConfig[priority] || priorityConfig.Low;
  const opacity = status === "Resolved" ? 0.4 : 0.7;

  return L.divIcon({
    className: "simple-hotspot",
    html: `
      <div style="
        width: ${config.size}px;
        height: ${config.size}px;
        border-radius: 50%;
        background: ${config.color}40;
        border: ${config.stroke}px solid ${config.color};
        opacity: ${opacity};
        transition: all 0.3s ease;
        cursor: pointer;
      " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
    `,
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size / 2],
  });
};

// Heatmap-style circular marker
export const createHeatmapIcon = (priority, status, density = 1) => {
  const baseSize = 20;
  const size = baseSize + (density * 10); // Size based on issue density
  
  const colors = {
    High: "#dc2626",
    Medium: "#ea580c", 
    Low: "#16a34a"
  };
  
  const color = colors[priority] || colors.Low;
  const opacity = status === "Resolved" ? 0.3 : 0.6;
  
  return L.divIcon({
    className: "heatmap-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle, ${color}80 0%, ${color}40 50%, ${color}20 100%);
        opacity: ${opacity};
        transform: scale(1);
        transition: transform 0.2s ease;
      " class="heatmap-circle"></div>
      
      <style>
        .heatmap-circle:hover {
          transform: scale(1.3) !important;
        }
        .heatmap-marker {
          background: transparent !important;
          border: none !important;
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Minimal dot marker for high-density areas
export const createDotIcon = (priority, status) => {
  const colors = {
    High: "#dc2626",
    Medium: "#ea580c",
    Low: "#16a34a"
  };
  
  const sizes = {
    High: 12,
    Medium: 10,
    Low: 8
  };
  
  const color = colors[priority] || colors.Low;
  const size = sizes[priority] || sizes.Low;
  const opacity = status === "Resolved" ? 0.4 : 0.8;
  
  return L.divIcon({
    className: "dot-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        opacity: ${opacity};
        box-shadow: 0 0 6px ${color}60;
        border: 1px solid white;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Export the main function (you can switch between different styles)
export { createCustomMarkerIcon as createHotspotMarker };