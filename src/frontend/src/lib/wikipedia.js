/**
 * Utility to resolve authentic Wikipedia biography URLs for startup and corporate founders
 */

export const KNOWN_FOUNDER_WIKIPEDIA = {
  // Canonical Pillars
  'denis sverdlov': 'https://en.wikipedia.org/wiki/Denis_Sverdlov',
  'kenneth lay': 'https://en.wikipedia.org/wiki/Kenneth_Lay',
  'ken lay': 'https://en.wikipedia.org/wiki/Kenneth_Lay',
  'jeffrey skilling': 'https://en.wikipedia.org/wiki/Jeffrey_Skilling',
  'jeff skilling': 'https://en.wikipedia.org/wiki/Jeffrey_Skilling',
  'andrew fastow': 'https://en.wikipedia.org/wiki/Andrew_Fastow',
  'andy fastow': 'https://en.wikipedia.org/wiki/Andrew_Fastow',
  'richard fuld': 'https://en.wikipedia.org/wiki/Richard_S._Fuld_Jr.',
  'dick fuld': 'https://en.wikipedia.org/wiki/Richard_S._Fuld_Jr.',
  'henry lehman': 'https://en.wikipedia.org/wiki/Henry_Lehman',
  'bernard ebbers': 'https://en.wikipedia.org/wiki/Bernard_Ebbers',
  'bernie ebbers': 'https://en.wikipedia.org/wiki/Bernard_Ebbers',
  'scott sullivan': 'https://en.wikipedia.org/wiki/Scott_Sullivan_(businessman)',
  'elizabeth holmes': 'https://en.wikipedia.org/wiki/Elizabeth_Holmes',
  'ramesh balwani': 'https://en.wikipedia.org/wiki/Sunny_Balwani',
  'sunny balwani': 'https://en.wikipedia.org/wiki/Sunny_Balwani',
  'sam bankman-fried': 'https://en.wikipedia.org/wiki/Sam_Bankman-Fried',
  'sbf': 'https://en.wikipedia.org/wiki/Sam_Bankman-Fried',
  'caroline ellison': 'https://en.wikipedia.org/wiki/Caroline_Ellison',
  'gary wang': 'https://en.wikipedia.org/wiki/Gary_Wang',
  'nishad singh': 'https://en.wikipedia.org/wiki/Nishad_Singh',
  'adam neumann': 'https://en.wikipedia.org/wiki/Adam_Neumann',
  'miguel mckelvey': 'https://en.wikipedia.org/wiki/Miguel_McKelvey',
  'markus braun': 'https://en.wikipedia.org/wiki/Markus_Braun',
  'jan marsalek': 'https://en.wikipedia.org/wiki/Jan_Marsalek',
  'george fisher': 'https://en.wikipedia.org/wiki/George_M._C._Fisher',
  'george eastman': 'https://en.wikipedia.org/wiki/George_Eastman',
  'stephen elop': 'https://en.wikipedia.org/wiki/Stephen_Elop',
  'jorma ollila': 'https://en.wikipedia.org/wiki/Jorma_Ollila',
  'mike lazaridis': 'https://en.wikipedia.org/wiki/Mike_Lazaridis',
  'jim balsillie': 'https://en.wikipedia.org/wiki/Jim_Balsillie',
  'byju raveendran': 'https://en.wikipedia.org/wiki/Byju_Raveendran',
  'divya gokulnath': 'https://en.wikipedia.org/wiki/Divya_Gokulnath',

  // Other well-known tech founders
  'sahil lavingia': 'https://en.wikipedia.org/wiki/Sahil_Lavingia',
  'shai agassi': 'https://en.wikipedia.org/wiki/Shai_Agassi',
  'ben kaufman': 'https://en.wikipedia.org/wiki/Quirky',
  'nikki durkin': 'https://en.wikipedia.org/wiki/99dresses',
  'tony fadell': 'https://en.wikipedia.org/wiki/Tony_Fadell',
  'jeffrey katzenberg': 'https://en.wikipedia.org/wiki/Jeffrey_Katzenberg',
  'meg whitman': 'https://en.wikipedia.org/wiki/Meg_Whitman',
  'doug evans': 'https://en.wikipedia.org/wiki/Juicero',
  'domm holland': 'https://en.wikipedia.org/wiki/Fast_(company)',
  'henrik fisker': 'https://en.wikipedia.org/wiki/Henrik_Fisker',
  'trevor milton': 'https://en.wikipedia.org/wiki/Trevor_Milton',
  'travis kalanick': 'https://en.wikipedia.org/wiki/Travis_Kalanick',
  'marc lore': 'https://en.wikipedia.org/wiki/Marc_Lore',
  'tri tran': 'https://en.wikipedia.org/wiki/Munchery',
  'hosain rahman': 'https://en.wikipedia.org/wiki/Jawbone_(company)',
  'eric migicovsky': 'https://en.wikipedia.org/wiki/Pebble_(watch)',
  'justin kan': 'https://en.wikipedia.org/wiki/Justin_Kan',
  'kevin rose': 'https://en.wikipedia.org/wiki/Kevin_Rose',
  'alexis ohanian': 'https://en.wikipedia.org/wiki/Alexis_Ohanian',
  'danielle morrill': 'https://en.wikipedia.org/wiki/Danielle_Morrill'
};

/**
 * Returns the Wikipedia biography URL for a founder.
 * Falls back to Wikipedia's formatted search/slug URL.
 */
export function getFounderWikipediaUrl(founderName) {
  if (!founderName || typeof founderName !== 'string') return null;
  const clean = founderName.trim();
  if (clean === 'Founding Team' || clean === 'Executive Leadership') return null;

  const lower = clean.toLowerCase();
  if (KNOWN_FOUNDER_WIKIPEDIA[lower]) {
    return KNOWN_FOUNDER_WIKIPEDIA[lower];
  }

  // Format as Wikipedia title (First_Last)
  const formatted = clean.replace(/\s+/g, '_');
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(formatted)}`;
}

export default getFounderWikipediaUrl;
