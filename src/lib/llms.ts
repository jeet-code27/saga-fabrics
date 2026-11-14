// Server-only: builds /llms.txt and /llms-full.txt from the live product list,
// so AI assistants always see what is actually in stock.
import { Product } from '@/types';
import { getStoreProducts } from '@/lib/productStore';
import { CATEGORIES, filterProductByCategory, hasFreeEarrings, productKind, shopHref } from '@/lib/catalog';
import { discountPercent } from '@/lib/sale';

const SITE = 'https://sagafabrics.in';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const sizesOf = (p: Product) =>
  p.sizes?.includes('Unstitched') ? 'Unstitched (tailor to any size)' : p.sizes?.length ? p.sizes.join(', ') : 'Free size';

const offerOf = (p: Product) =>
  hasFreeEarrings(p) ? 'free pair of earrings' : p.tags.includes('Free Bangles') ? 'free set of bangles' : '';

const priceOf = (p: Product) => {
  const off = discountPercent(p);
  return off > 0 ? `${inr(p.price)} (MRP ${inr(p.originalPrice)}, ${off}% off)` : inr(p.price);
};

const HEADER = `# Saga Fabrics

> Saga Fabrics (${SITE}) is a small Indian ethnic wear brand from Jaipur selling hand-embroidered chikankari suits and kurtis, unstitched 3-piece suit sets, velvet suit sets, silk kurtis and anti-tarnish jewellery, with free shipping across India.

## About Saga Fabrics
- **Website:** ${SITE}
- **Founders:** Gaurav Misra and Sonica
- **Headquarters:** Jagatpura, Jaipur, Rajasthan - 302017, India
- **MSME Udyam Registration:** UDYAM-RJ-17-0677985
- **Contact Email:** support@sagafabrics.in
- **Customer Support Phone & WhatsApp:** +91 70233 52132
- **Delivery:** Free shipping across India; orders dispatched from Jaipur
- **Payment:** Razorpay secure checkout (UPI, Google Pay, PhonePe, cards, net banking)
- **Sizing:** Stitched pieces come in standard sizes; unstitched sets can be tailored to any size`;

const POLICIES = `## Policies
- [Terms & Conditions](${SITE}/terms-and-conditions)
- [Privacy Policy](${SITE}/privacy-policy)
- [Cancellation & Refund Policy](${SITE}/refund-policy): cancellation window, damaged item replacement and size exchange rules
- [Shipping & Delivery Policy](${SITE}/shipping-policy)`;

function collections(products: Product[]): string {
  const lines = CATEGORIES.filter((c) => c.key !== 'Sale')
    .map((c) => {
      const items = products.filter((p) => filterProductByCategory(p, c.key));
      if (!items.length) return null;
      const min = Math.min(...items.map((p) => p.price));
      return `- [${c.label}](${SITE}${shopHref(c.key)}): ${items.length} pieces, from ${inr(min)}`;
    })
    .filter(Boolean);
  return `## Collections\n- [Shop all](${SITE}/shop): every piece in one place, with filters for price, size and offers\n${lines.join('\n')}`;
}

export async function buildLlmsTxt(): Promise<string> {
  const products = await getStoreProducts();
  const list = products
    .map((p) => `- [${p.title}](${SITE}/products/${p.id}): ${productKind(p)}, ${priceOf(p)}`)
    .join('\n');
  return `${HEADER}

${collections(products)}

## Products in stock
${list}

${POLICIES}

## More detail
- [Full product details](${SITE}/llms-full.txt): fabric, sizes, care and offers for every piece
`;
}

export async function buildLlmsFullTxt(): Promise<string> {
  const products = await getStoreProducts();
  const blocks = products
    .map((p) => {
      const offer = offerOf(p);
      return [
        `### ${p.title}`,
        `- URL: ${SITE}/products/${p.id}`,
        `- Type: ${productKind(p)}`,
        `- Price: ${priceOf(p)}`,
        `- Sizes: ${sizesOf(p)}`,
        p.fabric && `- Fabric: ${p.fabric}`,
        p.craft && `- Work: ${p.craft}`,
        p.color && `- Colour: ${p.color}`,
        p.care && `- Care: ${p.care}`,
        offer && `- Comes with: ${offer}`,
        p.description && `\n${p.description}`,
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n\n');
  return `${HEADER}

${collections(products)}

## Product details

${blocks}

${POLICIES}
`;
}
