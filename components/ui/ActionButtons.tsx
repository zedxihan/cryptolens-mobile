import { Heart, Star } from 'lucide-react-native';
import { Linking, Pressable, Text } from 'react-native';

export const GithubButton = () => (
  <Pressable
    onPress={() => Linking.openURL('https://github.com/zedxihan/cryptolens')}
    className="w-full flex-row items-center justify-start gap-3 rounded-xl border border-border-2 bg-surface-2 px-4 py-3 active:border-[#4ade80]/50 active:bg-[#4ade80]/10"
  >
    <Star size={18} color="#86a79b" />
    <Text className="font-Poppins_500Medium text-sm text-text">
      Star on GitHub
    </Text>
  </Pressable>
);

export const DonateButton = ({ onClick }: { onClick: () => void }) => (
  <Pressable
    onPress={onClick}
    className="w-full flex-row items-center justify-start gap-3 rounded-xl border border-[#eb2f96]/20 bg-[#eb2f96]/10 px-4 py-3 active:bg-[#eb2f96]/20"
  >
    <Heart size={18} color="#eb2f96" fill="#eb2f96" />
    <Text className="font-Poppins_500Medium text-sm text-white">Donate</Text>
  </Pressable>
);
