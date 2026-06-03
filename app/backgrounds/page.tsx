import { readdir } from "fs/promises";
import { join } from "path";
import BackgroundsPage from "@/components/BackgroundsPage";

export default async function Page() {
  const dir = join(process.cwd(), "public", "backgrounds");
  const files = await readdir(dir);
  const images = files
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort();
  return <BackgroundsPage images={images} />;
}
