/* eslint-disable react/prop-types */
import { ArrowBack, ArrowForward } from "@mui/icons-material";

function PaginationAdvShop({ pages_count, current_page, setcurrentpage }) {
    if (!Array.isArray(pages_count) || pages_count.length <= 1) return null;

    const ITEMS_PER_PAGE = 12;
    const totalItems = pages_count.length * ITEMS_PER_PAGE;
    const startItem = (current_page * ITEMS_PER_PAGE) + 1;
    const endItem = Math.min((current_page + 1) * ITEMS_PER_PAGE, totalItems);

    const handlePageChange = (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < pages_count.length) {
            setcurrentpage(pageIndex);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getVisiblePages = () => {
        const totalPages = pages_count.length;
        const current = current_page;
        const maxVisible = 7; // Aumentado para mostrar mais páginas
        const half = Math.floor(maxVisible / 2);

        let start = Math.max(current - half, 0);
        let end = Math.min(start + maxVisible - 1, totalPages - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(end - maxVisible + 1, 0);
        }

        return Array.from(
            { length: end - start + 1 },
            (_, i) => start + i
        );
    };

    const visiblePages = getVisiblePages();
    const showStartEllipsis = visiblePages[0] > 0;
    const showEndEllipsis = visiblePages[visiblePages.length - 1] < pages_count.length - 1;

    return (
        <div className="w-full border-t border-gray-100">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col items-center gap-4">
                    {/* Info de Paginação */}
                    <div className="text-sm text-gray-500">
                        Mostrando produtos {startItem} - {endItem} de {totalItems}
                    </div>

                    {/* Controles de Paginação */}
                    <div className="flex items-center gap-2">
                        {/* Botão Anterior */}
                        <button
                            onClick={() => handlePageChange(current_page - 1)}
                            disabled={current_page === 0}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors
                                ${current_page === 0 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <ArrowBack className="text-lg" />
                            <span className="hidden sm:inline">Anterior</span>
                        </button>

                        {/* Números das Páginas */}
                        <div className="flex items-center">
                            {/* Primeira Página */}
                            {showStartEllipsis && (
                                <>
                                    <button
                                        onClick={() => handlePageChange(0)}
                                        className="w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-700"
                                    >
                                        1
                                    </button>
                                    <span className="w-10 text-center text-gray-400">...</span>
                                </>
                            )}

                            {/* Páginas Visíveis */}
                            {visiblePages.map(pageIndex => (
                                <button
                                    key={pageIndex}
                                    onClick={() => handlePageChange(pageIndex)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors
                                        ${pageIndex === current_page
                                            ? 'bg-[#012038] text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {pageIndex + 1}
                                </button>
                            ))}

                            {/* Última Página */}
                            {showEndEllipsis && (
                                <>
                                    <span className="w-10 text-center text-gray-400">...</span>
                                    <button
                                        onClick={() => handlePageChange(pages_count.length - 1)}
                                        className="w-10 h-10 rounded-lg hover:bg-gray-100 text-gray-700"
                                    >
                                        {pages_count.length}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Botão Próximo */}
                        <button
                            onClick={() => handlePageChange(current_page + 1)}
                            disabled={current_page === pages_count.length - 1}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors
                                ${current_page === pages_count.length - 1
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <span className="hidden sm:inline">Próximo</span>
                            <ArrowForward className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginationAdvShop; 