import Link from "next/link";

export default function NotFound() {
  return (
    <main className="login-page">
      <section className="login-panel">
        <p className="eyebrow">Not available</p>
        <h1>Record not found</h1>
        <p className="lede">
          The record may not exist, or your account may not have access to it.
        </p>
        <Link className="primary-button section" href="/">
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
