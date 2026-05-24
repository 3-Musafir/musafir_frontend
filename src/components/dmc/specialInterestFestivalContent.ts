export type FestivalItineraryDay = {
  day: string;
  plan: string;
};

export type SpecialInterestFestival = {
  slug: string;
  name: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  duration: string;
  region: string;
  positioning: string;
  agencyNote: string;
  itinerary: FestivalItineraryDay[];
};

export const sharedFestivalInclusions = [
  "Hotel coordination",
  "Private group transport",
  "Local guides and festival interpreters",
  "Responsible travel briefing",
  "Cultural etiquette orientation",
  "Route and weather monitoring",
  "Festival timing coordination",
  "Group movement management",
  "Airport receiving and departure assistance",
  "Optional photography/video support",
  "On-ground DMC coordination",
];

export const sharedFestivalExclusions = [
  "International flights",
  "Pakistan visa fees",
  "Travel insurance",
  "Emergency evacuation",
  "Domestic flights unless specified",
  "Festival permissions or special access unless confirmed",
  "Personal expenses",
  "Meals not mentioned",
  "Extra nights due to weather, road closures, flight delays, or force majeure",
];

export const festivalPageNote =
  "Dates are subject to local confirmation. Many of these are community-led or weather/season-sensitive events, so final schedules should be reconfirmed through local partners before selling.";

export const specialInterestFestivals: SpecialInterestFestival[] = [
  {
    slug: "shimshal-kuch-festival",
    name: "Shimshal Kuch Festival",
    seoTitle: "Shimshal Kuch Festival DMC | Upper Hunza Cultural Trek | 3Musafir",
    metaDescription:
      "3Musafir designs Shimshal Kuch Festival DMC itineraries for foreign agencies, with Upper Hunza trekking logistics, camping, local guides, porter support, cultural access, and responsible community coordination.",
    h1: "Shimshal Kuch Festival DMC Itinerary for Upper Hunza Cultural Trekking",
    duration: "12 to 14 days",
    region: "Shimshal Valley, Upper Hunza, Pamir/Gujerav pasture route",
    positioning:
      "A remote Upper Hunza cultural trek built around the return of Shimshal shepherds and livestock from the Pamir/Gujerav pastures. The Kuch Festival celebrates the safe return of shepherds and animals through traditional rituals and community celebration in Shimshal Valley.",
    agencyNote:
      "This is not a mass-market festival. It should be sold as a remote cultural expedition requiring trekking fitness, local coordination, camping logistics, porter support, and responsible community access.",
    itinerary: [
      { day: "Day 1", plan: "Arrival in Islamabad, DMC briefing, trek and cultural etiquette orientation" },
      { day: "Day 2", plan: "Islamabad to Chilas/Besham via Karakoram Highway" },
      { day: "Day 3", plan: "Chilas to Hunza/Gulmit/Passu with Rakaposhi and KKH stops" },
      { day: "Day 4", plan: "Jeep transfer to Shimshal Valley, village orientation" },
      { day: "Day 5", plan: "Trek toward Shimshal Pamir route, campsite setup" },
      { day: "Day 6", plan: "Trek with local herder route, high-pasture cultural interpretation" },
      { day: "Day 7", plan: "Move toward Shimshal Pass / festival zone" },
      { day: "Day 8", plan: "Kuch Festival observation and community participation" },
      { day: "Day 9", plan: "Descent with local movement toward Shimshal village" },
      { day: "Day 10", plan: "Return to Shimshal, village celebration and rest" },
      { day: "Day 11", plan: "Jeep back to Hunza/Gulmit" },
      { day: "Day 12", plan: "Hunza heritage day: Passu, Gulmit, Attabad, Karimabad" },
      { day: "Day 13", plan: "Hunza to Chilas/Besham" },
      { day: "Day 14", plan: "Return to Islamabad / departure buffer" },
    ],
  },
  {
    slug: "hunza-winter-festival",
    name: "Hunza Winter Festival",
    seoTitle: "Hunza Winter Festival DMC | Ice Sports & Culture in Gilgit-Baltistan | 3Musafir",
    metaDescription:
      "3Musafir supports Hunza Winter Festival DMC programs for foreign agencies, including Attabad Lake ice sports, Hunza heritage, Gojal winter landscapes, local guides, hotels, transport, and winter logistics.",
    h1: "Hunza Winter Festival DMC Itinerary for Ice Sports and Culture",
    duration: "8 to 9 days",
    region: "Hunza, Attabad Lake, Karimabad, Gojal, Gilgit-Baltistan",
    positioning:
      "A winter sports and cultural itinerary centered around Attabad Lake, Hunza Valley, ice hockey, ice skating, traditional games, cultural performances, and winter landscapes. The product is strongest as Pakistan winter travel, cultural sports, and women-inclusive mountain community.",
    agencyNote:
      "Sell this as Pakistan winter travel plus cultural sports plus women-inclusive mountain community. It is a strong fit for European winter festival audiences.",
    itinerary: [
      { day: "Day 1", plan: "Arrival in Islamabad, winter briefing, equipment/clothing advisory" },
      { day: "Day 2", plan: "Fly/drive to Gilgit, continue to Hunza" },
      { day: "Day 3", plan: "Festival opening at Attabad Lake, ice hockey and ice skating" },
      { day: "Day 4", plan: "Winter sports, traditional games, cultural show" },
      { day: "Day 5", plan: "Hunza sightseeing: Baltit Fort, Altit Fort, Karimabad, Eagle's Nest" },
      { day: "Day 6", plan: "Gojal day: Gulmit, Passu Cones, Hussaini Bridge, winter photography" },
      { day: "Day 7", plan: "Khunjerab / upper Hunza winter excursion if accessible" },
      { day: "Day 8", plan: "Return to Gilgit/Islamabad" },
      { day: "Day 9", plan: "Departure / Islamabad buffer" },
    ],
  },
  {
    slug: "ice-hockey-hunza",
    name: "Ice Hockey in Hunza / Gilgit-Baltistan",
    seoTitle: "Ice Hockey in Hunza DMC | Gilgit-Baltistan Winter Sports Tour | 3Musafir",
    metaDescription:
      "3Musafir builds Ice Hockey in Hunza DMC itineraries around Gilgit-Baltistan winter sports, frozen lake culture, skating, Hunza heritage, Gojal landscapes, guides, transport, and hotel coordination.",
    h1: "Ice Hockey in Hunza DMC Itinerary for Gilgit-Baltistan Winter Sports",
    duration: "7 days",
    region: "Hunza, Attabad Lake, Gojal, Gilgit-Baltistan",
    positioning:
      "A winter sports itinerary around Hunza and Gilgit-Baltistan's frozen lake culture, ice hockey, skating, winter landscapes, and community sports.",
    agencyNote:
      "Strong for sports tourism, winter photography, women-inclusive winter sports, and Northern Pakistan winter culture.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad arrival and winter briefing" },
      { day: "Day 2", plan: "Fly/drive to Gilgit, continue to Hunza" },
      { day: "Day 3", plan: "Attabad Lake / ice sports orientation" },
      { day: "Day 4", plan: "Ice hockey, skating, local winter games" },
      { day: "Day 5", plan: "Hunza heritage: Baltit, Altit, Karimabad" },
      { day: "Day 6", plan: "Gojal winter landscapes: Passu, Gulmit, Borith" },
      { day: "Day 7", plan: "Return to Islamabad" },
    ],
  },
  {
    slug: "sut-das-darel-festival",
    name: "Sut Das Darel Festival",
    seoTitle: "Sut Das Darel Festival DMC | Diamer Cultural Sports Tour | 3Musafir",
    metaDescription:
      "3Musafir supports Sut Das Darel Festival DMC programs in Diamer with local permissions, festival access, polo, horse racing, football, music, heritage interpretation, transport, and guides.",
    h1: "Sut Das Darel Festival DMC Itinerary for Diamer Cultural Sports",
    duration: "8 to 9 days",
    region: "Darel Valley, Diamer, Gilgit-Baltistan",
    positioning:
      "A culturally rooted festival in Darel Valley, Diamer, combining polo, horse racing, football, traditional music, local heritage, and mountain landscapes.",
    agencyNote:
      "This is a good offbeat Gilgit-Baltistan cultural sports product, but requires strong local permissions and crowd/movement management.",
    itinerary: [
      { day: "Day 1", plan: "Arrival in Islamabad or Gilgit" },
      { day: "Day 2", plan: "Travel to Gilgit / Diamer region" },
      { day: "Day 3", plan: "Drive to Darel Valley, local orientation" },
      { day: "Day 4", plan: "Sut Das Festival: opening, polo, horse racing" },
      { day: "Day 5", plan: "Festival sports, football, local music" },
      { day: "Day 6", plan: "Village culture, food, community interaction" },
      { day: "Day 7", plan: "Valley landscapes and heritage storytelling" },
      { day: "Day 8", plan: "Return to Gilgit/Islamabad" },
      { day: "Day 9", plan: "Departure buffer" },
    ],
  },
  {
    slug: "taghm-spring-festival",
    name: "Taghm Spring Festival",
    seoTitle: "Taghm Spring Festival DMC | Shimshal Agricultural Festival Tour | 3Musafir",
    metaDescription:
      "3Musafir designs Taghm Spring Festival DMC itineraries in Shimshal Valley with spring rituals, agricultural heritage, village walks, local guides, jeep logistics, hotels, and responsible cultural access.",
    h1: "Taghm Spring Festival DMC Itinerary for Shimshal Agricultural Heritage",
    duration: "8 to 9 days",
    region: "Shimshal Valley, Upper Hunza",
    positioning:
      "A spring festival in Shimshal marking the beginning of the agricultural season after winter, with rituals, cultural dances, local cuisine, and agricultural heritage in Shimshal Valley.",
    agencyNote:
      "Best positioned as spring awakening in the high mountains: agriculture, survival, culture, and community after winter.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad arrival and cultural briefing" },
      { day: "Day 2", plan: "Islamabad to Chilas/Besham" },
      { day: "Day 3", plan: "Chilas to Hunza/Gulmit" },
      { day: "Day 4", plan: "Jeep transfer to Shimshal Valley" },
      { day: "Day 5", plan: "Taghm Festival: spring rituals, dances, local food" },
      { day: "Day 6", plan: "Shimshal village walks, agricultural heritage, community storytelling" },
      { day: "Day 7", plan: "Return to Hunza, Attabad/Gulmit/Passu stops" },
      { day: "Day 8", plan: "Drive/fly back toward Islamabad" },
      { day: "Day 9", plan: "Departure buffer" },
    ],
  },
  {
    slug: "jashn-e-gultari",
    name: "Jashn-e-Gultari / Singo Festival",
    seoTitle: "Jashn-e-Gultari DMC | Baltistan Cultural Festival Tour | 3Musafir",
    metaDescription:
      "3Musafir supports Jashn-e-Gultari DMC itineraries for Baltistan cultural groups, including Gultari Valley access, Shina-speaking heritage, local music, games, food, transport, and guides.",
    h1: "Jashn-e-Gultari DMC Itinerary for Baltistan Cultural Travel",
    duration: "7 days",
    region: "Gultari Valley, Baltistan",
    positioning:
      "A cultural festival in Gultari Valley, Baltistan, focused on Shina-speaking culture, music, games, hospitality, and Himalayan landscapes.",
    agencyNote:
      "Strong for rare Baltistan cultural access. Keep expectations clear: remote route, limited accommodation, and local scheduling flexibility.",
    itinerary: [
      { day: "Day 1", plan: "Fly to Skardu, hotel check-in, Skardu Bazaar" },
      { day: "Day 2", plan: "Skardu to Gultari Valley, scenic stops" },
      { day: "Day 3", plan: "Jashn-e-Gultari opening, local music and games" },
      { day: "Day 4", plan: "Festival immersion, village culture, food" },
      { day: "Day 5", plan: "Gultari landscapes, photography, community interaction" },
      { day: "Day 6", plan: "Return to Skardu, Satpara/Kachura add-on" },
      { day: "Day 7", plan: "Fly/drive to Islamabad" },
    ],
  },
  {
    slug: "shyok-winter-festival",
    name: "Shyok Winter Festival, Khaplu",
    seoTitle: "Shyok Winter Festival DMC | Khaplu Winter Sports & Culture | 3Musafir",
    metaDescription:
      "3Musafir manages Shyok Winter Festival DMC tours in Khaplu with winter sports, Balti culture, Khaplu Palace, Shyok River routes, heritage stays, local guides, and transport.",
    h1: "Shyok Winter Festival DMC Itinerary for Khaplu Winter Sports and Culture",
    duration: "5 to 6 days",
    region: "Khaplu, Shyok Valley, Baltistan",
    positioning:
      "A winter sports and Balti culture itinerary in Khaplu, combining snow landscapes, Shyok River geography, Khaplu Palace, Tiaku Polo, ice hockey, rock climbing, volleyball, and cultural performances.",
    agencyNote:
      "Good for premium winter Baltistan products. Add heritage stay options near Khaplu where available.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad to Skardu flight, Katpana/Skardu Bazaar" },
      { day: "Day 2", plan: "Drive to Khaplu via Shigar and Shyok River viewpoints" },
      { day: "Day 3", plan: "Shyok Winter Festival opening, Tiaku Polo, ice hockey" },
      { day: "Day 4", plan: "Winter sports, cultural performances, Khaplu Palace" },
      { day: "Day 5", plan: "Return to Skardu" },
      { day: "Day 6", plan: "Fly/drive to Islamabad" },
    ],
  },
  {
    slug: "mayfung-fire-festival-skardu",
    name: "Mayfung Fire Festival, Skardu",
    seoTitle: "Mayfung Fire Festival DMC | Skardu Winter Solstice Tour | 3Musafir",
    metaDescription:
      "3Musafir builds Mayfung Fire Festival DMC itineraries in Skardu around winter solstice, bonfires, Balti music, dancing, local sports, Shigar, Sarfaranga, transport, and hotels.",
    h1: "Mayfung Fire Festival DMC Itinerary for Skardu Winter Solstice",
    duration: "6 days",
    region: "Skardu, Baltistan",
    positioning:
      "A Balti winter solstice festival in Skardu built around bonfires, music, dancing, local sports, and community warmth in a high-mountain winter setting.",
    agencyNote:
      "Strong sell for winter solstice, fire, folklore, and Balti hospitality. Needs weather-safe pacing.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad to Chilas by road" },
      { day: "Day 2", plan: "Chilas to Skardu" },
      { day: "Day 3", plan: "Skardu orientation: Katpana, Kachura, bazaar" },
      { day: "Day 4", plan: "Mayfung Fire Festival: bonfires, music, community celebration" },
      { day: "Day 5", plan: "Shigar Fort / Sarfaranga Cold Desert add-on" },
      { day: "Day 6", plan: "Return to Islamabad by flight or staged road movement" },
    ],
  },
  {
    slug: "hindukush-snow-festival",
    name: "Hindukush Snow Festival, Madaglasht Chitral",
    seoTitle: "Hindukush Snow Festival DMC | Madaglasht Chitral Winter Sports Tour | 3Musafir",
    metaDescription:
      "3Musafir supports Hindukush Snow Festival DMC tours in Madaglasht Chitral with winter sports, ice hockey, local music, cuisine, 4x4 movement, route monitoring, and guides.",
    h1: "Hindukush Snow Festival DMC Itinerary for Chitral Winter Sports",
    duration: "6 days",
    region: "Madaglasht, Shishi Valley, Chitral",
    positioning:
      "A Chitral winter sports and culture itinerary in Madaglasht/Shishi Valley, combining skiing, snowboarding, ice skating, traditional ice hockey, music, arts, cuisine, and Chitrali hospitality.",
    agencyNote:
      "Position as Hindukush winter culture plus community sports, not just a snow trip. Requires 4x4s, weather monitoring, and winter gear guidance.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad to Drosh/Chitral route" },
      { day: "Day 2", plan: "4x4 transfer to Madaglasht via Shishi Valley" },
      { day: "Day 3", plan: "Festival opening: skiing, snowboarding, ice sports" },
      { day: "Day 4", plan: "Traditional ice hockey, local music, food" },
      { day: "Day 5", plan: "Madaglasht village and winter landscape day" },
      { day: "Day 6", plan: "Return to Islamabad / Chitral buffer" },
    ],
  },
  {
    slug: "ko-polo-hurchus-valley",
    name: "Ko-Polo Hurchus Valley Winter Sports",
    seoTitle: "Ko-Polo Hurchus Valley DMC | Winter Sports in Baltistan | 3Musafir",
    metaDescription:
      "3Musafir offers Ko-Polo Hurchus Valley DMC support for niche Baltistan winter sports programs with local games, food, music, Skardu logistics, transport, guides, and hotel coordination.",
    h1: "Ko-Polo Hurchus Valley DMC Itinerary for Baltistan Winter Sports",
    duration: "6 days",
    region: "Hurchus Valley, Baltistan",
    positioning:
      "A Baltistan winter sports itinerary built around Ko-Polo and local winter games in Hurchus Valley.",
    agencyNote:
      "This can work as a niche winter sports plus local culture product for small groups.",
    itinerary: [
      { day: "Day 1", plan: "Fly to Skardu, hotel check-in" },
      { day: "Day 2", plan: "Drive to Hurchus Valley, local orientation" },
      { day: "Day 3", plan: "Ko-Polo winter sports opening" },
      { day: "Day 4", plan: "Local games, music, food, community interaction" },
      { day: "Day 5", plan: "Return to Skardu, Kachura/Katpana add-on" },
      { day: "Day 6", plan: "Fly/drive to Islamabad" },
    ],
  },
  {
    slug: "shogun-bohor-festival",
    name: "Shogun Bohor Festival, Gojal",
    seoTitle: "Shogun Bohor Festival DMC | Gojal Cultural Festival Tour | 3Musafir",
    metaDescription:
      "3Musafir designs Shogun Bohor Festival DMC itineraries in Gojal and Upper Hunza with Wakhi culture, mountain villages, food, music, storytelling, guides, hotels, and transport.",
    h1: "Shogun Bohor Festival DMC Itinerary for Gojal Cultural Travel",
    duration: "5 to 6 days",
    region: "Gojal, Upper Hunza",
    positioning:
      "A Gojal/Upper Hunza cultural itinerary suitable for travelers interested in Wakhi culture, mountain villages, food, music, storytelling, and remote community celebrations.",
    agencyNote:
      "Position for slow culture, language, food, mountain identity, not generic sightseeing.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad to Gilgit/Hunza" },
      { day: "Day 2", plan: "Hunza to Gojal: Gulmit, Passu, village orientation" },
      { day: "Day 3", plan: "Shogun Bohor Festival: local ceremonies, food, music" },
      { day: "Day 4", plan: "Gojal cultural immersion, Passu/Borith add-on" },
      { day: "Day 5", plan: "Return to Gilgit/Hunza" },
      { day: "Day 6", plan: "Fly/drive to Islamabad" },
    ],
  },
  {
    slug: "taleno-thumishalling-festival",
    name: "Taleno Thumishalling Festival, Khanabad Hunza",
    seoTitle: "Taleno Thumishalling Festival DMC | Khanabad Hunza Cultural Tour | 3Musafir",
    metaDescription:
      "3Musafir supports Taleno Thumishalling Festival DMC tours in Khanabad Hunza with folklore interpretation, music, dance, ritual storytelling, Hunza heritage, hotels, guides, and transport.",
    h1: "Taleno Thumishalling Festival DMC Itinerary for Khanabad Hunza",
    duration: "8 days",
    region: "Khanabad, Hunza",
    positioning:
      "A Hunza cultural festival in Khanabad centered on storytelling, symbolic ritual, music, dance, and community gathering.",
    agencyNote:
      "This is a myth, folklore, and Hunza identity itinerary. Use sensitive interpretive guides.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad arrival" },
      { day: "Day 2", plan: "Islamabad to Chilas/Besham" },
      { day: "Day 3", plan: "Chilas to Hunza" },
      { day: "Day 4", plan: "Karimabad, Baltit, Altit, Eagle's Nest" },
      { day: "Day 5", plan: "Khanabad festival day: ritual, storytelling, music" },
      { day: "Day 6", plan: "Gojal/Attabad/Passu add-on" },
      { day: "Day 7", plan: "Return to Chilas/Besham" },
      { day: "Day 8", plan: "Islamabad return / departure buffer" },
    ],
  },
  {
    slug: "vesaki-day-taxila",
    name: "Vesaki Day Festival, Taxila",
    seoTitle: "Vesaki Day Taxila Tour DMC | Buddhist Heritage Pakistan | 3Musafir",
    metaDescription:
      "3Musafir supports Vesaki Day Taxila DMC tours for Buddhist heritage, cultural, spiritual, interfaith, and academic groups, including Taxila Museum, archaeological sites, guides, transport, and Islamabad add-ons.",
    h1: "Vesaki Day Taxila DMC Itinerary for Buddhist Heritage Travel",
    duration: "1 to 2 days",
    region: "Taxila and Islamabad",
    positioning:
      "A short special-interest Buddhist heritage itinerary around Taxila, suitable for cultural, spiritual, interfaith, academic, and heritage groups.",
    agencyNote:
      "Strong for Buddhist heritage Pakistan, especially for Sri Lankan, Thai, Malaysian, Chinese, Japanese, Korean, and interfaith travel segments.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad to Taxila, museum, Buddhist archaeological sites, Vesaki observance where applicable" },
      { day: "Day 2", plan: "Optional Islamabad heritage add-on: Lok Virsa, Faisal Mosque, Pakistan Monument" },
    ],
  },
  {
    slug: "qaqlasht-festival",
    name: "Qaqlasht Festival, Chitral",
    seoTitle: "Qaqlasht Festival DMC | Chitral Sports & Culture Tour | 3Musafir",
    metaDescription:
      "3Musafir manages Qaqlasht Festival DMC itineraries in Chitral with polo, local sports, music, food, Qaqlasht Plateau access, Chitrali heritage, local guides, transport, and hotels.",
    h1: "Qaqlasht Festival DMC Itinerary for Chitral Sports and Culture",
    duration: "6 days",
    region: "Qaqlasht Plateau, Chitral",
    positioning:
      "A Chitral cultural and sports festival itinerary based around Qaqlasht Plateau, combining polo, local sports, music, food, mountain landscapes, and Chitrali hospitality.",
    agencyNote:
      "This can be sold as Chitral's open-air cultural sports festival with strong photography and community appeal.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad to Chitral" },
      { day: "Day 2", plan: "Chitral town: bazaar, Shahi Mosque, heritage briefing" },
      { day: "Day 3", plan: "Qaqlasht Festival opening, polo and local games" },
      { day: "Day 4", plan: "Festival immersion, music, food, Chitrali sports" },
      { day: "Day 5", plan: "Ayun / Chitral nature and culture add-on" },
      { day: "Day 6", plan: "Return to Islamabad" },
    ],
  },
  {
    slug: "under-a-pagan-moon",
    name: "Pakistan: Under a Pagan Moon",
    seoTitle: "Under a Pagan Moon Pakistan Tour | Kalash Cultural DMC Itinerary | 3Musafir",
    metaDescription:
      "3Musafir designs Under a Pagan Moon Pakistan DMC itineraries for Kalash-focused cultural travel in Chitral, Ayun, Bumburet, Rumbur, local guides, heritage stays, and responsible access.",
    h1: "Under a Pagan Moon Pakistan DMC Itinerary for Kalash Cultural Travel",
    duration: "10 to 12 days",
    region: "Chitral, Ayun, Bumburet, Rumbur, Kalash Valleys",
    positioning:
      "A Kalash-focused special-interest itinerary for foreign agencies looking for deeper cultural, anthropological, and festival-linked travel in Chitral and the Kalash Valleys.",
    agencyNote:
      "This must be handled with strict responsible tourism, consent-based photography, and cultural sensitivity.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad arrival and responsible cultural briefing" },
      { day: "Day 2", plan: "Islamabad to Chitral" },
      { day: "Day 3", plan: "Chitral town, Shahi Mosque, bazaar, heritage context" },
      { day: "Day 4", plan: "Ayun heritage stay and valley orientation" },
      { day: "Day 5", plan: "Bumburet Valley: Kalash culture, museum, village walk" },
      { day: "Day 6", plan: "Rumbur Valley: deeper community immersion" },
      { day: "Day 7", plan: "Festival/cultural observation depending on season" },
      { day: "Day 8", plan: "Chitral nature add-on: Garam Chashma / Chitral Gol" },
      { day: "Day 9", plan: "Return to Islamabad" },
      { day: "Day 10", plan: "Departure buffer" },
      { day: "Days 11-12", plan: "Optional Lahore/Taxila/Islamabad heritage extension" },
    ],
  },
  {
    slug: "shandur-polo-festival",
    name: "Shandur Polo Festival",
    seoTitle: "Shandur Polo Festival DMC | Chitral to Gilgit Polo Tour | 3Musafir",
    metaDescription:
      "3Musafir supports Shandur Polo Festival DMC tours connecting Chitral, Shandur Pass, Gilgit, polo culture, mountain camping, transport, guides, hotels, and high-altitude festival logistics.",
    h1: "Shandur Polo Festival DMC Itinerary from Chitral to Gilgit",
    duration: "10 to 14 days",
    region: "Chitral, Shandur Pass, Phander, Gilgit, Hunza add-on",
    positioning:
      "A high-altitude sports and cultural itinerary around the famous Shandur Polo Festival, connecting Chitral, Shandur Pass, Gilgit, mountain camping, polo culture, and dramatic landscapes.",
    agencyNote:
      "Strong for sports tourism, high-altitude festival travel, and Chitral-Gilgit crossover itineraries.",
    itinerary: [
      { day: "Day 1", plan: "Islamabad arrival" },
      { day: "Day 2", plan: "Islamabad to Chitral" },
      { day: "Day 3", plan: "Chitral town and polo culture orientation" },
      { day: "Day 4", plan: "Chitral to Mastuj/Phander staging" },
      { day: "Day 5", plan: "Move to Shandur Pass" },
      { day: "Day 6", plan: "Shandur Polo Festival opening" },
      { day: "Day 7", plan: "Polo matches, local music, camping" },
      { day: "Day 8", plan: "Final match / festival closing" },
      { day: "Day 9", plan: "Shandur to Gilgit/Phander" },
      { day: "Day 10", plan: "Gilgit to Hunza add-on" },
      { day: "Day 11", plan: "Hunza: Karimabad, Baltit, Altit" },
      { day: "Day 12", plan: "Return to Gilgit/Chilas" },
      { day: "Day 13", plan: "Islamabad return" },
      { day: "Day 14", plan: "Departure buffer" },
    ],
  },
];

export const getSpecialInterestFestival = (slug: string) =>
  specialInterestFestivals.find((festival) => festival.slug === slug);

export const specialInterestFestivalRoutes = [
  "/pakistan-dmc/special-interests/festivals-of-pakistan",
  "/pakistan-dmc/special-interests/kalash-festival-2027",
  ...specialInterestFestivals.map((festival) => `/pakistan-dmc/special-interests/${festival.slug}`),
];
