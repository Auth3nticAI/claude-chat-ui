"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Book, STATUS_LABELS, STATUS_STYLES } from "../../../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function BookDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const bookId = parseInt(id, 10);
    const router = useRouter();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${API_URL}/books/${bookId}`);
                if (!res.ok) {
                    throw new Error(
                        res.status === 404 ? "Book not found" : `HTTP ${res.status}`
                    );
                }
                const data = (await res.json()) as Book;
                if (!cancelled) {
                    setBook(data);
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load");
                    setLoading(false);
                }
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [bookId]);

    async function updateStatus(newStatus: Book["status"]) {
        if (!book) return;
        setUpdating(true);
        try {
            const res = await fetch(`${API_URL}/books/${bookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const updated = (await res.json()) as Book;
            setBook(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setUpdating(false);
        }
    }

    async function updateRating(rating: number) {
        if (!book) return;
        setUpdating(true);
        try {
            const res = await fetch(`${API_URL}/books/${bookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating }),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const updated = (await res.json()) as Book;
            setBook(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed");
        } finally {
            setUpdating(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`Delete "${book?.title}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            const res = await fetch(`${API_URL}/books/${bookId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            router.push("/books");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <section className="max-w-2xl mx-auto px-6 py-12">
                <p className="text-slate-500">Loading book...</p>
            </section>
        );
    }

    if (error || !book) {
        return (
            <section className="max-w-2xl mx-auto px-6 py-12">
                <Link
                    href="/books"
                    className="text-sm text-slate-600 hover:text-blue-700"
                >
                    &larr; Back to books
                </Link>
                <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                    {error ?? "Book not found"}
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-2xl mx-auto px-6 py-12">
            <Link
                href="/books"
                className="text-sm text-slate-600 hover:text-blue-700 transition-colors"
            >
                &larr; Back to books
            </Link>

            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-8">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        {book.title}
                    </h1>
                    <span
                        className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[book.status]}`}
                    >
                        {STATUS_LABELS[book.status]}
                    </span>
                </div>
                <p className="text-slate-600 mb-8">by {book.author}</p>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-700 mb-2">
                            Change status
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {(["want_to_read", "reading", "read"] as const).map(
                                (s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => updateStatus(s)}
                                        disabled={updating || book.status === s}
                                        className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${
                                            book.status === s
                                                ? "bg-blue-700 text-white border-blue-700"
                                                : "bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {STATUS_LABELS[s]}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {book.status === "read" && (
                        <div>
                            <h2 className="text-sm font-semibold text-slate-700 mb-2">
                                Rating
                            </h2>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => updateRating(r)}
                                        disabled={updating}
                                        className={`text-2xl transition-colors ${
                                            book.rating !== null && r <= book.rating
                                                ? "text-amber-500"
                                                : "text-slate-300 hover:text-amber-400"
                                        } disabled:cursor-not-allowed`}
                                        aria-label={`Rate ${r} stars`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-6 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {deleting ? "Deleting..." : "Delete this book"}
                    </button>
                </div>
            </div>
        </section>
    );
}
