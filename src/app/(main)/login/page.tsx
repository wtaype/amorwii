import type { Metadata } from "next";
import Login from "./login";
import "./login.css";

import { seopages } from "@/app/seopages";

export const metadata: Metadata = seopages.login;

export default function LoginPage() {
  return <Login />;
}
