import { callbackUrl, useLoginMutation } from "../../api/use-login-mutation.tsx";
import { baseUrl } from "../../../../shared/config/api-config.ts";

export const LoginButton = () => {
  const mutation = useLoginMutation();

  const handleLoginClick = () => {
    window.addEventListener("message", handleOauthMessage);
    window.open(
      `${baseUrl}auth/oauth-redirect?callbackUrl=${callbackUrl}`,
      "apihub-oauth2",
      "width=500, height=600",
    );
  };

  const handleOauthMessage = (event: MessageEvent) => {
    window.removeEventListener("message", handleOauthMessage);
    if (event.origin !== document.location.origin) {
      console.warn("origin not match");
    }
    const code = event.data.code;
    if (!code) {
      console.warn("no code in message");
    }

    mutation.mutate(code);
  };

  return <button onClick={handleLoginClick}>Login with APIHUB</button>;
};
