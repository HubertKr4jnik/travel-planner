export default function Sidebar({ elements, setElements }) {
  return (
    <aside className="relative min-h-[100vh - calc(var(--spacing) * 4)] w-70 gap-2 flex flex-col place-items-center m-4 px-4 py-6 border border-gray-700 rounded">
      <p className="font-bold">Add new components</p>
      <div className="w-full flex flex-col gap-4 h-full justify-between">
        <input
          type="button"
          value="Place to visit"
          className="w-full border border-gray-600 py-2 hover:border-white cursor-pointer rounded transition-all"
          onClick={() => {
            const timestamp = Date.now();
            setElements((prev) => ({
              ...prev,
              [timestamp]: {
                type: "place",
              },
            }));
          }}
        />
        <p className="text-center">
          Too many loose pdf files? Check out <br />
          <a
            href="https://pdf-merge-sage.vercel.app/"
            className="text-cyan-600 underline hover:text-cyan-500 transition-all"
          >
            my pdf merger
          </a>
        </p>
      </div>
    </aside>
  );
}
