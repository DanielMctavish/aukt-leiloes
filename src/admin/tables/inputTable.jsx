import SearchIcon from "@mui/icons-material/Search";

function inputTable() {
  return (
    <tr className="border-b-[.4px] border-zinc-300 ">
      <th className="px-6 py-3 lg:mt-0 mt-6 text-zinc-400 font-semibold flex lg:justify-end lg:items-center">
        <div className="relative">
          <input className="lg:bg-[#D7DDE7] bg-[#96A3BA] rounded-[4px] lg:w-full w-[320px] pl-4 pr-2 p-1" />
          <SearchIcon className="absolute top-1 left-2 text-[#FFFFFF]" />
        </div>
      </th>
    </tr>
  );
}

export default inputTable;
