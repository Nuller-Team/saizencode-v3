import { useEffect, useState } from 'react';
import type { MetaFunction } from "@remix-run/node";
import Modal from '../components/modal';

export const meta: MetaFunction = () => {
  return [
    { title: "Saizencode" },
    { name: "description", content: "サイゼリヤのメニューを検索することができるアプリです。" },
    { property:"og:title",content: "Saizencode" },
    { property: "og:description", content: "サイゼリヤのメニューを検索することができるアプリです。" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://saizencode-v3.nuller.jp" },
    { property: "og:image", content: "https://github.com/Nuller-Team/saizencode/blob/main/ocg/Saizencode.png?raw=true" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Saizencode" },
    { name: "twitter:description", content: "サイゼリヤのメニューを検索することができるアプリです。" },
    { name: "twitter:image", content: "https://github.com/Nuller-Team/saizencode/blob/main/ocg/Saizencode.png?raw=true" },
  ];
};

const API_ENDPOINT = 'api/menu';

export default function Index() {
  const [menu, setMenu] = useState<Category[]>([]);

  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const openModal = (category: Category, menuItem: MenuItem) => {
    setSelectedCategory(category);
    setSelectedMenuItem(menuItem);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setSelectedMenuItem(null);
  };



  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch(`${API_ENDPOINT}?query=${query}&limit=${limit}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setMenu(data);
        } else {
          console.error('API response format is not as expected:', data);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    }

    fetchMenu();
  }, [query, limit]);


  return (
    <div className="max-h-screen">
      <div className="bg-white text-white p-4 mb-4 rounded-md border-b">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mx-4">
            <div className="text-2xl font-semibold text-emerald-500">Saizencode</div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="bg-emerald-500 py-10 px-6 mx-4 rounded-3xl text-center">
          <h1 className="text-2xl font-bold text-white pb-6">サイゼリヤのメニュー検索アプリ「Saizencode」</h1>
          <a className="bg-white py-3 px-6 text-lg rounded-xl text-emerald-500 font-bold cursor-pointer">使い方はこちら</a>
        </div>
        <div>
          <div className="px-6 sticky top-0 py-[20px] w-full bg-white z-[100]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-f px-4 py-2 border-2 rounded-2xl bg-gray-100 border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-emerald-50"
              placeholder="検索"
            />
          </div>

          <div className="pb-40 animate-fadeIn">
            {menu.map((category) => (
              <div key={`${category.genre}-${category.reading}`}>
                <h4 className="text-2xl font-bold sticky top-[84px] bg-white z-[90] px-4 py-1 text-emerald-500 border-l-4 border-emerald-500 md:mx-6 mx-2">
                  {category.reading}
                </h4>
                {category.items.map((menuItem, index) => (
                  <div className="md:mx-12 mt-4 mx-4" key={index}>
                    <div
                      className="flex justify-between items-center bg-white p-4 mb-4 border-2 font-bold rounded-2xl hover:scale-[99%] hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-all z-[1]"
                      onClick={() => openModal(category, menuItem)}
                    >
                      <div className="flex items-center">
                        <div className="flex justify-center items-center text-white font-bold text-3xl mr-4">
                          {category.emoji}
                        </div>
                        <div className="w-40 md:w-80">
                          <p className="text-gray-400 text-sm font-bold">{menuItem.id}</p>
                          <span className="text-lg font-bold text-neutral-600 block truncate">{menuItem.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-neutral-600 min-w-[80px] justify-end">
                        <div>
                          <span className="text-xl font-bold">{menuItem.tax_price}</span>
                          <span className="text-sm mx-0.5 my-auto">円</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
      <Modal
        isOpen={selectedCategory !== null && selectedMenuItem !== null}
        onClose={closeModal}
        category={selectedCategory}
        menuItem={selectedMenuItem}
      />
    </div>
  );
}
