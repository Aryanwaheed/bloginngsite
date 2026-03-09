import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#1C1917] mb-4">Privacy Policy</h1>
        <p className="text-[#6B7280] mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="prose prose-gray max-w-none space-y-8">
          {[
            { title: "1. Information We Collect", content: "We collect information you provide directly to us, such as when you submit a job application (name, phone number, message). We also collect usage data including pages visited, searches performed, and interactions with the platform." },
            { title: "2. How We Use Your Information", content: "We use the information we collect to provide and improve our services, connect job seekers with employers, deliver AI chat experiences, and analyze platform usage to enhance user experience." },
            { title: "3. Analytics & Tracking", content: "This platform uses a privacy-focused analytics system that tracks aggregate page views, feature clicks, active session counts, and general geographic location (country-level only). We do not store personally identifiable analytics information. Session identifiers are generated anonymously and stored in local storage to track returning visits without using traditional cookies." },
            { title: "4. Data Storage", content: "Your data is stored securely using Supabase infrastructure with industry-standard encryption. Job applications are stored in our database and accessible only to administrators." },
            { title: "5. AI Characters", content: "The AI virtual characters on our platform are powered by artificial intelligence. Conversations may be stored to improve the service. No conversation data is shared with third parties." },
            { title: "6. Cookies", content: "We use essential cookies for authentication and session management. No marketing tracking cookies are used without your consent." },
            { title: "7. Your Rights", content: "You have the right to access, correct, or delete your personal data. Contact us at privacy@workhub.com to exercise these rights." },
            { title: "8. Contact", content: "For privacy-related questions, please contact us at privacy@workhub.com." },
          ].map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-[#1C1917] mb-3">{section.title}</h2>
              <p className="text-[#6B7280] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
