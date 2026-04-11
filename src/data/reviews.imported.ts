export type ImportedReviewSeed = {
  event: string;
  name?: string;
  createdAt: string;
  text: string;
  sourceChannel?: string;
  sourceUrl?: string;
  verifiedStatus?: "editorial" | "submitted" | "trip-linked";
  language?: "en" | "ur" | "mixed";
  editorialTransform?: "none" | "trimmed" | "normalized" | "excerpted";
};

export const IMPORTED_REVIEWS: ImportedReviewSeed[] = [
  // FireFest Art Retreat
  { event: "FIREFEST ART RETREAT", name: "Urooba", createdAt: "2023-09-25T00:00:00.000Z", text: "Such an amazing, wholesome experience. Beautiful humans still walk upon this earth. Would love everyone to share socials and stay connected." },
  { event: "FIREFEST ART RETREAT", name: "Abdul Samad Amin", createdAt: "2023-09-25T00:00:00.000Z", text: "A bunch of really nice people and amazing memories. Best wishes in coming back to real life. Lets stay connected." },
  { event: "FIREFEST ART RETREAT", name: "Saqib Sharif", createdAt: "2023-09-25T00:00:00.000Z", text: "Delighted to be part of this journey and organize the drum circle. Hope everyone's hands are feeling great now." },
  { event: "FIREFEST ART RETREAT", name: "Waleed Shaheen", createdAt: "2023-09-25T00:00:00.000Z", text: "Had an amazing experience and journey with all of you. Thank you for making my birthday memorable as well." },
  { event: "FIREFEST ART RETREAT", name: "Ebadat Maqbool Shah", createdAt: "2023-09-25T00:00:00.000Z", text: "Leaving Islamabad with a full heart. The companionship made this getaway exactly what I needed, and the sense of community and care from 3M was amazing." },
  { event: "FIREFEST ART RETREAT", name: "Ayesha Yogi", createdAt: "2023-09-25T00:00:00.000Z", text: "This trip was kind of last minute but I really feel I was called to be there. I am filled with gratitude and wonder at the hearts of the people I met and the moments we shared." },
  { event: "FIREFEST ART RETREAT", name: "Hammad Siddiqui", createdAt: "2023-09-25T00:00:00.000Z", text: "This was a wonderful experience and very well managed. Had a great time taking in the breathtaking views with you all." },
  { event: "FIREFEST ART RETREAT", name: "Ahsan", createdAt: "2023-09-25T00:00:00.000Z", text: "Amazing experience, from 18 to 65 all of you were really cool. Thank you." },
  { event: "FIREFEST ART RETREAT", name: "Maryam", createdAt: "2023-09-25T00:00:00.000Z", text: "This was pretty well organised. Hope you all are doing good. Till next time." },
  { event: "FIREFEST ART RETREAT", name: "Ibrahim Ahmed", createdAt: "2023-09-25T00:00:00.000Z", text: "Thanks Team 3M for arranging such an amazing retreat. I did not expect it to be this awesome and would love to join again." },
  { event: "FIREFEST ART RETREAT", name: "Noor Zahra", createdAt: "2023-09-25T00:00:00.000Z", text: "This trip came at a time when I needed an awakening. The memories, company, and home away from home feeling with 3M were truly magical." },
  { event: "FIREFEST ART RETREAT", name: "Bilal Ahsan", createdAt: "2023-09-25T00:00:00.000Z", text: "An incredible journey filled with unforgettable experiences. The camaraderie, laughter, and shared moments made the trip even more special." },
  { event: "FIREFEST ART RETREAT", name: "Daler Ahmad", createdAt: "2023-09-25T00:00:00.000Z", text: "Thank you to the management for an amazing trip. The past three days were awesome and the shared experiences made it even better." },
  { event: "FIREFEST ART RETREAT", name: "Tehreem Qureshi", createdAt: "2023-09-25T00:00:00.000Z", text: "Thank you for this wonderful trip. It was great catching up with so many beautiful souls." },
  { event: "FIREFEST ART RETREAT", name: "Isa Jilani Khan", createdAt: "2023-09-25T00:00:00.000Z", text: "Thank you everyone, especially the management, for making this trip so enjoyable and worthwhile. The vibes were immaculate." },
  { event: "FIREFEST ART RETREAT", name: "Rimsha Shakir Jan", createdAt: "2023-09-25T00:00:00.000Z", text: "This trip was a life-changing experience for me. I found answers, deep spirituality, and pure positive people through 3M." },
  { event: "FIREFEST ART RETREAT", name: "Nida Shahid", createdAt: "2023-09-25T00:00:00.000Z", text: "3M outdid itself once again. This short trip was wholesome, pure, and exactly what I needed right now." },
  { event: "FIREFEST ART RETREAT", name: "Ammara", createdAt: "2023-09-25T00:00:00.000Z", text: "This was my second trip with Teen Musafir and I loved the lowkey relaxing vibe. The people made it even more beautiful." },
  { event: "FIREFEST ART RETREAT", name: "Sillah", createdAt: "2023-09-25T00:00:00.000Z", text: "The weekend was a great retreat. I met many wonderful like-minded people and it turned out better than expected." },

  // FireFest 6.0
  { event: "FIREFEST 6.0", name: "Saad Aleem", createdAt: "2024-09-23T00:00:00.000Z", text: "Thank you Team and everyone for making this trip memorable. I could not have asked for better company." },
  { event: "FIREFEST 6.0", name: "Abdul Ahad", createdAt: "2024-09-23T00:00:00.000Z", text: "This Fire Fest was unforgettable. From laughter and adventures to campfire sing-alongs and peaceful connection, the joy and wonder will stay with us." },
  { event: "FIREFEST 6.0", name: "Aimen Karamat", createdAt: "2024-09-23T00:00:00.000Z", text: "The management boys were very cooperative, especially during trek times, and brought their own personalities that made it more fun." },
  { event: "FIREFEST 6.0", name: "Abrar Arif", createdAt: "2024-09-23T00:00:00.000Z", text: "Thank you to Teen Musafir for organizing such a memorable trip in a remote location. Despite the isolation, everything felt fun and well-supported." },
  { event: "FIREFEST 6.0", name: "Saad", createdAt: "2024-09-23T00:00:00.000Z", text: "Huge shoutout to the organizing team. From accommodations and food to jeep rides, bonfire sessions, and the hike, everything was on point." },

  // FireFest 7.0
  { event: "FIREFEST 7.0", name: "Sunny Aly", createdAt: "2025-07-14T00:00:00.000Z", text: "What an amazing trip. My fifth adventure with Teen Musafir, full of nature, hikes, jamming sessions, and joy in every moment." },
  { event: "FIREFEST 7.0", name: "Faizan Mohiuddin", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my first trip with Teen Musafir and it was amazing from start to finish. Beautiful views, great energy, and an incredible group made it special." },
  { event: "FIREFEST 7.0", name: "Soban", createdAt: "2025-07-14T00:00:00.000Z", text: "I was in a pretty bad place mentally when I went on this trip, but it genuinely felt like I got six months worth of therapy in three days." },
  { event: "FIREFEST 7.0", name: "Haider Ali Awan", createdAt: "2025-07-14T00:00:00.000Z", text: "This trip felt like a whole emotional rollercoaster tucked inside a bus full of strangers that somehow turned into family. Warm, safe, and real." },
  { event: "FIREFEST 7.0", name: "Mujeeb Shimshal", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my second trip with 3M after a long break and I am genuinely grateful. Sharan felt peaceful, beautiful, and unforgettable." },
  { event: "FIREFEST 7.0", name: "Ayesha Riaz", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my second trip with 3M and there is something magical about the energy it brings. I am not a hiking person but I am glad I pushed myself." },
  { event: "FIREFEST 7.0", name: "Maryam Ahsan", createdAt: "2025-07-14T00:00:00.000Z", text: "I was scared of the jeep ride, hike, and waterfall, but clicked with people so fast. The memories were absolutely worth it." },
  { event: "FIREFEST 7.0", name: "Eman Akhtar", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my very first trip with Teen Musafir and I could not have asked for a better one. I was nervous at first but this group made me feel welcomed and at home." },
  { event: "FIREFEST 7.0", name: "Haris Zaka", createdAt: "2025-07-14T00:00:00.000Z", text: "The hike was tiring but worth it, and the jeep rides, singing, dancing, and laughter made this trip unforgettable." },
  { event: "FIREFEST 7.0", name: "Aisha Mehar", createdAt: "2025-07-14T00:00:00.000Z", text: "I wanted to express heartfelt gratitude for creating such an amazing community where women feel safe and supported while traveling." },
  { event: "FIREFEST 7.0", name: "Maham", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my first trip with Musafir but it felt like I had known the team for ages. I never had this much fun on any trip before." },
  { event: "FIREFEST 7.0", name: "Humna Waqar", createdAt: "2025-07-14T00:00:00.000Z", text: "I am so glad I missed my graduation trip just to come on a trip with 3M. I met some of the most amazing people and found something my mind and soul needed." },
  { event: "FIREFEST 7.0", name: "Maryam Qureshy", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my first Teen Musafir trip and the first solo trip I ever took. I was anxious coming into it but was met with warmth, love, and kindness." },
  { event: "FIREFEST 7.0", name: "Tanjina Wajid", createdAt: "2025-07-14T00:00:00.000Z", text: "This was my first trip up north and I was so anxious, but by the end I was laughing, playing games, and connecting with beautiful souls." },
  { event: "FIREFEST 7.0", name: "Areej Fatima", createdAt: "2025-07-14T00:00:00.000Z", text: "The most important thing about Teen Musafir was how they kept women's safety as the top priority. This trip was a warm hug in my memory." },

  // FireFest 8.0
  { event: "FIREFEST 8.0", name: "Mairah Zahid", createdAt: "2025-09-29T00:00:00.000Z", text: "I am so grateful I got to travel with such a fun-loving, easygoing, and genuine group of people. You all reminded me what it means to live in the moment." },
  { event: "FIREFEST 8.0", name: "Areeba", createdAt: "2025-09-29T00:00:00.000Z", text: "Lovely meeting you all. The whole vibe was playful and memorable." },
  { event: "FIREFEST 8.0", name: "Afad Amir", createdAt: "2025-09-29T00:00:00.000Z", text: "For me it is never just about the destination, but the incredible people I get to share it with. The jamming sessions, hike, jeep ride, support, and carefree moments made it amazing." },
  { event: "FIREFEST 8.0", name: "Alishba Azam", createdAt: "2025-09-29T00:00:00.000Z", text: "I joined thinking I would meet random strangers and turns out I met awesome strangers I would actually love to meet again in life." },
  { event: "FIREFEST 8.0", name: "M Wajahat", createdAt: "2025-09-29T00:00:00.000Z", text: "Had loads of fun on this trip and would love to stay connected with everyone and meet again." },
  { event: "FIREFEST 8.0", name: "M", createdAt: "2025-09-30T00:00:00.000Z", text: "The team effort, jokes, hiking, horse riding, bonfire, and music led to profound people-watching, laughter, and appreciation for everyone's talent and hard work." },
  { event: "FIREFEST 8.0", name: "Muzammil Malik", createdAt: "2025-09-30T00:00:00.000Z", text: "This trip was more of a self-discovery for me, and I also discovered many amazing people who made the journey memorable in their own way." },
  { event: "FIREFEST 8.0", name: "Abdullah K Lashari", createdAt: "2025-09-30T00:00:00.000Z", text: "I was not expecting to make so many memories on this beautiful trip. It felt like we had all known each other for ages." },
  { event: "FIREFEST 8.0", name: "Ahmed Gillani", createdAt: "2025-09-30T00:00:00.000Z", text: "I came as a solo Musafir yet never felt like one. Thanks for being the best fellow travelers a solo newcomer could ask for." },

  // Detox 3.0
  { event: "DETOX 3.0", name: "Raiha", createdAt: "2024-10-20T00:00:00.000Z", text: "It was an absolute privilege and a blast doing all of this with all of you." },
  { event: "DETOX 3.0", name: "Anonymous Musafir", createdAt: "2024-10-20T00:00:00.000Z", text: "On my way back I am filled with positive energy and unforgettable memories. Small talks were simple yet beautiful and I will keep these memories for a lifetime." },
  { event: "DETOX 3.0", name: "Tayyba", createdAt: "2024-10-20T00:00:00.000Z", text: "I made new friends, met amazing people, and had one of the best experiences of my life." },
  { event: "DETOX 3.0", name: "Parwara", createdAt: "2024-10-20T00:00:00.000Z", text: "It was so wholesome to meet you all." },
  { event: "DETOX 3.0", name: "Eesha", createdAt: "2024-10-20T00:00:00.000Z", text: "I will be eternally grateful for this experience. I learnt so much about myself and you all are the loveliest souls ever." },
  { event: "DETOX 3.0", name: "Izza", createdAt: "2024-10-20T00:00:00.000Z", text: "It was lovely getting to know you all. Thank you Ahmed and the team for an amazing weekend away." },
  { event: "DETOX 3.0", name: "Abdullah Khalid", createdAt: "2024-10-20T00:00:00.000Z", text: "It is hard to describe this memorable trip, but it was a lovely experience of never-ending joy and blissfulness that will live in my heart." },
  { event: "DETOX 3.0", name: "Rameen Syed", createdAt: "2024-10-20T00:00:00.000Z", text: "I did not know so much empathy and kindness existed until I met this group. This trip rebuilt my confidence in humanity." },
  { event: "DETOX 3.0", name: "Renad", createdAt: "2024-10-21T00:00:00.000Z", text: "I went in with zero expectations and came out with friends for life. I saw vulnerabilities and emotions and it was a beautiful experience." },
  { event: "DETOX 3.0", name: "Bushra Zaidi", createdAt: "2024-10-21T00:00:00.000Z", text: "The trip turned out to be much more than I expected, with a safe and comfortable environment and yoga and meditation sessions that helped me unwind." },
  { event: "DETOX 3.0", name: "Sunniya Ali Khan", createdAt: "2024-10-21T00:00:00.000Z", text: "I usually have a hard time connecting with people, but on this trip I felt seen and liked by most in a very unique way." },
  { event: "DETOX 3.0", name: "Ruhma", createdAt: "2024-10-21T00:00:00.000Z", text: "I went on this trip with a group and came back with a pack. It was an amazing experience and everyone was so kind." },
  { event: "DETOX 3.0", name: "Aamna Tayyab", createdAt: "2024-10-21T00:00:00.000Z", text: "I was really anxious at first but you guys made me feel so safe and comfortable that all the bonding came naturally." },
  { event: "DETOX 3.0", name: "Humayun", createdAt: "2024-10-21T00:00:00.000Z", text: "I forced myself to go, but everyone blew me away. Their stories, strength, and spirit inspired me more than I can explain." },

  // Detox 4.0 and 5.0
  { event: "DETOX 4.0", name: "Wardah", createdAt: "2025-04-14T00:00:00.000Z", text: "I was super anxious in the beginning because it was my first solo trip, but it ended up feeling like home." },
  { event: "DETOX 4.0", name: "Sufyan Afrowala", createdAt: "2025-04-14T00:00:00.000Z", text: "Had a really good time with everyone. The dances, pranks, and walks were all amazingly beautiful." },
  { event: "DETOX 4.0", name: "Momina", createdAt: "2025-04-14T00:00:00.000Z", text: "A wonderful trip with great vibes, amazing company, unforgettable memories, and fun late-night conversations." },
  { event: "DETOX 4.0", name: "Sadia Farhan", createdAt: "2025-04-14T00:00:00.000Z", text: "We all came for different reasons but left with shared memories, new friendships, and full hearts." },
  { event: "DETOX 4.0", name: "Salman Abbas", createdAt: "2025-04-15T00:00:00.000Z", text: "Still trying to transition back into the normal routine. Thank you for a lovely trip and a wholesome journey." },
  { event: "DETOX 5.0", name: "Nayab Gohar", createdAt: "2025-08-04T00:00:00.000Z", text: "This was a very refreshing trip. The energy from each one of you was heartwarming and so loving." },
  { event: "DETOX 5.0", name: "Jasam", createdAt: "2025-08-04T00:00:00.000Z", text: "I came solo with zero expectations but left with so many friends and memories." },
  { event: "DETOX 5.0", name: "Romaza", createdAt: "2025-08-04T00:00:00.000Z", text: "As a first-time female solo traveler, I had a lot of doubts and fears but not even for a second did I feel like I was on a solo trip." },
  { event: "DETOX 5.0", name: "Shezina", createdAt: "2025-08-04T00:00:00.000Z", text: "The universe has a wild way of tossing strangers into your orbit who leave a massive dent on your heart, soul, and funny bone." },
  { event: "DETOX 5.0", name: "Zaryab Umer", createdAt: "2025-08-04T00:00:00.000Z", text: "I have always struggled with people and anxiety in social settings, but this trip gave me freedom to be myself and showed me my social potential." },
  { event: "DETOX 5.0", name: "Shaima Nisar", createdAt: "2025-08-04T00:00:00.000Z", text: "This was my first ever solo trip and I was anxious, but I found lovely people, warm conversations, and healing in the community." },

  // SummerFest 3.0 Skardu
  { event: "SUMMERFEST 3.0 SKARDU", name: "Rabbiya Rabeel", createdAt: "2023-08-16T00:00:00.000Z", text: "I had an amazing time. Thanks Team 3M. Count me in as a Musafir now." },
  { event: "SUMMERFEST 3.0 SKARDU", name: "Hamza Nofil", createdAt: "2023-08-16T00:00:00.000Z", text: "I am still exhausted but really missing the week we all shared together, full of laughs, parties, and everything in between." },
  { event: "SUMMERFEST 3.0 SKARDU", name: "Saad Azhar", createdAt: "2023-08-16T00:00:00.000Z", text: "This was my first group trip in a long time and you people made it the best trip ever." },
  { event: "SUMMERFEST 3.0 SKARDU", name: "Maheera Afzal", createdAt: "2023-08-16T00:00:00.000Z", text: "It was nice to be back with the Musafirs after a long while. Everyone had a unique story and I am proud of all of you." },
  { event: "SUMMERFEST 3.0 SKARDU", name: "Osama Atiq", createdAt: "2023-08-16T00:00:00.000Z", text: "This was my first group and 3M trip and I had an amazing time. The time spent together was truly heartwarming." },
  { event: "SUMMERFEST 3.0 SKARDU", name: "Minahil Fatima", createdAt: "2023-08-16T00:00:00.000Z", text: "I did not want to come to this trip at all, but it turned out to be one of the best decisions I have ever made in life." },
  { event: "SUMMERFEST 3.0 SKARDU", name: "Nauman Afzal", createdAt: "2023-08-16T00:00:00.000Z", text: "The trip got off to a rocky start, but through all the dust and sweat it became one of the most amazing experiences because of the people." },

  // SummerFest 4.0 Skardu
  { event: "SUMMERFEST 4.0 SKARDU", name: "M Haris Butt", createdAt: "2024-09-14T00:00:00.000Z", text: "Literally the best trip of my life so far. I left with nothing but admiration for this amazing community." },
  { event: "SUMMERFEST 4.0 SKARDU", name: "Abdullah Khan", createdAt: "2024-09-14T00:00:00.000Z", text: "Thank you to the 3 Musafir management for organizing such a wonderful trip. I had a great time with all of you." },
  { event: "SUMMERFEST 4.0 SKARDU", name: "Talha Ahmad", createdAt: "2024-09-14T00:00:00.000Z", text: "Amazing trip with a brilliant team. Some things were not in your control but the love, energy, and management of the 3M community stood out." },
  { event: "SUMMERFEST 4.0 SKARDU", name: "Anita Jalil", createdAt: "2024-09-14T00:00:00.000Z", text: "This was the best journey of my life. I made friends from every corner of Pakistan and felt so comfortable and cared for." },
  { event: "SUMMERFEST 4.0 SKARDU", name: "Leena Shariq", createdAt: "2024-09-14T00:00:00.000Z", text: "I might come off as too introverted but I felt so safe from the moment I landed. The 3M team was really kind." },
  { event: "SUMMERFEST 4.0 SKARDU", name: "Hamza Ahmad", createdAt: "2024-09-14T00:00:00.000Z", text: "You Musafirs were the kindest and sweetest people to travel with. I did this trip solo and met amazing talented people along the way." },
  { event: "SUMMERFEST 4.0 SKARDU", name: "Ghania Zakir", createdAt: "2024-09-14T00:00:00.000Z", text: "I joined as a solo Musafir and ended up with a wonderful friend circle. The captains always kept an eye on us and listened patiently." },

  // Cherry Blossom Hunza and Fall in Hunza
  { event: "CHERRY BLOSSOM HUNZA", name: "Saif Khan", createdAt: "2025-05-03T00:00:00.000Z", text: "This trip was magical. I came in with a backpack and left with a heart full of memories." },
  { event: "CHERRY BLOSSOM HUNZA", name: "Sunny Aly", createdAt: "2025-05-03T00:00:00.000Z", text: "From bus rides and dance to chai, stories under the stars, and music jams, every moment was filled with joy and camaraderie." },
  { event: "CHERRY BLOSSOM HUNZA", name: "Afad Amir", createdAt: "2025-05-03T00:00:00.000Z", text: "From crazy bus rides and spontaneous jam sessions to unforgettable moments, these past few days were pure magic." },
  { event: "CHERRY BLOSSOM HUNZA", name: "Basil Faisal", createdAt: "2025-05-08T00:00:00.000Z", text: "It was definitely a great experience filled with great interactions, even for anti-social people like myself, and thoughtful check-ins by the organizing team." },
  { event: "FALL IN HUNZA", name: "Dilawar Abdullah", createdAt: "2025-10-28T00:00:00.000Z", text: "This was my first time experiencing Hunza with 3M and it was full of joy. Within a day, our small friend group felt much larger and more connected." },
  { event: "FALL IN HUNZA", name: "Abdul Ahad Butt", createdAt: "2025-10-28T00:00:00.000Z", text: "My very first trip to Hunza with Teen Musafir felt like stepping into a dream painted with snow-capped peaks, laughter, and lifelong friendships." },
  { event: "FALL IN HUNZA", name: "Mohsin", createdAt: "2025-10-28T00:00:00.000Z", text: "Traveling solo for the first time, I was lowkey scared, but I ended up feeling right at home. Everyone was so welcoming." },
  { event: "FALL IN HUNZA", name: "Mian Sannan Badar", createdAt: "2025-10-28T00:00:00.000Z", text: "My heart is so full. I am leaving with bonds, connections, and friendships that I know will last a lifetime." },
  { event: "FALL IN HUNZA", name: "Shezina", createdAt: "2025-10-28T00:00:00.000Z", text: "Hunza had been an elusive dream for two years. This time I fought fate for it and it was absolutely worth it." },
  { event: "FALL IN HUNZA", name: "Qamber Ali", createdAt: "2025-10-28T00:00:00.000Z", text: "Had the best seven days ever with Team Musafir. The community felt like family and the management handled everything so smoothly." },
  { event: "FALL IN HUNZA", name: "Saman Liaquat", createdAt: "2025-10-28T00:00:00.000Z", text: "This was my first trip with 3M and first time in Hunza. The views, the people, and the vibes all felt so special." },
  { event: "FALL IN HUNZA", name: "Ubaid", createdAt: "2025-10-28T00:00:00.000Z", text: "We started with introductions and ended with memories that will last a lifetime. The bus yainds and sleepless nights made it unforgettable." },

  // Kashmir Homecoming 1.0 and 2.0
  { event: "KASHMIR HOMECOMING 1.0", name: "Uzair Hasnain", createdAt: "2024-08-19T00:00:00.000Z", text: "Thanks to all of you, especially the 3M team, for making this trip epic." },
  { event: "KASHMIR HOMECOMING 1.0", name: "Aiman Shamsi", createdAt: "2024-08-19T00:00:00.000Z", text: "As a female traveler, I had concerns, but you all made me feel so safe and supported. It was a dream experience and a core memory for life." },
  { event: "KASHMIR HOMECOMING 1.0", name: "Mahnoor Binte Kamran", createdAt: "2024-08-19T00:00:00.000Z", text: "This was my first solo trip, and I can honestly say it was the best experience of my life." },
  { event: "KASHMIR HOMECOMING 1.0", name: "Hamza Nofil", createdAt: "2024-08-19T00:00:00.000Z", text: "This was one of the best 3M trips I have ever been on, from bus yaind and jinn stories to lake swims and dance circles." },
  { event: "KASHMIR HOMECOMING 1.0", name: "Shanial Haroon", createdAt: "2024-08-19T00:00:00.000Z", text: "This trip was a cute little fever dream. Getting to chill with really cool and fun people is always one of my favorite parts of 3M." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Hina", createdAt: "2025-08-19T00:00:00.000Z", text: "You all have created an amazing community. Especially with how you handled panic and anxiety. Even after my mishaps, I would try again with you guys." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Faizan Mohiuddin", createdAt: "2025-08-19T00:00:00.000Z", text: "From peaceful morning views and non-stop dancing to landslides and long hikes, this journey would not have been the same without each one of you." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Saad Khan", createdAt: "2025-08-19T00:00:00.000Z", text: "Teen Musafir showed me the beautiful side of humanity again. Because of everyone on this trip, I found home somewhere far from home." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Waleeja Bukhari", createdAt: "2025-08-19T00:00:00.000Z", text: "This trip did not go as planned, but maybe that is the magic of travel. Amid the chaos I met people who turned it into something unforgettable." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Khubaib Bin Naeem Qureshi", createdAt: "2025-08-19T00:00:00.000Z", text: "I had always imagined traveling the mountains as an adult. Despite the rough parts, I would do anything to be back in the mountains right now." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Sunny Aly", createdAt: "2025-08-19T00:00:00.000Z", text: "Teen Musafir turned what could have been just another trip into an unforgettable experience because of the energy, laughter, and positivity you carried." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Umer", createdAt: "2025-08-19T00:00:00.000Z", text: "The expectations bar was high from previous trips and I was disappointed by some parts, but the people made it worth stepping out and into the mountains." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Maham", createdAt: "2025-08-19T00:00:00.000Z", text: "This was my third trip with 3M as a solo female traveler. There were moments when I questioned my decision, but I was still the saddest one to come back." },
  { event: "KASHMIR HOMECOMING 2.0", name: "Momina Bilal", createdAt: "2025-08-19T00:00:00.000Z", text: "This was my first ever trip to the mountains and from being hesitant to instantly falling in love with the place and the people, it became unforgettable." },

  // Smaller batches
  { event: "CHILLAM JOSHI - CHITRAL", name: "Ahmed", createdAt: "2025-05-21T00:00:00.000Z", text: "I came to Pakistan just for this trip and could not have asked for a better group to experience Chitral and Kalash with. From strangers to a solid travel squad." },
  { event: "JUNGLE JAMBOREE 1.0", name: "Sohaib", createdAt: "2024-03-11T00:00:00.000Z", text: "The raw beauty of the forest and the survival-based theme were truly unique experiences I will not forget. The meaningful conversations made it even more special." },
  { event: "JUNGLE JAMBOREE 2.0", name: "Zainab Malik", createdAt: "2025-04-07T00:00:00.000Z", text: "Despite it being my first trip with you guys, you made me feel like I belonged from the very start. I did not just travel with strangers, I came back with friends." },
  { event: "JUNGLE JAMBOREE 2.0", name: "Farhan Ullah Aziz", createdAt: "2025-04-07T00:00:00.000Z", text: "After the insane fun I had with all of you, I am mad at myself for not traveling enough. I will miss the songs, bonfire dances, stargazing, and banter." },
  { event: "JUNGLE JAMBOREE 2.0", name: "Ayesha Saleem", createdAt: "2025-04-07T00:00:00.000Z", text: "The most amazing tour of my life. I lost faith in people for a while, but the way everyone helped me on the hike restored something in me." },
  { event: "JUNGLE JAMBOREE 2.0", name: "Maham T Ahmed", createdAt: "2025-04-07T00:00:00.000Z", text: "Never in my wildest dreams could I have imagined a solo trip to the north and meeting so many wonderful people in such a safe and non-judgmental space." },
  { event: "JUNGLE JAMBOREE 2.0", name: "Wazzah", createdAt: "2025-04-07T00:00:00.000Z", text: "This journey gave me something I did not know I had lost: my energy. The vibe and people made it worth every sacrifice." },
  { event: "JUNGLE JAMBOREE; FOREST BATHING", name: "Ameen Babar", createdAt: "2025-11-24T00:00:00.000Z", text: "Thank you 3M for an absolutely wild and unforgettable trip in the jungle. From trails to campfire vibes and stargazing, every moment was a vibe." },
  { event: "JUNGLE JAMBOREE; FOREST BATHING", name: "Mutaal Shafqat", createdAt: "2025-11-24T00:00:00.000Z", text: "Amazing memories, good food, epic bonfire, storytelling, deep chats, and personality-revealing questions. A perfect blend of fun and reflection." },
  { event: "JUNGLE JAMBOREE; FOREST BATHING", name: "Saad Khan", createdAt: "2025-11-24T00:00:00.000Z", text: "I want to thank 3 Musafir for this amazing trip. As an introvert, I am surprised and happy I made so many great friends." },
  { event: "JUNGLE JAMBOREE; FOREST BATHING", name: "Saadi", createdAt: "2025-11-24T00:00:00.000Z", text: "Did not expect a getaway to turn into such a cool community experience. The slow-paced hike and genuine friendships were the surprise highlights." },

  // Women only
  { event: "WOMEN ONLY TRIP", name: "Anam", createdAt: "2025-12-21T00:00:00.000Z", text: "I needed this. I needed to be silly, make bracelets, dance on the bus, and feel all the different yummy ways to be a woman." },
  { event: "WOMEN ONLY TRIP", name: "RRG", createdAt: "2025-12-21T00:00:00.000Z", text: "I am still processing that the trip ended. Shezina made sure we were all comfortable and every activity was meaningful and well organized." },
  { event: "WOMEN ONLY TRIP", name: "Zainab Basit", createdAt: "2025-12-21T00:00:00.000Z", text: "Watching the trip memories makes me emotional. Shezina made us feel safe, seen, and genuinely cared for." },
  { event: "WOMEN ONLY TRIP", name: "Meerum Shafiq", createdAt: "2025-12-22T00:00:00.000Z", text: "This was not the trip I had in mind. It gave me much more than I asked from it and made me believe in how healing sisterhood can be." },
  { event: "WOMEN ONLY TRIP", name: "Aisha Rehman", createdAt: "2025-12-22T00:00:00.000Z", text: "From workshops and bracelet making to self-defense sessions and late-night talks, everything about this trip felt deeply special." },
  { event: "WOMEN ONLY TRIP", name: "Fizza Imran", createdAt: "2025-12-22T00:00:00.000Z", text: "The energy was so positive that bonding happened effortlessly. This trip gave all of us space to let the child inside come out with pure joy." },
  { event: "WOMEN ONLY TRIP", name: "Umme Hani", createdAt: "2025-12-22T00:00:00.000Z", text: "I did not expect this trip to turn into one of the most memorable days of my life. The energy was positive from start to finish." },
  { event: "WOMEN ONLY TRIP", name: "Maryam Ali", createdAt: "2025-12-22T00:00:00.000Z", text: "Words are not enough to explain what I felt. Being surrounded by such incredible women was something I genuinely needed." },

  // Nighter in MJ and NYE
  { event: "NIGHTER IN MJ", name: "Saif Khan", createdAt: "2024-07-08T00:00:00.000Z", text: "Such an energetic group. From the bus to the dance floor, every moment of the trip was full of positive vibes." },
  { event: "NIGHTER IN MJ", name: "Nouman", createdAt: "2024-07-08T00:00:00.000Z", text: "My first solo trip with 3M started with doubts and mayhem but quickly transformed into an unforgettable adventure with people who felt like home." },
  { event: "NIGHTER IN MJ", name: "Areesha", createdAt: "2024-07-08T00:00:00.000Z", text: "I always knew traveling with strangers could be fun, but I had my doubts about feeling safe. Traveling with 3M became one of the best decisions I have made." },
  { event: "NIGHTER IN MJ", name: "Malaika", createdAt: "2024-07-08T00:00:00.000Z", text: "Traveling in Pakistan as a girl was always a worry, but traveling with 3M changed that around and made it feel like such a safe space." },
  { event: "NIGHTER IN MJ", name: "Wasia Urooj", createdAt: "2024-07-08T00:00:00.000Z", text: "This was my first solo adventure and I was anxious about the age factor, but the warmth and enthusiasm from everyone felt like a cozy hug." },
  { event: "NIGHTER IN MJ", name: "Malika Imran", createdAt: "2024-07-08T00:00:00.000Z", text: "I had an incredible experience with 3M. The vibe of the trip was fantastic and I am already looking forward to traveling again." },
  { event: "NIGHTER IN MJ", name: "Azka", createdAt: "2024-07-08T00:00:00.000Z", text: "I really needed a break, and that is exactly what I got. The energy, fun, dancing, and jamming were all fantastic." },
  { event: "NYE - NIGHTER IN MJ!", name: "F", createdAt: "2025-01-02T00:00:00.000Z", text: "Thank you all for an amazing trip. I met some really cool people and was reminded of how fun Pakistan can be." },

  // DaisyFest
  { event: "DAISYFEST: MUSHKPURI", name: "Hoorine", createdAt: "2024-08-04T00:00:00.000Z", text: "A big thank you to everyone who helped me on the hike. 3 Musafir really is the best." },
  { event: "DAISYFEST: MUSHKPURI", name: "Javeria Hayat", createdAt: "2024-08-04T00:00:00.000Z", text: "I had never been on a solo trip before, but 3M made my solo trip worth enjoying. One day became a beautiful memory for life." },
  { event: "DAISYFEST: MUSHKPURI", name: "Rida Khalid", createdAt: "2024-08-04T00:00:00.000Z", text: "It was a crazy experience and I loved every bit of it. Everyone from bus 2 was the best group to hang out with." },
  { event: "DAISYFEST: MUSHKPURI 2.0", name: "Abdul Rehman", createdAt: "2025-06-03T00:00:00.000Z", text: "This was my first ever trip with strangers, but by the end of the day it did not feel like that at all. It felt like belonging." },

  // SnowFest Baku and SnowFest 7.0
  { event: "SNOWFEST BAKU", name: "Eefrah Tahir", createdAt: "2026-01-03T00:00:00.000Z", text: "I had an amazing time with all of you Musafirs. Thank you for the memories I will remember forever." },
  { event: "SNOWFEST BAKU", name: "Asim Jadoon", createdAt: "2026-01-03T00:00:00.000Z", text: "I signed up with zero research and zero expectations and was completely blown away. The chaos and warmth somehow felt like home." },
  { event: "SNOWFEST BAKU", name: "Zara Khurram", createdAt: "2026-01-03T00:00:00.000Z", text: "I expected good people and party energy, but was still blown away. The people made Baku and Shahdag worth the freezing weather." },
  { event: "SNOWFEST BAKU", name: "Awais Khan", createdAt: "2026-01-03T00:00:00.000Z", text: "I did not know what I was getting into, but everything felt easy, comfortable, and full of laughs from the very beginning." },
  { event: "SNOWFEST BAKU", name: "Usman Ghani", createdAt: "2026-01-03T00:00:00.000Z", text: "I was not even sure whether I would make it to the trip, but taking the risk was worth it. The squad made it unforgettable." },
  { event: "SNOWFEST 7.0 FLIGHT 2", name: "Ahmed Gillani", createdAt: "2026-02-16T00:00:00.000Z", text: "Had an amazing trip with truly cool people. Everyone was cooperative, fun, and easygoing, which made everything even better." },
  { event: "SNOWFEST 7.0 FLIGHT 2", name: "Mehruu", createdAt: "2026-02-16T00:00:00.000Z", text: "Thank you for this unforgettable trip. We shared so many laughs, took countless pictures in the snow, and created memories I will always cherish." },
  { event: "SNOWFEST 7.0 FLIGHT 2", name: "Abdullah Naeem", createdAt: "2026-02-16T00:00:00.000Z", text: "Thank you everyone for such a memorable trip. From all the fun moments to the snowy scenes, it was truly unforgettable." },
  { event: "SNOWFEST 7.0 FLIGHT 2", name: "Qamar J Pirzada", createdAt: "2026-02-16T00:00:00.000Z", text: "Had my first solo trip with 3M and it was truly an amazing experience. I met some really cool humans and made great memories." },

  // Spooktober
  { event: "SPOOKTOBER 4.0", name: "Usman Ghani", createdAt: "2025-11-03T00:00:00.000Z", text: "This was one of the best trips in Pakistan with any group. Rather than a group, I would call it family." },
  { event: "SPOOKTOBER 4.0", name: "Fatima Travels", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my second trip with 3M and it was amazing. More than the place itself, it is always the people that make it worthwhile." },
  { event: "SPOOKTOBER 4.0", name: "Maryam Ahsan", createdAt: "2025-11-03T00:00:00.000Z", text: "This trip was very spur of the moment for me but it was amazing. Stargazing, sunrise, costumes, and jeep rides made it unforgettable." },
  { event: "SPOOKTOBER 4.0", name: "Anthony Samuel", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my second trip with 3M and what I learned is that you are doing something special by bringing together people from different backgrounds." },
  { event: "SPOOKTOBER 4.0", name: "Zamzam Pervaiz", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my third trip with Teen Musafir as a solo traveler and I have always felt safe. This trip became a phenomenal core memory." },
  { event: "SPOOKTOBER 4.0", name: "Komal Rafiq", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my first ever solo trip. I came wanting random conversations and less photos, and I am glad I got all of it." },
  { event: "SPOOKTOBER 4.0", name: "Awais Arshad", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my very first travel experience within Pakistan and it turned out to be wonderful. Everything was well organized and I made many new friends." },
  { event: "SPOOKTOBER 4.0", name: "Aamna Adil", createdAt: "2025-11-03T00:00:00.000Z", text: "This has been the best trip I have ever been on. I have never made this many friends in two days in my life." },
  { event: "SPOOKTOBER 4.0", name: "Shanzay Khan", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my fourth trip with 3M but definitely the best experience so far. I truly enjoyed the inclusive vibe of the entire trip." },
  { event: "SPOOKTOBER 4.0", name: "Misbah", createdAt: "2025-11-03T00:00:00.000Z", text: "This was my first trip with 3 Musafir and it blessed me with unforgettable memories. I met many amazing people and felt a lot of support for my little cookie venture." },
];
