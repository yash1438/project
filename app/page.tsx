'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LinkData {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  lastClickedAt: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLinks = async () => {
    const res = await fetch('/api/links');
    if (res.ok) setLinks(await res.json());
  };

  useEffect(() => { fetchLinks(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, shortCode: code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setUrl('');
      setCode('');
      fetchLinks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortCode: string) => {
    if(!confirm('Are you sure?')) return;
    await fetch(`/api/links/${shortCode}`, { method: 'DELETE' });
    fetchLinks();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-indigo-600">LinkShortener</h1>
            <div className="text-sm text-gray-500">Health: /healthz</div>
        </header>

        {/* Input Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Code (Optional)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ex: mylink1"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
                disabled={loading}
                className="w-full md:w-auto bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors">
              {loading ? 'Creating...' : 'Shorten'}
            </button>
          </form>
          {error && <p className="mt-3 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">Short Link</th>
                <th className="p-4 border-b hidden sm:table-cell">Original URL</th>
                <th className="p-4 border-b">Clicks</th>
                <th className="p-4 border-b hidden md:table-cell">Last Clicked</th>
                <th className="p-4 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {links.map((link) => (
                <tr key={link.shortCode} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-indigo-600">
                    <a href={`/${link.shortCode}`} target="_blank" className="hover:underline">
                      /{link.shortCode}
                    </a>
                  </td>
                  <td className="p-4 text-gray-500 hidden sm:table-cell max-w-xs truncate" title={link.originalUrl}>
                    {link.originalUrl}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {link.clicks}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm hidden md:table-cell">
                    {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-right">
                     <Link href={`/code/${link.shortCode}`} className="text-blue-500 text-sm mr-4 hover:underline">
                        Stats
                     </Link>
                    <button 
                        onClick={() => handleDelete(link.shortCode)}
                        className="text-red-500 text-sm hover:text-red-700 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No links created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}