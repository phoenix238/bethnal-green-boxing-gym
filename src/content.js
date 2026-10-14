// All public-facing copy lives here so it can be checked against the
// interview notes (docs/INTERVIEW_NOTES.md) without reading layout code.
// Rule: only facts marked "Clear" in the notes. Anything else is a labelled placeholder.
// Founder: Bernie Paul, 'he' (owner confirmed). Pro facts limited to what the press caption and magazine cover prove.

export const site = {
  name: 'Bethnal Green Boxing Club',
  mark: 'BG',
  area: 'Bethnal Green, East London',
  tagline: 'A proper boxing gym for the neighbourhood.',
};

export const photos = {
  ring: { src: 'photos/ring.jpg', alt: 'The gym ring with white ropes and a Bethnal Green Boxing Club canvas, fight posters on the walls behind', caption: 'The ring' },
  lounge: { src: 'photos/lounge-posters.jpg', alt: 'Seating area with a sofa, a table of boxing magazines and a wall of fight posters', caption: 'The poster wall' },
  floor: { src: 'photos/training-floor.jpg', alt: 'Training floor with rubber matting, benches, dumbbells and weight plates', caption: 'The training floor' },
  magazinesClose: { src: 'photos/magazines-close.jpg', alt: 'Stacks of old Boxing News and The Ring magazines on a table', caption: 'Old Boxing News and The Ring' },
  magazinesTable: { src: 'photos/magazines-table.jpg', alt: 'A white table piled with vintage boxing magazines next to a sofa', caption: 'The magazine table' },
  // Founder photos supplied by the owner. Press pictures (Action Images) and the magazine cover belong to their publishers: get permission before launch.
  founderPostbox: { src: 'photos/founder-postbox.jpg', width: 1093, height: 728, alt: 'Black and white photo of a young Bernie Paul in boxing gloves next to an old Post Office pillar box', caption: 'The Punching Postman' },
  founderMagazine: { src: 'photos/founder-magazine.jpg', width: 635, height: 615, alt: 'Royal Mail’s London Magazine cover with Bernie Paul in red gloves, headline Punching Postman', caption: 'Royal Mail’s London Magazine' },
  founderYorkHall: { src: 'photos/founder-york-hall.jpg', width: 600, height: 435, alt: 'Black and white fight photo of Bernie Paul landing a right hand', caption: 'York Hall, 29 November 1995' },
  founderCelebrates: { src: 'photos/founder-celebrates.jpg', width: 672, height: 502, alt: 'Bernie Paul celebrating with arms raised as the referee steps in, opponent on the canvas', caption: 'Southern Area title win' },
  founderSparring: { src: 'photos/founder-sparring.jpg', width: 482, height: 357, alt: 'Black and white photo of Bernie Paul in an exchange at close range', caption: 'Bernie Paul in action' },
  // Members are identifiable: get everyone's consent (a parent's for anyone under 18) before these go on a public site.
  clubGroup: { src: 'photos/club-group.jpg', width: 1200, height: 900, alt: 'A class group in the ring with guards up, fight posters behind', caption: 'Guards up' },
  clubGroup2: { src: 'photos/club-group-2.jpg', width: 1200, height: 1600, alt: 'Another class group posing in the ring with guards up', caption: 'In the ring after class' },
};

export const media = {
  logo: { src: 'logo.jpg', width: 1063, height: 848, alt: 'Bethnal Green Boxing Club logo' },
  video: { src: 'video/pads.mp4', poster: 'video/pads-poster.jpg', alt: 'Pad work in the ring during a class' },
  whatsapp: 'https://chat.whatsapp.com/G5KmaFQfJpKEKg2zpGwjtI',
};

export const hero = {
  eyebrow: 'Bethnal Green · Opposite York Hall',
  title: ['Old-school boxing,', 'down in the basement.'],
  lede: 'Classes for every level, and beginners are always welcome. This isn\'t a gym for looking in the mirror. You come down, you work, you sweat.',
  primaryCta: 'See the timetable',
  secondaryCta: 'Our story',
};

export const approach = {
  eyebrow: 'How we do it',
  heading: ['Not a fancy gym.', 'A proper one.'],
  lede: 'Old fight posters, donated bags and gloves, and a ring. Nothing shiny. Just a place to learn to box and get properly fit.',
  body: 'Every class is open level. If you\'ve never thrown a punch, you start where you are. If you\'ve boxed for years, you\'ll still be working. Nobody here is trying to impress anyone.',
  values: [
    { title: 'Everyone starts somewhere', text: 'Classes are open level. First session or not, you train together and push at your own pace.' },
    { title: 'Old school', text: 'Hard work and discipline. Proper boxing, taught the way it always has been.' },
    { title: 'Giving back', text: 'It isn\'t all about the money. The club is here to give something back to Bethnal Green.' },
  ],
};

export const sessions = {
  eyebrow: 'The timetable',
  heading: ['A range of', 'classes.'],
  intro: 'First time or fiftieth, there\'s a class for you. Have a look at what\'s on, read what each one is, and book a place.',
  priceNote: '£10 a class. £5 if you rent a studio in the Proposition Studios building: ask at the desk or in the WhatsApp group for the code.',
  discountHint: 'Studio holder in the Proposition Studios building? Enter your code for the £5 rate.',
  bookingNotice: 'Online booking is not open yet. This preview does not take payment or hold a place.',
};

export const story = {
  eyebrow: 'Our story',
  heading: ['Told to go and stick', 'to the heavy bag.'],
  paragraphs: [
    'Bernie Paul started boxing at about 15, at Finchley Boxing Club, along with his brothers Steve and John. That was home for the best part of three years.',
    'One of the trainers there had already made his mind up. Steve and John, he said, were going to be fighters. Bernie was told to go and stick to the heavy bag.',
    'It didn\'t put him off. It made him hungrier. Steve and John were the more gifted boxers, but Bernie had the power.',
    'After disagreements at Finchley, the brothers moved to Tottenham New Enterprise Boxing Club. It was a long trek from Highgate, and a hard, serious gym when you got there.',
    'The work paid off, and the amateur wins came.',
  ],
  pro: {
    heading: ['The Punching', 'Postman.'],
    paragraphs: [
      'A shoulder injury kept Bernie out of the ring for years. He kept training anyway, and turned professional in his mid-twenties.',
      'He kept his job as a postman the whole time. Royal Mail\'s London Magazine put him on the cover as the Punching Postman, Hornsey\'s Bernie Paul.',
      'On 29 November 1995 he boxed Jason Rowland at York Hall for the Southern Area light-welterweight title, and knocked him out on the bell at the end of the first round.',
      'York Hall is right across the road from the club. Bernie won a title there. Now he teaches boxing opposite it.',
    ],
  },
  quote: null,
};

export const gym = {
  eyebrow: 'The space',
  heading: ['From a grubby basement', 'to a proper gym.'],
  paragraphs: [
    'The gym is in the basement of the Proposition Studios building in Bethnal Green, right opposite York Hall.',
    'When Bernie was first shown it, the basement was dark and grubby. The brief from the chairman of Proposition Studios was short: turn it into a gym.',
    'So that\'s what happened. Up went the fight posters. In came bags, gloves and kit, much of it donated, some of it by artists. There\'s a ring with the club\'s name on the canvas and a table piled with old boxing magazines.',
  ],
};

export const community = {
  eyebrow: 'Community',
  heading: ['Giving something', 'back.'],
  paragraphs: [
    'Before this gym, Bernie ran a small training group from a garage during lockdown. Some young people came along, and it was clear what regular training, discipline and a bit of belonging did for them.',
    'That\'s the heart of this club. It\'s not all about the money. It\'s about giving people somewhere to go, something to work at, and people in their corner.',
  ],
  goals: [
    'Find local funders and supporters to back the club\'s community work',
    'Raise money for a minibus, so the club can run day trips for young people and adults who need a break',
    'Work with the council to support young people in Bethnal Green',
  ],
  note: 'These are goals the club is working towards, not services running today.',
};

export const shop = {
  eyebrow: 'Kit',
  heading: ['Club kit', 'is on the way.'],
  text: 'Bethnal Green Boxing Club kit is coming soon. Nothing is on sale yet.',
  status: 'Coming soon',
};

export const club = {
  eyebrow: 'The club',
  heading: ['The people', 'who train here.'],
  text: 'Young and old, first-timers and people who\'ve boxed for years. Everyone trains together, and everyone gets in the photo at the end.',
};

export const join = {
  eyebrow: 'Get in touch',
  heading: ['Join the', 'WhatsApp group.'],
  text: 'Hear about classes, ask a question before your first session, or just say hello.',
  button: 'Join the WhatsApp group',
  note: 'Online booking isn\'t open yet, so the WhatsApp group is the way to get in touch for now.',
};

export const visit = {
  eyebrow: 'Find us',
  heading: ['Come down', 'and train.'],
  items: [
    { label: 'Where', value: 'Basement of the Proposition Studios building, Bethnal Green, opposite York Hall. Full address to be confirmed.' },
    { label: 'When', value: 'See the classes page for what\'s on and when.' },
    { label: 'Price', value: '£10 a class · £5 if you rent a studio in the Proposition Studios building (ask for the code)' },
  ],
};

export const cta = {
  heading: ['Come as you are.', 'Leave a bit stronger.'],
  text: 'Open level, beginners welcome. No experience needed.',
  button: 'See the timetable',
};

export const footer = {
  line: 'A community boxing club in Bethnal Green, East London. Online booking and the kit shop are not open yet.',
  instagram: null, // link to be supplied by the owner
};

// Text for the full classes page. The classes themselves (names, descriptions, lengths, dates) come live from Cal.com,
// so the owner changes them there and the website follows.
export const classesPage = {
  eyebrow: 'What\'s on',
  heading: ['Classes at', 'the club.'],
  intro: 'Everything below is straight from our booking calendar, so it is always up to date. Pick a class and book your place.',
  groupHeading: 'Group classes',
  privateHeading: 'Private sessions',
  empty: 'No classes are listed right now. Check back soon, or message the WhatsApp group.',
  error: 'We couldn\'t load the class list just now.',
};
