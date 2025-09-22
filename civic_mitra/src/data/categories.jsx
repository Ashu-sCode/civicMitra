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
    icon: Car, // default group icon
    subcategories: [
      { name: "Roads & Transport Issues", icon: Car },
      { name: "Roads & Traffic Safety", icon: TrafficCone },
      { name: "Streetlights & Electricity", icon: Lightbulb },
      { name: "Civic Infrastructure", icon: Building2 },
      { name: "Transport & Public Vehicles", icon: Bus },
      { name: "Lighting & Street Safety", icon: Flashlight },
    ],
  },
  {
    group: "Sanitation & Cleanliness",
    icon: Trash2,
    subcategories: [
      { name: "Sanitation & Solid Waste", icon: Trash2 },
      { name: "Street Cleaning", icon: BrushCleaning },
      { name: "Parks & Public Spaces", icon: Trees },
      { name: "Environment & Public Health", icon: Leaf },
    ],
  },
  {
    group: "Water & Environment",
    icon: Droplet,
    subcategories: [
      { name: "Water Supply & Sewerage", icon: Droplet },
      { name: "Drinking Water & Quality", icon: CupSoda },
    ],
  },
  {
    group: "Public Health & Safety",
    icon: Shield,
    subcategories: [
      { name: "Public Safety & Law", icon: Shield },
      { name: "Disaster & Emergency", icon: AlertTriangle },
      { name: "Animal Welfare & Control", icon: Dog },
    ],
  },
  {
    group: "Education & Services",
    icon: BookOpen,
    subcategories: [
      { name: "Education & Libraries", icon: BookOpen },
      { name: "Citizen Services & Grievances", icon: ClipboardList },
    ],
  },
  {
    group: "Other",
    icon: Sparkles,
    subcategories: [
      { name: "Urban Planning & Zoning", icon: Map },
      { name: "Heritage & Monuments", icon: Landmark },
      { name: "Markets & Trade", icon: Store },
    ],
  },
];
