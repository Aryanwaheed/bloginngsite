import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] font-jakarta">
      <SiteNavbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-[#1C1917] mb-4">Terms & Conditions</h1>
        <p className="text-[#6B7280] mb-8">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="space-y-8">
          {[
            { title: "1. Acceptance of Terms", content: "By accessing and using WorkHub, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform." },
            { title: "2. Use of Services", content: "WorkHub provides a job listing platform and AI virtual character chat service. Job listings are for informational purposes. We do not guarantee employment. Users must be at least 18 years old." },
            { title: "3. Job Applications", content: "By submitting a job application, you consent to your contact information being shared with the job poster. WorkHub is not responsible for hiring decisions or employment outcomes." },
            { title: "4. AI Characters", content: "AI virtual characters are for entertainment and conversational purposes only. They are not real people. Do not share sensitive personal information in chat sessions. WorkHub is not liable for any decisions made based on AI conversations." },
            { title: "5. Prohibited Conduct", content: "Users may not use the platform for illegal purposes, post fraudulent job listings, harass other users, attempt to impersonate AI characters as real people, or attempt to reverse engineer the platform." },
            { title: "6. Intellectual Property", content: "All content on WorkHub, including text, graphics, and software, is the property of WorkHub and protected by applicable copyright laws." },
            { title: "7. Limitation of Liability", content: "WorkHub is provided 'as is' without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform." },
            { title: "8. Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms." },
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
