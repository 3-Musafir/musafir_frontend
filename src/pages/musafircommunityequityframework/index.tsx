"use client";

import Header from "@/components/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "../navigation";

export default function MusafirCommunityEquityFramework() {
  return (
    <div className="min-h-screen bg-gray-50 text-foreground flex flex-col">
      <Header setSidebarOpen={() => {}} showMenuButton={false} />

      <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
        <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-heading">
              Musafir Community Equity Framework
            </h1>
            <p className="text-sm text-muted-foreground">
              A community commitment to inclusivity, safety, respect, and accountability.
            </p>
          </div>

        {/* Summary */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-heading">What this is</p>
            <p className="text-sm text-muted-foreground">
              This framework sets expectations for conduct, outlines prohibited behaviors/items, and explains how concerns are reported, investigated, and resolved.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-heading">Core goals</p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Respect for diversity and a harassment-free environment.</li>
              <li>Physical and emotional safety for all musafirs.</li>
              <li>Environmental stewardship (including strict no-littering).</li>
              <li>Intergenerational continuity and future-facing accountability.</li>
              <li>Responsible, privacy-respecting use of technology (including AI).</li>
            </ul>
          </div>
        </section>

        {/* Detailed (expandable) */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
          <Accordion type="single" collapsible>
            <AccordionItem value="framework" className="border-gray-200/70">
              <AccordionTrigger className="text-sm text-brand-primary">
                View complete framework
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Musafir Community Equity Framework
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-heading">1. Introduction</h2>
                    <h3 className="text-sm font-semibold text-heading">Purpose of the Community Equity Framework</h3>
                    <p className="text-sm text-muted-foreground">
                      The Musafir Community Equity Framework is designed to foster an inclusive, respectful, and equitable environment for all participants—across current and future generations. This document outlines our commitment to diversity, expectations for conduct, and procedures for addressing violations, ensuring a safe and enriching experience for everyone involved.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Alignment with Musafir Community’s Mission</h3>
                    <p className="text-sm text-muted-foreground">
                      Musafir Community is founded on the principle of respect for diversity and the necessity of normalizing safe travels for women across Pakistan. We believe that traveling in groups enhances communication skills, encourages personal growth, and pushes individuals out of their comfort zones. By integrating intergenerational commitments, responsible use of technology, sustainable environmental practices (including no littering), and ethical engagement with local cultures, this framework ensures that our core values will be preserved and passed on to future musafirs.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">2. Core Principles and Values</h2>
                    <h3 className="text-sm font-semibold text-heading">Respect for Diversity</h3>
                    <p className="text-sm text-muted-foreground">
                      We celebrate the unique backgrounds, experiences, and perspectives that each musafir brings. Our commitment to diversity means we actively promote inclusivity and reject all forms of discrimination. This includes generational diversity—recognizing that different age groups may have varying communication styles, worldviews, and learning processes.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Safety and Well-being</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensuring the physical and emotional safety of all participants is our top priority. We strive to create an environment where musafirs can explore, learn, and grow without fear of harm or harassment. Safety extends to future travelers, who deserve the same secure and supportive environment.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Personal Growth and Intergenerational Continuity</h3>
                    <p className="text-sm text-muted-foreground">
                      We encourage self-reliance, emotional resilience, and personal development through shared travel experiences. By engaging with diverse personalities and navigating new challenges, musafirs expand their horizons. We acknowledge that the knowledge, skills, and ethical standards developed today must be preserved and shared with new generations of musafirs.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Long-Term Vision and Sustainability</h3>
                    <p className="text-sm text-muted-foreground">
                      Our community aims not only to enrich current travelers but also to preserve and enhance experiences for future participants. This includes environmental stewardship, ethical engagement with local communities, no littering, and a commitment to passing on organizational knowledge and best practices.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">3. Code of Conduct</h2>
                    <h3 className="text-sm font-semibold text-heading">Expected Behaviors</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Professionalism: Act in a mature, professional, and respectful manner at all times.</li>
                      <li>Courtesy and Respect: Show consideration for others, including fellow musafirs, staff, drivers, local communities, and management.</li>
                      <li>Open Communication: Engage in honest dialogue and address conflicts constructively.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">Harassment and Discrimination Policies</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Zero Tolerance for Harassment: Harassment based on race, gender, sexual orientation, ethnicity, religion, disability, national origin, appearance, age, or any characteristic is prohibited.</li>
                      <li>Discrimination: Discriminatory behavior—towards any group or generation—will not be tolerated.</li>
                      <li>Reporting Incidents: Musafirs are encouraged to report incidents promptly to designated Equity Officers.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">Consent for Media and Privacy</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Media Consent: Obtain explicit consent before photographing or filming others.</li>
                      <li>Official Media Content: Inform the media management team in advance if you do not wish to be included.</li>
                      <li>Privacy Respect: Respect personal boundaries at all times.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">Abusive Language</h3>
                    <p className="text-sm text-muted-foreground">
                      Musafirs must refrain from using abusive, profane, threatening, or derogatory language toward anyone. Violations trigger investigation and consequences.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Future-Facing Accountability</h3>
                    <p className="text-sm text-muted-foreground">
                      Before implementing decisions that significantly affect the community, leadership must consider the potential impact on future musafirs’ experience and opportunities.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">4. Prohibited Items and Behaviors</h2>
                    <h3 className="text-sm font-semibold text-heading">4.1 Substance Restrictions</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Alcohol: Consumption or possession is strictly prohibited during trips.</li>
                      <li>Illegal Drugs: Possession or consumption is forbidden and will result in immediate action.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">4.2 Weapons Ban</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Weapons of any kind (or items that could cause injury/damage) are not allowed.</li>
                      <li>This policy ensures the safety and well-being of all participants.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">4.3 No Littering</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Littering or improper disposal of waste is strictly prohibited.</li>
                      <li>Each musafir is responsible for managing waste and leaving no trace.</li>
                      <li>This protects destinations for future musafirs.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">5. Equity Policy Procedures</h2>
                    <h3 className="text-sm font-semibold text-heading">Reporting Process</h3>
                    <p className="text-sm text-muted-foreground">
                      Musafirs can address concerns or file complaints directly with designated Equity Officers:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Ali Hassan</li>
                      <li>Remsha Kaleem</li>
                      <li>Hameez Rizwan</li>
                      <li>Maryam Nawaz Khan</li>
                      <li>Ahmad Abrar</li>
                      <li>Mahrukh Siddiqui</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      Confidentiality: All reports will be handled with the utmost confidentiality.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Investigation Procedures</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Upon receiving a complaint, an impartial and thorough investigation will be conducted promptly.</li>
                      <li>All parties may present their accounts; decisions are based on collected evidence.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">Consequences for Violations</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Verbal Warning: For minor infractions, a documented verbal warning may be issued.</li>
                      <li>Disqualification: Severe or repeated violations may result in immediate disqualification.</li>
                      <li>Ban: Persistent violations can lead to a ban from future trips.</li>
                      <li>Legal Action: Illegal activities may involve law enforcement authorities.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">6. Support and Resources</h2>
                    <h3 className="text-sm font-semibold text-heading">Counseling Services</h3>
                    <p className="text-sm text-muted-foreground">
                      Musafir Community offers access to counseling services for musafirs who need support during or after trips.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">Conflict Resolution Support</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Mediation: The management team can provide mediation services to resolve conflicts amicably.</li>
                      <li>Guidance: Musafirs can seek guidance on handling interpersonal issues respectfully and effectively.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">7. Training and Education</h2>
                    <h3 className="text-sm font-semibold text-heading">Orientation Sessions</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Pre-Trip Orientation covers the framework, cultural sensitivity, no-littering, and intergenerational commitments.</li>
                      <li>These sessions ensure all participants understand expectations and responsibilities.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">Workshops and Seminars</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Workshops may cover diversity, inclusion, communication, environmental stewardship, and mentorship.</li>
                      <li>Leadership sessions help develop future community leaders.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">8. Intergenerational Expansion</h2>
                    <h3 className="text-sm font-semibold text-heading">8.1 Mentorship and Knowledge Transfer</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Mentor–mentee programs encourage experienced musafirs to mentor newer members.</li>
                      <li>Peer learning sessions share challenges, lessons learned, and guidance.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">8.2 Resource Preservation and Growth</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Commit to leaving destinations better than found—no littering, minimizing waste, respecting customs.</li>
                      <li>Maintain a digital repository of essential travel knowledge updated annually.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">8.3 Inclusive Governance</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Youth representation (e.g., under 25) in advisory decision-making roles.</li>
                      <li>Succession planning to train younger leaders over time.</li>
                    </ul>
                    <h3 className="text-sm font-semibold text-heading">8.4 Cultural Preservation, Ethical Engagement, and Storytelling</h3>
                    <p className="text-sm text-muted-foreground">
                      Musafirs should learn local customs, seek permission for photography, support local economies responsibly, and preserve stories with consent.
                    </p>
                    <h3 className="text-sm font-semibold text-heading">8.5 Responsible Use of AI</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Respect privacy; do not share sensitive info with AI tools without explicit consent.</li>
                      <li>Verify AI outputs for accuracy and bias; keep human oversight for decisions.</li>
                      <li>Ensure consent and transparency for AI-generated media content.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">9. Review and Update Mechanisms</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Annual reviews to assess effectiveness and relevance.</li>
                      <li>Feedback incorporation (including youth representatives).</li>
                      <li>Transparent communication of changes.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">10. Accessibility</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Written in clear language for broad comprehension.</li>
                      <li>Translations available upon request.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">11. Acknowledgment and Agreement</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>All musafirs are required to read and sign the framework prior to participating in activities.</li>
                      <li>By signing, musafirs commit to upholding values and policies.</li>
                      <li>
                        Intergenerational clause: “I acknowledge that I am part of a continuum of travelers within the Musafir Community. I commit to preserving these values of respect, inclusivity, sustainability, and responsible innovation. I will actively mentor or support future musafirs whenever possible.”
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">Conclusion</h2>
                    <p className="text-sm text-muted-foreground">
                      This framework is a commitment to ensuring every musafir—present and future—feels safe, respected, and valued.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-semibold text-heading">Contributors</h2>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Original Lead Author &amp; Curator: Ali Hassan</li>
                      <li>Supporting Curator: Areeba Shamsi</li>
                      <li>Curators: Hameez Rizwan, Maryam Nawaz Khan, Ahmad Abrar, Mahrukh Siddiqui</li>
                      <li>
                        Intergenerational, AI, Environmental &amp; Cultural Engagement Expansion: Incorporated by the Musafir Community Steering Committee with input from both founding and emerging members
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
