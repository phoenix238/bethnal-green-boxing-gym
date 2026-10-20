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
  benPlaceholder: { src: 'photos/ben-placeholder.svg', width: 600, height: 750, alt: 'Placeholder silhouette: photo of Ben coming soon', caption: 'Photo coming soon' }, // PLACEHOLDER: swap for Ben's real photo
  clubGroup2: { src: 'photos/club-group-2.jpg', width: 1200, height: 1600, alt: 'Another class group posing in the ring with guards up', caption: 'In the ring after class' },
};

export const media = {
  logo: { src: 'logo.jpg', width: 1063, height: 848, alt: 'Bethnal Green Boxing Club logo' },
  video: { src: 'video/pads.mp4', poster: 'video/pads-poster.jpg', alt: 'Pad work in the ring during a class' },
  whatsapp: 'https://chat.whatsapp.com/G5KmaFQfJpKEKg2zpGwjtI',
};

// Through-line: Home = Bernie + the gym + your first class. Classes = what's on and how to book.
// Story = Bernie's boxing life. Gym = the room and the people in it. Community = why the club exists.
// Visit = where, when, how much, how to ask. Each page has one job; don't repeat another page's job.

// HOME
export const hero = {
  eyebrow: 'Bethnal Green · Opposite York Hall',
  title: ['Learn to box', 'with Bernie.'],
  lede: [
    'A small boxing club in a basement in Bethnal Green, run by Bernie Paul. Former pro. Once known as the Punching Postman.',
    'Every class is open level. Never boxed? Good. That\'s where everyone starts.',
  ],
  // Hero picture: a key from `photos` below. Temporary: a class group in the ring, until the owner supplies the hero photo.
  photo: 'clubGroup',
  primaryCta: 'Book a class', // opens the Cal.com booking calendar on the page
  secondaryCta: 'See the classes',
};

// Home: short personal introduction to Bernie. Links on to the full story rather than telling it.
export const meet = {
  eyebrow: 'Your coach',
  heading: ['You\'ll be trained', 'by Bernie.'],
  paragraphs: [
    'Bernie started boxing at 15 in north London. He turned pro in his mid-twenties, while still doing his post round, and won a Southern Area title fight at York Hall in 1995.',
    'Now he runs his own club, right across the road from where he won it. He takes the group classes with his coaching partner, Ben.',
  ],
  link: { label: 'Read Bernie\'s story', href: '#/story' },
};

// GYM page: the coaches. Ben's details are PLACEHOLDERS: his Facebook page is login-walled, so nothing about his
// background has been read. Replace `bio` (and add a `photo` key from `photos`) once Ben supplies/approves his own text.
export const coaches = {
  eyebrow: 'Your coaches',
  heading: ['Meet the', 'coaches.'],
  lede: 'Two coaches, one small club. Bernie and Ben take the group classes together. For one-to-one work, see Ben.',
  people: [
    {
      name: 'Bernie Paul',
      role: 'Founder · Group classes',
      photo: 'founderPostbox',
      bio: 'Former pro and founder of the club. Once known as the Punching Postman. Takes the group classes.',
      link: { label: 'Read Bernie\'s story', href: '#/story' },
    },
    {
      name: 'Ben Doughty',
      role: 'Coach · One-to-one coaching · Group classes',
      photo: 'benPlaceholder',
      bio: 'Ben\'s coaching background goes here. [Placeholder: to be written with Ben.]',
      note: 'Private one-to-one lesson with Ben: £40. Book online through our booking calendar.',
      book: 'Book a private lesson',
    },
  ],
};

// Home: what to expect. Only confirmed facts; the advice lines are deliberately generic.
export const firstClass = {
  eyebrow: 'Your first class',
  heading: ['What to', 'expect.'],
  intro: 'No experience needed. No need to be fit first. Here\'s how it works.',
  steps: [
    { title: 'Pick a class', text: 'Every class is open level, so beginners train alongside people who\'ve boxed for years. Go at your own pace.' },
    { title: 'Book your place', text: 'Book online through our booking calendar. It\'s £10 a class, or £5 if you rent a studio in the building.' },
    { title: 'Come down', text: 'Wear something you can move in. If you\'re not sure about anything, ask before you come.' },
    { title: 'Got a question?', text: 'Message the WhatsApp group and ask. No question is too basic.' },
  ],
};

// GYM page: what the club is like to train in.
export const approach = {
  eyebrow: 'How we train',
  heading: ['Not a fancy gym.', 'A proper one.'],
  lede: 'No mirrors to pose in, nothing shiny. A ring, some bags, old fight posters on the walls, and a coach who has done it.',
  body: 'You learn to box properly: how to stand, how to punch, how to move. It\'s hard work, and you\'ll feel it. But nobody\'s here to show off, and nobody gets left behind.',
  values: [
    { title: 'Everyone starts somewhere', text: 'Classes are open level. First session or fiftieth, you train together and push at your own pace.' },
    { title: 'Old school', text: 'Hard work and discipline. Boxing taught the way it always has been.' },
    { title: 'Small and personal', text: 'This isn\'t a chain. It\'s Bernie\'s club, and he knows who\'s in the room.' },
  ],
};

export const sessions = {
  eyebrow: 'The timetable',
  heading: ['What\'s', 'on.'],
  intro: 'Open-level classes, beginners welcome. See what\'s coming up and book a place.',
  priceNote: '£10 a class. £5 if you rent a studio in the Proposition Studios building: ask in the WhatsApp group for the code.',
  discountHint: 'Studio holder in the Proposition Studios building? Enter your code for the £5 rate.',
  bookingNotice: 'Online booking is not open yet. This preview does not take payment or hold a place.',
};

// STORY page: Bernie's boxing life. The only place it is told in full.
export const story = {
  eyebrow: 'Bernie\'s story',
  heading: ['Told to go and stick', 'to the heavy bag.'],
  paragraphs: [
    'Bernie Paul started boxing at about 15, at Finchley Boxing Club, with his brothers Steve and John. That was home for the best part of three years.',
    'One trainer there had already made up his mind. Steve and John were going to be fighters. Bernie should go and stick to the heavy bag.',
    'It didn\'t put him off. It made him hungrier. His brothers were the more gifted boxers, but Bernie had the power.',
    'The three of them moved on to Tottenham New Enterprise Boxing Club. A long trek from Highgate, and a hard, serious gym when you got there.',
    'The work paid off, and the amateur wins came.',
  ],
  pro: {
    heading: ['The Punching', 'Postman.'],
    paragraphs: [
      'Then a shoulder injury kept him out of the ring for years. He kept training anyway, and turned professional in his mid-twenties.',
      'He kept his job as a postman the whole way through. Royal Mail\'s London Magazine put him on the cover: the Punching Postman, Hornsey\'s Bernie Paul.',
      'On 29 November 1995 he boxed Jason Rowland at York Hall for the Southern Area light-welterweight title, and knocked him out on the bell at the end of the first round.',
      'York Hall is right across the road from the club. Bernie won a title there. Now he teaches boxing opposite it.',
    ],
  },
  quote: null,
};

// GYM page: the room itself.
export const gym = {
  eyebrow: 'The space',
  heading: ['Built by the community.', 'For the community.'],
  // Owner chose this direction (October 2026): not about artists or Proposition Studios.
  paragraphs: [
    'It started as a basement nobody was using. The kit was donated by the community, the posters went up, and the ring went in, with the club\'s name on the canvas.',
    'There\'s a training floor, a sofa, and a table piled with old Boxing News and The Ring. It looks like a boxing gym because it is one.',
  ],
};

// GYM page: the people.
export const club = {
  eyebrow: 'The club',
  heading: ['The people', 'who train here.'],
  text: 'Young and old, first-timers and people who\'ve boxed for years. Everyone trains together, and everyone gets in the photo at the end.',
};

// COMMUNITY page: why the club exists and where it's going.
export const community = {
  eyebrow: 'Community',
  heading: ['Giving something', 'back.'],
  paragraphs: [
    'Before this club, Bernie ran a small training group from a garage during lockdown. Some young people came along, and he saw what regular training, discipline and a bit of belonging did for them.',
    'That\'s why the club is here. It\'s not all about the money. It\'s about giving people somewhere to go, something to work at, and someone in their corner.',
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

// VISIT page: practical details and how to ask.
export const join = {
  eyebrow: 'Ask us anything',
  heading: ['Join the', 'WhatsApp group.'],
  text: 'Not sure if it\'s for you? Ask a question before your first class, hear when classes change, or just say hello.',
  button: 'Join the WhatsApp group',
  note: 'Bookings go through the booking calendar. The WhatsApp group is for questions and news.',
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
  text: 'Open level, beginners welcome. Bernie will see you down there.',
  button: 'See the classes',
};

export const footer = {
  line: 'Bernie Paul\'s community boxing club in Bethnal Green, East London. The kit shop isn\'t open yet.',
  instagram: null, // link to be supplied by the owner
};

// CLASSES page. The classes themselves (names, descriptions, lengths, dates) come live from Cal.com,
// so the owner changes them there and the website follows.
export const classesPage = {
  eyebrow: 'What\'s on',
  heading: ['Classes at', 'the club.'],
  intro: 'Every class is open level, and beginners are welcome. The list below comes straight from our booking calendar, so it\'s always up to date. Pick one and book your place.',
  groupHeading: 'Group classes',
  privateHeading: 'Private sessions',
  empty: 'No classes are listed right now. Check back soon, or ask in the WhatsApp group.',
  error: 'We couldn\'t load the class list just now.',
};
