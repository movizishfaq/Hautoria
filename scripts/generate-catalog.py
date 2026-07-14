"""
Generate Hautoria product catalog from Market Price Analysis PDF.
Supplier costs are estimated internally (never exported to the website).
Only selling prices and market compare-at prices are saved.
"""

import json
import math
import os
import re
import shutil

PRODUCTS = [
    {
        "name": "Fit Me Matte Tube Foundation 18ml",
        "image": "page-01-img-0.png",
        "range": (1599, 1999),
        "retailers": [],
        "category": "treatment",
        "featured": True,
    },
    {
        "name": "The Ordinary Hyaluronic Acid 2% + B5 30ml",
        "image": "page-01-img-1.png",
        "range": (3999, 4999),
        "retailers": [3999, 4250, 4999, 4295],
        "category": "serum",
        "featured": True,
    },
    {
        "name": "The Ordinary Salicylic Acid 2% Solution Serum 30ml",
        "image": "page-02-img-0.png",
        "range": (3495, 4900),
        "retailers": [3495, 3999, 4500, 3495, 4900],
        "category": "serum",
    },
    {
        "name": "MAC Prep + Prime Tube Primer 45ml",
        "image": "page-02-img-1.png",
        "range": (999, 999),
        "retailers": [999, 999],
        "category": "treatment",
    },
    {
        "name": "MAC NC15 Foundation",
        "image": "page-03-img-0.png",
        "range": (11000, 20674),
        "retailers": [11000, 20674, 14280],
        "category": "treatment",
    },
    {
        "name": "MAC Matchmaster Foundation 50ml",
        "image": "page-03-img-1.png",
        "range": (14348, 18930),
        "retailers": [13348, 18930],
        "category": "treatment",
    },
    {
        "name": "MAC NC20 Foundation 30ml",
        "image": "page-04-img-0.png",
        "range": (14348, 25963),
        "retailers": [14348, 14900, 25963],
        "category": "treatment",
    },
    {
        "name": "MAC Black Foundation 30ml",
        "image": "page-04-img-1.png",
        "range": (10800, 18930),
        "retailers": [10800, 18930, 14348],
        "category": "treatment",
    },
    {
        "name": "Maybelline Sky High Mascara",
        "image": "page-05-img-0.png",
        "range": (2879, 5297),
        "retailers": [5297, 3950, 2879, 3599],
        "category": "treatment",
        "featured": True,
    },
    {
        "name": "Giorgio Armani Mascara",
        "image": "page-05-img-1.png",
        "range": (7299, 7299),
        "retailers": [7299],
        "category": "treatment",
    },
    {
        "name": "Dior Mascara",
        "image": "page-06-img-0.png",
        "range": (16107, 20867),
        "retailers": [20867, 16107],
        "category": "treatment",
    },
    {
        "name": "Chanel Mascara",
        "image": "page-06-img-1.png",
        "range": (14108, 15895),
        "retailers": [14108, 15895, 15600],
        "category": "treatment",
    },
    {
        "name": "Chanel Mascara Golden",
        "image": "page-07-img-0.png",
        "range": (13500, 23080),
        "retailers": [13500, 23080, 16585],
        "category": "treatment",
    },
    {
        "name": "Axis-Y Dark Spot Correcting Tube Serum 50ml",
        "image": "page-07-img-1.png",
        "range": (2999, 5200),
        "retailers": [2999, 3450, 3849, 3800, 5200, 4395],
        "category": "serum",
    },
    {
        "name": "Vegan Axis-Y Serum",
        "image": "page-08-img-0.png",
        "range": (2599, 6000),
        "retailers": [4200, 4160, 6000, 2599, 2900],
        "category": "serum",
    },
    {
        "name": "Anua Heartleaf Silky Moisture Sunblock 50+ 50ml",
        "image": "page-08-img-1.png",
        "range": (2150, 8800),
        "retailers": [2150, 6200, 8800, 5487, 3389],
        "category": "treatment",
    },
    {
        "name": "Anua Peach 70% Niacin Serum 30ml",
        "image": "page-09-img-0.png",
        "range": (2299, 7200),
        "retailers": [7200, 4999, 5500, 2299, 6980, 5774],
        "category": "serum",
    },
    {
        "name": "The Ordinary High Adherence Silicone Primer",
        "image": "page-09-img-1.png",
        "range": (1999, 5999),
        "retailers": [3950, 4299, 1999, 5999, 3350, 3295],
        "category": "treatment",
    },
    {
        "name": "The Ordinary Natural Moisturizing Factor + HA 100ml",
        "image": "page-10-img-0.png",
        "range": (5391, 7499),
        "retailers": [5850, 5800, 7499, 5391],
        "category": "moisturizer",
    },
    {
        "name": "COSRX Aloe Soothing Sun Cream SPF 50+",
        "image": "page-10-img-1.png",
        "range": (2999, 4999),
        "retailers": [3739, 4000, 4699, 2999, 4999],
        "category": "treatment",
    },
    {
        "name": "COSRX Centella Water Alcohol-Free Toner 150ml",
        "image": "page-11-img-0.png",
        "range": (2468, 5699),
        "retailers": [4287, 5530, 5005, 5699, 2468],
        "category": "treatment",
    },
    {
        "name": "COSRX Hyaluronic Acid Hydra Power Essence 100ml",
        "image": "page-11-img-1.png",
        "range": (2519, 5980),
        "retailers": [5680, 2999, 5980, 2519],
        "category": "serum",
    },
    {
        "name": "COSRX Hyaluronic Acid Intensive Cream 100g",
        "image": "page-11-img-2.png",
        "range": (4400, 6685),
        "retailers": [4400, 5360, 4499, 6685, 5840],
        "category": "moisturizer",
    },
    {
        "name": "COSRX Snail 92 All In One Cream",
        "image": "page-12-img-0.png",
        "range": (2899, 5394),
        "retailers": [5219, 4200, 5394, 2899, 3650],
        "category": "moisturizer",
        "featured": True,
    },
    {
        "name": "La Roche-Posay Sun Block 50+",
        "image": "page-12-img-1.png",
        "range": (5000, 8800),
        "retailers": [6500, 8800, 7900, 7810, 5000],
        "category": "treatment",
    },
    {
        "name": "CeraVe Facial Moisturizing Lotion PM",
        "image": "page-13-img-0.png",
        "range": (4999, 5800),
        "retailers": [5800, 5200, 4999, 5399, 5730, 5500],
        "category": "moisturizer",
    },
    {
        "name": "COSRX AHA/BHA Clarifying Treatment Toner",
        "image": "page-13-img-1.png",
        "range": (3801, 5495),
        "retailers": [3801, 4990, 3800, 5495, 5480],
        "category": "treatment",
    },
    {
        "name": "COSRX Propolis Synergy & Vitamin C Toner 280ml",
        "image": "page-14-img-0.png",
        "range": (4282, 6300),
        "retailers": [4999, 4999, 5516, 6300, 4282],
        "category": "treatment",
    },
    {
        "name": "Anua Heartleaf Cleansing Oil 200ml",
        "image": "page-14-img-1.png",
        "range": (5999, 9231),
        "retailers": [7200, 6200, 9231, 5999],
        "category": "cleanser",
    },
    {
        "name": "Anua Soothing Toner 77% 250ml",
        "image": "page-15-img-0.png",
        "range": (5800, 6240),
        "retailers": [6240, 5800],
        "category": "treatment",
    },
    {
        "name": "CeraVe Acne Control Cleanser 236ml",
        "image": "page-15-img-1.png",
        "range": (1399, 1399),
        "retailers": [1399],
        "category": "cleanser",
    },
    {
        "name": "COSRX Low pH Good Morning Gentle Cleanser",
        "image": "page-15-img-2.png",
        "range": (3850, 4700),
        "retailers": [3850, 3850, 4000, 4700, 4400],
        "category": "cleanser",
    },
    {
        "name": "CeraVe Foaming Cleanser",
        "image": "page-16-img-0.png",
        "range": (4445, 8500),
        "retailers": [6995, 7000, 4445, 6461, 6950, 8500],
        "category": "cleanser",
    },
    {
        "name": "CeraVe SA Cream Bumpy Skin 340g",
        "image": "page-16-img-1.png",
        "range": (2703, 10600),
        "retailers": [9900, 10600, 2703],
        "category": "moisturizer",
    },
    {
        "name": "CeraVe Hydrating Cleanser 236ml",
        "image": "page-17-img-0.png",
        "range": (4650, 5599),
        "retailers": [5599, 4650],
        "category": "cleanser",
    },
    {
        "name": "CeraVe Itch Relief Moisturizing Lotion",
        "image": "page-17-img-1.png",
        "range": (3499, 8000),
        "retailers": [8000, 6360, 4560, 3499],
        "category": "moisturizer",
    },
    {
        "name": "La Roche-Posay Vitamin C Serum",
        "image": "page-18-img-0.png",
        "range": (3750, 17900),
        "retailers": [17900, 3750, 4449, 10300],
        "category": "serum",
    },
    {
        "name": "CeraVe Moisturising Cream 340g Jar",
        "image": "page-18-img-1.png",
        "range": (7250, 7700),
        "retailers": [7250, 7700],
        "category": "moisturizer",
        "featured": True,
    },
    {
        "name": "La Roche-Posay Hyalu B5 Serum",
        "image": "page-18-img-2.png",
        "range": (4250, 23386),
        "retailers": [4250, 15900, 23386, 7950],
        "category": "serum",
    },
    {
        "name": "CeraVe Moisturising Cream 454g Jar",
        "image": "page-19-img-0.png",
        "range": (4250, 9700),
        "retailers": [9700, 6495, 4250, 5900],
        "category": "moisturizer",
    },
    {
        "name": "La Roche-Posay Retinol B3 Serum",
        "image": "page-19-img-1.png",
        "range": (7480, 19957),
        "retailers": [12950, 19957, 7480, 9595, 17900],
        "category": "serum",
    },
    {
        "name": "La Roche-Posay Niacinamide 10 Serum",
        "image": "page-39-img-1.png",
        "range": (1600, 10900),
        "retailers": [2999, 2150, 1600, 10900, 2564],
        "category": "serum",
    },
    # Page 40 — no market data; estimated from similar products
    {
        "name": "CeraVe Deep Cleaning Moisturising Massage Cream 100ml",
        "image": "page-13-img-0.png",
        "range": (4500, 6500),
        "retailers": [5500],
        "category": "moisturizer",
        "estimated": True,
    },
    {
        "name": "La Roche-Posay 50+ Sunscreen Long 50ml",
        "image": "page-12-img-1.png",
        "range": (5500, 7500),
        "retailers": [6500],
        "category": "treatment",
        "estimated": True,
    },
    {
        "name": "The Ordinary Tubes 30ml (All Variants)",
        "image": "page-02-img-0.png",
        "range": (3200, 4800),
        "retailers": [3999],
        "category": "serum",
        "estimated": True,
    },
    {
        "name": "MAC Black Primer 30ml",
        "image": "page-02-img-1.png",
        "range": (1200, 1800),
        "retailers": [1500],
        "category": "treatment",
        "estimated": True,
    },
    {
        "name": "MAC Prep + Prime 35ml",
        "image": "page-02-img-1.png",
        "range": (900, 1400),
        "retailers": [1100],
        "category": "treatment",
        "estimated": True,
    },
]

ACCENTS = ["bg-blush", "bg-beige", "bg-sage"]
CONCERNS_MAP = {
    "serum": ["hydration", "radiance", "aging"],
    "moisturizer": ["hydration", "sensitivity"],
    "cleanser": ["clarity", "sensitivity"],
    "treatment": ["clarity", "radiance"],
    "oil": ["hydration", "radiance"],
}


def slugify(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def psych_price(value: float) -> int:
    rounded = int(math.ceil(value / 100) * 100) - 1
    return max(rounded, 99)


def calc_prices(range_min: int, range_max: int, retailers: list[int]) -> dict:
    """Estimate supplier cost internally; export only selling + compare-at."""
    market_prices = retailers or [range_min, range_max]
    market_min = min(market_prices)
    market_max = max(market_prices)
    market_avg = sum(market_prices) / len(market_prices)

    # Internal supplier cost estimate (~72% of lowest market price)
    supplier_cost = round(market_min * 0.72)

    # Selling: healthy margin, still below market average
    target_sell = max(supplier_cost * 1.22, market_avg * 0.87)
    target_sell = min(target_sell, market_avg * 0.93)
    target_sell = max(target_sell, supplier_cost + 200)

    selling_price = psych_price(target_sell)
    compare_at = psych_price(market_avg + 50)

    if selling_price >= compare_at:
        selling_price = psych_price(market_avg * 0.88)

    discount_pct = round((1 - selling_price / compare_at) * 100) if compare_at > selling_price else 0

    return {
        "selling_price": selling_price,
        "compare_at_price": compare_at if discount_pct >= 3 else None,
        "discount_pct": discount_pct,
        # Internal only — not written to public catalog
        "_supplier_cost": supplier_cost,
        "_market_avg": round(market_avg),
    }


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_images = os.path.join(base, "public", "products")
    out_images = os.path.join(base, "public", "catalog")
    os.makedirs(out_images, exist_ok=True)

    catalog = []
    for i, product in enumerate(PRODUCTS):
        slug = slugify(product["name"])
        src_img = os.path.join(src_images, product["image"])
        ext = os.path.splitext(product["image"])[1]
        dest_name = f"{slug}{ext}"
        dest_img = os.path.join(out_images, dest_name)

        if os.path.exists(src_img):
            shutil.copy2(src_img, dest_img)

        prices = calc_prices(product["range"][0], product["range"][1], product["retailers"])
        category = product["category"]
        accent = ACCENTS[i % len(ACCENTS)]

        entry = {
            "id": slug,
            "slug": slug,
            "name": product["name"],
            "tagline": product["name"].split()[0],
            "description": f"Authentic {product['name']} — premium beauty, competitively priced.",
            "category": category,
            "concerns": CONCERNS_MAP.get(category, ["hydration"]),
            "price": prices["selling_price"],
            "compareAtPrice": prices["compare_at_price"],
            "rating": 4.7,
            "reviewCount": 50 + (i * 13) % 400,
            "stock": 15 + (i * 7) % 30,
            "image": f"/catalog/{dest_name}",
            "accent": accent,
            "badges": (
                [f"{prices['discount_pct']}% Off"]
                if prices["compare_at_price"] and prices["discount_pct"] >= 3
                else []
            ),
            "ingredients": [],
            "featured": product.get("featured", False),
        }
        catalog.append(entry)

    out_json = os.path.join(base, "src", "lib", "catalog.json")
    public_catalog = [{k: v for k, v in item.items()} for item in catalog]
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(public_catalog, f, indent=2)

    print(f"Generated {len(catalog)} products -> {out_json}")
    for item in catalog[:5]:
        print(f"  {item['name']}: Rs. {item['price']}", end="")
        if item.get("compareAtPrice"):
            print(f" (was Rs. {item['compareAtPrice']})", end="")
        print()


if __name__ == "__main__":
    main()
