"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#fdf8f5] flex flex-col items-center justify-center py-8 px-2">
      <div className="flex items-center justify-center mb-8">
        <Link href="/app">
          <img
            src="/logo%20wordmark.png"
            alt="Hilight Logo"
            className="h-12 object-contain cursor-pointer"
          />
        </Link>
      </div>
      <section className="w-full max-w-2xl bg-[#fdf8f5] rounded-2xl shadow-xl p-8 border border-gray-100 mb-8 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Privacy Policy</h1>
      <section className="mb-6">
        <p>Your privacy is important to us. This Privacy Policy explains how Hilight collects, uses, and protects your personal information when you use our Service.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6">
          <li><strong>Account Information:</strong> When you sign up, we collect your name and email address.</li>
          <li><strong>Usage Data:</strong> We collect information about how you use Hilight to improve the Service.</li>
          <li><strong>Content:</strong> We store your highlights, notes, and other content you create on the platform.</li>
        </ul>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6">
          <li>To provide and maintain the Service</li>
          <li>To communicate with you about your account</li>
          <li>To improve and personalize your experience</li>
          <li>To ensure the security of our platform</li>
        </ul>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with trusted service providers who help us operate Hilight, but only as necessary and under strict confidentiality agreements.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <p>We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Your Choices</h2>
        <p>You may update or delete your account information at any time. To request deletion of your data, contact us at support@hilight.app.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">6. Changes to Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes. Continued use of Hilight means you accept the updated policy.</p>
      </section>
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
        <p>If you have questions about this Privacy Policy, please contact us at support@hilight.app.</p>
      </section>
        <div className="flex justify-center mt-10">
          <Link href="/signup" className="inline-block px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold shadow hover:bg-blue-800 transition">Back</Link>
        </div>
      </section>
    </main>
  );
}
