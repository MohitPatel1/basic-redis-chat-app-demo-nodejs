import WelcomeBack from "@/assets/images/welcome-back.png";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
const WelcomeBackImage = Image.resolveAssetSource(WelcomeBack).uri;

const DEMO_USERS = ["Pablo", "Joe", "Mary", "Alex"];

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
  dropdownOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  row: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownBlock: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    borderWidth: 1,
    borderTopWidth: 0,
  },
  dropdownItem: {
    padding: 10,
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(85, 110, 230, 0.25)',
    padding: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  welcomeText: {
    color: '#556ee6', // primary color
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -36,
    left: 20,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eff2f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    paddingTop: 58,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  label: {
    fontSize: 12,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#556ee6',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  }
});

const UsernameSelect = ({ username, setUsername, names = [""] }: { username: string, setUsername: Dispatch<SetStateAction<string>>, names: string[] }) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(200);
  const ref = useRef<TouchableOpacity>(null);

  useEffect(() => {
    if (open) {
      /** @ts-ignore */
      ref.current?.focus();
    }
  }, [open]);

  return (
    <TouchableOpacity
      ref={ref}
      style={[styles.dropdown, open && styles.dropdownOpen]}
      onPress={() => setOpen((o) => !o)}
    >
      <View style={styles.row}>
        <Text>{username}</Text>
        <View>
          {/* <Svg width={24} height={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <Path d="M7 10l5 5 5-5z" fill="#333" />
          </Svg> */}
        </View>
      </View>
      {open && (
        <View style={[styles.dropdownBlock, { width }]}>
          {names.map((name) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              key={name}
              onPress={() => setUsername(name)}
            >
              <Text>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};


export const Login = ({ onLogIn }: { onLogIn: (username: string, password: string, onError: (error?: string | null) => void) => void }) => {
  const [username, setUsername] = useState(
    () => DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)]
  );
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null | undefined>(null);

  const onSubmit = () => {
    onLogIn(username, password, setError);
  };

  return (
    <View style={styles.container}>
    <Image 
      source={{ uri: WelcomeBackImage }}
      style={{ width: 100, height: 100 }}
      // resizeMode="contain"
    />
      <View style={styles.welcomeContainer}>
        <View style={{ position: 'relative', width: 90 }}>
          <View style={styles.logoContainer}>
            {/* Replace with your RN compatible Logo component */}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.welcomeText, styles.heading]}>Welcome Back !</Text>
          <Text style={styles.welcomeText}>Sign in to continue</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <UsernameSelect
          username={username}
          setUsername={setUsername}
          names={DEMO_USERS}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder="Password"
        />

        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </View>
  );
};