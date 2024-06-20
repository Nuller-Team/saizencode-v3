import { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { loadMenuData } from "../utils/tools";

export const loader: LoaderFunction = async ({ params }) => {
  try {
    const menu_data: MenuCategory[] = await loadMenuData();
    const category_query = params.query;
    const category_menu = menu_data.find(category => category.genre === category_query);

    if (!category_menu) {
      return json({ Error: `${category_query} Not Found` }, { status: 404 });
    }

    return json(category_menu);
  } catch (error) {
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
