import { Image, Text, View } from 'react-native';

export default function Logo({ textSize = 'text-lg' }: { textSize?: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Image
        source={require('../../assets/logo.png')}
        className="h-7 w-7"
        resizeMode="contain"
      />
      <Text
        className={`${textSize} font-Poppins_700Bold tracking-tight text-text`}
      >
        CryptoLens
      </Text>
    </View>
  );
}
