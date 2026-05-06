"use client";

import Head from "next/head";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function MusafirCommunityEquityFramework() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://3musafir.com").replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}/musafircommunityequityframework`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Explore",
        item: `${siteUrl}/explore`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Community Equity Framework",
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 text-foreground flex flex-col">
        <main className="px-4 md:px-6 lg:px-8 xl:px-10 py-10 lg:py-14">
          <div className="mx-auto w-full max-w-6xl space-y-8 lg:space-y-10">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-heading">
                Musafir Community Equity Framework
              </h1>
              <p className="text-sm text-muted-foreground">
                A community commitment to inclusivity, safety, respect, accountability, and long-term stewardship.
              </p>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-heading">What this is</p>
                <p className="text-sm text-muted-foreground">
                  This framework sets expectations for conduct, privacy, prohibited behaviors and items, reporting procedures,
                  cultural engagement, environmental responsibility, and the responsible use of AI across current and future
                  generations of musafirs.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-heading">Core goals</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>Respect diversity and reject harassment, discrimination, and abusive behavior.</li>
                  <li>Protect the physical and emotional safety of all musafirs, staff, drivers, and host communities.</li>
                  <li>Preserve destinations through no-littering, waste reduction, and ethical local engagement.</li>
                  <li>Carry community knowledge, mentorship, and accountability forward for future musafirs.</li>
                  <li>Use technology and AI responsibly, transparently, and with strong privacy safeguards.</li>
                </ul>
              </div>
            </section>

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

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">1. Introduction</h2>
                        <h3 className="text-sm font-semibold text-heading">Purpose of the Community Equity Framework</h3>
                        <p className="text-sm text-muted-foreground">
                          The Musafir Community Equity Framework is designed to foster an inclusive, respectful, and equitable
                          environment for all participants across current and future generations. This document outlines our
                          commitment to diversity, expectations for conduct, and procedures for addressing violations, ensuring a
                          safe and enriching experience for everyone involved.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Alignment with Musafir Community&apos;s Mission</h3>
                        <p className="text-sm text-muted-foreground">
                          Musafir Community is founded on the principle of respect for diversity and the necessity of normalizing
                          safe travels for women across Pakistan. We believe that traveling in groups enhances communication skills,
                          encourages personal growth, and pushes individuals out of their comfort zones. By integrating
                          intergenerational commitments, responsible use of technology, sustainable environmental practices
                          including no littering, and ethical engagement with local cultures, this framework ensures that our core
                          values will be preserved and passed on to future musafirs.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">2. Core Principles and Values</h2>
                        <h3 className="text-sm font-semibold text-heading">Respect for Diversity</h3>
                        <p className="text-sm text-muted-foreground">
                          We celebrate the unique backgrounds, experiences, and perspectives that each musafir brings. Our
                          commitment to diversity means we actively promote inclusivity and reject all forms of discrimination. This
                          includes generational diversity, recognizing that different age groups may have varying communication
                          styles, worldviews, and learning processes.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Safety and Well-being</h3>
                        <p className="text-sm text-muted-foreground">
                          Ensuring the physical and emotional safety of all participants is our top priority. We strive to create an
                          environment where musafirs can explore, learn, and grow without fear of harm or harassment. Safety
                          extends to future travelers, who deserve the same secure and supportive environment.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Personal Growth and Intergenerational Continuity</h3>
                        <p className="text-sm text-muted-foreground">
                          We encourage self-reliance, emotional resilience, and personal development through shared travel
                          experiences. By engaging with diverse personalities and navigating new challenges, musafirs expand their
                          horizons. We acknowledge that the knowledge, skills, and ethical standards developed today must be
                          preserved and shared with new generations of musafirs.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Long-Term Vision and Sustainability</h3>
                        <p className="text-sm text-muted-foreground">
                          Our community aims not only to enrich current travelers but also to preserve and enhance experiences for
                          future participants. This includes environmental stewardship, ethical engagement with local communities, no
                          littering, and a commitment to passing on organizational knowledge and best practices.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">3. Code of Conduct</h2>
                        <h3 className="text-sm font-semibold text-heading">Expected Behaviors</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Professionalism: Musafirs are expected to act in a mature, professional, and respectful manner at all times.</li>
                          <li>Courtesy and Respect: Show consideration for the rights and feelings of others, including fellow musafirs, staff, drivers, local communities, and the management team.</li>
                          <li>Open Communication: Engage in honest dialogue and address conflicts constructively.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">Indemnity and Harm Mitigation</h3>
                        <p className="text-sm text-muted-foreground">
                          Where a musafir&apos;s content, conduct, or public statements cause reputational harm, community backlash,
                          partner distress, operational disruption, or complaints from local stakeholders, 3Musafir may take
                          proportionate corrective action to protect its community, partnerships, and destinations. This may include
                          suspension, removal, permanent ban, and any other lawful protective measures deemed necessary.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Harassment and Discrimination Policies</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Zero Tolerance for Harassment: Any form of harassment based on race, gender, sexual orientation, ethnicity, religion, disability, national origin, appearance, age, or any other characteristic is strictly prohibited.</li>
                          <li>Discrimination: Discriminatory behavior towards any group or generation undermines our community values and will not be tolerated.</li>
                          <li>Reporting Incidents: Musafirs are encouraged to report incidents of harassment or discrimination to designated Equity Officers promptly.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">Consent for Media and Privacy</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Media Consent: Musafirs must obtain explicit consent before taking photographs or videos of fellow musafirs or team members.</li>
                          <li>Creator Responsibility: Any musafir creating or publishing content remains personally responsible for their conduct and for the consequences of that content. Participation in a Musafir trip does not grant any participant authority to speak on behalf of, represent, or define the values of 3Musafir unless expressly authorized in writing by 3Musafir.</li>
                          <li>Official Media Content: The media management team is responsible for capturing content for promotional purposes. Musafirs who are uncomfortable being included in media content should inform the team in advance.</li>
                          <li>Privacy Respect: Respect the privacy and personal boundaries of others at all times.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">Abusive Language</h3>
                        <p className="text-sm text-muted-foreground">
                          Musafirs must refrain from using abusive, profane, threatening, or derogatory language toward anyone,
                          whether fellow musafirs, staff, drivers, or local communities. Violations will trigger the same
                          investigation and consequences outlined under Harassment and Discrimination Policies.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Future-Facing Accountability</h3>
                        <p className="text-sm text-muted-foreground">
                          Before implementing decisions that significantly affect the community, such as resource allocation or trip
                          logistics, leadership and organizers must consider the potential impact on future musafirs&apos; experience and
                          opportunities.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">4. Prohibited Items and Behaviors</h2>
                        <h3 className="text-sm font-semibold text-heading">4.1 Substance Restrictions</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Alcohol: The consumption or possession of alcohol is strictly prohibited for all participants during trips.</li>
                          <li>Illegal Drugs: Possession or consumption of illegal drugs is forbidden and will result in immediate action.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">4.2 Weapons Ban</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Prohibited Items: Weapons of any kind, or items that could cause injury or damage, are not allowed.</li>
                          <li>Safety First: This policy ensures the safety and well-being of all musafirs, staff, and team members.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">4.3 No Littering</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Environmental Respect: Littering or improper disposal of waste is strictly prohibited during all Musafir Community activities and trips.</li>
                          <li>Personal Responsibility: Every musafir is responsible for managing their waste using designated disposal methods, carrying reusable containers, and leaving no trace in natural or communal areas.</li>
                          <li>Protecting Destinations: This clause upholds our commitment to environmental stewardship, ensuring that destinations remain pristine for future musafirs.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">5. Equity Policy Procedures</h2>
                        <h3 className="text-sm font-semibold text-heading">Reporting Process</h3>
                        <p className="text-sm text-muted-foreground">
                          Musafirs can address concerns or file complaints directly with our designated Equity Officers:
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
                          Confidentiality: All reports will be handled with the utmost confidentiality to protect the privacy of all
                          parties involved.
                        </p>
                        <h3 className="text-sm font-semibold text-heading">Investigation Procedures</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Thorough Investigation: Upon receiving a complaint, an impartial and thorough investigation will be conducted promptly.</li>
                          <li>Fairness: All parties will have the opportunity to present their accounts, and decisions will be based on the evidence collected.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">Consequences for Violations</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Verbal Warning: For minor infractions, a musafir may receive a documented verbal warning.</li>
                          <li>Disqualification: Severe or repeated violations may result in immediate disqualification from current activities.</li>
                          <li>Ban from Community: Persistent violations can lead to a ban from future Musafir Community trips.</li>
                          <li>Legal Action: Illegal activities, such as harassment or possession of illegal substances, may result in legal action, including involving law enforcement authorities.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">6. Support and Resources</h2>
                        <h3 className="text-sm font-semibold text-heading">Counseling Services</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Emotional Support: Musafir Community offers access to counseling services for musafirs who need support during or after trips.</li>
                          <li>Confidential Assistance: These services are confidential and aim to help musafirs navigate personal or interpersonal challenges.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">Conflict Resolution Support</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Mediation: The management team can provide mediation services to resolve conflicts amicably.</li>
                          <li>Guidance: Musafirs can seek guidance on how to handle interpersonal issues respectfully and effectively.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">7. Training and Education</h2>
                        <h3 className="text-sm font-semibold text-heading">Orientation Sessions</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Pre-Trip Orientation: All musafirs will participate in an orientation session covering the Community Equity Framework, expectations for conduct, cultural sensitivity, no-littering guidelines, and intergenerational commitments.</li>
                          <li>Understanding Policies: These sessions ensure all participants understand the framework and their responsibilities.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">Workshops and Seminars</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Continuous Learning: Musafir Community may offer workshops and seminars on topics such as diversity, inclusion, effective communication, environmental stewardship, ethical engagement, no-littering practices, and mentorship.</li>
                          <li>Leadership Development: Special sessions will focus on developing future community leaders, ensuring that emerging generations have the skills and knowledge to sustain and grow the Musafir Community.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">8. Intergenerational Expansion</h2>
                        <h3 className="text-sm font-semibold text-heading">8.1 Mentorship and Knowledge Transfer</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Mentor-Mentee Program: Current musafirs, including Gen Z, are encouraged to mentor newer or younger participants, sharing travel best practices and community values.</li>
                          <li>Peer Learning Sessions: Before and after trips, experienced members hold informal sessions to share challenges faced, lessons learned, and advice for upholding the Musafir ethos.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">8.2 Resource Preservation and Growth</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Sustainable Practices: Organizers and participants commit to leaving destinations better than they found them, strictly avoiding littering, minimizing waste, respecting local customs, and preserving natural and cultural sites.</li>
                          <li>Knowledge Libraries: The Musafir Community will maintain a digital repository of essential travel knowledge, route tips, success stories, and guidelines, updated annually, so future musafirs can benefit from past experiences.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">8.3 Inclusive Governance</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Youth Representation: A portion of any steering committee or advisory board is reserved for younger musafirs, such as those under 25, to ensure emerging generations have a voice in decision-making.</li>
                          <li>Successive Leadership: The community leadership team will implement a succession plan that trains and prepares younger leaders to assume key roles over time, preserving institutional memory and welcoming fresh perspectives.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">8.4 Cultural Preservation, Ethical Engagement, and Storytelling</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li><span className="font-medium text-heading">Learn and Adapt:</span> Musafirs are expected to familiarize themselves with local customs, dress codes, and cultural norms before traveling. When in doubt, ask local guides or community leaders for advice on proper behavior.</li>
                          <li><span className="font-medium text-heading">Language and Greetings:</span> A little effort goes a long way. Attempt to learn basic local greetings or polite phrases to show respect and openness.</li>
                          <li><span className="font-medium text-heading">Photography Courtesy:</span> Always seek permission before photographing locals or their property, mindful of possible religious or cultural sensitivities.</li>
                          <li>Storytelling must preserve the dignity of host communities and must not turn local people, customs, or destinations into content that is disruptive, extractive, disrespectful, or culturally harmful.</li>
                          <li><span className="font-medium text-heading">Avoid Encouraging Begging:</span> Do not give money directly to local children, as it can encourage dependency and unsafe street activities. Instead, direct any charitable intentions toward credible local organizations, schools, or community projects.</li>
                          <li><span className="font-medium text-heading">Gifts and Donations:</span> If you wish to offer small gifts such as school supplies, coordinate with local authorities or community leaders to ensure fair distribution and to avoid conflict or inequality.</li>
                          <li><span className="font-medium text-heading">Dress Modestly Where Required:</span> In some regions, more conservative attire is expected. Respect these norms to maintain a harmonious relationship with the local population.</li>
                          <li><span className="font-medium text-heading">Observe Religious Practices:</span> During festivals, religious events, or prayer times, minimize disruptions and follow the lead of locals when invited to participate.</li>
                          <li><span className="font-medium text-heading">Buy Local Products:</span> Purchase goods from local artisans, farmers, or small businesses to help the community benefit from tourism.</li>
                          <li><span className="font-medium text-heading">Fair Prices and Bargaining:</span> Where bargaining is customary, do so politely. Avoid aggressively forcing prices to unsustainably low levels.</li>
                          <li><span className="font-medium text-heading">Eco-Friendly Practices:</span> Use biodegradable or reusable items, upholding the community&apos;s no-littering policy and preserving the local environment.</li>
                          <li><span className="font-medium text-heading">Community Approval:</span> Seek permission if you plan to host any activities or events in local villages. Ensure such engagements benefit locals without disrupting their daily lives.</li>
                          <li><span className="font-medium text-heading">Mutual Learning:</span> Encourage open dialogue about the types of interactions local communities welcome from visitors. Share your insights with future musafirs to maintain respectful practices over time.</li>
                          <li><span className="font-medium text-heading">Narrative Sharing:</span> Encourage musafirs of all ages to share personal stories, trip highlights, or lessons learned through newsletters, vlogs, or social media.</li>
                          <li><span className="font-medium text-heading">Oral History:</span> Record local histories and cultural narratives with consent, ensuring that these stories are preserved and respected.</li>
                          <li><span className="font-medium text-heading">Legacy Projects:</span> Each trip or cohort is encouraged to complete a legacy project, such as creating local partnerships, documenting oral histories, or compiling a guide for future musafirs. These projects help preserve cultural richness and best practices for coming generations.</li>
                        </ul>
                        <h3 className="text-sm font-semibold text-heading">8.5 Responsible Use of AI</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li><span className="font-medium text-heading">Respect for Privacy:</span> Any use of AI tools for trip planning, data collection, or content creation must strictly adhere to the community&apos;s privacy standards. Personal or sensitive information should not be shared with AI platforms without explicit consent.</li>
                          <li><span className="font-medium text-heading">Accuracy and Transparency:</span> Participants who generate written or visual content using AI must review the output for accuracy and potential bias before sharing.</li>
                          <li><span className="font-medium text-heading">Informed Choices:</span> When AI tools assist in community decisions, such as logistical planning or resource allocation, human oversight is required to interpret suggestions, ensuring that choices reflect Musafir Community values.</li>
                          <li><span className="font-medium text-heading">No Sole Reliance on AI:</span> Final decisions should not depend solely on automated outputs. AI remains a support tool, with human judgment and expertise as the ultimate guide.</li>
                          <li><span className="font-medium text-heading">Verifying Sources:</span> Any AI-generated information or recommendations must be corroborated by reliable sources. Musafirs are expected to cross-check facts and avoid spreading unverified claims.</li>
                          <li><span className="font-medium text-heading">Mitigating Bias:</span> AI models may inadvertently perpetuate biases. Users must remain vigilant about potential bias in AI outputs, especially regarding race, gender, religion, ethnicity, or age.</li>
                          <li><span className="font-medium text-heading">Consent and Authenticity:</span> If AI-generated images, video, or voice content is used for community promotions or storytelling, participants should be informed and have the option to opt out.</li>
                          <li><span className="font-medium text-heading">Intellectual Property:</span> When creating AI-generated content, such as blog posts or digital art, on behalf of Musafir Community, any usage restrictions or licenses should be observed, with credit given where appropriate.</li>
                          <li><span className="font-medium text-heading">AI Literacy Workshops:</span> The community may offer optional sessions on responsible AI use, teaching participants how to identify potential pitfalls, maintain data privacy, and address ethical concerns.</li>
                          <li><span className="font-medium text-heading">Ongoing Monitoring:</span> Leaders and Equity Officers will stay informed about developments in AI policy and technology, updating community guidelines as needed to reflect best practices and ethical standards.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">9. Review and Update Mechanisms</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Annual Reviews: The Community Equity Framework will be reviewed annually to assess its effectiveness and relevance, including its intergenerational, environmental, ethical engagement, and AI components.</li>
                          <li>Feedback Incorporation: Feedback from musafirs, staff, partners, and stakeholders will be considered in making updates. Youth representatives will play a key role in these reviews.</li>
                          <li>Generational Impact Assessment: A simple intergenerational progress scorecard may be published to measure mentorship outcomes, new member satisfaction, and the overall inclusion of future perspectives.</li>
                          <li>Transparency: Any changes to the framework will be communicated to all musafirs promptly.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">10. Accessibility</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Clear Language: The framework is written in clear, understandable language to ensure comprehension by all community members.</li>
                          <li>Translations: Translations of the framework will be made available upon request to accommodate musafirs who prefer languages other than English.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">11. Acknowledgment and Agreement</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Signed Agreement: All musafirs are required to read and sign this expanded Community Equity Framework prior to participating in any Musafir Community activities.</li>
                          <li>Commitment to Abide: By signing, musafirs commit to abiding by the framework and upholding the values and policies of Musafir Community.</li>
                        </ul>
                        <p className="text-sm font-semibold text-heading">Intergenerational Clause</p>
                        <p className="text-sm text-muted-foreground">
                          &quot;I acknowledge that I am part of a continuum of travelers within the Musafir Community. I commit to
                          preserving these values of respect, inclusivity, sustainability, and responsible innovation. I will
                          actively mentor or support future musafirs whenever possible, ensuring this social contract remains vibrant
                          and adaptable for generations to come.&quot;
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">Conclusion</h2>
                        <p className="text-sm text-muted-foreground">
                          The Musafir Community Equity Framework is a testament to our collective commitment to fostering a community
                          where every musafir, present and future, feels safe, respected, and valued. By incorporating
                          intergenerational principles, guidelines for the ethical use of AI, a strict no-littering policy, and
                          respectful engagement with local communities, we ensure that Musafir Community remains resilient,
                          forward-thinking, and true to its core mission. Together, we can create enriching travel experiences that
                          promote personal growth and leave a lasting legacy for those who will join in the years ahead.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-semibold text-heading">Contributors</h2>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          <li>Original Lead Author and Curator: Ali Hassan</li>
                          <li>Supporting Curator: Areeba Shamsi</li>
                          <li>Curators: Hameez Rizwan, Maryam Nawaz Khan, Ahmad Abrar, Mahrukh Siddiqui</li>
                          <li>Intergenerational, AI, Environmental and Cultural Engagement Expansion: Incorporated by the Musafir Community Steering Committee with input from both founding and emerging members.</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
        </main>

      </div>
    </>
  );
}
