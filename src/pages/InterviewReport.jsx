import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { fallbackReport } from "../data/reportData";

function readResults() {
  try {
    const savedResults = sessionStorage.getItem("devprep-results");

    if (!savedResults) {
      return fallbackReport;
    }

    const parsedResults = JSON.parse(savedResults);

    if (!parsedResults.answers?.length) {
      return fallbackReport;
    }

    return parsedResults;
  } catch {
    return fallbackReport;
  }
}

function scoreStatus(score) {
  if (score >= 8.5) {
    return {
      label: "Excellent",
      className: "bg-green-50 text-green-700",
    };
  }

  if (score >= 7) {
    return {
      label: "Good",
      className: "bg-blue-50 text-blue-700",
    };
  }

  return {
    label: "Needs improvement",
    className: "bg-amber-50 text-amber-700",
  };
}

function InterviewReport() {
  const { interviewId } = useParams();

  const [results, setResults] = useState(readResults);
  const [isLoadingReport, setIsLoadingReport] = useState(Boolean(interviewId));
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    if (!interviewId) {
      return;
    }

    async function loadInterviewReport() {
      try {
        const response = await api.get(`/interviews/${interviewId}`);

        const interview = response.data.interview;

        const formattedResults = {
          session: {
            role: interview.targetRole,
            experience: interview.experienceLevel,
            format: interview.interviewType,
            topics: interview.topics,
          },

          completedAt: interview.completedAt || interview.createdAt,

          answers: interview.questions
            .filter((question) => question.answer && question.score !== null)
            .map((question) => ({
              questionId: question._id,
              question: question.question,
              topic: question.topic,
              answer: question.answer,
              score: question.score,
              feedback: {
                strength: question.feedback?.strength || "",
                missing: question.feedback?.missing || "",
                suggestion: question.feedback?.suggestion || "",
              },
            })),
        };

        setResults(formattedResults);
      } catch (requestError) {
        setReportError(
          requestError.response?.data?.message ||
            "Unable to load this interview report.",
        );
      } finally {
        setIsLoadingReport(false);
      }
    }

    loadInterviewReport();
  }, [interviewId]);

  const overallScore = useMemo(() => {
    const total = results.answers.reduce(
      (sum, answer) => sum + Number(answer.score || 0),
      0,
    );

    return total / results.answers.length;
  }, [results.answers]);

  const competencyScores = useMemo(() => {
    const topics = new Map();

    results.answers.forEach((answer) => {
      const topic = answer.topic || "General";

      const existing = topics.get(topic) || {
        total: 0,
        count: 0,
      };

      existing.total += Number(answer.score || 0);
      existing.count += 1;

      topics.set(topic, existing);
    });

    const colors = [
      "bg-blue-600",
      "bg-violet-600",
      "bg-emerald-600",
      "bg-amber-500",
      "bg-cyan-600",
    ];

    return Array.from(topics.entries()).map(([name, data], index) => ({
      name,
      score: Math.round((data.total / data.count) * 10),
      color: colors[index % colors.length],
    }));
  }, [results.answers]);

  const overallPercentage = Math.round(overallScore * 10);
  const status = scoreStatus(overallScore);

  const completedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(results.completedAt));

  function downloadReport() {
    const document = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = document.internal.pageSize.getWidth();
    const margin = 42;

    document.setFillColor(15, 23, 42);
    document.rect(0, 0, pageWidth, 105, "F");

    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(22);
    document.text("DevPrep AI", margin, 42);

    document.setFontSize(15);
    document.text("Interview Session Report", margin, 70);

    document.setFont("helvetica", "normal");
    document.setFontSize(9);
    document.setTextColor(203, 213, 225);
    document.text(
      `Generated ${new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      margin,
      89,
    );

    document.setTextColor(15, 23, 42);

    autoTable(document, {
      startY: 125,
      theme: "grid",
      head: [["Session", "Details"]],
      body: [
        ["Target role", results.session.role],
        ["Experience", results.session.experience],
        ["Interview format", results.session.format],
        ["Topics", results.session.topics?.join(", ") || "—"],
        [
          "Completed",
          new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(results.completedAt)),
        ],
        ["Overall score", `${overallScore.toFixed(1)}/10`],
        ["Questions evaluated", String(results.answers.length)],
      ],
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 7,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: {
          cellWidth: 135,
          fontStyle: "bold",
        },
      },
      margin: {
        left: margin,
        right: margin,
      },
    });

    let currentY = document.lastAutoTable.finalY + 24;

    document.setFont("helvetica", "bold");
    document.setFontSize(14);
    document.text("Topic performance", margin, currentY);

    autoTable(document, {
      startY: currentY + 10,
      theme: "striped",
      head: [["Topic", "Score"]],
      body: competencyScores.map((topic) => [topic.name, `${topic.score}%`]),
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 7,
        textColor: [30, 41, 59],
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
      },
      margin: {
        left: margin,
        right: margin,
      },
    });

    currentY = document.lastAutoTable.finalY + 24;

    document.setFont("helvetica", "bold");
    document.setFontSize(14);
    document.text("Question-by-question feedback", margin, currentY);

    autoTable(document, {
      startY: currentY + 10,
      theme: "grid",
      head: [["#", "Question", "Score", "Strength", "Next improvement"]],
      body: results.answers.map((answer, index) => [
        String(index + 1),
        answer.question,
        `${Number(answer.score).toFixed(1)}/10`,
        answer.feedback.strength || "—",
        answer.feedback.suggestion || "—",
      ]),
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 6,
        overflow: "linebreak",
        valign: "top",
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
      },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: {
          cellWidth: 22,
          halign: "center",
        },
        1: {
          cellWidth: 140,
        },
        2: {
          cellWidth: 45,
          halign: "center",
        },
      },
      margin: {
        left: margin,
        right: margin,
        bottom: 42,
      },
      didDrawPage: () => {
        const pageHeight = document.internal.pageSize.getHeight();

        document.setFont("helvetica", "normal");
        document.setFontSize(8);
        document.setTextColor(100, 116, 139);

        document.text("Generated by DevPrep AI", margin, pageHeight - 20);

        document.text(
          `Page ${document.internal.getNumberOfPages()}`,
          pageWidth - margin,
          pageHeight - 20,
          {
            align: "right",
          },
        );
      },
    });

    const safeRole = results.session.role
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    document.save(`devprep-${safeRole || "interview"}-report.pdf`);
  }
  if (isLoadingReport) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-9 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />

          <p className="mt-4 text-sm font-medium text-muted">
            Loading interview report...
          </p>
        </div>
      </div>
    );
  }

  if (reportError) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="font-semibold text-ink">Unable to load report</h1>

        <p className="mt-2 text-sm text-red-700">{reportError}</p>

        <Link
          to="/history"
          className="mt-5 inline-flex rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Return to History
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {reportError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {reportError}
        </div>
      )}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">
            Interview Session Report
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>{results.session.role}</span>
            <span className="hidden size-1 rounded-full bg-slate-300 sm:block" />
            <span>{results.session.format}</span>
            <span className="hidden size-1 rounded-full bg-slate-300 sm:block" />

            <span className="flex items-center gap-1.5">
              <CalendarDays size={15} />
              {completedDate}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadReport}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} />
            Download PDF
          </button>

          <Link
            to="/interview/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <RotateCcw size={17} />
            New Interview
          </Link>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <article className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-muted">Overall score</p>

          <div className="mt-5 flex items-end gap-2">
            <span className="text-6xl font-bold tracking-tight text-ink">
              {overallScore.toFixed(1)}
            </span>
            <span className="mb-2 text-xl font-semibold text-muted">/10</span>
          </div>

          <span
            className={`mt-5 inline-flex rounded-md px-3 py-1.5 text-sm font-semibold ${status.className}`}
          >
            {status.label}
          </span>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs font-medium">
              <span className="text-muted">Performance</span>
              <span className="text-ink">{overallPercentage}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          <dl className="mt-6 space-y-4 border-t border-line pt-5">
            <div className="flex justify-between gap-4">
              <dt className="text-sm text-muted">Questions evaluated</dt>
              <dd className="text-sm font-semibold text-ink">
                {results.answers.length}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-sm text-muted">Experience level</dt>
              <dd className="text-sm font-semibold text-ink">
                {results.session.experience}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <BarChart3 size={20} />
            </span>

            <div>
              <h2 className="font-semibold text-ink">Topic performance</h2>
              <p className="text-sm text-muted">
                Scores calculated from evaluated answers
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-6">
            {competencyScores.map((competency) => (
              <div key={competency.name}>
                <div className="mb-2 flex justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    {competency.name}
                  </span>
                  <span className="text-sm font-bold text-ink">
                    {competency.score}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${competency.color}`}
                    style={{ width: `${competency.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-700">
              <CheckCircle2 size={20} />
            </span>

            <div>
              <h2 className="font-semibold text-ink">Key strengths</h2>
              <p className="text-sm text-muted">
                What you communicated effectively
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            {results.answers.slice(0, 3).map((answer) => (
              <li
                key={answer.questionId}
                className="flex items-start gap-3 text-sm leading-6 text-slate-700"
              >
                <CheckCircle2
                  size={17}
                  className="mt-1 shrink-0 text-green-600"
                />
                {answer.feedback.strength}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Target size={20} />
            </span>

            <div>
              <h2 className="font-semibold text-ink">Areas for improvement</h2>
              <p className="text-sm text-muted">
                Concepts to address in your next attempt
              </p>
            </div>
          </div>

          <ul className="mt-6 space-y-4">
            {results.answers.slice(0, 3).map((answer) => (
              <li
                key={answer.questionId}
                className="flex items-start gap-3 text-sm leading-6 text-slate-700"
              >
                <AlertTriangle
                  size={17}
                  className="mt-1 shrink-0 text-amber-600"
                />
                {answer.feedback.missing}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-brand-100 bg-brand-50/50 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles size={21} />
          </span>

          <div>
            <h2 className="font-semibold text-ink">
              Comprehensive executive summary
            </h2>

            <p className="mt-3 max-w-5xl text-sm leading-7 text-slate-700">
              Your responses demonstrate a solid understanding of the selected
              topics and an ability to explain important concepts clearly. Your
              strongest answers define the concept before discussing its use. To
              improve further, include more practical examples, explicitly
              describe trade-offs, and mention edge cases where your preferred
              approach may not be appropriate.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-line p-5 md:px-6">
          <span className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <ClipboardCheck size={20} />
          </span>

          <div>
            <h2 className="font-semibold text-ink">Question breakdown</h2>
            <p className="text-sm text-muted">
              Detailed evaluation of every submitted response
            </p>
          </div>
        </div>

        <div className="divide-y divide-line">
          {results.answers.map((answer, index) => {
            const answerStatus = scoreStatus(answer.score);

            return (
              <article key={answer.questionId} className="p-5 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      {index + 1}
                    </span>

                    <div>
                      <h3 className="max-w-4xl text-sm font-semibold leading-6 text-ink">
                        {answer.question}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                        {answer.answer}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                    <span className="text-lg font-bold text-ink">
                      {answer.score}/10
                    </span>

                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${answerStatus.className}`}
                    >
                      {answerStatus.label}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Strong
                    </p>
                    <p className="mt-2 text-sm leading-6 text-green-900">
                      {answer.feedback.strength}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Next improvement
                    </p>
                    <p className="mt-2 text-sm leading-6 text-blue-900">
                      {answer.feedback.suggestion}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default InterviewReport;
