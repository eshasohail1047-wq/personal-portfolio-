import { redirect } from "next/navigation";

/** Legacy URL — How I Build lives on home after About. */
export default function HowIBuildPage() {
  redirect("/#how-i-build");
}
