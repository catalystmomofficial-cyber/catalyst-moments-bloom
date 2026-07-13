Hero carousel images
=====================

Drop your 4 hero photos in THIS folder with these exact names:

  ttc.jpg          -> "Trying to Conceive" slide  (e.g. the kitchen / phone-tracking photo)
  pregnancy.jpg    -> "Pregnancy" slide           (e.g. the meditating pregnant woman)
  postpartum.jpg   -> "Postpartum" slide          (e.g. the mom holding her newborn)
  wellness.jpg     -> "Every stage" slide         (e.g. the second meditation photo)

Recommended: portrait orientation (~4:5), compressed to well under 300 KB each
(e.g. 800px wide, quality ~75) so the hero stays fast to load (LCP).

Until these files exist, each slide gracefully falls back to the current hero
image, so the carousel is never broken while you're setting it up.

The slide captions live in src/components/home/HeroImageCarousel.tsx if you want
to reword them.
