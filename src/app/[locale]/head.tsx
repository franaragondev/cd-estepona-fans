export default function Head() {
  return (
    <>
      <meta
        property="fb:app_id"
        content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
      />
    </>
  );
}
