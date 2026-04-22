import { Menu, Search, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '../../assets/logo.png';
import ComingSoonPopup from '../ui/ComingSoonPopup';
import MobileDrawer from './MobileDrawer';

export default function Topbar() {
  const insets = useSafeAreaInsets();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      Keyboard.dismiss();
      setQuery('');
    }
  }, [isSearchOpen]);

  const handleAction = (type: string) => {
    setIsMenuOpen(false);
    if (type === 'mail') {
      Linking.openURL('mailto:support@cryptolens.link');
    } else {
      setComingSoon(type);
      setTimeout(() => setComingSoon(null), 1500);
    }
  };

  return (
    <View className="z-50 w-full px-3" style={{ paddingTop: insets.top + 10 }}>
      <View className="flex-row items-center justify-between rounded-2xl border border-border-2 bg-surface-2 px-4 py-3 shadow-sm">
        {isSearchOpen ? (
          <View className="flex-1 flex-row items-center gap-2">
            <Search size={20} color="#86a79b" />
            <TextInput
              ref={searchInputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search coins..."
              placeholderTextColor="#86a79b"
              className="font-regular h-full flex-1 p-0 text-sm text-text"
              returnKeyType="search"
            />
            <Pressable onPress={() => setIsSearchOpen(false)} className="p-1">
              <X size={20} color="#86a79b" />
            </Pressable>
          </View>
        ) : (
          <>
            <View className="flex-row items-center gap-2">
              <Image
                source={logo}
                className="h-8 w-8"
                alt="Logo"
                resizeMode="contain"
              />
              <Text className="text-xl font-semibold tracking-tight text-text">
                CryptoLens
              </Text>
            </View>

            <View className="flex-row items-center gap-3">
              <Pressable onPress={() => setIsSearchOpen(true)}>
                <Search size={20} color="#d8f1e7" />
              </Pressable>
              <Pressable onPress={() => setIsMenuOpen(true)}>
                <Menu size={20} color="#d8f1e7" />
              </Pressable>
            </View>
          </>
        )}
      </View>

      <MobileDrawer
        isVisible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onAction={handleAction}
      />

      <ComingSoonPopup label={comingSoon} isVisible={!!comingSoon} />
    </View>
  );
}
