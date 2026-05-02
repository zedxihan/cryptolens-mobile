import { Bug, Heart, Mail, Star, Sun, X } from 'lucide-react-native';
import type { ElementType } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ActionButtonProps {
  icon: ElementType;
  label: string;
  url: string;
  color: string;
  activeColor: string;
  className?: string;
  textClassName?: string;
  onClose: () => void;
}

interface MobileDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const ACTION_BTNS = [
  {
    id: 'github',
    icon: Star,
    label: 'Star on GitHub',
    url: 'https://github.com/zedxihan/cryptolens',
    color: '#86a79b',
    activeColor: '#4ade80',
    className: 'active:border-[#4ade80]/50 active:bg-[#4ade80]/10',
    textClassName: 'group-active:text-[#4ade80]',
  },
  {
    id: 'donate',
    icon: Heart,
    label: 'Donate',
    url: 'https://patreon.com/zedxihan',
    color: '#eb2f96',
    activeColor: '#ff7eb3',
    className:
      'border-[#eb2f96]/20 bg-[#eb2f96]/10 active:border-[#eb2f96]/50 active:bg-[#eb2f96]/20',
    textClassName: 'group-active:text-[#ff7eb3]',
  },
];

const BOTTOM_BTNS = [
  {
    id: 'bug',
    icon: Bug,
    url: 'https://github.com/zedxihan/cryptolens/issues',
  },
  { id: 'mail', icon: Mail, url: 'mailto:support@cryptolens.link' },
  { id: 'theme', icon: Sun, url: null },
];

const ActionButton = ({
  icon: Icon,
  label,
  url,
  color,
  activeColor,
  className = '',
  textClassName = '',
  onClose,
}: ActionButtonProps) => {
  const containerClasses = `group w-full flex-row items-center justify-start gap-3 rounded-xl border border-border-2 bg-surface-2 px-4 py-3 transition-all active:scale-95 ${className}`;
  const textClasses = `font-pmedium text-md text-text transition-colors ${textClassName}`;

  return (
    <Pressable
      onPress={() => {
        Linking.openURL(url);
        onClose();
      }}
      className={containerClasses}
    >
      {({ pressed }) => {
        const iconColor = pressed ? activeColor : color;
        return (
          <>
            <Icon size={18} color={iconColor} fill={iconColor} />
            <Text className={textClasses}>{label}</Text>
          </>
        );
      }}
    </Pressable>
  );
};

export default function MobileDrawer({
  isVisible,
  onClose,
}: MobileDrawerProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      backdropOpacity={0.6}
      style={{ margin: 0, flexDirection: 'row', justifyContent: 'flex-start' }}
    >
      <View className="border-border-2 bg-surface h-full w-[65vw] border-l shadow-2xl">
        <View
          className="border-border-2 flex-row items-center justify-between border-b px-4 py-3"
          style={{ paddingTop: insets.top }}
        >
          <Text className="font-psemibold text-text text-lg">Menu</Text>
          <Pressable
            onPress={onClose}
            className="bg-surface-2 rounded-xl p-2 active:bg-white/5"
          >
            <X size={20} color="#86a79b" />
          </Pressable>
        </View>

        {/* Drawer Body */}
        <View className="gap-3 p-4">
          {ACTION_BTNS.map((item) => (
            <ActionButton key={item.id} {...item} onClose={onClose} />
          ))}

          <View className="bg-border-2 my-1 h-px w-full" />
          <View className="mt-1 flex-row items-center justify-between gap-2">
            {BOTTOM_BTNS.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (item.url) Linking.openURL(item.url);
                  onClose();
                }}
                className="border-border-2 bg-surface-2 h-14 flex-1 items-center justify-center rounded-xl border transition-all active:scale-95 active:bg-white/5"
              >
                <item.icon size={20} color="#86a79b" />
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
