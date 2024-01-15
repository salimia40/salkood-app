import { Paper, Title, Text, Container, Stack } from "@mantine/core";
import RegisterForm from "./RegisterForm";

export default function Page() {
  return (
    <Container size={460} py={40}>
      <Title ta="center">Register your eccount</Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your personal info to register
      </Text>

      <Paper
        withBorder
        shadow="md"
        p={30}
        radius="md"
        mt="xl"
        component={Stack}
        gap="md"
      >
        <RegisterForm />
        <Text c="dimmed" size="xs">
          By clicking Register, you agree to our terms and conditions.
        </Text>
      </Paper>
    </Container>
  );
}
