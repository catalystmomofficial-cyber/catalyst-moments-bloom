import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---------------------------------------------------------------
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "test-user" } }),
}));

vi.mock("@/hooks/useWellnessData", () => ({
  useWellnessData: () => ({
    wellnessEntries: [
      {
        mood_score: 6,
        energy_level: 5,
        stress_level: 4,
        sleep_hours: 7,
        hydration_glasses: 5,
        self_care_completed: true,
      },
    ],
    workoutSessions: [{ workout_type: "yoga" }],
  }),
}));

vi.mock("@/hooks/useContentFilter", () => ({
  useContentFilter: () => ({ currentJourney: "pregnancy", currentStage: "second-trimester" }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/services/wellnessAI", () => ({
  wellnessAI: {
    generatePersonalizedRecommendations: vi.fn().mockResolvedValue([
      {
        id: "rec-1",
        type: "mindfulness",
        title: "Try a 5-minute breathing reset to anchor your afternoon",
        description: "A short box-breathing session can lower stress and boost focus.",
        action: "Start now",
        priority: "high",
        reasoning: "Stress level is elevated relative to your weekly baseline",
        timeframe: "5 minutes",
        category: "Mindfulness",
        icon: "🧘",
      },
    ]),
    generateDynamicInsights: vi.fn().mockResolvedValue(["Hydration looking good"]),
  },
}));

const sampleRec = {
  title: "Try a 5-minute breathing reset to anchor your afternoon",
  action: "Start now",
  priority: "high",
  category: "Mindfulness",
};

// --- Import after mocks --------------------------------------------------
import { PersonalizedRecommendations } from "../PersonalizedRecommendations";

const findCardHeader = (titleEl: HTMLElement): HTMLElement => {
  // CardHeader is the parent of the CardTitle
  const header = titleEl.closest('[class*="flex"]') as HTMLElement | null;
  if (!header) throw new Error("Could not find CardHeader element");
  return header;
};

describe("PersonalizedRecommendations layout regression", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stacks the header title and refresh button on mobile and aligns them on desktop", async () => {
    render(<PersonalizedRecommendations />);

    const title = await screen.findByText("Your Personalized Recommendations");
    const header = findCardHeader(title);

    // Mobile-first: column. sm+ : row + space-between. Prevents header overlap.
    expect(header.className).toMatch(/\bflex-col\b/);
    expect(header.className).toMatch(/\bsm:flex-row\b/);
    expect(header.className).toMatch(/sm:justify-between/);
    // Gap ensures spacing when wrapping
    expect(header.className).toMatch(/\bgap-/);

    const refreshBtn = screen.getByRole("button", { name: /refresh/i });
    expect(refreshBtn).toBeInTheDocument();
    // Refresh button must not be absolutely positioned (which historically caused overlap)
    expect(refreshBtn.className).not.toMatch(/\babsolute\b/);
  });

  it("stacks recommendation meta and action button responsively (no overlap)", async () => {
    render(<PersonalizedRecommendations />);

    const recTitle = await screen.findByText(sampleRec.title);
    const card = recTitle.closest("div.rounded-lg") as HTMLElement;
    expect(card).not.toBeNull();

    // Top row: icon/title vs badges
    const topRow = card.querySelector(":scope > div:first-child") as HTMLElement;
    expect(topRow.className).toMatch(/\bflex-col\b/);
    expect(topRow.className).toMatch(/\bsm:flex-row\b/);

    // Bottom row: meta info vs action button
    const actionBtn = screen.getByRole("button", { name: sampleRec.action });
    const bottomRow = actionBtn.parentElement as HTMLElement;
    expect(bottomRow.className).toMatch(/\bflex-col\b/);
    expect(bottomRow.className).toMatch(/\bsm:flex-row\b/);
    expect(bottomRow.className).toMatch(/sm:justify-between/);

    // Action button is full-width on mobile, auto on desktop
    expect(actionBtn.className).toMatch(/\bw-full\b/);
    expect(actionBtn.className).toMatch(/\bsm:w-auto\b/);
  });

  it("renders both badges without forcing them to overflow off the card", async () => {
    render(<PersonalizedRecommendations />);
    await waitFor(() => screen.getByText(sampleRec.title));

    const priorityBadge = screen.getByText(sampleRec.priority);
    const categoryBadge = screen.getByText(sampleRec.category);
    const badgeWrap = priorityBadge.parentElement as HTMLElement;

    expect(badgeWrap).toBe(categoryBadge.parentElement);
    // Wrapping allowed so badges don't overlap the title at narrow widths
    expect(badgeWrap.className).toMatch(/\bflex-wrap\b/);
  });
});
