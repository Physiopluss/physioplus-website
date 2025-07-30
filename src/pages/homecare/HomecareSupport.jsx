import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllSupportTickets,
  createSupportTicket,
  getSupportTicketById,
  reopenSupportTicket,
} from "../../api/homecare/support"; // ✅ Adjust import path as needed
import { useNavigate } from "react-router-dom";

// --- Demo fallback data ---
const DEMO_TICKETS = [
  {
    _id: "1",
    email: "abhi@gmail.com",
    summary: "Please describe your problem...",
    status: "active",
  },
  {
    _id: "2",
    email: "abhi@gmail.com",
    summary: "Please describe your problem...",
    status: "closed",
    closedAt: Date.now() - 1000 * 60 * 60 * 24,
    detail:
      "PhysioPlus coins cannot be redeemed for this transaction due to specific exclusions or promotional restrictions",
  },
];

export default function HomecareSupport() {
  const userObj = JSON.parse(localStorage.getItem("homecareUser"));
  const patientId = userObj?.userId;
  const navigate = useNavigate();
  const [view, setView] = useState("form");
  const [email, setEmail] = useState(userObj?.userEmail || "");
  const [problem, setProblem] = useState("");
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch tickets
  useEffect(() => {
    if (view === "list") fetchTickets();
  }, [view]);

  async function fetchTickets() {
    setLoading(true);
    try {
      const res = await getAllSupportTickets(patientId);
      setTickets(res?.length ? res : DEMO_TICKETS);
    } catch (err) {
      console.warn("Falling back to demo tickets due to error:", err);
      setTickets(DEMO_TICKETS);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createSupportTicket({ patientId, email, summary: problem });
      toast.success("Ticket submitted");
      setProblem("");
      setView("list");
    } catch (err) {
      toast.error("Failed to submit ticket. Using demo mode.");
      setTickets([
        ...tickets,
        {
          _id: Date.now().toString(),
          email,
          summary: problem,
          status: "active",
        },
      ]);
      setView("list");
    }
  }

  async function handleTicketClick(ticket) {
    try {
      const res = await getSupportTicketById(ticket._id);
      setSelected(res || ticket);
      setView("detail");
    } catch (err) {
      toast.error("Failed to fetch details, showing demo data");
      setSelected(ticket);
      setView("detail");
    }
  }

  async function handleReopen() {
    try {
      await reopenSupportTicket(selected._id);
      toast.success("Ticket reopened");
      fetchTickets();
      setView("list");
    } catch (err) {
      toast.error("Could not reopen ticket");
    }
  }

  function canReopen(ticket) {
    if (ticket.status !== "closed" || !ticket.closedAt) return false;
    const hoursElapsed = (Date.now() - ticket.closedAt) / (1000 * 60 * 60);
    return hoursElapsed <= 48;
  }

  // FORM VIEW
  if (view === "form") {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-md">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <h2 className="font-semibold text-lg">Help & Support</h2>
          <span
            className="text-green text-sm font-medium cursor-pointer"
            onClick={() => setView("list")}
          >
            View Tickets
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Describe your problem</label>
            <textarea
              className="w-full border px-3 py-2 rounded-md h-24 resize-none"
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Write your issue..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green text-white py-2 rounded-md font-medium"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  // LIST VIEW
  if (view === "list") {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-md">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <button onClick={() => setView("form")}>
            <ArrowLeft />
          </button>
          <h2 className="font-semibold text-lg">Your Tickets</h2>
        </div>
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No tickets found.</p>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="flex justify-between items-start border-b py-3 cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                <div>
                  <p className="font-medium text-sm">{ticket.email}</p>
                  <p className="text-xs text-gray-500">{ticket.summary}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    ticket.status === "closed"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // DETAIL VIEW
  if (view === "detail" && selected) {
    const isClosed = selected.status === "closed";
    const within48h = canReopen(selected);
    return (
      <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-md">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <button onClick={() => setView("list")}>
            <ArrowLeft />
          </button>
          <h2 className="font-semibold text-lg">Ticket Detail</h2>
        </div>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs text-gray-500">Email</label>
            <p className="text-sm font-medium">{selected.email}</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500">Issue</label>
            <p className="text-sm">{selected.detail || selected.summary}</p>
          </div>
          {isClosed && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 text-sm rounded">
              {within48h
                ? "You can reopen this ticket within 48 hours."
                : "You can no longer reopen this ticket. Please create a new one."}
            </div>
          )}
        </div>
        <button
          onClick={handleReopen}
          disabled={!within48h}
          className={`w-full py-2 rounded-md font-medium ${
            within48h
              ? "bg-green text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Reopen Ticket
        </button>
      </div>
    );
  }

  return null;
}
