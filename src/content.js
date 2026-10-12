// All public-facing copy lives here so it can be checked against the
// interview notes (docs/INTERVIEW_NOTES.md) without reading layout code.
// Rule: only facts marked "Clear" in the notes. Anything else is a labelled placeholder.
// Founder pronouns and name are deliberately left out (see HANDOFF.md guardrails).

export const site = {
  name: 'Bethnal Green Boxing Club',
  mark: 'BG',
  area: 'Bethnal Green, East London',
  tagline: 'A proper boxing gym for the neighbourhood.',
};

export const photos = {
  ring: { src: '/photos/ring.jpg', alt: 'The gym ring with white ropes and a Bethnal Green Boxing Club canvas, fight posters on the walls behind', caption: 'The ring' },
  lounge: { src: '/photos/lounge-posters.jpg', alt: 'Seating area with a sofa, a table of boxing magazines and a wall of fight posters', caption: 'The poster wall' },
  floor: { src: '/photos/training-floor.jpg', alt: 'Training floor with rubber matting, benches, dumbbells and weight plates', caption: 'The training floor' },
  magazinesClose: { src: '/photos/magazines-close.jpg', alt: 'Stacks of old Boxing News and The Ring magazines on a table', caption: 'Old Boxing News and The Ring' },
  magazinesTable: { src: '/photos/magazines-table.jpg', alt: 'A white table piled with vintage boxing magazines next to a sofa', caption: 'The magazine table' },
};

export const hero = {
  eyebrow: 'Bethnal Green · Opposite York Hall',
  title: ['Old-school boxing,', 'down in the basement.'],
  lede: 'Tuesday and Thursday nights at 7pm. Open level, and beginners are welcome. This isn\'t a gym for looking in the mirror. You come down, you work, you sweat.',
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
  heading: ['Two nights', 'a week.'],
  intro: 'Tuesday and Thursday at 7pm. Both classes are open level and beginner friendly, so you don\'t need any experience to come along.',
  priceNote: '£10 per class. £5 for Proposition Studios artists.',
  bookingNotice: 'Online booking is not open yet. This preview does not take payment or hold a place.',
};

export const story = {
  eyebrow: 'Our story',
  heading: ['Told to go and stick', 'to the heavy bag.'],
  paragraphs: [
    'Our founder started boxing at about 15, at Finchley Boxing Club, along with brothers Steve and John. That was home for the best part of three years.',
    'One of the trainers there had already made his mind up. Steve and John, he said, were going to be fighters. Our founder was told to go and stick to the heavy bag.',
    'It could have been the end of it. Instead it made our founder hungrier. Steve and John were the more gifted boxers, but our founder had the power, and stayed on that bag.',
    'After disagreements at Finchley, the brothers moved to Tottenham New Enterprise Boxing Club. It was a long trek from Highgate, and a hard, serious gym when you got there. Nobody messed about.',
    'The work paid off. The amateur wins came, and in time our founder went on to box professionally.',
    'Now the club has a home in Bethnal Green, opposite York Hall. The idea is simple: an honest boxing gym, open to anyone, that gives something back.',
  ],
  // Quotes come from a machine transcript: needsSignOff stays true until the founder approves the wording.
  quote: { text: 'It breaks you down to build you up.', attribution: 'Our founder', needsSignOff: true },
};

export const gym = {
  eyebrow: 'The space',
  heading: ['From a grubby basement', 'to a proper gym.'],
  paragraphs: [
    'The gym is in the basement of the Proposition Studios building in Bethnal Green, right opposite York Hall.',
    'When our founder was first shown it, the basement was dark and grubby. The brief from the chairman of Proposition Studios was short: turn it into a gym.',
    'So that\'s what happened. Up went the fight posters. In came bags, gloves and kit, much of it donated, some of it by artists. There\'s a ring with the club\'s name on the canvas and a table piled with old boxing magazines.',
  ],
};

export const community = {
  eyebrow: 'Community',
  heading: ['Giving something', 'back.'],
  paragraphs: [
    'Before this gym, our founder ran a small training group from a garage during lockdown. Some young people came along, and it was clear what regular training, discipline and a bit of belonging did for them.',
    'That\'s the heart of this club. It\'s not all about the money. It\'s about giving people somewhere to go, something to work at, and people in their corner.',
  ],
  goals: [
    'Find local funders and supporters to back the club\'s community work',
    'Raise money for a minibus, so the club can run day trips for young people and adults who need a break',
    'Work with the council to support young people in Bethnal Green',
    'Build a community page about Bethnal Green, its history, York Hall and local landmarks',
  ],
  note: 'These are goals the club is working towards, not services running today.',
};

export const shop = {
  eyebrow: 'Kit',
  heading: ['Club kit', 'is on the way.'],
  text: 'We\'re working on Bethnal Green Boxing Club t-shirts, shorts, hand wraps and gloves. Nothing is on sale yet.',
  status: 'Coming soon',
};

export const visit = {
  eyebrow: 'Find us',
  heading: ['Come down', 'and train.'],
  items: [
    { label: 'Where', value: 'Basement of the Proposition Studios building, Bethnal Green, opposite York Hall. Full address to be confirmed.' },
    { label: 'When', value: 'Tuesday and Thursday, 7pm' },
    { label: 'Price', value: '£10 per class · £5 Proposition Studios artists' },
  ],
};

export const cta = {
  heading: ['Come as you are.', 'Leave a bit stronger.'],
  text: 'Tuesday and Thursday, 7pm. No experience needed.',
  button: 'See the timetable',
};

export const footer = {
  line: 'A community boxing club in Bethnal Green, East London. Online booking and the kit shop are not open yet.',
  instagram: null, // link to be supplied by the owner
};
