import React from 'react';
import {
  Home, Users, Calendar, User, BarChart, Globe, Bell, ChevronDown,
  CheckCircle, DollarSign, Zap, Settings, TrendingUp, Wifi, Crown,
  Plus, Brain, Megaphone, Download, ArrowRight, Eye, Palette, Heart,
  BarChart3, ArrowUp, ArrowDown, Menu, Dumbbell, Upload, Play,
  Grid3X3, List, Star, MoreVertical, Edit, Copy, UserPlus, Trash,
  Clock, Activity, ArrowLeft, Save, Search, GripVertical, X, Library,
  UserCog, UserX, FileText, UserCheck, IdCard, Camera, UploadCloud, Phone,
  Shapes, UsersRound, BarChartHorizontal, Sparkles, ClipboardList,
  FileJson, FileUp, LineChart, Coins, CalendarCheck, PieChart,
  ShoppingBag, Radio, Layout, Package, Archive, AlertTriangle, MessageSquare, Trash2,
  Building2, Router
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Home,
  Users,
  Calendar,
  User,
  BarChart,
  Globe,
  Bell,
  ChevronDown,
  CheckCircle,
  DollarSign,
  Zap,
  Settings,
  TrendingUp,
  Wifi,
  Crown,
  Plus,
  Brain,
  Megaphone,
  Download,
  ArrowRight,
  Eye,
  Palette,
  Heart,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Menu,
  Dumbbell,
  Upload,
  Play,
  Grid3X3,
  List,
  Star,
  MoreVertical,
  Edit,
  Copy,
  UserPlus,
  Trash,
  Clock,
  Activity,
  ArrowLeft,
  Save,
  Search,
  GripVertical,
  X,
  Library,
  UserCog,
  UserX,
  FileText,
  UserCheck,
  IdCard,
  Camera,
  UploadCloud,
  Phone,
  Shapes,
  UsersRound,
  BarChartHorizontal,
  Sparkles,
  ClipboardList,
  FileJson,
  FileUp,
  LineChart,
  Coins,
  CalendarCheck,
  PieChart,
  ShoppingBag,
  Radio,
  Layout,
  Package,
  Archive,
  AlertTriangle,
  MessageSquare,
  Trash2,
  Building2,
  Router
};

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return <div className={className} style={{ width: size, height: size }} />;
  }

  return <IconComponent className={className} size={size} />;
};

export default Icon;