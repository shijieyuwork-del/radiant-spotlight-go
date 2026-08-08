import { Helmet } from "react-helmet-async";
import { SITE_URL, OG_IMAGE, TWITTER_HANDLE } from "@/lib/seo-config";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  structuredData?: Record<string, unknown>;
}

/**
 * 为每个页面动态设置 meta 标签
 * 包括：title、description、og:*、twitter:*、canonical、structured data
 */
export const PageMeta = ({
  title,
  description,
  path = "/",
  image = OG_IMAGE,
  type = "website",
  structuredData,
}: PageMetaProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("Glowy") ? title : `${title} | Glowy`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={fullTitle} />
      <meta name="og:description" content={description} />
      <meta name="og:type" content={type} />
      <meta name="og:url" content={url} />
      <meta name="og:image" content={image} />
      <meta name="og:site_name" content="Glowy" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="canonical" href={url} />

      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
};

export default PageMeta;
