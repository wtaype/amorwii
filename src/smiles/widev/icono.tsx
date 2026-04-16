import type { SVGProps } from "react";
import { cx } from "./clase";

export type WiIconoName =
  | "heart"
  | "home"
  | "plus"
  | "sparkles"
  | "info"
  | "gauge"
  | "userPlus"
  | "login"
  | "menu"
  | "close";

type WiIconoProps = {
  name: WiIconoName;
  className?: string;
  title?: string;
};

const svgBase: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function WiIcono({ name, className, title }: WiIconoProps) {
  return (
    <svg
      {...svgBase}
      className={cx("wiico", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {name === "heart" && <path d="M21 8.5c0 7-9 12-9 12s-9-5-9-12A5.5 5.5 0 0 1 12 5a5.5 5.5 0 0 1 9 3.5Z" />}
      {name === "home" && (
        <>
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </>
      )}
      {name === "plus" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </>
      )}
      {name === "sparkles" && <path d="m12 3 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18l.9-5.4L4.2 8.7l5.4-.8z" />}
      {name === "info" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6" />
          <path d="M12 7h.01" />
        </>
      )}
      {name === "gauge" && (
        <>
          <path d="M5 14a7 7 0 1 1 14 0" />
          <path d="m12 14 4-4" />
          <path d="M7 18h10" />
        </>
      )}
      {name === "userPlus" && (
        <>
          <circle cx="9" cy="7" r="4" />
          <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
          <path d="M19 8v6M16 11h6" />
        </>
      )}
      {name === "login" && (
        <>
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M13 19h8V5h-8" />
        </>
      )}
      {name === "menu" && <path d="M3 6h18M3 12h18M3 18h18" />}
      {name === "close" && <path d="m6 6 12 12M18 6 6 18" />}
    </svg>
  );
}
