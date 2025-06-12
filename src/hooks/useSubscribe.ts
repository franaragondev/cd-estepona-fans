import { useState, useRef } from "react";

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "bot"
  | "invalid_email"
  | "server_error";

export function useSubscribe(t: (key: string) => string) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("invalid_email");
      setErrorMessage(t("invalidEmailMessage"));
      return;
    }

    const honeypotValue = honeypotRef.current?.value || "";
    if (honeypotValue) {
      setStatus("bot");
      setErrorMessage(t("botDetectedMessage"));
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        switch (data.error) {
          case "Invalid email":
          case "invalid_email":
            setStatus("invalid_email");
            setErrorMessage(t("invalidEmailMessage"));
            break;
          case "Bot detected":
            setStatus("bot");
            setErrorMessage(t("botDetectedMessage"));
            break;
          case "Email already subscribed":
            setStatus("error");
            setErrorMessage(t("emailAlreadySubscribedMessage") || data.error);
            break;
          case "Server error":
          case "server_error":
            setStatus("server_error");
            setErrorMessage(t("serverErrorMessage"));
            break;
          default:
            setStatus("error");
            setErrorMessage(t("genericErrorMessage"));
        }
        return;
      }

      setStatus("success");
      setErrorMessage("");
      setEmail("");
      if (honeypotRef.current) honeypotRef.current.value = "";
    } catch (error) {
      setStatus("server_error");
      setErrorMessage(t("serverErrorMessage"));
      console.error(error);
    }
  };

  return {
    email,
    setEmail,
    status,
    errorMessage,
    honeypotRef,
    handleSubmit,
  };
}
