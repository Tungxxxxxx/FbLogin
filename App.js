import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState(null);
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "1484540205670419",
  });
  useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
      })();
    }
  }, [response]);
  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== "success") {
      alert("something went wrong");
      return;
    }
  };
  return (
    <View style={styles.container}>
      {user ? (
        <Profile user={user} />
      ) : (
        <>
          <Text>Login with facebook</Text>
          <Button
            disabled={!request}
            title="Login with facebook"
            onPress={handlePressAsync}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

function Profile({ user }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>{user.name}</Text>
    </View>
  );
}
