import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";
import styles from "./logo-cloud-3.module.css";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"section"> & {
  logos?: Logo[];
  heading?: string;
  subline?: string;
};

const defaultLogos: Logo[] = [
  { src: "/company-logos/apple.png", alt: "Apple" },
  { src: "/company-logos/microsoft.png", alt: "Microsoft" },
  { src: "/company-logos/google.png", alt: "Google" },
  { src: "/company-logos/amazon.png", alt: "Amazon" },
  { src: "/company-logos/meta.png", alt: "Meta" },
  { src: "/company-logos/nvidia.png", alt: "NVIDIA" },
  { src: "/company-logos/tesla.png", alt: "Tesla" },
  { src: "/company-logos/salesforce.png", alt: "Salesforce" },
  { src: "/company-logos/oracle.png", alt: "Oracle" },
  { src: "/company-logos/adobe.png", alt: "Adobe" },
];

export function LogoCloud({
  className,
  logos = defaultLogos,
  heading = "Our candidates have landed roles at",
  subline = "",
  ...props
}: LogoCloudProps) {
  return (
    <section
      {...props}
      aria-label={heading}
      className={cn(styles.section, className)}
    >
      {(heading || subline) && (
        <div className={styles.heading}>
          {heading && <h2>{heading}</h2>}
          {subline && <p className={styles.subline}>{subline}</p>}
        </div>
      )}

      <div className={styles.cloud}>
        <InfiniteSlider gap={56} reverse speed={70} speedOnHover={25}>
          {logos.map((logo) => (
            <div className={styles.item} key={`logo-${logo.alt}`}>
              <img
                alt={logo.alt}
                className={styles.logo}
                height={logo.height || "auto"}
                loading="lazy"
                src={logo.src}
                width={logo.width || "auto"}
              />
              <span className={styles.label}>{logo.alt}</span>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
