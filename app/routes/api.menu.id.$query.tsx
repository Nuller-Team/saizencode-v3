import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { loadMenuData } from "../utils/tools";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const menu_data: MenuCategory[] = await loadMenuData();
    const id_query = params.query;
    let foundItem = null;
    menu_data.forEach(category => {
      const item = category.items.find(item => item.id === id_query);
      if (item) {
        foundItem = item;
      }
    });

    if (!foundItem) {
      return json({ Error: `${id_query} Not Found` }, { status: 404 });
    }

    return json(foundItem);
  } catch (error) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
