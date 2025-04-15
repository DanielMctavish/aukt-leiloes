import PropTypes from 'prop-types';

function TabNavigation({ activeTab, handleTabChange }) {
    const tabs = [
        { id: 'info', label: 'Informações Pessoais' },
        { id: 'avatar', label: 'Avatar' },
        { id: 'password', label: 'Segurança' },
        { id: 'email', label: 'Email' }
    ];
    
    return (
        <div className="flex border-b border-gray-100 overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap 
                    ${activeTab === tab.id 
                        ? 'text-green-600 border-b-2 border-green-500' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

TabNavigation.propTypes = {
    activeTab: PropTypes.string.isRequired,
    handleTabChange: PropTypes.func.isRequired
};

export default TabNavigation; 