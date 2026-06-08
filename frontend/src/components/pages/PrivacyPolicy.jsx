import React from "react";

const PrivacyPolicy = () => {
  const paragraphs = [
    "Introduction",
    "This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website.",
    "Information We Collect",
    "We may collect information that you voluntarily provide to us, such as your name, email address, and messages when you use contact forms or subscribe to our newsletter.",
    "Usage Information",
    "We may automatically collect certain information about your device and usage of the site, including IP address, browser type, pages visited, and the dates/times of access.",
    "How We Use Information",
    "We use the information we collect to respond to inquiries, provide and improve our services, send transactional messages, and for analytics purposes.",
    "Sharing Your Information",
    "We do not sell personal information. We may share information with service providers who perform services on our behalf, such as hosting, analytics, and email delivery.",
    "Security",
    "We take reasonable measures to protect information, but no electronic transmission or storage is completely secure.",
    "Cookies and Tracking",
    "We may use cookies and similar technologies to analyze trends, administer the site, track users’ movements, and gather demographic information.",
    "Third-Party Links",
    "Our site may contain links to third-party websites. We are not responsible for the privacy practices of such other sites.",
    "Children's Privacy",
    "Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.",
    "Your Choices",
    "You may opt out of receiving promotional communications from us by following the unsubscribe instructions in those communications.",
    "Data Retention",
    "We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required or permitted by law.",
    "Changes to This Policy",
    "We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new Privacy Policy on this page.",
    "Contact Us",
    "If you have questions about this Privacy Policy, please contact us via the contact page.",
  ];

  

  return (
    <div className="container mx-auto p-8">
      <section className="bg-[#2d2d2d] text-white p-12 rounded-md mb-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-[15px] leading-relaxed">
          This Privacy Policy explains how we handle personal information on
          this website. The text below is a placeholder for a typical policy.
        </p>
      </section>

      <div className="space-y-6">
        {paragraphs.map((p, idx) => (
          <p key={idx} className={idx % 2 === 0 ? "text-2xl font-semibold" : "text-[15px] leading-relaxed"}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
