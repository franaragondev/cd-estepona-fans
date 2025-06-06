import { useState, useRef } from "react";

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "bot"
  | "email_deleted"
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

    const honeypot = honeypotRef.current?.value || "";

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: new URLSearchParams({ email, honeypot }),
      });

      const data = await res.json();

      if (!res.ok) {
        switch (data.message) {
          case "bot_detected":
            setStatus("bot");
            setErrorMessage(t("botDetectedMessage"));
            break;
          case "invalid_email":
            setStatus("invalid_email");
            setErrorMessage(t("invalidEmailMessage"));
            break;
          case "email_deleted":
            setStatus("email_deleted");
            setErrorMessage(t("emailDeletedMessage"));
            break;
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
      console.log(error);
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
