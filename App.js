//android: 100761456125-194nq3bsj67li17euqe4sbp7abnm5ank.apps.googleusercontent.com

import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { Button } from "react-native";

import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // const [request, response, promptAsync] = Facebook.useAuthRequest({
  //   clientId: "1484540205670419",
  //   scopes: ["public_profile", "user_birthday", "user_location"],
  // });
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "100761456125-194nq3bsj67li17euqe4sbp7abnm5ank.apps.googleusercontent.com",
  });
  useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,name,email,birthday,picture.type(large)&access_token=${response.authentication.accessToken}`
        );
        const userInfo = await userInfoResponse.json();
        console.log(JSON.stringify(userInfo));
        setUser(userInfo);
        setToken(response.authentication.accessToken);
      })();
    }
  }, [response]);
  const handlePressAsync = async () => {
    const result = await promptAsync();
    console.log(result);
    if (result.type === "error") {
      if (result.params.error === "access_denied") {
        return;
      }
      alert("Lỗi đăng kkk");
    }
  };
  const handleLogOut = async (userId, token) => {
    const apiUrl = `https://graph.facebook.com/${userId}/permissions?access_token=${token}`;
    fetch(apiUrl, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Permissions revoked successfully:", data);
      })
      .catch((error) => {
        console.error("Error revoking permissions:", error);
      });
    // Xóa thông tin người dùng từ state để chuyển về màn hình đăng nhập lại
    setUser(null);
    setToken(null);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Profile user={user} handleLogOut={handleLogOut} />
          <Button
            title="Logout"
            onPress={() => {
              handleLogOut(user.id, token);
            }}
          />
        </>
      ) : (
        <>
          <Button
            disabled={!request}
            title="Login with facebook"
            onPress={handlePressAsync}
          />
          <Button
            disabled={!request}
            title="Login with google"
            onPress={promptAsync}
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
      <SafeAreaView>
        <StatusBar />
        <Image
          source={{
            uri: `http://graph.facebook.com/${user.id}/picture?type=large&redirect=true&width=200&height=200`,
          }}
          width={100}
          height={200}
        />
        <Text>{user.name}</Text>
        <Text>{user.id}</Text>
        <Text>{user.email}</Text>
        <Text>{user.birthday}</Text>
      </SafeAreaView>
    </View>
  );
}
