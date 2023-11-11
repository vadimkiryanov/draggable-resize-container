import React from 'react';

export const TaskBar: React.FC = () => {
  const [isAppActive, setIsAppActive] = React.useState<number | null>(null);

  return (
    <div className="fixed  w-full bottom-0 flex-none z-10 flex justify-center shadow-lg bg-white bg-opacity-75 border-t border-gray-300 border-opacity-20 backdrop-filter backdrop-blur-lg px-56 dark:bg-gray-800 dark:bg-opacity-75 dark:backdrop-filter dark:backdrop-blur-lg dark:border-gray-600 dark:border-opacity-20">
      <nav className="flex items-center justify-center space-x-1 h-14">
        {appsIcon.map((app, index) => {
          return (
            <button
              key={app.id}
              onClick={() => {
                isAppActive !== app.id ? setIsAppActive(app.id) : setIsAppActive(null);
              }}
              type="button"
              className="relative group focus:outline-none bg-white rounded transition duration-150 bg-opacity-0 hover:bg-opacity-50 active:bg-opacity-75 dark:bg-black dark:bg-opacity-0 dark:hover:bg-opacity-25 dark:active:bg-opacity-50"
            >
              {isAppActive === app.id && <span className="absolute bottom-0 left-0 right-0 mx-4 h-1 rounded bg-blue-500"></span>}
              <span className="block p-2 transform transition duration-75 active:scale-90">
                <img className="relative w-8 h-8" src={app.image} alt="Start Menu" />
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const appsIcon: TAppsIcon[] = [
  {
    id: 1,
    image: 'img/icons/windows.png',
  },
  {
    id: 2,
    image: 'img/icons/desktop.png',
  },
  {
    id: 3,
    image: 'img/icons/computer-dark.png',
  },
  {
    id: 4,
    image: 'img/icons/edge.png',
  },
  {
    id: 5,
    image: 'img/icons/folder.png',
  },
  {
    id: 6,
    image: 'img/icons/store.png',
  },
];

type TAppsIcon = {
  id: number;
  image: string;
};
