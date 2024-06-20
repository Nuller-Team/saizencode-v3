import fs from "fs";
import path from "path";
import { LoaderFunction } from "@remix-run/node";

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface MenuCategory {
  genre: string;
  emoji: string;
  reading: string;
  items: MenuItem[];
}

export let loadMenuData: LoaderFunction<MenuCategory[]> = async () => {
  const file_path = path.resolve("data", "menu.json");
  const file_contents = await fs.promises.readFile(file_path, "utf-8");
  const menu_data: MenuCategory[] = JSON.parse(file_contents);
  return menu_data;
};