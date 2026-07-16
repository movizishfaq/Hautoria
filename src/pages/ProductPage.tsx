import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  StarIcon,
  TruckIcon,
  ZoomInIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { catalogService } from '../services/catalogService';
import { isApiEnabled } from '../services/api';
import type { Product } from '../types/domain';
import { useAppState } from '../hooks/useAppState';
import { EmptyState } from '../components/ui/EmptyState';
import { Price } from '../components/ui/Price';
import { QuantitySelector } from '../components/ui/QuantitySelector';
import { RatingStars } from '../components/ui/RatingStars';
import { LuxuryProductCard } from '../features/catalog/LuxuryProductCard';
import { BlurReveal } from '../components/premium/BlurReveal';
import { discountPercent, formatPrice } from '../lib/formatPrice';
import { FAQS } from '../lib/data';
import { getProductReviews } from '../lib/productReviews';
import { useSeo } from '../hooks/useSeo';
import { Breadcrumbs } from '../components/seo/Breadcrumbs';
import { JsonLd } from '../components/seo/JsonLd';
import {
  breadcrumbSchema,
  globalSchemas,
  productSchema,
  webPageSchema,
} from '../lib/seoSchemas';
import { absoluteAsset, metaDescription, pageTitle, seoConfig } from '../lib/seoConfig';

export function StickyAddToCart({
  product,
  quantity,
  onAdd,
  visible,
}: {
  product: Product;
  quantity: number;
  onAdd: () => void;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] z-[60] border-t border-charcoal/10 glass px-4 py-3 shadow-luxe-lg dark:glass-dark lg:bottom-6 lg:left-auto lg:right-6 lg:z-40 lg:max-w-md lg:rounded-2xl lg:border">
          <div className="mx-auto flex max-w-7xl items-center gap-3 sm:gap-4">
            <div className={`hidden h-12 w-12 shrink-0 rounded-xl sm:block ${product.accent} p-1.5`}>
              <img src={product.image} alt={product.name} className="h-full object-contain" loading="lazy" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm">{product.name}</p>
              <p className="text-sm text-gold">{formatPrice(product.price * quantity)}</p>
            </div>
            <button
              onClick={onAdd}
              className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-full bg-charcoal px-5 py-3 text-[0.58rem] uppercase tracking-luxe text-ivory sm:px-6 dark:bg-ivory dark:text-charcoal">
              <ShoppingBagIcon className="h-4 w-4" />
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Add to Cart</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProductPage() {
  const { slug } = useParams();
  const { getBySlug, products, ready } = useCatalog();
  const [product, setProduct] = useState<Product | undefined>();
  const { addToCart, toggleWishlist, wishlist, viewProduct, notify } = useAppState();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const local = getBySlug(slug);
    if (local) {
      setProduct(local);
      return;
    }
    if (isApiEnabled() && ready) {
      void catalogService.bySlug(slug).then((remote) => setProduct(remote));
    }
  }, [slug, getBySlug, ready]);

  useEffect(() => {
    if (product) viewProduct(product.id);
  }, [product?.id, viewProduct]);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const breadcrumbItems = useMemo(
    () => [
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: product?.category ?? 'Product', path: `/shop?category=${product?.category ?? 'all'}` },
      { name: product?.name ?? 'Product', path: `/products/${product?.slug ?? slug ?? ''}` },
    ],
    [product, slug]
  );

  const productSeo = useMemo(() => {
    if (!product) return null;
    const description = metaDescription(
      product.description ||
        `${product.name} — authentic premium ${product.category} from Hautoria. ${product.tagline}. Shop now with fast delivery across Pakistan.`
    );
    return {
      title: pageTitle([product.name]),
      description,
      keywords: `${seoConfig.defaultKeywords}, ${product.name}, ${product.category}, ${product.concerns.join(', ')}`,
      canonicalPath: `/products/${product.slug}`,
      ogImage: absoluteAsset(product.image),
      ogType: 'product',
    };
  }, [product]);

  useSeo(productSeo);

  const productJsonLd = useMemo(() => {
    if (!product || !productSeo) return globalSchemas();
    return [
      ...globalSchemas(),
      webPageSchema({
        name: productSeo.title,
        description: productSeo.description,
        path: `/products/${product.slug}`,
      }),
      breadcrumbSchema(breadcrumbItems),
      productSchema(product),
    ];
  }, [product, productSeo, breadcrumbItems]);

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-28 flex justify-center">
        {!ready ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        ) : (
          <EmptyState title="Product not found" body="This item may no longer be available." />
        )}
      </main>
    );
  }

  const wished = wishlist.some((w) => w.productId === product.id);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const boughtTogether = products.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    addToCart(product, product.variants[variant]?.id ?? product.variants[0].id, quantity);
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <main className="mx-auto max-w-7xl px-4 pb-44 pt-28 sm:px-6 lg:pb-20 lg:pt-32">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <motion.div
              layout
              className={`relative aspect-square overflow-hidden rounded-[2rem] ${product.accent} shadow-luxe`}>
              {discount && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-charcoal px-4 py-1.5 text-[0.58rem] uppercase tracking-luxe text-ivory">
                  {discount}% Off
                </span>
              )}
              <motion.img
                key={gallery[image]}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                src={gallery[image]}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full cursor-zoom-in object-contain p-10"
                onClick={() => setZoom(true)}
              />
              <button
                onClick={() => setZoom(true)}
                className="absolute bottom-5 right-5 rounded-full glass p-3">
                <ZoomInIcon className="h-4 w-4" />
              </button>
            </motion.div>
            <div className="mt-4 flex gap-3">
              {gallery.slice(0, 4).map((src, i) => (
                <button
                  key={src}
                  onClick={() => setImage(i)}
                  className={`h-20 w-20 rounded-xl p-2 transition-all ${
                    image === i ? 'ring-2 ring-gold' : 'bg-beige/50 dark:bg-white/5'
                  }`}>
                  <img
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <BlurReveal>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                  {product.name}
                </h1>
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    notify(wished ? 'Removed from wishlist' : 'Saved');
                  }}
                  className="shrink-0 rounded-full border border-charcoal/15 p-3 dark:border-white/15">
                  <HeartIcon className={`h-5 w-5 ${wished ? 'fill-gold text-gold' : ''}`} />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <RatingStars rating={product.rating} count={product.reviewCount} />
              </div>

              <div className="mt-6">
                <Price value={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
              </div>

              {product.stock <= 8 && (
                <p className="mt-4 text-sm text-gold">Only {product.stock} left in stock</p>
              )}

              <p className="mt-6 text-base font-light leading-relaxed text-charcoal/65 dark:text-ivory/65">
                {product.description}
              </p>

              {product.variants.length > 1 && (
                <div className="mt-8">
                  <p className="mb-3 text-[0.58rem] uppercase tracking-luxe text-charcoal/45">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <motion.button
                        key={v.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setVariant(i)}
                        className={`rounded-full border px-5 py-2.5 text-sm transition-all ${
                          variant === i
                            ? 'border-gold bg-gold/10 text-charcoal'
                            : 'border-charcoal/15 dark:border-white/15'
                        }`}>
                        {v.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <QuantitySelector value={quantity} max={product.stock} onChange={setQuantity} />
                <button
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-[0.62rem] uppercase tracking-luxe text-ivory transition-colors hover:bg-gold hover:text-charcoal dark:bg-ivory dark:text-charcoal">
                  <ShoppingBagIcon className="h-4 w-4" />
                  Add to Cart · {formatPrice(product.price * quantity)}
                </button>
              </div>

              <div className="mt-8 grid gap-3 rounded-2xl bg-beige/60 p-5 text-sm dark:bg-white/5">
                <p className="flex items-center gap-3">
                  <TruckIcon className="h-4 w-4 text-gold" />
                  Free delivery on orders over Rs. 5,000
                </p>
                <p className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-4 w-4 text-gold" />
                  100% authentic · verified supplier
                </p>
                <p className="flex items-center gap-3">
                  <StarIcon className="h-4 w-4 text-gold" />
                  {product.rating} rating from {product.reviewCount} reviews
                </p>
              </div>
            </BlurReveal>
          </div>
        </div>

        <section className="mt-24 border-t border-charcoal/10 pt-16 dark:border-white/10">
          <BlurReveal>
            <h2 className="font-serif text-3xl">Frequently bought together</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {boughtTogether.map((item) => (
                <LuxuryProductCard key={item.id} product={item} />
              ))}
            </div>
          </BlurReveal>
        </section>

        <section className="mt-24">
          <BlurReveal>
            <h2 className="font-serif text-3xl">Customer reviews</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {getProductReviews(product.id).map((review) => (
                <div key={`${product.id}-${review.author}`} className="rounded-2xl bg-beige/50 p-6 dark:bg-white/5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="mt-1 text-[0.62rem] uppercase tracking-luxe text-charcoal/45 dark:text-ivory/45">
                        {review.date}
                        {review.verified ? ' · Verified purchase' : ''}
                      </p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/65 dark:text-ivory/65">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </BlurReveal>
        </section>

        <section className="mt-24">
          <BlurReveal>
            <h2 className="font-serif text-3xl">Questions & answers</h2>
            <div className="mt-6 space-y-2">
              {FAQS.slice(0, 4).map((faq, i) => (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-charcoal/10 dark:border-white/10">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left">
                    <span className="font-serif text-lg">{faq.q}</span>
                    {openFaq === i ? (
                      <MinusIcon className="h-4 w-4 shrink-0" />
                    ) : (
                      <PlusIcon className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-charcoal/65 dark:text-ivory/65">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </BlurReveal>
        </section>

        <section className="mt-24">
          <h2 className="font-serif text-3xl">You may also like</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <LuxuryProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </main>

      <StickyAddToCart product={product} quantity={quantity} onAdd={handleAdd} visible={stickyVisible} />

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-8 backdrop-blur-sm">
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={gallery[image]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
