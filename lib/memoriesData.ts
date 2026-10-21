/**
 * ---------------------------------------------------------------------------
 *  Birthday App Configuration
 * ---------------------------------------------------------------------------
 *  Everything personal lives here. Swap names, text, and photo URLs to make
 *  the experience your own. Photos can be any URL or a local file placed in
 *  /public (for example "/photos/beach.jpg").
 * ---------------------------------------------------------------------------
 */

const photo = (seed: string, w = 400, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

export const config = {
  recipientName: 'Aria',
  senderName: 'Your favorite human',
  birthdayLabel: 'October 20',
  /** Optional: path to an mp3 in /public (e.g. "/music/our-song.mp3"). Leave empty to use the built-in music box. */
  musicUrl: '',
}

export const welcome = {
  eyebrow: 'Hey you, birthday star',
  lines: [
    `Today the whole universe is celebrating you, ${config.recipientName}.`,
    'I made this little world just for you — every page is a piece of us.',
    'Take your time, swipe slowly, and smile a lot.',
  ],
}

export type TimelineEvent = {
  date: string
  title: string
  text: string
  detail: string
  image: string
}

export const timeline: TimelineEvent[] = [
  {
    date: 'Spring 2019',
    title: 'The day we met',
    text: 'A random hello that turned into hours of talking.',
    detail: 'I still remember exactly what you were wearing and how you laughed at my terrible joke.',
    image: photo('met-1', 600, 450),
  },
  {
    date: 'Summer 2019',
    title: 'Our first adventure',
    text: 'Lost on purpose, found something better.',
    detail: 'No map, no plan, just a playlist and a full tank. Best decision ever.',
    image: photo('trip-2', 600, 450),
  },
  {
    date: 'Winter 2021',
    title: 'The hard days',
    text: 'You showed up when it mattered most.',
    detail: 'You never asked what I needed — you just knew. I will never forget that.',
    image: photo('winter-3', 600, 450),
  },
  {
    date: 'Today',
    title: 'Still my favorite person',
    text: 'And the story keeps getting better.',
    detail: 'Here is to every chapter we have not written yet.',
    image: photo('today-4', 600, 450),
  },
]

export type MemoryLayout =
  | 'polaroid'
  | 'tilt'
  | 'neon'
  | 'taped'
  | 'collage'
  | 'filmstrip'
  | 'arch'
  | 'magazine'
  | 'stack'

export type Memory = {
  id: string
  layout: MemoryLayout
  title: string
  caption: string
  date: string
  note: string
  image: string
  /** Extra photos for collage / filmstrip / stack layouts */
  images?: string[]
}

export const memories: Memory[] = [
  {
    id: 'm1',
    layout: 'polaroid',
    title: 'Golden hour',
    caption: 'That sunset we chased',
    date: 'Jun 12, 2019',
    note: 'The sky was orange and so were our ice creams.',
    image: photo('memory-1'),
  },
  {
    id: 'm2',
    layout: 'tilt',
    title: 'City lights',
    caption: 'Midnight walks',
    date: 'Aug 03, 2019',
    note: 'We walked until our feet hurt and talked until sunrise.',
    image: photo('memory-2'),
  },
  {
    id: 'm3',
    layout: 'neon',
    title: 'Party mode',
    caption: 'Dancing like nobody watched',
    date: 'Dec 31, 2019',
    note: 'Everybody watched. We did not care.',
    image: photo('memory-3'),
  },
  {
    id: 'm4',
    layout: 'taped',
    title: 'Scrapbook day',
    caption: 'Our coffee shop corner',
    date: 'Mar 18, 2020',
    note: 'Two lattes, one croissant, a thousand stories.',
    image: photo('memory-4'),
  },
  {
    id: 'm5',
    layout: 'collage',
    title: 'Weekend chaos',
    caption: 'The road trip collage',
    date: 'Jul 09, 2020',
    note: 'Wrong turns, right people.',
    image: photo('memory-5a'),
    images: [photo('memory-5a'), photo('memory-5b'), photo('memory-5c'), photo('memory-5d')],
  },
  {
    id: 'm6',
    layout: 'filmstrip',
    title: 'Photo booth',
    caption: 'Four frames of pure silly',
    date: 'Feb 14, 2021',
    note: 'We ran out of poses by frame two.',
    image: photo('memory-6a'),
    images: [photo('memory-6a', 400, 300), photo('memory-6b', 400, 300), photo('memory-6c', 400, 300)],
  },
  {
    id: 'm7',
    layout: 'arch',
    title: 'Dreamy',
    caption: 'Under the stars',
    date: 'Sep 22, 2022',
    note: 'You made a wish on a satellite. I did not correct you.',
    image: photo('memory-7'),
  },
  {
    id: 'm8',
    layout: 'magazine',
    title: 'Cover Star',
    caption: 'Person of the year, every year',
    date: 'May 05, 2023',
    note: 'Exclusive interview: how to be this amazing.',
    image: photo('memory-8'),
  },
  {
    id: 'm9',
    layout: 'stack',
    title: 'More to come',
    caption: 'Tap to shuffle the pile',
    date: 'Jan 01, 2024',
    note: 'A pile of moments, and room for so many more.',
    image: photo('memory-9a'),
    images: [photo('memory-9a'), photo('memory-9b'), photo('memory-9c')],
  },
]

export const reasons: string[] = [
  'Your laugh could fix any bad day.',
  'You remember the tiny things nobody else does.',
  'You are brave even when you are scared.',
  'You make strangers feel like old friends.',
  'Your hugs are basically medicine.',
  'You turn ordinary days into stories.',
  'You never give up on the people you love.',
  'Your taste in music is (mostly) excellent.',
  'You make me want to be a better person.',
  'You are simply, wonderfully you.',
]

export type CrazyMoment = {
  id: string
  title: string
  text: string
  image: string
}

export const crazyMoments: CrazyMoment[] = [
  { id: 'c1', title: 'The karaoke incident', text: 'We were off-key. We were legendary.', image: photo('crazy-1') },
  { id: 'c2', title: 'Burnt pancake brunch', text: 'Smoke alarm became our DJ.', image: photo('crazy-2') },
  { id: 'c3', title: 'Rain dance', text: 'Forgot umbrellas, found joy.', image: photo('crazy-3') },
  { id: 'c4', title: '3AM drive-thru', text: 'Fries taste better after midnight.', image: photo('crazy-4') },
  { id: 'c5', title: 'The lost-key saga', text: 'It was in your pocket. The whole time.', image: photo('crazy-5') },
  { id: 'c6', title: 'Beach sunrise', text: 'Worth every yawn.', image: photo('crazy-6') },
]

export const cake = {
  candles: 5,
  wishTitle: 'Your wish is on its way',
  wishMessage: `May this year bring you endless laughter, wild adventures, quiet peace, and every dream you have been too shy to say out loud. Happy birthday, ${config.recipientName}.`,
}

export const letter = {
  greeting: `My dearest ${config.recipientName},`,
  paragraphs: [
    'Happy birthday. I have tried to write this a dozen times, and every version felt too small for what I actually want to say.',
    'You came into my life quietly and then changed everything — the way I laugh, the way I see the world, the way ordinary Tuesdays feel like something worth remembering.',
    'Thank you for the late-night talks, the inside jokes nobody else understands, the patience on my worst days, and the way you celebrate my best ones like they are your own.',
    'This year, I hope you are gentle with yourself. I hope you chase the things that make your heart race. I hope you know, deeply, how loved you are.',
    'No matter where the year takes us, I will be right here — cheering the loudest, hugging the tightest, and grateful every single day that you exist.',
  ],
  signoff: 'Forever yours,',
  signature: config.senderName,
}

export const bucketList: string[] = [
  'Watch a sunrise from a mountain top',
  'Take a spontaneous weekend trip',
  'Learn to cook one fancy dish together',
  'Have a full movie marathon night',
  'Go stargazing far from city lights',
  'Write letters to open in 5 years',
  'Try a dance class (and survive it)',
  'Make a scrapbook of this year',
]

export const finale = {
  heading: 'One last thing...',
  subheading: 'Press the button and hold on tight.',
  popupTitle: 'Surprise!',
  popupMessage: `This hug is for every birthday I could not be there for, and every one I will be. I love you endlessly, ${config.recipientName}. Happy birthday!`,
}
