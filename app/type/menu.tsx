
interface MenuItem {
  id: number;
  name: string;
  tax_price: number;
}

interface Category {
  genre: string;
  reading: string;
  emoji: string;
  items: MenuItem[];
}
