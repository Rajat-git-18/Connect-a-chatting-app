import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import theme from "@/theme";

type ImageUploadCardProps = {
  uri: string | null;
  onChange: (uri: string | null) => void;
};

export default function ImageUploadCard({
  uri,
  onChange,
}: ImageUploadCardProps) {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Allow Connect to access your photos to attach an image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.85,
      allowsEditing: true,
      aspect: [16, 9],
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={pickImage}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Upload image"
      >
        {uri ? (
          <Image source={{ uri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconWrap}>
              <Ionicons
                name="image-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.title}>Add a cover image</Text>
            <Text style={styles.subtitle}>Optional · JPG or PNG</Text>
          </View>
        )}
      </TouchableOpacity>

      {uri ? (
        <TouchableOpacity
          style={styles.remove}
          onPress={() => onChange(null)}
          activeOpacity={0.85}
        >
          <Text style={styles.removeText}>Remove image</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 160,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    overflow: "hidden",
    ...theme.shadows.card,
  },

  preview: {
    width: "100%",
    height: "100%",
  },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },

  title: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text,
  },

  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },

  remove: {
    alignSelf: "center",
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },

  removeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    fontWeight: "500",
  },
});
