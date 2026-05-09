import type { Coin } from '@/services/types';
import { Search, UserRoundPlus, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import logo from '@/assets/images/logo.svg';
import { Image } from '@/components/ui/Image';
import SearchResults from '@/components/ui/SearchResults';
import MobileDrawer from './MobileDrawer';

export default function Topbar() {
  const insets = useSafeAreaInsets();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleCoinPress = (coin: Coin) => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    // router.push(`/coin/${coin.id}`);
  };

  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidHide', () =>
      inputRef.current?.blur(),
    );
    return () => keyboardListener.remove();
  }, []);

  return (
    <View
      className="absolute inset-x-0 top-0 z-50 px-4"
      style={{ paddingTop: insets.top + 10 }}
    >
      <View className="flex-row items-center justify-between gap-4">
        <Pressable
          onPress={() => setIsMenuOpen(true)}
          className="active:opacity-70"
        >
          <Image
            source={logo}
            className="size-12 rounded-full"
            alt="Logo"
            contentFit="contain"
          />
        </Pressable>

        <View className="bg-surface-2/90 flex-1 flex-row items-center gap-3 rounded-full px-4 py-2.5">
          <Search size={24} color="#d8f1e7" />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search any coin"
            placeholderTextColor="#86a79b"
            className="font-pmedium text-text flex-1 p-0 text-base"
            returnKeyType="search"
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              className="active:opacity-70"
              hitSlop={10}
            >
              <X size={20} color="#d8f1e7" />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => {}}
          className="bg-surface-2/90 size-12 items-center justify-center rounded-full active:opacity-80"
        >
          <UserRoundPlus
            size={24}
            color="#d8f1e7"
            strokeWidth={2}
            style={{ marginLeft: 2.5 }}
          />
        </Pressable>
      </View>

      {query.length > 0 && (
        <>
          <Pressable
            className="absolute -inset-x-20 -top-96 h-[200vh] bg-black/30"
            onPress={() => {
              setQuery('');
              Keyboard.dismiss();
            }}
          />
          <View className="mt-2">
            <SearchResults query={query} onCoinPress={handleCoinPress} />
          </View>
        </>
      )}

      <MobileDrawer
        isVisible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </View>
  );
}
