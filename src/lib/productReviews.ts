export type ProductReview = {
  author: string;
  text: string;
  rating: number;
  date: string;
  verified: boolean;
};

const REVIEW_POOL: ProductReview[] = [
  {
    author: 'Ayesha K.',
    rating: 5,
    date: 'Jan 2026',
    verified: true,
    text: 'Ordered twice now — sealed, fresh, and delivered before the estimated date.',
  },
  {
    author: 'Sara M.',
    rating: 4,
    date: 'Dec 2025',
    verified: true,
    text: 'Product matched the listing exactly. Packaging could be a little tighter but overall very happy.',
  },
  {
    author: 'Fatima R.',
    rating: 5,
    date: 'Nov 2025',
    verified: true,
    text: 'Checked the batch code online — genuine. Will reorder from Hautoria again.',
  },
  {
    author: 'Hina S.',
    rating: 4,
    date: 'Oct 2025',
    verified: false,
    text: 'Good value compared to other shops in Lahore. Took 2 days to arrive, not overnight.',
  },
  {
    author: 'Zainab A.',
    rating: 5,
    date: 'Sep 2025',
    verified: true,
    text: 'My dermatologist recommended this exact formula. Glad I found it here at a fair price.',
  },
  {
    author: 'Mariam T.',
    rating: 3,
    date: 'Aug 2025',
    verified: true,
    text: 'Works as expected but the pump felt slightly stiff on first use. Customer support replied quickly.',
  },
  {
    author: 'Noor H.',
    rating: 5,
    date: 'Jul 2025',
    verified: true,
    text: 'Skin felt calmer within a week. Authentic product — expiry date was 18 months out.',
  },
  {
    author: 'Bushra I.',
    rating: 4,
    date: 'Jun 2025',
    verified: true,
    text: 'Solid purchase. Slightly smaller than I imagined from the photos but quantity on label is correct.',
  },
  {
    author: 'Rabia Q.',
    rating: 5,
    date: 'May 2025',
    verified: true,
    text: 'COD was smooth and the rider called before delivery. Product was bubble-wrapped well.',
  },
  {
    author: 'Sana P.',
    rating: 4,
    date: 'Apr 2025',
    verified: false,
    text: 'Happy with quality. Gave 4 stars because the outer carton had a small dent — bottle was fine.',
  },
  {
    author: 'Amna Z.',
    rating: 5,
    date: 'Mar 2025',
    verified: true,
    text: 'Repurchase for the third time. Consistency between orders has been excellent.',
  },
  {
    author: 'Khadija L.',
    rating: 4,
    date: 'Feb 2025',
    verified: true,
    text: 'Texture and scent match what I buy abroad. Delivery to Islamabad was under 48 hours.',
  },
];

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getProductReviews(productId: string, count = 4): ProductReview[] {
  const start = hashString(productId) % REVIEW_POOL.length;
  const picked: ProductReview[] = [];
  for (let i = 0; i < REVIEW_POOL.length && picked.length < count; i += 1) {
    const review = REVIEW_POOL[(start + i * 5) % REVIEW_POOL.length];
    if (!picked.some((entry) => entry.author === review.author)) {
      picked.push(review);
    }
  }
  return picked;
}
