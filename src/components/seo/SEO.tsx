import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  structuredData?: Record<string, any>;
}

const SEO = ({ title, description, canonical, image, structuredData }: SEOProps) => {
  const location = useLocation();
  const url = canonical || `${window.location.origin}${location.pathname}`;

  const jsonLd = structuredData ? JSON.stringify(structuredData) : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Catalyst Mom" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={title} />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{jsonLd}</script>
      )}
    </Helmet>
  );
};

export default SEO;
