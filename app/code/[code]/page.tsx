'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    fetch(`/api/links/${code}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [code]);

  if (loading) return <div className="p-8 text-center">Loading stats...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Link not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full border border-gray-200">
        <div className="mb-6">
            <Link href="/" className="text-indigo-600 hover:underline text-sm">&larr; Back to Dashboard</Link>
        </div>
        <h1 className="text-2xl font-bold mb-4">Stats for <span className="text-indigo-600">/{data.shortCode}</span></h1>
        
        <div className="space-y-4">
            <div>
                <label className="text-xs uppercase text-gray-500 font-semibold">Original URL</label>
                <p className="break-all text-gray-800">{data.originalUrl}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                    <label className="text-xs uppercase text-blue-500 font-semibold">Total Clicks</label>
                    <p className="text-3xl font-bold text-blue-700">{data.clicks}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                    <label className="text-xs uppercase text-gray-500 font-semibold">Created At</label>
                    <p className="text-sm text-gray-700">{new Date(data.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}