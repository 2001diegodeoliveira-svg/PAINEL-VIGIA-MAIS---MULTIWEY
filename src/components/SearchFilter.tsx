import { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { useDataStore } from '../stores/dataStore';
import { Search as SearchIcon, Filter as FilterIcon } from 'lucide-react';

export function SearchFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const { setSelectedMunicipality } = useAppStore();
  const { municipalities } = useDataStore();

  const filteredMunicipalities = municipalities.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleMunicipalitySelect = (code: string | null) => {
    setSelectedMunicipality(code);
    setSearchTerm('');
    setFilterOpen(false);
  };

  return (
    <div className="relative md:flex items-center gap-2">
      <div className="relative">
        <SearchIcon
          className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar município..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 md:w-40 transition-all"
        />
      </div>

      {searchTerm && filteredMunicipalities.length > 0 && (
        <div
          className={`absolute z-20 w-32 md:w-40 mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden ${filterOpen ? 'block' : 'hidden'}`}
        >
          {filteredMunicipalities.map((m) => (
            <button
              key={m.code}
              onClick={() => handleMunicipalitySelect(m.code)}
              className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-0"
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
        aria-label="Filtros"
      >
        <FilterIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

