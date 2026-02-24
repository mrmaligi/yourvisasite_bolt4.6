import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Users,
  Newspaper,
  Layout,
  Search,
  History,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useGlobalSearch } from '../contexts/GlobalSearchContext';
import { supabase } from '../lib/supabase';
import type { LawyerProfile } from '../types/database';

interface SearchResult {
  id: string;
  type: 'visa' | 'lawyer' | 'news' | 'page';
  title: string;
  subtitle?: string;
  url: string;
  icon?: React.ElementType;
}

const STATIC_PAGES: SearchResult[] = [
  { id: 'home', type: 'page', title: 'Home', url: '/', icon: Layout },
  { id: 'tracker', type: 'page', title: 'Tracker', url: '/tracker', icon: Layout },
  { id: 'visas', type: 'page', title: 'Find a Visa', url: '/visas', icon: FileText },
  { id: 'lawyers', type: 'page', title: 'Lawyer Directory', url: '/lawyers', icon: Users },
  { id: 'news', type: 'page', title: 'Immigration News', url: '/news', icon: Newspaper },
  { id: 'marketplace', type: 'page', title: 'Marketplace', url: '/marketplace', icon: Layout },
];

export function GlobalSearch() {
  const { isOpen, setIsOpen } = useGlobalSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchResult[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('search-history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse search history:', e);
          return [];
        }
      }
    }
    return [];
  });

  // Fetch data only when modal opens and we don't have results yet
  useEffect(() => {
    if (isOpen && results.length === 0) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Visas
      const { data: visas } = await supabase
        .from('visas')
        .select('id, name, subclass, category')
        .eq('is_active', true);

      // 2. Fetch Lawyers (only approved)
      const { data: lawyerProfiles } = await supabase
        .schema('lawyer')
        .from('profiles')
        .select('id, user_id, jurisdiction')
        .eq('verification_status', 'approved');

      let lawyersWithNames: (Pick<LawyerProfile, 'id' | 'user_id' | 'jurisdiction'> & { full_name?: string | null })[] = [];
      if (lawyerProfiles && lawyerProfiles.length > 0) {
        const userIds = lawyerProfiles.map(l => l.user_id);
        const { data: publicProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        const profileMap = new Map(publicProfiles?.map(p => [p.id, p]) || []);
        lawyersWithNames = lawyerProfiles.map(l => ({
          ...l,
          full_name: profileMap.get(l.user_id)?.full_name
        }));
      }

      // 3. Fetch News
      const { data: news } = await supabase
        .from('news_articles')
        .select('id, title, slug')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(10);

      // Transform to SearchResult
      const visaResults: SearchResult[] = (visas || []).map(v => ({
        id: v.id,
        type: 'visa',
        title: `${v.subclass} - ${v.name}`,
        subtitle: v.category,
        url: `/visas/${v.id}`,
        icon: FileText
      }));

      const lawyerResults: SearchResult[] = lawyersWithNames.map(l => ({
        id: l.id,
        type: 'lawyer',
        title: l.full_name || 'Lawyer',
        subtitle: l.jurisdiction,
        url: `/lawyers/${l.id}`,
        icon: Users
      }));

      const newsResults: SearchResult[] = (news || []).map(n => ({
        id: n.id,
        type: 'news',
        title: n.title,
        url: `/news/${n.slug}`,
        icon: Newspaper
      }));

      setResults([...STATIC_PAGES, ...visaResults, ...lawyerResults, ...newsResults]);

    } catch (error) {
      console.error('Search data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item: SearchResult) => {
    // Add to history
    const newHistory = [item, ...history.filter(h => h.id !== item.id)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    setIsOpen(false);
    navigate(item.url);
    setQuery('');
  };

  // Grouping
  const pages = results.filter(r => r.type === 'page');
  const visaItems = results.filter(r => r.type === 'visa');
  const lawyerItems = results.filter(r => r.type === 'lawyer');
  const newsItems = results.filter(r => r.type === 'news');

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      label="Global Search"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-[10vh]"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search visas, lawyers, news..."
            className="flex-1 h-14 bg-transparent outline-none text-lg text-neutral-900 dark:text-white placeholder:text-neutral-400"
          />
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-2 py-1 text-xs font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">ESC</kbd>
          </div>
        </div>

        <Command.List className="flex-1 overflow-y-auto p-2 scroll-py-2">
          {loading && (
            <div className="flex items-center justify-center py-12 text-neutral-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading...
            </div>
          )}

          {!loading && <Command.Empty className="py-12 text-center text-neutral-500">No results found.</Command.Empty>}

          {!query && history.length > 0 && (
            <Command.Group className="mb-2">
               <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Recent</div>
              {history.map((item) => (
                <Command.Item
                  key={`history-${item.id}`}
                  value={`history-${item.title}`}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-200 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 cursor-pointer"
                >
                  <History className="w-4 h-4 text-neutral-400" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-neutral-400">{item.type}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {!loading && (
            <>
              {pages.length > 0 && (
                <Command.Group className="mb-2">
                   <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Pages</div>
                  {pages.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-200 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 cursor-pointer"
                    >
                      {item.icon ? <item.icon className="w-4 h-4 text-neutral-400" /> : <Layout className="w-4 h-4 text-neutral-400" />}
                      <span className="font-medium">{item.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {visaItems.length > 0 && (
                <Command.Group className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Visas</div>
                  {visaItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.title} ${item.subtitle || ''}`}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-200 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 cursor-pointer group"
                    >
                      <FileText className="w-4 h-4 text-neutral-400 group-aria-selected:text-primary-500" />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        {item.subtitle && <div className="text-xs text-neutral-500">{item.subtitle}</div>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {lawyerItems.length > 0 && (
                <Command.Group className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Lawyers</div>
                  {lawyerItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.title} ${item.subtitle || ''}`}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-200 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 cursor-pointer group"
                    >
                      <Users className="w-4 h-4 text-neutral-400 group-aria-selected:text-primary-500" />
                      <div className="flex-1">
                        <div className="font-medium">{item.title}</div>
                        {item.subtitle && <div className="text-xs text-neutral-500">{item.subtitle}</div>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {newsItems.length > 0 && (
                <Command.Group className="mb-2">
                  <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">News</div>
                  {newsItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={item.title}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-700 dark:text-neutral-200 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800 cursor-pointer"
                    >
                      <Newspaper className="w-4 h-4 text-neutral-400" />
                      <span className="font-medium line-clamp-1">{item.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </>
          )}
        </Command.List>

        <div className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center justify-between text-xs text-neutral-500">
           <span>
             <kbd className="font-sans font-semibold">↑↓</kbd> to navigate
             <span className="mx-2">•</span>
             <kbd className="font-sans font-semibold">↵</kbd> to select
           </span>
           <span>
             <kbd className="font-sans font-semibold">esc</kbd> to close
           </span>
        </div>
      </div>
    </Command.Dialog>
  );
}
