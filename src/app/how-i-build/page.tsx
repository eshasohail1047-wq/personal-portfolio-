import { redirect } from "next/navigation";

/** Legacy URL — About (process flight) lives on home. */
export default function HowIBuildPage() {
  redirect("/#about");
}
