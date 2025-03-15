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

const API_ENDPOINT = '/data/menu.json';

export default function Index() {
  const [menu, set_menu] = useState<Category[]>([]);
  const [query, set_query] = useState('');
  const [loading, set_loading] = useState(true);
  const [selected_category, set_selected_category] = useState<Category | null>(null);
  const [selected_menuitem, set_selected_menu_item] = useState<MenuItem | null>(null);
  const [initial_menu, set_initial_menu] = useState<Category[]>([]);

  const openModal = (category: Category, menu_item: MenuItem) => {
    set_selected_category(category);
    set_selected_menu_item(menu_item);
  };

  const closeModal = () => {
    set_selected_category(null);
    set_selected_menu_item(null);
  };

  useEffect(() => {
    async function fetchMenu() {
      set_loading(true);
      try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        if (Array.isArray(data)) {
          set_menu(data);
          set_initial_menu(data);
        } else {
          console.error('Format Error:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      set_loading(false);
    }

    fetchMenu();
  }, []);

  useEffect(() => {
    const filteredMenu = initial_menu.filter(category => {
      return category.items.some(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.toString().includes(query)
      );
    });
    set_menu(filteredMenu);
  }, [query, initial_menu]);

  return (
    <div className="max-h-screen">
      <div className="bg-white text-white p-4 mb-4 rounded-md border-b">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mx-4">
            <div><img src="logo.webp" className="w-60"></img></div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="bg-emerald-500 py-10 px-6 mx-4 rounded-3xl text-center">
          <h1 className="text-2xl font-bold text-white pb-6">サイゼリヤのメニュー検索アプリ「Saizencode」</h1>
          <a className="bg-white py-3 px-6 text-lg rounded-xl text-emerald-500 font-bold cursor-not-allowed opacity-80">使い方はこちら(準備中)</a>
        </div>
        <div>
          <div className="px-6 sticky top-0 py-[20px] w-full bg-white z-[100]">
            <input
              type="text"
              value={query}
              onChange={(e) => set_query(e.target.value)}
              className="w-full h-f px-4 py-2 border-2 rounded-2xl bg-gray-100 border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-emerald-50"
              placeholder="検索"
            />
          </div>

          {loading ? (
            <div className="pb-40">
              <div className="animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold sticky top-[84px] bg-white z-[90] px-4 py-1 text-gray-300 border-l-4 border-gray-300 md:mx-6 mx-2 h-8 w-1/2">
                      <div className="flex items-center text-gray-300 min-w-[80px] justify-end bg-gray-300 rounded-full h-8 w-20"></div>
                    </div>
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="flex justify-between items-center bg-white p-4 mb-4 border-2 rounded-2xl mt-4 md:mx-12 mx-4">
                        <div className="flex items-center">
                          <div className="flex justify-center items-center text-gray-300 font-bold text-3xl mr-4 bg-gray-300 rounded-full w-12 h-12"></div>
                          <div className="w-40 md:w-80">
                            <p className="text-gray-300 text-sm font-bold bg-gray-300 rounded h-4 w-1/2"></p>
                            <span className="text-lg font-bold text-gray-300 block truncate bg-gray-300 rounded h-6 mt-2"></span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-300 min-w-[80px] justify-end bg-gray-300 rounded-full h-8 w-20"></div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-40 animate-fadeIn">
              {menu.map((category) => (
                <div key={`${category.genre}-${category.reading}`}>
                  <h4 className="text-2xl font-bold sticky top-[84px] bg-white z-[90] px-4 py-1 text-emerald-500 border-l-4 border-emerald-500 md:mx-6 mx-2">
                    {category.reading}
                  </h4>
                  {category.items.map((menu_item, index) => (
                    <div className="md:mx-12 mt-4 mx-4" key={index}>
                      <div
                        className="flex justify-between items-center bg-white p-4 mb-4 border-2 font-bold rounded-2xl hover:scale-[99%] hover:bg-emerald-50 hover:border-emerald-500 cursor-pointer transition-all z-[1]"
                        onClick={() => openModal(category, menu_item)}
                      >
                        <div className="flex items-center">
                          <div className="flex justify-center items-center text-white font-bold text-3xl mr-4">
                            {category.emoji}
                          </div>
                          <div className="w-40 md:w-80">
                            <p className="text-gray-400 text-sm font-bold">{menu_item.id}</p>
                            <span className="text-lg font-bold text-neutral-600 block truncate">{menu_item.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-neutral-600 min-w-[80px] justify-end">
                          <div>
                            <span className="text-xl font-bold">{menu_item.tax_price}</span>
                            <span className="text-sm mx-0.5 my-auto">円</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={selected_category !== null && selected_menuitem !== null}
        on_close={closeModal}
        category={selected_category}
        menuItem={selected_menuitem}
      />
    </div>
  );
}