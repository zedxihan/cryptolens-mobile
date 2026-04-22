import { Calendar, Heart, Mail, Settings, Star, X } from 'lucide-react-native';
import { Linking, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ActionButtonProps, MobileDrawerProps } from '../../types';

const ActionButton = ({
  icon: Icon,
  label,
  url,
  color,
  onClose,
}: ActionButtonProps) => (
  <Pressable
    onPress={() => {
      Linking.openURL(url);
      onClose();
    }}
    className="w-full flex-row items-center justify-start gap-3 rounded-xl border border-border-2 bg-surface-2 px-4 py-3 active:scale-95"
  >
    <Icon size={18} color={color} fill={color} />
    <Text className="text-sm font-medium text-text">{label}</Text>
  </Pressable>
);

export default function MobileDrawer({
  isVisible,
  onClose,
  onAction,
}: MobileDrawerProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 flex-row justify-end bg-black/60">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="h-full w-[65vw] border-l border-border-2 bg-surface shadow-2xl">
          <View
            className="flex-row items-center justify-between border-b border-border-2 px-4 py-3"
            style={{ paddingTop: insets.top + 8 }}
          >
            <Text className="text-lg font-semibold text-text">Menu</Text>
            <Pressable
              onPress={onClose}
              className="rounded-xl bg-surface-2 p-2 active:bg-white/5"
            >
              <X size={20} color="#86a79b" />
            </Pressable>
          </View>

          <View className="gap-3 p-4">
            <ActionButton
              icon={Star}
              label="Star on GitHub"
              url="https://github.com/zedxihan/cryptolens"
              color="#86a79b"
              onClose={onClose}
            />
            <ActionButton
              icon={Heart}
              label="Donate"
              url="https://patreon.com/zedxihan"
              color="#eb2f96"
              onClose={onClose}
            />

            <View className="my-1 h-px w-full bg-border-2" />
            <View className="mt-1 flex-row items-center justify-between gap-2">
              {[
                { id: 'calendar', icon: Calendar, label: 'Calendar' },
                { id: 'settings', icon: Settings, label: 'Settings' },
                { id: 'mail', icon: Mail, label: 'Contact' },
              ].map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => onAction(item.id)}
                  className="h-12 flex-1 items-center justify-center rounded-xl border border-border-2 bg-surface-2 active:scale-95"
                >
                  <item.icon size={20} color="#86a79b" />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
