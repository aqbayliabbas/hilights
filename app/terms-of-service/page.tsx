"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#fdf8f5] flex flex-col items-center justify-center py-8 px-2">
      <div className="flex items-center justify-center mb-8">
        <Link href="/">
          <img
            src="/logo%20wordmark.png"
            alt="Hilight Logo"
            className="h-12 object-contain cursor-pointer"
          />
        </Link>
      </div>
      <section className="w-full max-w-2xl bg-[#fdf8f5] rounded-2xl shadow-xl p-8 border border-gray-100 mb-8 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Terms of Service</h1>
      <section className="mb-6">
        <p>Welcome to Hilight! These Terms of Service ("Terms") govern your use of the Hilight application (the "Service"). By creating an account or using Hilight, you agree to these Terms. Please read them carefully.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">1. Use of Service</h2>
        <p>Hilight is an educational platform designed to help users organize, highlight, and learn from digital content. You may use the Service only for lawful purposes and in accordance with these Terms.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. Account Registration</h2>
        <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. User Content</h2>
        <p>You retain ownership of the content you upload, highlight, or annotate on Hilight. By using the Service, you grant us a license to display and store your content as necessary to provide the Service.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Prohibited Conduct</h2>
        <ul className="list-disc ml-6">
          <li>Do not use Hilight for any illegal or unauthorized purpose.</li>
          <li>Do not attempt to access or interfere with other users' data.</li>
          <li>Do not upload malicious software or content.</li>
        </ul>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
        <p>We reserve the right to suspend or terminate your account if you violate these Terms or use the Service in a harmful manner.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">6. Changes to Terms</h2>
        <p>We may update these Terms from time to time. We will notify you of any material changes. Continued use of Hilight after changes means you accept the new Terms.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
        <p>If you have questions about these Terms, please contact us at support@hilight.app.</p>
      </section>
        <div className="flex justify-center mt-10">
          <Link href="/signup" className="inline-block px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold shadow hover:bg-blue-800 transition">Back</Link>
        </div>
      </section>
    </main>
  );
}
