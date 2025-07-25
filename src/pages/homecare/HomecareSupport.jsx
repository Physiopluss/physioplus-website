import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

// Mocked ticket demo data
const DUMMY_TICKETS = [
  {
    id: 1,
    email: "abhi@gmail.com",
    summary: "Please describe your problem...",
    status: "active",
  },
  {
    id: 2,
    email: "abhi@gmail.com",
    summary: "Please describe your problem...",
    status: "closed",
    closedAt: Date.now() - 1000 * 60 * 60 * 24, // closed 24h ago
    detail:
      "PhysioPlus coins cannot be redeemed for this transaction due to specific exclusions or promotional restrictions",
  },
  {
    id: 3,
    email: "abhi@gmail.com",
    summary: "Please describe your problem...",
    status: "active",
  },
  {
    id: 4,
    email: "abhi@gmail.com",
    summary: "Please describe your problem...",
    status: "active",
  },
];

export default function HomecareSupport() {
  // demo view state: form | list | detail
  const [view, setView] = useState("form");
  // form inputs
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  // simulated ticket list and selected ticket
  const [tickets, setTickets] = useState(DUMMY_TICKETS);
  const [selected, setSelected] = useState(null);

  // helpers to simulate ticket detail scenarios
  function handleSubmit(e) {
    e.preventDefault();
    // Add new demo ticket as 'active'
    setTickets([
      ...tickets,
      {
        id: Date.now(),
        email,
        summary: problem,
        status: "active",
      },
    ]);
    setView("list");
    setEmail("");
    setProblem("");
  }

  function handleTicketClick(ticket) {
    setSelected(ticket);
    setView("detail");
  }

  function handleReopen() {
    // simulate reopening by changing status
    setTickets(
      tickets.map((t) =>
        t.id === selected.id ? { ...t, status: "active" } : t
      )
    );
    setView("list");
  }

  // used to demonstrate 48 hours logic for reopening
  function canReopen(ticket) {
    if (ticket.status !== "closed") return false;
    if (!ticket.closedAt) return false;
    const now = Date.now();
    const hoursElapsed = (now - ticket.closedAt) / (1000 * 60 * 60);
    return hoursElapsed < 48;
  }

  // Render logic for each "screen"
  // =========== 1. Ticket Submit Form ===========
  if (view === "form")
    return (
      <div className=" bg-white w-full md:max-w-4xl flex flex-col justify-center mx-auto md:my-10 h-auto md:h-screen rounded-md py-4 ">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button onClick={() => {}} className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">
            Help & Support
          </h1>
          <span
            className="text-green text-sm font-medium pr-2 cursor-pointer"
            onClick={() => setView("list")}
          >
            Ticket
          </span>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-4 pt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Write a detail about your problem
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none h-28 outline-none"
              placeholder="Please describe your problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
            />
          </div>
        </form>
        {/* Submit button */}
        <div className="p-4 border-t border-gray-100">
          <button
            type="submit"
            className="w-full bg-green text-white font-medium py-3 rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  // =========== 2. View Tickets ===========
  if (view === "list")
    return (
      <div className="bg-white w-full md:max-w-4xl flex flex-col justify-center mx-auto md:my-10 h-auto md:h-screen rounded-md py-4 ">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button onClick={() => setView("form")} className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">
            View Tickets
          </h1>
          <span className="text-green-600 text-sm font-medium pr-2"> </span>
        </div>
        <div className="flex flex-col px-4 py-4 space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex items-center gap-3 py-2 border-b cursor-pointer"
              onClick={() => handleTicketClick(ticket)}
            >
              <div>
                <span className="bg-green-100 text-green-700 rounded-full p-2 text-xs mr-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="10" fill="#C6F7E2" />
                    <text x="7" y="15" fontSize="10" fill="#069669">
                      ?
                    </text>
                  </svg>
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{ticket.email}</div>
                <div className="text-xs text-gray-500 truncate">
                  {ticket.summary}
                </div>
              </div>
              <div className="ml-auto">
                {ticket.status === "active" ? (
                  <span className="bg-green/10 text-green text-xs px-2 py-1 rounded">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Closed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // =========== 3 & 4. View Ticket Detail ===========
  if (view === "detail" && selected) {
    const isClosed = selected.status === "closed";
    const within48h = isClosed && canReopen(selected);
    return (
      <div className="bg-white w-full md:max-w-4xl flex flex-col justify-center mx-auto md:my-10 h-auto md:h-screen rounded-md py-4 ">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <button onClick={() => setView("list")} className="p-1">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">
            View Ticket
          </h1>
          <span className="pr-2"></span>
        </div>
        <div className="px-4 py-6">
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <div className="text-sm font-medium">{selected.email}</div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              Issue Described
            </label>
            <div className="text-sm">
              {selected.detail || "Please describe your problem..."}
            </div>
          </div>
          {/* YELLOW INFO BOX  */}
          {isClosed ? (
            <div className="bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 p-3 rounded mb-4 text-xs">
              {within48h
                ? "Note: You can reopen this ticket within 48 hours of its closure."
                : "Note: To raise these concern again, you’ll need to create a new ticket."}
            </div>
          ) : null}
        </div>
        <div className="mt-auto px-4 pb-4">
          {/* BOTTOM BUTTON, enabled/disabled depending on closed+48h */}
          {isClosed ? (
            <button
              type="button"
              disabled={!within48h}
              className={`w-full py-3 rounded-md font-medium ${
                within48h
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={within48h ? handleReopen : undefined}
            >
              Reopen Ticket
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-md font-medium bg-gray-200 text-gray-500"
            >
              Reopen Ticket
            </button>
          )}
        </div>
      </div>
    );
  }
  return null;
}
