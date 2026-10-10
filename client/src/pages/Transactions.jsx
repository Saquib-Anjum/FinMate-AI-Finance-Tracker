
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { CATEGORY } from "../constants/categories";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionModal from "../components/transactions/TransactionModal";

const PAGE_SIZE = 10;

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [page, setPage] = useState(1);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

 const fetchTransactions = useCallback(async () => {
  setLoading(true);

  try {
    const { data } = await api.get("/transactions/get");

    setTransactions(data.data ?? []);
  } catch (err) {
    toast.error(
      err?.response?.data?.message || "Failed to fetch transactions"
    );
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          `${transaction.title ?? ""} ${transaction.category ?? ""}`
            .toLowerCase()
            .includes(query);

        const matchesType =
          !type || transaction.type?.toLowerCase() === type.toLowerCase();

        const matchesCategory =
          !category || transaction.category === category;

        const transactionDate = transaction.date
          ? new Date(transaction.date)
          : null;

        const transactionMonth = transactionDate
          ? `${transactionDate.getUTCFullYear()}-${String(
              transactionDate.getUTCMonth() + 1
            ).padStart(2, "0")}`
          : "";

        const matchesMonth = !month || transactionMonth === month;

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesMonth
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, search, type, category, month]);

  useEffect(() => {
    setPage(1);
  }, [search, type, category, month]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / PAGE_SIZE)
  );

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const openCreateModal = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleSuccess = async () => {
    setShowModal(false);
    setEditingTransaction(null);
    await fetchTransactions();
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all your transactions
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Plus size={17} />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="relative sm:col-span-2 xl:col-span-2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
          />
        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
          aria-label="Filter by transaction type"
        >
          <option value="">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {CATEGORY.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
          aria-label="Filter by month"
        />
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""} found
        </p>

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setType("");
            setCategory("");
            setMonth("");
          }}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Clear filters
        </button>
      </div>

      {/* Table */}
      <TransactionTable
        transactions={paginatedTransactions}
        loading={loading}
        onEdit={openEditModal}
        onRefresh={fetchTransactions}
      />

      {/* Pagination */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filteredTransactions.length)} of{" "}
            {filteredTransactions.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1
              )
              .map((p, index, visiblePages) => (
                <React.Fragment key={p}>
                  {index > 0 && visiblePages[index - 1] !== p - 1 && (
                    <span className="px-1 text-slate-400">…</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-9 min-w-9 rounded-lg px-2 text-xs font-medium ${
                      page === p
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setShowModal(false);
            setEditingTransaction(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Transactions;
