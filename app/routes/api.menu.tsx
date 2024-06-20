import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

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

export const loader: LoaderFunction = async ({ request }) => {
  const file_path = path.resolve("data", "menu.json");
  const file_contents = await fs.promises.readFile(file_path, "utf-8");
  const menu_data: MenuCategory[] = JSON.parse(file_contents);

  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  let totalItems = 0;

  for (const category of menu_data) {
    totalItems += category.items.length;
  }

  const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit")!) : totalItems;

  if (!query) {
    const allmenu_data: MenuCategory[] = menu_data.map(category => ({
      ...category,
      items: category.items.slice(0, limit),
    }));
    return json(allmenu_data);
  }

  const filterItems = (items: MenuItem[], query: string, remaining_limit: number): { filtered_items: MenuItem[], exceeded_limit: boolean } => {
    let filtered_items: MenuItem[] = [];
    let count = 0;
    for (const item of items) {
      if (count >= remaining_limit) {
        return { filtered_items, exceeded_limit: true };
      }
      if (
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.includes(query) ||
        item.price.toString().includes(query)
      ) {
        filtered_items.push(item);
        count++;
      }
    }
    return { filtered_items, exceeded_limit: false };
  };

  const filtered_data: MenuCategory[] = [];
  let remaining_limit: number = limit;

  for (const category of menu_data) {
    if (remaining_limit <= 0) {
      break;
    }

    const { filtered_items, exceeded_limit } = filterItems(category.items, query!, remaining_limit);

    if (filtered_items.length > 0) {
      filtered_data.push({
        ...category,
        items: filtered_items.slice(0, remaining_limit),
      });
      remaining_limit -= filtered_items.length;
    }

    if (exceeded_limit) {
      break;
    }
  }

  return json(filtered_data);
};
