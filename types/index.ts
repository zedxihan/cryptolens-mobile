import { type Href } from 'expo-router';
import type React from 'react';

export interface TabItem {
  id: string;
  icon: React.ElementType;
  label: string;
  route?: Href;
}

export interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  url: string;
  color: string;
  onClose: () => void;
}

export interface MobileDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onAction: (type: string) => void;
}
