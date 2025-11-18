"use client";

import { useEffect, useState } from "react";
import { jobs } from "@/lib/jobs";

type Application = {
  id: string;
  name: string;
  email: string;
  cover_letter?: string;
  resume_url?: string;
  job_slug: string;
  status: string | null;
  created_at: string;
};

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "interview",
  "hired",
  "rejected",
  "shortlisted",
  "task_sent",
];

function getJobTitle(slug: string) {
  const job = jobs.find((j) => j.slug === slug);
  return job ? job.title : slug;
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // For shortlist interview email
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  // For task email
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskLink, setTaskLink] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const json = await res.json();
      const data: Application[] = json.data ?? [];
      setApplications(
        data.map((app) => ({
          ...app,
          status: app.status || "new",
        }))
      );
      setSelectedIds([]);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }
      const json = await res.json();
      const updated: Application = json.data;

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...updated } : app))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} application${
          selectedIds.length > 1 ? "s" : ""
        }? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/admin/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete applications");
      }

      setApplications((prev) =>
        prev.filter((app) => !selectedIds.includes(app.id))
      );
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || "Failed to delete");
    }
  }

  // 👉 Shortlist + send interview email (now dynamic)
  async function handleShortlistSelected() {
    if (selectedIds.length === 0) {
      alert("Select at least one application to shortlist.");
      return;
    }

    if (!interviewDate || !interviewTime || !meetingLink) {
      alert("Please provide interview date, time, and meeting link.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/applications/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          interviewDate,
          interviewTime,
          meetingLink,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Failed to shortlist and send emails");
      }

      alert("Shortlist emails sent and status updated.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to shortlist and send emails");
    } finally {
      setActionLoading(false);
    }
  }

  // 👉 Send task email to selected
  async function handleSendTaskSelected() {
    if (selectedIds.length === 0) {
      alert("Select at least one application to send tasks.");
      return;
    }
    if (!taskDescription || !taskDeadline) {
      alert("Please provide task description and deadline.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/applications/send-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          taskDescription,
          taskDeadline,
          taskLink: taskLink || undefined,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Failed to send task emails");
      }

      alert("Task emails sent and status updated.");
      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to send task emails");
    } finally {
      setActionLoading(false);
    }
  }

  const allSelected =
    applications.length > 0 && selectedIds.length === applications.length;

  const disableBulkActions =
    selectedIds.length === 0 || loading || actionLoading;

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex flex-col gap-4 mb-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-heading text-3xl md:text-4xl text-neon">
            Job Applications
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0 || loading || actionLoading}
              className="px-4 py-2 rounded-md border border-red-500/60 text-red-400 text-sm disabled:opacity-40"
            >
              Delete selected
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-md border border-white/20 text-sm hover:bg-white/5"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Bulk actions bar for shortlist + task emails */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleShortlistSelected}
              disabled={disableBulkActions}
              className="px-4 py-2 rounded-md bg-electric text-black text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading ? "Working…" : "Shortlist & Send Interview Email"}
            </button>
            <button
              onClick={handleSendTaskSelected}
              disabled={disableBulkActions}
              className="px-4 py-2 rounded-md border border-electric/60 text-electric text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading ? "Working…" : "Send Task Email"}
            </button>
            <span className="text-xs text-gray-400 self-center">
              {selectedIds.length} selected
            </span>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
            {/* Interview inputs */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <p className="text-xs text-gray-400">Interview details</p>
              <input
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                placeholder="Interview date (e.g. 4 Nov 2025)"
                className="px-3 py-2 rounded-md bg-base border border-white/20 text-sm text-white w-full md:w-64"
              />
              <input
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                placeholder="Interview time (e.g. 10:20 PM)"
                className="px-3 py-2 rounded-md bg-base border border-white/20 text-sm text-white w-full md:w-48"
              />
              <input
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="Google Meet link"
                className="px-3 py-2 rounded-md bg-base border border-white/20 text-sm text-white w-full md:w-64"
              />
            </div>

            {/* Task inputs */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <p className="text-xs text-gray-400">Task details</p>
              <input
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task description"
                className="px-3 py-2 rounded-md bg-base border border-white/20 text-sm text-white w-full md:w-64"
              />
              <input
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                placeholder="Deadline (e.g. 25 Nov 2025)"
                className="px-3 py-2 rounded-md bg-base border border-white/20 text-sm text-white w-full md:w-52"
              />
              <input
                value={taskLink}
                onChange={(e) => setTaskLink(e.target.value)}
                placeholder="Task link (optional)"
                className="px-3 py-2 rounded-md bg-base border border-white/20 text-sm text-white w-full md:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-400">
          No applications received yet. Submit a test application from the
          Careers page and click “Refresh”.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10">
              <tr className="text-left">
                <th className="p-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Resume</th>
                <th className="p-2">Status</th>
                <th className="p-2">Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-white/5 hover:bg-base/70 align-top"
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app.id)}
                      onChange={() => toggleSelect(app.id)}
                    />
                  </td>
                  <td className="p-2 font-medium text-neon">{app.name}</td>
                  <td className="p-2 text-electric">{app.email}</td>
                  <td className="p-2">
                    <div className="font-medium">
                      {getJobTitle(app.job_slug)}
                    </div>
                    <div className="text-xs text-gray-500">
                      slug: {app.job_slug}
                    </div>
                    {app.cover_letter && (
                      <div className="mt-1 text-xs text-gray-400 line-clamp-2">
                        “{app.cover_letter}”
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    {app.resume_url ? (
                      <a
                        href={app.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-electric underline"
                      >
                        View
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2">
                    <select
                      value={app.status || "new"}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="bg-base border border-white/20 rounded-md px-2 py-1 text-sm"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 text-gray-400">
                    {new Date(app.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
