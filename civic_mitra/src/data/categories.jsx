// src/data/categoryGroups.js
import {
  Car,
  TrafficCone,
  Lightbulb,
  Building2,
  Bus,
  Flashlight,
  Trash2,
  BrushCleaning,
  Trees,
  Leaf,
  Droplet,
  CupSoda,
  Shield,
  AlertTriangle,
  Dog,
  BookOpen,
  ClipboardList,
  Map,
  Landmark,
  Store,
  Sparkles,
} from "lucide-react";

export const categories = [
  {
    group: "Infrastructure",
    icon: Car,
    subcategories: [
      { name: "Roads & Transport Issues", icon: Car, tooltip: "Potholes, broken roads, speed breakers" },
      { name: "Roads & Traffic Safety", icon: TrafficCone, tooltip: "Traffic signals, pedestrian safety, road markings" },
      { name: "Streetlights & Electricity", icon: Lightbulb, tooltip: "Streetlight outages or faulty electrical supply" },
      { name: "Civic Infrastructure", icon: Building2, tooltip: "Bridges, footpaths, public structures" },
      { name: "Transport & Public Vehicles", icon: Bus, tooltip: "Bus services, vehicle maintenance, scheduling" },
      { name: "Lighting & Street Safety", icon: Flashlight, tooltip: "Safety measures like reflective signs, lights" },
    ],
  },
  {
    group: "Sanitation & Cleanliness",
    icon: Trash2,
    subcategories: [
      { name: "Sanitation & Solid Waste", icon: Trash2, tooltip: "Garbage collection, bins, illegal dumping" },
      { name: "Street Cleaning", icon: BrushCleaning, tooltip: "Sweeping streets, clearing litter" },
      { name: "Parks & Public Spaces", icon: Trees, tooltip: "Maintenance of parks, gardens, open spaces" },
      { name: "Environment & Public Health", icon: Leaf, tooltip: "Pollution, hygiene, green initiatives" },
    ],
  },
  {
    group: "Water & Environment",
    icon: Droplet,
    subcategories: [
      { name: "Water Supply & Sewerage", icon: Droplet, tooltip: "Pipeline issues, sewage management" },
      { name: "Drinking Water & Quality", icon: CupSoda, tooltip: "Tap water quality, contamination issues" },
    ],
  },
  {
    group: "Public Health & Safety",
    icon: Shield,
    subcategories: [
      { name: "Public Safety & Law", icon: Shield, tooltip: "Law enforcement, crime, street safety" },
      { name: "Disaster & Emergency", icon: AlertTriangle, tooltip: "Floods, fire, accidents, emergency response" },
      { name: "Animal Welfare & Control", icon: Dog, tooltip: "Stray animals, animal cruelty, rescue" },
    ],
  },
  {
    group: "Education & Services",
    icon: BookOpen,
    subcategories: [
      { name: "Education & Libraries", icon: BookOpen, tooltip: "School issues, libraries, educational resources" },
      { name: "Citizen Services & Grievances", icon: ClipboardList, tooltip: "Service requests, complaints, government forms" },
    ],
  },
  {
    group: "Other",
    icon: Sparkles,
    subcategories: [
      { name: "Urban Planning & Zoning", icon: Map, tooltip: "Land use, city planning, building approvals" },
      { name: "Heritage & Monuments", icon: Landmark, tooltip: "Maintenance, protection of heritage sites" },
      { name: "Markets & Trade", icon: Store, tooltip: "Local markets, trade regulations, permits" },
    ],
  },
];
