import { type Href } from 'expo-router';
import type React from 'react';

export interface TabItem {
  id: string;
  icon: React.ElementType;
  label: string;
  route?: Href;
}
