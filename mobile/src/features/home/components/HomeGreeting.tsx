import { Text, StyleSheet } from "react-native";
import theme from "@/theme";

type HomeGreetingProps = {
  name?: string;
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function HomeGreeting({ name = "Rajat" }: HomeGreetingProps) {
  return (
    <Text style={styles.text}>
      {getGreeting()}, {name} 👋
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
});
