import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sorpresa para ti 🎁",
    description: "Alguien especial te ha enviado una sorpresa.",
    robots: { index: false, follow: false },
};

export default function SorpresasLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
