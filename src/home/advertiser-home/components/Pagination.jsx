/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { ArrowCircleLeft, ArrowCircleRight } from "@mui/icons-material";
import { loadPage } from "../functions/loadPage";

function PaginationComponent({ pages_count, current_page, auct_id, setproductsfiltered, setcurrentpage }) {

    const handlePageChange = (pageIndex) => {
        loadPage(pageIndex, auct_id, setproductsfiltered, setcurrentpage);
    };

    return (
        <div className="flex bg-white p-2 gap-6 border-[1px] border-[#d8d8d8] rounded-md">
            <ArrowCircleLeft
                sx={{ color: "#012038", fontSize: "28px" }}
                className="cursor-pointer"
                onClick={() => handlePageChange(current_page > 0 ? current_page - 1 : 0)}
            />
            {pages_count.map(page => (
                <button
                    key={page}
                    className={`text-[12px] ${page === current_page ? 'font-bold' : ''}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page + 1}
                </button>
            ))}
            <ArrowCircleRight
                sx={{ color: "#012038", fontSize: "28px" }}
                className="cursor-pointer"
                onClick={() => handlePageChange(current_page < pages_count.length - 1 ? current_page + 1 : current_page)}
            />
        </div>
    );
}

export default PaginationComponent;
