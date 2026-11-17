import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, Clock3, Instagram, Mail, MapPin, MessageCircle, Plus } from 'lucide-react';
import './pages.css';

export type PageName = 'about' | 'journal' | 'article-care' | 'article-styling' | 'article-gifting' | 'contact' | 'visit' | 'care' | 'faq';

type ArticlePage = 'article-care' | 'article-styling' | 'article-gifting';
type PublicLinks = {
  whatsapp: string;
  email: string;
  instagram: string;
  maps: string;
  address: string;
  hours: string;
  website: string;
};
type ArticleCopy = {
  label: string;
  firstLine: string;
  accentLine: string;
  intro: string;
  summary: string;
  image: string;
  imageAlt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const OFFICIAL_INSTAGRAM = 'https://www.instagram.com/zenvjewels/';
const OFFICIAL_MAPS = 'https://maps.app.goo.gl/E2awtcwWRAqQf9cQ6?g_st=ic';
const articleOrder: ArticlePage[] = ['article-care', 'article-styling', 'article-gifting'];
const pageLabels: Record<PageName, string> = {
  about: 'About ZenV', journal: 'Journal', 'article-care': 'Jewellery care',
  'article-styling': 'Everyday styling', 'article-gifting': 'Thoughtful gifting',
  contact: 'Contact', visit: 'Visit us', care: 'Care guide', faq: 'Frequently asked questions',
};

const articles: Record<ArticlePage, ArticleCopy> = {
  'article-care': {
    label: 'Care & keeping',
    firstLine: 'A little care,',
    accentLine: 'a longer love.',
    intro: 'The pieces we reach for most deserve a small ritual of their own. Thoughtful wearing, gentle cleaning and a quiet place to rest can help you look after fashion jewellery without turning it into a complicated project.',
    summary: 'Simple habits for wearing, cleaning, storing and travelling with the pieces you love.',
    image: 'hero.jpg',
    imageAlt: 'Twisted gold-coloured hoop earrings resting on pale stones in sunlight',
    sections: [
      {
        heading: 'Last on. First off.',
        paragraphs: [
          'Make jewellery the finishing touch, rather than the starting point. Apply perfume, lotion, sunscreen and hair products first, then allow them to dry before putting a piece on. Spraying fragrance directly onto a chain or earring can leave residue where you least want it: around fastenings, textured surfaces and delicate finishes.',
          'Take pieces off before showering, swimming, washing dishes or strenuous exercise. Water, sweat and cleaning products can affect many fashion-jewellery finishes. A photograph cannot tell you whether an item is water-resistant, so treat that claim as something to check with ZenV for the particular piece, not something to assume.',
        ],
      },
      {
        heading: 'Let a soft cloth do the work.',
        paragraphs: [
          'After wearing, a gentle wipe with a clean, dry, soft lint-free cloth is a sensible starting point for many pieces. Use light pressure and take your time around settings and links. The aim is to lift everyday residue, not to polish away a surface coating. If something catches, stop rather than pulling the cloth through it.',
          'Skip toothpaste, lemon, baking soda, abrasive brushes and household metal polish. Avoid soaking, jewellery dips and ultrasonic cleaning unless the maker has specifically approved them for that item. Advice that works for an uncoated metal may be unsuitable for plating, glued details, pearls or treated stones. Ask for material-specific instructions before trying a wet cleaning method.',
        ],
      },
      {
        heading: 'Give every piece a little space.',
        paragraphs: [
          'A jewellery box works best when pieces are not competing for room. Lay necklaces individually, with their clasps fastened and chains arranged loosely. Keep earrings together but separated from hard-edged rings or bracelets. A soft pouch or a smooth-lined compartment can help reduce rubbing; it need not be an elaborate display.',
          'Choose a dry place away from bathroom humidity and direct sunlight. Do not seal a damp piece into a pouch. Check that cloth linings are clean, and keep heavier pieces from pressing against delicate links. If a chain tangles, set it down on a flat surface and work slowly; pulling both ends usually tightens the problem.',
        ],
      },
      {
        heading: 'Pack for the journey, not the photograph.',
        paragraphs: [
          'For travel, edit your selection before you pack. One comfortable everyday pair of earrings and a piece that changes the mood may be more useful than a whole drawer. Place each item in its own soft compartment, then use a structured case to protect it from pressure in a bag.',
          'Avoid dropping loose pieces into a handbag pocket, wrapping chains tightly around other jewellery or sticking tape directly onto a finish. Keep necklace ends separate and leave space around clasps. When you arrive, unpack into a dry, stable place rather than leaving your favourites mixed with toiletries or damp clothing.',
        ],
      },
      {
        heading: 'Notice the small changes.',
        paragraphs: [
          'A quick look before wearing can catch a loose fastening, an opening link or a setting that has begun to snag fabric. Do not force a clasp that no longer moves freely, and do not keep wearing a piece that catches or feels uncomfortable. Set it aside and ask ZenV what can be checked or repaired; repair availability is not assumed here.',
          'If an item irritates your skin, remove it and seek appropriate advice if irritation continues. Words such as “gold-coloured” describe appearance, not metal content. Ask about the base metal, plating and any known sensitivities before choosing a piece. No photograph or general guide can establish that jewellery is hypoallergenic or suitable for everyone.',
        ],
      },
      {
        heading: 'Know the piece in front of you.',
        paragraphs: [
          'The most useful care questions are specific: What is the base metal? Is there a plated or lacquered finish? Are stones set or glued? Is a special cloth recommended? Keep any instructions supplied for that exact item and resist transferring them automatically to the next piece you buy.',
          'This is general care guidance, not a warranty or a promise about the sample catalogue. Confirm materials and care with ZenV, along with current stock, final price and shipping, before making a purchase decision. A little clarity at the beginning makes the everyday ritual simpler: wear with attention, wipe gently, and put each piece away with room to breathe.',
        ],
      },
    ],
  },
  'article-styling': {
    label: 'Worn your way',
    firstLine: 'Everyday clothes.',
    accentLine: 'A personal signature.',
    intro: 'A good jewellery look does not require a new wardrobe or a set of strict rules. Start with something you already enjoy wearing, notice its lines, and let one small detail change the feeling of the whole outfit.',
    summary: 'A practical way to choose a focal point, layer lightly and make familiar outfits feel like you.',
    image: 'jewelry-1.jpg',
    imageAlt: 'Two delicate necklaces layered above the neckline of an ivory shirt',
    sections: [
      {
        heading: 'Begin with the neckline.',
        paragraphs: [
          'Before opening your jewellery box, look at the space your clothes create. An open shirt or a simple scoop neckline leaves room for a necklace to sit against the skin. A high neckline can make earrings or a bracelet the more natural starting point. Neither choice is a rule; it is simply a way to notice where a detail will be visible.',
          'Try the piece with the actual outfit rather than imagining it in isolation. A pendant may sit neatly above one neckline and disappear into another. Check the chain length, any extender and the pendant dimensions with ZenV. The sample photographs offer a mood, but they cannot tell you exactly where a piece will fall on your body.',
        ],
      },
      {
        heading: 'Choose one centre of attention.',
        paragraphs: [
          'If you love a sculptural pair of earrings, let them lead. You might keep the neckline clear and add only a quiet ring or bracelet. If a necklace is the detail that makes you smile, give it enough visual space to be noticed. An outfit can feel considered without every part of it making the same level of statement.',
          'This is especially useful when clothing already has print, embroidery or texture. Hold the jewellery beside the fabric and see what happens. Sometimes the contrast is lovely; sometimes removing one piece makes the whole look calmer. Choosing a focal point is not about wearing less for its own sake. It is about making the part you love easier to see.',
        ],
      },
      {
        heading: 'Layer with a little breathing room.',
        paragraphs: [
          'Start a necklace layer with two lengths that are visibly different. Let a finer chain sit near the neckline and a second piece fall below it, then move around before adding anything else. A small change in length can matter more than adding a third chain. Ask for actual measurements rather than relying on labels such as short or long.',
          'Notice weight and texture as well as length. Similar chains may twist together, while a heavy pendant can pull a delicate layer out of place. Check that each clasp is secure and that the combination feels comfortable. If you find yourself straightening the pieces constantly, simplify. A layer should accompany your day, not turn into a task you carry through it.',
        ],
      },
      {
        heading: 'Mix finishes on purpose.',
        paragraphs: [
          'Warm and cool metal colours can share an outfit. One easy approach is to repeat a finish in two places: perhaps an earring and a ring, with a contrasting necklace between them. Repetition gives the mix a sense of intention without requiring a perfectly matched set. You can also let a single contrasting piece be the point of interest.',
          'Think about surface as much as colour. A brushed-looking texture, a smooth curve and a tiny reflective detail all catch light differently. Look in ordinary daylight, not only under bright dressing-room lights. Descriptions of colour and shine are styling language, not proof of solid precious metal; confirm the actual material and finish separately before choosing.',
        ],
      },
      {
        heading: 'Include your wrists and your hair.',
        paragraphs: [
          'A bracelet or kada can change a familiar rolled-sleeve shirt without adding anything at the neckline. Try it while typing, reaching into a bag and fastening a cuff. A pleasing stack in a still photograph may be noisy or awkward in daily use. Check the inner dimensions, opening mechanism and fit rather than assuming one size works for every wrist.',
          'Hair accessories can be the finishing detail when you would rather leave your neck clear. Consider your hair texture and the way you usually wear it, then ask how a particular fastening works. Avoid combinations that catch on earrings or pull at the hair. The useful question is not whether a look is fashionable enough, but whether you can move comfortably in it.',
        ],
      },
      {
        heading: 'Try the look in an ordinary moment.',
        paragraphs: [
          'Before heading out, sit down, turn your head and put on the layer you will actually wear over your outfit. Check whether earrings meet a collar, a necklace catches on a knit, or a ring feels awkward around a handle. Weight, scale and fastening details deserve as much attention as the image that first caught your eye.',
          'Keep a mental note of the combinations you reach for naturally. You may find that one pair works beautifully with several outfits, while a bigger statement feels right only sometimes. Both have a place. Browse the sample gallery for ideas, then ask ZenV to confirm dimensions, materials, stock and final price. Your signature grows from what feels like you, not from following someone else’s formula.',
        ],
      },
    ],
  },
  'article-gifting': {
    label: 'Little gestures',
    firstLine: 'A thoughtful gift,',
    accentLine: 'not a guessing game.',
    intro: 'Jewellery can be a wonderfully personal gesture. The thoughtfulness is not in guessing the most dramatic piece; it is in noticing the person, checking the practical details, and leaving enough room for their own taste.',
    summary: 'A considered guide to personal taste, comfortable fit, budgets and the questions worth asking first.',
    image: 'jewelry-8.jpg',
    imageAlt: 'A gold-coloured chain bracelet lying across the pages of an open magazine',
    sections: [
      {
        heading: 'Notice what already feels like them.',
        paragraphs: [
          'Look for the small habits that repeat: the earrings they wear to work, the necklace they keep on a hook, or whether they usually choose warm or cool metal colours. Notice scale too. Someone who enjoys a small everyday detail may appreciate a different gift from someone who loves a bold shape. These observations are more useful than choosing whatever looks most impressive in a photograph.',
          'Make room for the possibility that their taste changes with the occasion. A quiet everyday piece and a celebration piece serve different purposes. If you are unsure, ask a light, direct question about what they enjoy wearing. A little conversation need not spoil a gift; it can show that you are paying attention to the person rather than only the surprise.',
        ],
      },
      {
        heading: 'Set the whole budget first.',
        paragraphs: [
          'Choose a comfortable spending limit before making a shortlist. Think about the complete amount, including any shipping or packaging charges that may apply. A thoughtful gift does not need to sit at the top of your budget. A piece chosen with care, and a note explaining why it reminded you of someone, can feel more personal than a larger but less considered purchase.',
          'Prices in this sample catalogue are illustrative, not an agreed offer. Ask ZenV for the current final price and what it includes. If you enquire about several possibilities, share your preferred budget and ask for suitable available options. Do not assume a displayed selection is reserved, or that a WhatsApp message has completed an order or payment.',
        ],
      },
      {
        heading: 'Treat fit as part of the gift.',
        paragraphs: [
          'Rings and closed kadas require particularly careful sizing. Ask for measurements and the correct way to compare them with something the recipient already wears. Adjustable does not mean unlimited, and an opening mechanism does not guarantee a comfortable fit. Never bend a piece beyond its intended adjustment just to make a guessed size work.',
          'For necklaces, check the chain and extender lengths. For earrings, consider whether the person has pierced ears, their preferred fastening and the weight they find comfortable. Ask about materials and any relevant sensitivities without assuming a piece is hypoallergenic. If you cannot establish a suitable fit or material, choose another option or invite the recipient into the decision.',
        ],
      },
      {
        heading: 'Ask the wonderfully practical questions.',
        paragraphs: [
          'Before committing, confirm the exact item, current availability, material, finish, dimensions and final price. Ask whether the photography represents that live piece or is only editorial inspiration. A clear reference or screenshot description can help a conversation, but the sample image itself is not a promise about the catalogue ZenV currently has available.',
          'Discuss delivery area, shipping cost, payment method and any returns or exchanges policy directly with ZenV. Gift wrapping, gift receipts, repairs and warranties should also be checked rather than assumed. No approved returns window or gifting service is promised on this site. These questions may seem less romantic than the choice itself, but they help prevent the recipient from inheriting an awkward problem.',
        ],
      },
      {
        heading: 'Plan the handover with a little margin.',
        paragraphs: [
          'If the gift is for a particular day, mention the date when you enquire and ask whether delivery or collection is realistically possible. Do not treat a sample product page or an unconfirmed shipping estimate as a guarantee. Leave yourself room to make another plan if the piece, route or timing is not available.',
          'Ask how the jewellery will be packed and whether presentation options are offered. If you wrap it yourself, protect the piece in a soft, separate compartment rather than letting it rattle against other items. Include any care information supplied for that exact jewellery. A short personal note can explain the thought behind the choice without needing an elaborate box or a grand claim.',
        ],
      },
      {
        heading: 'Leave room for their own choice.',
        paragraphs: [
          'Sometimes the loveliest gift is choosing together. Share two or three ideas, offer a budget, or arrange a browse once ZenV has confirmed current showroom details. This can be especially useful when sizing, fastening preferences or materials matter. Do not assume that gift cards or credit are available; ask about the options ZenV actually offers.',
          'Whether the final piece is a surprise or a shared decision, let it belong to the recipient’s life. They may style it differently from the way you imagined, and that is part of the pleasure. Use the gallery as a starting point for a conversation, confirm the practical details with ZenV, and let your note carry the reason you chose it: you noticed something they might love.',
        ],
      },
    ],
  },
};

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function safeHttps(value: unknown): string {
  const text = cleanText(value);
  if (!text) return '';
  try {
    const url = new URL(text);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

function instagramLink(value: unknown): string {
  const text = cleanText(value);
  const handle = text.replace(/^@/, '');
  if (/^[a-z0-9._]{1,30}$/i.test(handle)) return `https://www.instagram.com/${handle}/`;
  const url = safeHttps(text);
  if (!url) return OFFICIAL_INSTAGRAM;
  const host = new URL(url).hostname;
  return host === 'instagram.com' || host === 'www.instagram.com' ? url : OFFICIAL_INSTAGRAM;
}

function mapsLink(value: unknown): string {
  const url = safeHttps(value);
  if (!url) return OFFICIAL_MAPS;
  const parsed = new URL(url);
  const isMaps = parsed.hostname === 'maps.app.goo.gl' || parsed.hostname === 'maps.google.com'
    || ((parsed.hostname === 'google.com' || parsed.hostname === 'www.google.com') && parsed.pathname.startsWith('/maps'));
  return isMaps ? url : OFFICIAL_MAPS;
}

function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function readingTime(article: ArticleCopy): number {
  const words = [article.intro, ...article.sections.flatMap(section => [section.heading, ...section.paragraphs])].join(' ').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ExternalLink({ href, children, className = 'static-info-textlink' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">
    {children}<ArrowUpRight size={18} aria-hidden="true" />
    <span className="static-info-sr"> (opens in a new tab)</span>
  </a>;
}

function InternalLink({ base, to, children, button = false }: { base: string; to: string; children: ReactNode; button?: boolean }) {
  return <a className={button ? 'static-info-button' : 'static-info-textlink'} href={base + to}>
    {children}<ArrowRight size={18} aria-hidden="true" />
  </a>;
}

function PageHeading({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro: ReactNode }) {
  return <header className="static-info-heading">
    <p className="static-info-eyebrow">{eyebrow}</p>
    <h1 className="static-info-title">{title}</h1>
    <p className="static-info-lede">{intro}</p>
  </header>;
}

function EditorialPhoto({ base, image, alt, caption, eager = false }: { base: string; image: string; alt: string; caption?: string; eager?: boolean }) {
  return <figure className="static-info-photo">
    <img src={base + 'images/' + image} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" width={900} height={1350} />
    <figcaption>{caption || 'Editorial sample photography · Not a confirmed catalogue item.'}</figcaption>
  </figure>;
}

function EnquiryNote({ base }: { base: string }) {
  return <aside className="static-info-enquiry-note" aria-label="About this storefront">
    <div>
      <p className="static-info-eyebrow">A little clarity</p>
      <h2>A conversation.<br /><em>Not a checkout.</em></h2>
    </div>
    <div className="static-info-prose">
      <p>This is an illustrative catalogue with sample product information and editorial photography. Selections are a starting point for a WhatsApp enquiry, not a completed order, reservation or payment.</p>
      <p>ZenV confirms the live piece, final price, stock, materials, shipping and payment arrangements directly before you decide.</p>
      <InternalLink base={base} to="contact.html">Ask ZenV a question</InternalLink>
    </div>
  </aside>;
}

function AboutPage({ base }: { base: string }) {
  return <>
    <section className="static-info-spread static-info-about-spread" aria-label="About ZenV">
      <div className="static-info-spread-copy">
        <PageHeading eyebrow="The ZenV point of view" title={<>Small details.<br /><em>Your signature.</em></>} intro="Jewellery can be the smallest part of an outfit, and the part that makes it feel most like you. A familiar shirt. A favourite pair of earrings. A little shift in the everyday." />
        <p className="static-info-body-copy">ZenV is a Bengaluru fashion jewellery and accessories brand. Its public Instagram profile shares curated statement pieces, including necklaces, kadas, earrings and hair accessories.</p>
        <InternalLink base={base} to="gallery.html" button>Explore the jewellery edit</InternalLink>
      </div>
      <EditorialPhoto base={base} image="jewelry-1.jpg" alt="Layered necklaces worn with a relaxed ivory shirt" eager />
    </section>
    <section className="static-info-section" aria-labelledby="static-about-point">
      <div className="static-info-section-heading">
        <p className="static-info-eyebrow">Less rulebook. More instinct.</p>
        <h2 id="static-about-point">Adornment, on <em>your terms.</em></h2>
      </div>
      <div className="static-info-principles">
        <div><span className="static-info-index">01 / A feeling</span><h3>Start with what you love.</h3><p>A simple curve, an unexpected texture, a little light near the face. Let the detail you notice lead the way; the rest does not have to match perfectly.</p><InternalLink base={base} to="article-styling.html">Find your everyday signature</InternalLink></div>
        <div><span className="static-info-index">02 / A ritual</span><h3>Make room for everyday.</h3><p>A favourite piece should not need a grand occasion. Give it a place in your day, and a gentle routine when the day is done.</p><InternalLink base={base} to="care.html">A little care guide</InternalLink></div>
        <div><span className="static-info-index">03 / A conversation</span><h3>Ask for the details.</h3><p>The right choice is about comfort and clarity as much as appearance. Ask about materials, dimensions and availability before making it yours.</p><InternalLink base={base} to="faq.html">The useful questions</InternalLink></div>
      </div>
    </section>
    <div className="static-info-pullquote"><p>A little sparkle.<br /><em>A lot of you.</em></p><span className="static-info-eyebrow">The everyday, a little elevated</span></div>
    <EnquiryNote base={base} />
    <nav className="static-info-endlinks" aria-label="Explore the ZenV world"><InternalLink base={base} to="journal.html">Read the journal</InternalLink><InternalLink base={base} to="visit.html">Plan a showroom visit</InternalLink></nav>
  </>;
}

function ArticlePreview({ page, base, variant }: { page: ArticlePage; base: string; variant: 'featured' | 'row' | 'related' }) {
  const article = articles[page];
  const Heading = variant === 'related' ? 'h3' : 'h2';
  return <article className={`static-info-journal-entry static-info-journal-${variant}`}>
    {variant !== 'related' && <a className="static-info-journal-image" href={base + page + '.html'} aria-label={`Read ${article.firstLine} ${article.accentLine}`}>
      <img src={base + 'images/' + article.image} alt={article.imageAlt} loading={variant === 'featured' ? 'eager' : 'lazy'} decoding="async" width={900} height={1350} />
    </a>}
    <div className="static-info-journal-copy">
      <p className="static-info-eyebrow">{article.label} <span aria-hidden="true">/</span> {readingTime(article)} min read</p>
      <Heading><a href={base + page + '.html'}>{article.firstLine}<br /><em>{article.accentLine}</em></a></Heading>
      <p>{article.summary}</p>
      <InternalLink base={base} to={page + '.html'}>Read the story</InternalLink>
    </div>
  </article>;
}

function JournalPage({ base }: { base: string }) {
  return <>
    <PageHeading eyebrow="The ZenV journal" title={<>A few lovely<br /><em>things to know.</em></>} intro="Notes on the pieces we wear, the way we put them together, and the small gestures that make them personal. Three original guides to return to, at your own pace." />
    <section className="static-info-journal-list" aria-label="Jewellery articles">
      {articleOrder.map((page, index) => <ArticlePreview key={page} page={page} base={base} variant={index === 0 ? 'featured' : 'row'} />)}
    </section>
    <p className="static-info-caption">Journal images are editorial samples, not photographs of confirmed ZenV stock. The guides offer general advice; check the details of any live piece with ZenV.</p>
    <nav className="static-info-endlinks" aria-label="Continue exploring"><InternalLink base={base} to="gallery.html">Browse the sample gallery</InternalLink><InternalLink base={base} to="contact.html">Ask about a piece</InternalLink></nav>
  </>;
}

function ArticlePageView({ page, base }: { page: ArticlePage; base: string }) {
  const article = articles[page];
  const companion = page === 'article-care' ? { to: 'care.html', label: 'Keep the quick care guide close' }
    : { to: 'gallery.html', label: 'Explore the sample jewellery edit' };
  return <>
    <article className="static-info-article">
      <PageHeading eyebrow={`${article.label} / About ${readingTime(article)} minutes`} title={<>{article.firstLine}<br /><em>{article.accentLine}</em></>} intro={article.intro} />
      <EditorialPhoto base={base} image={article.image} alt={article.imageAlt} eager />
      <div className="static-info-article-layout">
        <nav className="static-info-contents" aria-label="In this article">
          <p className="static-info-eyebrow">In this story</p>
          <ol>{article.sections.map((section, index) => <li key={section.heading}><a href={base + page + '.html#section-' + (index + 1)}>{section.heading}</a></li>)}</ol>
          <p className="static-info-caption">Practical inspiration, not material-specific care or an approved sales policy.</p>
        </nav>
        <div className="static-info-article-prose">
          {article.sections.map((section, index) => <section key={section.heading} id={'section-' + (index + 1)} aria-labelledby={'static-article-heading-' + (index + 1)}>
            <p className="static-info-eyebrow">0{index + 1}</p>
            <h2 id={'static-article-heading-' + (index + 1)}>{section.heading}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>)}
          <div className="static-info-article-footnote"><p>Make the guide your own, then check the details with ZenV. Sample photography and catalogue information are illustrative; final price, stock, materials and shipping are confirmed directly.</p><InternalLink base={base} to={companion.to}>{companion.label}</InternalLink><InternalLink base={base} to="contact.html">Talk to ZenV</InternalLink></div>
        </div>
      </div>
    </article>
    <section className="static-info-related" aria-labelledby="static-related-title">
      <div className="static-info-section-heading"><p className="static-info-eyebrow">One lovely thing leads to another</p><h2 id="static-related-title">A little more <em>reading.</em></h2></div>
      <div className="static-info-related-list">{articleOrder.filter(name => name !== page).map(name => <ArticlePreview key={name} page={name} base={base} variant="related" />)}</div>
    </section>
    <nav className="static-info-endlinks" aria-label="Journal navigation"><InternalLink base={base} to="journal.html">All journal stories</InternalLink><InternalLink base={base} to="faq.html">Enquiries, explained</InternalLink></nav>
  </>;
}

function ContactPage({ base, links }: { base: string; links: PublicLinks }) {
  const id = useId();
  const messageField = useRef<HTMLTextAreaElement>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState(false);
  const draft = `Hello ZenV,${name.trim() ? ` my name is ${name.trim()}.` : ''}\n\n${message.trim()}\n\nThis is an enquiry, not a confirmed order or payment.`;
  const draftHref = prepared && links.whatsapp && message.trim() ? whatsappLink(links.whatsapp, draft) : '';

  function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrepared(false);
    if (!links.whatsapp) { setError('WhatsApp contact is awaiting configuration. Please use ZenV’s official Instagram link below.'); return; }
    if (!message.trim()) { setError('Please add a message so ZenV knows how to help.'); messageField.current?.focus(); return; }
    if (message.length > 1200) { setError('Please keep your message to 1,200 characters or fewer.'); messageField.current?.focus(); return; }
    if (name.length > 100) { setError('Please keep the optional name to 100 characters or fewer.'); return; }
    setError('');
    setPrepared(true);
  }

  function clearDraft() {
    setName(''); setMessage(''); setError(''); setPrepared(false);
  }

  return <>
    <PageHeading eyebrow="A real conversation" title={<>A little question?<br /><em>Say hello.</em></>} intro="Ask about a piece, its fit, a gift, or a visit. Bring the questions that matter to you; ZenV can confirm the live details before you decide." />
    <div className="static-info-contact-layout">
      <section className="static-info-contact-form" aria-labelledby={id + '-form-title'}>
        <p className="static-info-eyebrow">Start with a note</p>
        <h2 id={id + '-form-title'}>Let’s make it <em>personal.</em></h2>
        <p>Include a catalogue name or reference if you have one in mind. This form prepares a draft for WhatsApp; it does not send a message or place an order.</p>
        {!links.whatsapp && <div className="static-info-config-note" role="status" id={id + '-config'}><p>WhatsApp contact is awaiting configuration. The form cannot prepare an enquiry yet. Please contact ZenV through its official Instagram.</p><ExternalLink href={links.instagram}><Instagram size={17} aria-hidden="true" /> Message ZenV on Instagram</ExternalLink></div>}
        {/* No named controls: a non-JavaScript form submission must not put personal text into a URL. */}
        <form onSubmit={prepareMessage} noValidate autoComplete="off" aria-describedby={id + '-privacy'}>
          <div className="static-info-field">
            <label htmlFor={id + '-name'}>Your name <span>(optional)</span></label>
            <input id={id + '-name'} type="text" maxLength={100} autoComplete="off" value={name} disabled={!links.whatsapp} onChange={event => { setName(event.target.value); setPrepared(false); setError(''); }} />
          </div>
          <div className="static-info-field">
            <label htmlFor={id + '-message'}>Your message <span>(required)</span></label>
            <textarea ref={messageField} id={id + '-message'} rows={7} maxLength={1200} required autoComplete="off" value={message} disabled={!links.whatsapp} aria-describedby={id + '-count' + (error ? ' ' + id + '-error' : '')} aria-invalid={Boolean(error)} onChange={event => { setMessage(event.target.value); setPrepared(false); setError(''); }} />
            <p className="static-info-character-count" id={id + '-count'}>{message.length.toLocaleString('en-US')} / 1,200 characters</p>
          </div>
          <p className="static-info-caption" id={id + '-privacy'}>Your text stays only in this open page’s memory; this site does not save it. WhatsApp receives the draft only if you choose to open it. Avoid payment details or sensitive personal information.</p>
          {error && <p className="static-info-form-error" role="alert" id={id + '-error'}>{error}</p>}
          <div className="static-info-actions"><button className="static-info-button" type="submit" disabled={!links.whatsapp}>Prepare WhatsApp message <MessageCircle size={18} aria-hidden="true" /></button><button className="static-info-clear" type="button" onClick={clearDraft} disabled={!name && !message}>Clear draft</button></div>
        </form>
        <noscript><p className="static-info-config-note">Preparing a draft needs JavaScript. Please use the official Instagram contact link instead.</p></noscript>
        {draftHref && <div className="static-info-prepared">
          <p className="static-info-prepared-status" role="status"><Check size={18} aria-hidden="true" /> Your draft is ready. Nothing has been sent.</p>
          <p className="static-info-caption">Review it below, open WhatsApp, and send it there only when you are ready. Opening WhatsApp needs an internet connection.</p>
          <div className="static-info-draft-preview"><p className="static-info-eyebrow">Your WhatsApp draft</p><p>{draft}</p></div>
          <ExternalLink href={draftHref} className="static-info-button">Open draft in WhatsApp</ExternalLink>
        </div>}
      </section>
      <aside className="static-info-contact-aside" aria-label="Other ways to reach ZenV">
        <p className="static-info-eyebrow">Find us, naturally</p>
        <dl className="static-info-details">
          <div><dt><Instagram size={18} aria-hidden="true" /> Instagram</dt><dd><ExternalLink href={links.instagram}>ZenV’s official Instagram</ExternalLink></dd></div>
          <div><dt><Mail size={18} aria-hidden="true" /> Email</dt><dd>{links.email ? <a className="static-info-textlink" href={'mailto:' + encodeURIComponent(links.email)}>{links.email}<ArrowUpRight size={17} aria-hidden="true" /></a> : <p>Official email is not yet configured. Please use Instagram or the configured WhatsApp contact.</p>}</dd></div>
          <div><dt><MapPin size={18} aria-hidden="true" /> In person</dt><dd><p>Bengaluru, India. Check current address and opening hours before travelling.</p><InternalLink base={base} to="visit.html">Plan your visit</InternalLink></dd></div>
          {links.website && <div><dt>Official website</dt><dd><ExternalLink href={links.website}>Visit ZenV’s website</ExternalLink></dd></div>}
        </dl>
        <EditorialPhoto base={base} image="jewelry-8.jpg" alt="A chain bracelet photographed on an open magazine" />
        <p className="static-info-caption">No automated response time is promised. Final price, availability, materials, shipping and payment arrangements are confirmed by ZenV, not by this form.</p>
      </aside>
    </div>
    <nav className="static-info-endlinks" aria-label="Helpful next pages"><InternalLink base={base} to="faq.html">A few useful answers</InternalLink><InternalLink base={base} to="gallery.html">Return to the sample gallery</InternalLink></nav>
  </>;
}

function VisitPage({ base, links }: { base: string; links: PublicLinks }) {
  return <>
    <section className="static-info-spread static-info-visit-spread" aria-label="Visiting ZenV">
      <div className="static-info-spread-copy">
        <PageHeading eyebrow="Bengaluru, in person" title={<>A little browse.<br /><em>A little closer.</em></>} intro="There is something different about seeing how a piece catches the light, trying a shape, and finding your own favourite. Plan a visit to ZenV’s Bengaluru showroom with the details confirmed first." />
        <dl className="static-info-details">
          <div><dt><MapPin size={18} aria-hidden="true" /> Showroom address</dt><dd>{links.address || 'Exact street address is awaiting confirmation. Check the official map pin and contact ZenV before travelling.'}</dd></div>
          <div><dt><Clock3 size={18} aria-hidden="true" /> Opening hours</dt><dd>{links.hours || 'Opening hours are awaiting confirmation. Please ask ZenV about today’s hours and appointment availability.'}</dd></div>
        </dl>
        <div className="static-info-actions"><ExternalLink href={links.maps} className="static-info-button"><MapPin size={18} aria-hidden="true" /> Open official directions</ExternalLink><ExternalLink href={links.instagram}>Confirm a visit on Instagram</ExternalLink></div>
        <p className="static-info-caption">The directions link is the public map shared through ZenV’s Instagram profile. It opens externally and needs internet access. No map is embedded or loaded on this page.</p>
      </div>
      <EditorialPhoto base={base} image="jewelry-8.jpg" alt="A gold-coloured chain bracelet on the pages of a magazine" caption="Editorial sample jewellery photograph · Not a photograph of the showroom." eager />
    </section>
    <section className="static-info-section" aria-labelledby="static-visit-before">
      <div className="static-info-section-heading"><p className="static-info-eyebrow">Before you set out</p><h2 id="static-visit-before">Leave room for <em>a lovely browse.</em></h2></div>
      <ol className="static-info-numbered-list">
        <li><h3>Confirm the practical details.</h3><p>Check the exact address, current opening hours and whether an appointment is needed. Ask about access or parking if those details matter to your visit; they have not been confirmed here.</p></li>
        <li><h3>Mention the pieces on your mind.</h3><p>Share a catalogue reference or the kind of jewellery you would like to see. The sample gallery is not live stock, so ask ZenV which pieces are available to view.</p></li>
        <li><h3>Ask, try, and take your time.</h3><p>Check dimensions, fastenings, materials and final price. Confirm any collection, payment or shipping arrangements directly; a website selection is an enquiry, not a completed order.</p></li>
      </ol>
    </section>
    <nav className="static-info-endlinks" aria-label="Prepare for your visit"><InternalLink base={base} to="contact.html">Ask about a visit</InternalLink><InternalLink base={base} to="gallery.html">Gather a little inspiration</InternalLink></nav>
  </>;
}

function CarePage({ base }: { base: string }) {
  return <>
    <section className="static-info-spread static-info-care-spread" aria-label="Jewellery care guide">
      <div className="static-info-spread-copy">
        <PageHeading eyebrow="The everyday ritual" title={<>Wear often.<br /><em>Care gently.</em></>} intro="A few quiet habits can help you look after the pieces you enjoy. These are general suggestions for fashion jewellery; the exact material and finish always come first." />
        <p className="static-info-body-copy">Do not assume the sample pieces are waterproof, solid precious metal or hypoallergenic. Ask ZenV for the materials and care instructions of the live item you are considering.</p>
        <InternalLink base={base} to="article-care.html">Read the complete care story</InternalLink>
      </div>
      <EditorialPhoto base={base} image="hero.jpg" alt="Gold-coloured hoop earrings arranged on stones in soft natural light" eager />
    </section>
    <section className="static-info-section" aria-labelledby="static-care-routine">
      <div className="static-info-section-heading"><p className="static-info-eyebrow">Small habits. Gentle attention.</p><h2 id="static-care-routine">A place in your <em>daily routine.</em></h2></div>
      <ol className="static-info-numbered-list">
        <li><h3>Last on, first off.</h3><p>Let perfume, lotions and hair products dry before wearing jewellery. Remove it before bathing, swimming, chores involving water or chemicals, and strenuous exercise. Avoid spraying a piece directly.</p></li>
        <li><h3>A soft cloth, a light touch.</h3><p>Gently wipe many fashion-jewellery pieces with a clean, dry, soft cloth after wearing. Avoid scrubbing, household polish, toothpaste, acidic mixtures, soaking or ultrasonic cleaning unless approved for that exact item.</p></li>
        <li><h3>A space of its own.</h3><p>Store pieces separately in a dry place, away from direct sunlight and bathroom humidity. Arrange chains loosely and fasten clasps. Keep hard-edged or heavier pieces from rubbing against delicate details.</p></li>
        <li><h3>Pause when something changes.</h3><p>Do not force a fastening or bend an item to change its fit. Set aside pieces that snag, have a loose detail or feel uncomfortable. Remove jewellery if it irritates your skin, and ask about the specific material before wearing it again.</p></li>
      </ol>
    </section>
    <div className="static-info-care-note"><p className="static-info-eyebrow">Know your particular piece</p><h2>The detail is <em>in the material.</em></h2><p>Base metals, plating, stone treatments, glued details and finishes can need different care. This guide is not a warranty or a repair promise. Ask ZenV for item-specific advice and any available aftercare before deciding.</p><InternalLink base={base} to="contact.html">Ask a material or care question</InternalLink></div>
    <EnquiryNote base={base} />
    <nav className="static-info-endlinks" aria-label="More jewellery guidance"><InternalLink base={base} to="article-styling.html">Wear it your way</InternalLink><InternalLink base={base} to="faq.html">Enquiry questions, answered</InternalLink></nav>
  </>;
}

function FaqPage({ base, links }: { base: string; links: PublicLinks }) {
  const questions: { question: string; answer: ReactNode }[] = [
    { question: 'Does choosing a piece complete an order?', answer: <><p>No. A selection or a prepared WhatsApp message is an enquiry only. It does not reserve stock, confirm an order or process a payment. ZenV must confirm the live item, final price, stock, materials, shipping and payment arrangements directly before you agree to proceed.</p><InternalLink base={base} to="contact.html">Start a conversation</InternalLink></> },
    { question: 'Are the photographs and catalogue details confirmed stock?', answer: <><p>No. This portable storefront uses sample photography and illustrative catalogue information. Product names, prices, specifications and availability are not a confirmed live inventory. Use them for inspiration, then ask ZenV which actual pieces are available and request their current details.</p><InternalLink base={base} to="gallery.html">Explore the sample gallery</InternalLink></> },
    { question: 'How do I check sizing, materials or skin sensitivities?', answer: <><p>Ask about the exact base metal, plating or finish, dimensions, weight and fastening. For rings and kadas, request the appropriate sizing guidance. Colour or shine does not establish metal content, and this site does not promise that an item is hypoallergenic, nickel-free, waterproof or suitable for every wearer.</p><InternalLink base={base} to="care.html">Read the general care guide</InternalLink></> },
    { question: 'What are the shipping and payment options?', answer: <p>Delivery areas, charges, dispatch times, courier options and payment methods must be confirmed by ZenV for your enquiry. No shipping fee, delivery date or payment service is promised here. This site does not collect a payment or book a shipment. Avoid sharing card details in a contact message.</p> },
    { question: 'Can I return, exchange or repair a piece?', answer: <p>An approved returns, exchanges, warranty or repairs policy has not been supplied for this storefront. Ask ZenV about the policy for the exact item before committing, including any hygiene restrictions, damage-reporting process, eligibility and costs. Do not assume that gifting or an unworn piece automatically creates an exchange option.</p> },
    { question: 'How can I visit the Bengaluru showroom?', answer: <><p>Use the official public directions link and confirm the exact address, current opening hours and appointment availability with ZenV before travelling. If address or hours have not been configured, the visit page says so rather than inventing them.</p><InternalLink base={base} to="visit.html">Plan a visit</InternalLink><ExternalLink href={links.maps}>Open official directions</ExternalLink></> },
    { question: 'What happens to the text in the contact form?', answer: <><p>The form keeps your draft only in the open page’s memory, not in browser storage or an account. It prepares a WhatsApp link for you to review. The draft is shared with WhatsApp only when you choose to open that link; you still need to send it there. Nothing is marked as sent by this site. Clear the draft to remove it from the page.</p><p>If a valid WhatsApp number has not been configured, the form cannot prepare a message. The official Instagram link remains available. An email link is shown only when an email has been configured.</p></> },
    { question: 'Can I browse this site offline?', answer: <p>Yes, the informational pages and local sample photographs can be read when the portable site’s files are available together. WhatsApp, Instagram, email delivery and directions need external services and connectivity. No map frame or remote content is embedded in these pages, and there are no accounts or newsletter sign-ups.</p> },
  ];
  return <>
    <PageHeading eyebrow="A little help, clearly" title={<>Good questions.<br /><em>Honest answers.</em></>} intro="The useful details, without the fine-print feeling. Here is what this sample storefront can do, what it cannot do, and what to confirm with ZenV." />
    <section className="static-info-faq-list" aria-label="Frequently asked questions">
      {questions.map((item, index) => <details className="static-info-faq-item" key={item.question} open={index === 0 ? true : undefined}>
        <summary><span>{item.question}</span><Plus size={20} aria-hidden="true" /></summary>
        <div className="static-info-faq-answer">{item.answer}</div>
      </details>)}
    </section>
    <div className="static-info-faq-help"><p className="static-info-eyebrow">Something else on your mind?</p><h2>There is room for <em>your question.</em></h2><p>For a specific piece, a gifting plan or current showroom details, ask ZenV directly.</p><InternalLink base={base} to="contact.html" button>Say hello to ZenV</InternalLink></div>
  </>;
}

export function InfoPage({ page, base, config }: {
  page: PageName;
  base: string;
  config: {
    whatsappNumber: string;
    email: string;
    instagram: string;
    mapsUrl: string;
    address: string;
    openingHours: string;
    websiteUrl: string;
  };
}) {
  const prefix = typeof base === 'string' ? base : '';
  const digits = cleanText(config?.whatsappNumber).replace(/\D/g, '');
  const email = cleanText(config?.email);
  const links: PublicLinks = {
    whatsapp: /^[1-9]\d{9,14}$/.test(digits) ? digits : '',
    email: /^[^\s@<>:\/?#&]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email) ? email : '',
    instagram: instagramLink(config?.instagram),
    maps: mapsLink(config?.mapsUrl),
    address: cleanText(config?.address),
    hours: cleanText(config?.openingHours),
    website: safeHttps(config?.websiteUrl),
  };
  let content: ReactNode;
  switch (page) {
    case 'journal': content = <JournalPage base={prefix} />; break;
    case 'article-care': case 'article-styling': case 'article-gifting': content = <ArticlePageView page={page} base={prefix} />; break;
    case 'contact': content = <ContactPage base={prefix} links={links} />; break;
    case 'visit': content = <VisitPage base={prefix} links={links} />; break;
    case 'care': content = <CarePage base={prefix} />; break;
    case 'faq': content = <FaqPage base={prefix} links={links} />; break;
    default: content = <AboutPage base={prefix} />;
  }
  const isArticle = articleOrder.includes(page as ArticlePage);
  return <div className="static-page static-info">
    <div className="static-info-shell">
      <nav className="static-info-breadcrumb" aria-label="Breadcrumb">
        <a href={prefix + 'index.html'}>Home</a><span aria-hidden="true">/</span>
        {isArticle && <><a href={prefix + 'journal.html'}>Journal</a><span aria-hidden="true">/</span></>}
        <span aria-current="page">{pageLabels[page] || 'About ZenV'}</span>
      </nav>
      {content}
    </div>
  </div>;
}
