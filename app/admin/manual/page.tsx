"use client";

import { useState } from "react";
import {
    BookOpen,
    LayoutDashboard,
    Smile,
    Files,
    FolderOpen,
    ListTodo,
    Trophy,
    Users,
    Settings,
    Sparkles,
    Gamepad2,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Search,
    Code2,
    Shield,
    Zap,
    Pin,
    Star,
    TrendingUp,
    Calendar,
    Upload,
    Download,
    Eye,
    GripVertical,
    AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Collapsible section component ──────────────────────────────────────
function Section({
    id,
    icon: Icon,
    title,
    color,
    children,
    openSections,
    toggle,
}: {
    id: string;
    icon: any;
    title: string;
    color: string;
    children: React.ReactNode;
    openSections: Set<string>;
    toggle: (id: string) => void;
}) {
    const isOpen = openSections.has(id);

    return (
        <div className="glass-card border border-[var(--border)] overflow-hidden">
            <button
                onClick={() => toggle(id)}
                className="w-full flex items-center gap-3 p-4 sm:p-5 hover:bg-[var(--secondary)]/30 transition-colors text-left"
            >
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h2 className="flex-1 text-lg font-semibold text-[var(--foreground)]">
                    {title}
                </h2>
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)]" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--muted-foreground)]" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 sm:px-5 pb-5 space-y-4 text-sm text-[var(--foreground)] leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Small helper components ────────────────────────────────────────────
function Tip({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
            <Zap className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="text-blue-300">{children}</span>
        </div>
    );
}

function Warning({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
            <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
            <span className="text-orange-300">{children}</span>
        </div>
    );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
    return (
        <div className="flex gap-3 items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold flex items-center justify-center">
                {n}
            </span>
            <span>{children}</span>
        </div>
    );
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <code className="px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--primary)] text-xs font-mono">
            {children}
        </code>
    );
}

// ── Main page ──────────────────────────────────────────────────────────
export default function AdminManualPage() {
    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(["overview"])
    );
    const [search, setSearch] = useState("");

    const toggle = (id: string) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const expandAll = () => {
        setOpenSections(
            new Set(sections.map((s) => s.id))
        );
    };

    const collapseAll = () => {
        setOpenSections(new Set());
    };

    // Section definitions (for expand/collapse all + search filtering)
    const sections = [
        { id: "overview", title: "Overview & Navigation", keywords: "overview navigation sidebar dashboard home" },
        { id: "dashboard", title: "Dashboard", keywords: "dashboard stats activity quick actions" },
        { id: "content", title: "Content Management", keywords: "content cards create edit delete verse devotional article prayer motivational drag reorder filter search preview" },
        { id: "card-types", title: "Card Types Reference", keywords: "verse devotional article prayer motivational quiz game meme fact riddle joke thought provoking visual share marketing milestone upgrade journal prompt" },
        { id: "ai-generation", title: "AI Content Generation", keywords: "ai generate sparkles theme auto fill" },
        { id: "quiz-generator", title: "Quiz Generator", keywords: "quiz generate ai import export json questions" },
        { id: "game-generator", title: "Game & AR Game Generator", keywords: "game ar augmented reality html raw sandbox iframe blob" },
        { id: "sandbox", title: "Sandboxed HTML Games (Security)", keywords: "sandbox iframe blob csp security isolation soulsync bridge postmessage" },
        { id: "categories", title: "Categories", keywords: "categories bento grid discover slug emoji gradient" },
        { id: "featured", title: "Featured, Trending & Pinning", keywords: "featured trending pin pinned position duration calendar dates" },
        { id: "moods", title: "Moods", keywords: "moods emoji color sort order" },
        { id: "tasks", title: "Tasks", keywords: "tasks daily weekly challenge points drag reorder" },
        { id: "levels", title: "Levels & XP", keywords: "levels xp experience badge points reward" },
        { id: "users", title: "User Management", keywords: "users membership admin points streak edit delete" },
        { id: "settings", title: "Settings & Configuration", keywords: "settings login rewards streak milestones weekend bonus share rewards default" },
        { id: "api", title: "API Routes Reference", keywords: "api routes endpoints generate-content generate-quiz generate-ar-game categories settings feed" },
    ];

    const filteredSections = search.trim()
        ? sections.filter(
              (s) =>
                  s.title.toLowerCase().includes(search.toLowerCase()) ||
                  s.keywords.toLowerCase().includes(search.toLowerCase())
          )
        : sections;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] flex items-center gap-3">
                        <BookOpen className="w-7 h-7 text-[var(--primary)]" />
                        Admin Manual
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                        Complete guide to every feature in the Soul Sync admin panel
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={expandAll}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--muted-foreground)] transition-colors"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--muted-foreground)] transition-colors"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search manual... (e.g. quiz, sandbox, featured)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm text-[var(--foreground)]"
                />
            </div>

            {/* Sections */}
            <div className="space-y-3">
                {/* ── 1. Overview ── */}
                {filteredSections.find((s) => s.id === "overview") && (
                    <Section id="overview" icon={BookOpen} title="Overview & Navigation" color="bg-[var(--primary)]/20 text-[var(--primary)]" openSections={openSections} toggle={toggle}>
                        <p>
                            The admin panel is accessible at <Kbd>/admin</Kbd>. Only users with <Kbd>is_admin: true</Kbd> in their profile can access it. Non-admins are redirected to the home page.
                        </p>
                        <p className="font-medium mt-2">Sidebar Navigation</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                            {[
                                { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
                                { icon: Smile, label: "Moods", path: "/admin/moods" },
                                { icon: Files, label: "Content", path: "/admin/cards" },
                                { icon: FolderOpen, label: "Categories", path: "/admin/categories" },
                                { icon: ListTodo, label: "Tasks", path: "/admin/tasks" },
                                { icon: Trophy, label: "Levels", path: "/admin/levels" },
                                { icon: Users, label: "Users", path: "/admin/users" },
                                { icon: Settings, label: "Settings", path: "/admin/settings" },
                            ].map((item) => (
                                <div key={item.path} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--secondary)]/30 text-xs">
                                    <item.icon className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                                    <span>{item.label}</span>
                                    <span className="text-[var(--muted-foreground)] ml-auto hidden sm:inline">{item.path}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-2">
                            On mobile, tap the hamburger menu (top-left) to open the sidebar. The sidebar auto-closes when you navigate.
                        </p>
                    </Section>
                )}

                {/* ── 2. Dashboard ── */}
                {filteredSections.find((s) => s.id === "dashboard") && (
                    <Section id="dashboard" icon={LayoutDashboard} title="Dashboard" color="bg-indigo-500/20 text-indigo-400" openSections={openSections} toggle={toggle}>
                        <p>The dashboard shows at-a-glance stats and quick actions.</p>
                        <p className="font-medium">Stats Cards</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li><strong className="text-[var(--foreground)]">Total Users</strong> &mdash; registered user count</li>
                            <li><strong className="text-[var(--foreground)]">Active Content</strong> &mdash; published cards</li>
                            <li><strong className="text-[var(--foreground)]">Total Moods</strong> &mdash; mood options available</li>
                            <li><strong className="text-[var(--foreground)]">Total Tasks</strong> &mdash; all tasks across types</li>
                            <li><strong className="text-[var(--foreground)]">Levels</strong> &mdash; progression levels created</li>
                        </ul>
                        <p className="font-medium mt-2">Recent Activity</p>
                        <p className="text-[var(--muted-foreground)]">Shows the 5 most recent user registrations with relative timestamps.</p>
                        <p className="font-medium mt-2">Quick Actions</p>
                        <p className="text-[var(--muted-foreground)]">Shortcut buttons to jump directly to Moods, Content, Tasks, Levels, and Users pages.</p>
                    </Section>
                )}

                {/* ── 3. Content Management ── */}
                {filteredSections.find((s) => s.id === "content") && (
                    <Section id="content" icon={Files} title="Content Management" color="bg-green-500/20 text-green-400" openSections={openSections} toggle={toggle}>
                        <p>The Content page (<Kbd>/admin/cards</Kbd>) is the heart of the CMS. It manages all card content shown in the user feed.</p>

                        <p className="font-medium">Viewing Content</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li><strong className="text-[var(--foreground)]">Search</strong> &mdash; filter cards by title</li>
                            <li><strong className="text-[var(--foreground)]">Type Filter</strong> &mdash; click type buttons to show only that type (21 types available)</li>
                            <li><strong className="text-[var(--foreground)]">Table View</strong> (desktop) shows title, type badge, status, points, membership level, and actions</li>
                            <li><strong className="text-[var(--foreground)]">Card View</strong> (mobile) shows compact cards with swipe-friendly layout</li>
                        </ul>

                        <p className="font-medium mt-3">Creating Content</p>
                        <Step n={1}>Click the <strong>&quot;Add Content&quot;</strong> button (top-right)</Step>
                        <Step n={2}>Select the content type from the dropdown</Step>
                        <Step n={3}>Fill in the required fields (title, content-specific fields)</Step>
                        <Step n={4}>Optionally set category, featured/trending flags, pin settings</Step>
                        <Step n={5}>Click <strong>&quot;Create&quot;</strong> to save</Step>

                        <p className="font-medium mt-3">Editing Content</p>
                        <p className="text-[var(--muted-foreground)]">Click the <strong>Edit</strong> (pencil) button on any card. The same form opens pre-filled with existing data. For games and quizzes, the HTML/JSON is loaded from the games/quizzes tables.</p>

                        <p className="font-medium mt-3">Drag-and-Drop Reordering</p>
                        <p className="text-[var(--muted-foreground)]">
                            Grab the <GripVertical className="w-3 h-3 inline" /> handle on any row to drag and reorder cards. The new order is saved automatically. This controls the default feed order.
                        </p>

                        <p className="font-medium mt-3">Preview</p>
                        <p className="text-[var(--muted-foreground)]">
                            Click the <Eye className="w-3 h-3 inline" /> eye icon to preview a card. The preview shows a phone-frame mockup and the raw card data (JSON).
                        </p>

                        <p className="font-medium mt-3">Deleting Content</p>
                        <Warning>Deletion is permanent. A confirmation dialog appears before deletion. Associated game/quiz data is not auto-deleted; clean those up separately if needed.</Warning>

                        <p className="font-medium mt-3">Action Buttons (Top)</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li><Sparkles className="w-3 h-3 inline text-purple-400" /> <strong className="text-[var(--foreground)]">AI Quiz Generator</strong> &mdash; opens the quiz generation modal</li>
                            <li><Gamepad2 className="w-3 h-3 inline text-blue-400" /> <strong className="text-[var(--foreground)]">AR Game Generator</strong> &mdash; opens the AR/HTML game creation modal</li>
                        </ul>
                    </Section>
                )}

                {/* ── 4. Card Types ── */}
                {filteredSections.find((s) => s.id === "card-types") && (
                    <Section id="card-types" icon={HelpCircle} title="Card Types Reference" color="bg-purple-500/20 text-purple-400" openSections={openSections} toggle={toggle}>
                        <p>There are 21 content types, grouped below.</p>

                        <p className="font-medium mt-2">Core Content</p>
                        <div className="grid gap-2">
                            {[
                                { type: "verse", desc: "Bible verse with reference, text, and optional reflection" },
                                { type: "devotional", desc: "Daily devotional with scripture, body text, and prayer" },
                                { type: "article", desc: "Long-form article with body text and source URL" },
                                { type: "prayer", desc: "Prayer text with prayer_type (protection, guidance, anxiety, etc.)" },
                                { type: "motivational", desc: "Motivational quote with author attribution" },
                            ].map((t) => (
                                <div key={t.type} className="flex gap-3 p-2 rounded-lg bg-[var(--secondary)]/20">
                                    <Kbd>{t.type}</Kbd>
                                    <span className="text-[var(--muted-foreground)]">{t.desc}</span>
                                </div>
                            ))}
                        </div>

                        <p className="font-medium mt-3">Interactive</p>
                        <div className="grid gap-2">
                            {[
                                { type: "quiz", desc: "Multi-question quiz. Uses raw JSON editor or AI generator. Stored in quizzes/quiz_questions tables." },
                                { type: "game", desc: "HTML game. Uses raw HTML editor or AI AR generator. Stored in games table. Runs in sandboxed iframe." },
                                { type: "riddle", desc: "Riddle with question, hint, and revealable answer" },
                                { type: "joke", desc: "Two-part joke with revealable punchline" },
                            ].map((t) => (
                                <div key={t.type} className="flex gap-3 p-2 rounded-lg bg-[var(--secondary)]/20">
                                    <Kbd>{t.type}</Kbd>
                                    <span className="text-[var(--muted-foreground)]">{t.desc}</span>
                                </div>
                            ))}
                        </div>

                        <p className="font-medium mt-3">Engagement & Social</p>
                        <div className="grid gap-2">
                            {[
                                { type: "meme", desc: "Meme with top/bottom text overlay on an image" },
                                { type: "fact", desc: "Interesting fact with optional source attribution" },
                                { type: "thought_provoking", desc: "Deep question or thought-provoking quote" },
                                { type: "visual", desc: "Visual/calm content, includes breathing exercise animations" },
                                { type: "share_card", desc: "Shareable card with customisable message" },
                                { type: "task", desc: "Daily task card (linked to the tasks system)" },
                            ].map((t) => (
                                <div key={t.type} className="flex gap-3 p-2 rounded-lg bg-[var(--secondary)]/20">
                                    <Kbd>{t.type}</Kbd>
                                    <span className="text-[var(--muted-foreground)]">{t.desc}</span>
                                </div>
                            ))}
                        </div>

                        <p className="font-medium mt-3">Special / System Cards</p>
                        <div className="grid gap-2">
                            {[
                                { type: "marketing", desc: "Promotional card with CTA button. Can be pinned with date range." },
                                { type: "milestone", desc: "Celebratory card shown when a user hits a milestone." },
                                { type: "upgrade", desc: "Prompts freemium (level 1) users to upgrade. Can be pinned." },
                                { type: "journal_prompt", desc: "Journal prompt shown to users who haven't journaled recently." },
                                { type: "journal", desc: "Alias for journal_prompt in the feed system." },
                            ].map((t) => (
                                <div key={t.type} className="flex gap-3 p-2 rounded-lg bg-[var(--secondary)]/20">
                                    <Kbd>{t.type}</Kbd>
                                    <span className="text-[var(--muted-foreground)]">{t.desc}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* ── 5. AI Content Generation ── */}
                {filteredSections.find((s) => s.id === "ai-generation") && (
                    <Section id="ai-generation" icon={Sparkles} title="AI Content Generation" color="bg-pink-500/20 text-pink-400" openSections={openSections} toggle={toggle}>
                        <p>
                            When creating or editing a card, click the <Sparkles className="w-3 h-3 inline text-pink-400" /> <strong>&quot;Generate with AI&quot;</strong> button
                            to auto-fill content based on a theme.
                        </p>
                        <p className="font-medium mt-2">Supported Types</p>
                        <p className="text-[var(--muted-foreground)]">
                            AI generation works for: <Kbd>verse</Kbd>, <Kbd>devotional</Kbd>, <Kbd>article</Kbd>, <Kbd>prayer</Kbd>, <Kbd>motivational</Kbd>, and <Kbd>task</Kbd>.
                        </p>
                        <p className="font-medium mt-2">How to Use</p>
                        <Step n={1}>Select the card type in the form</Step>
                        <Step n={2}>Enter a theme/topic in the &quot;AI Theme&quot; field (e.g., &quot;forgiveness&quot;, &quot;hope in trials&quot;)</Step>
                        <Step n={3}>Click <strong>&quot;Generate with AI&quot;</strong></Step>
                        <Step n={4}>The form fields are auto-filled. Review and edit as needed.</Step>
                        <Step n={5}>Save the card</Step>
                        <Tip>The AI uses Google Gemini. Generation takes 3-10 seconds. You can regenerate as many times as you like before saving.</Tip>
                    </Section>
                )}

                {/* ── 6. Quiz Generator ── */}
                {filteredSections.find((s) => s.id === "quiz-generator") && (
                    <Section id="quiz-generator" icon={HelpCircle} title="Quiz Generator" color="bg-purple-500/20 text-purple-400" openSections={openSections} toggle={toggle}>
                        <p>Create quizzes via AI generation, raw JSON import, or manual editing.</p>

                        <p className="font-medium mt-2">Method 1: AI Generation</p>
                        <Step n={1}>Open the Quiz Generator from the Content page (purple <Sparkles className="w-3 h-3 inline" /> button)</Step>
                        <Step n={2}>Enter a topic (e.g., &quot;Parables of Jesus&quot;)</Step>
                        <Step n={3}>Choose number of questions (3, 5, 7, or 10) and difficulty</Step>
                        <Step n={4}>Click <strong>&quot;Generate Quiz with AI&quot;</strong></Step>
                        <Step n={5}>Review generated questions &mdash; edit text, options, correct answer, explanations</Step>
                        <Step n={6}>Add/remove questions as needed, then save</Step>

                        <p className="font-medium mt-3">Method 2: JSON Import</p>
                        <Step n={1}>In the Quiz Generator, click <Upload className="w-3 h-3 inline" /> <strong>&quot;Import from JSON&quot;</strong></Step>
                        <Step n={2}>Paste a JSON object in this format:</Step>
                        <pre className="p-3 rounded-lg bg-[var(--secondary)]/50 text-xs font-mono overflow-x-auto">{`{
  "questions": [
    {
      "question": "What is the first book of the Bible?",
      "options": ["Genesis", "Exodus", "Leviticus", "Numbers"],
      "correct_answer": 0,
      "explanation": "Genesis means 'beginning'."
    }
  ]
}`}</pre>
                        <p className="text-[var(--muted-foreground)] mt-1"><Kbd>correct_answer</Kbd> is the 0-based index of the correct option.</p>

                        <p className="font-medium mt-3">Method 3: Raw JSON in Card Form</p>
                        <p className="text-[var(--muted-foreground)]">
                            When creating a card with type <Kbd>quiz</Kbd>, the form shows a JSON editor. Paste the same JSON format above. The editor validates JSON in real-time (red border = error).
                        </p>

                        <p className="font-medium mt-3">Exporting</p>
                        <p className="text-[var(--muted-foreground)]">
                            In the Quiz Generator review step, click <Download className="w-3 h-3 inline" /> <strong>&quot;Export&quot;</strong> to copy the quiz JSON to your clipboard.
                        </p>
                    </Section>
                )}

                {/* ── 7. Game & AR Game Generator ── */}
                {filteredSections.find((s) => s.id === "game-generator") && (
                    <Section id="game-generator" icon={Gamepad2} title="Game & AR Game Generator" color="bg-blue-500/20 text-blue-400" openSections={openSections} toggle={toggle}>
                        <p>Create games via AI-generated AR configs, raw HTML, or both.</p>

                        <p className="font-medium mt-2">Method 1: AI AR Game</p>
                        <Step n={1}>Open the AR Game Generator from the Content page (blue <Gamepad2 className="w-3 h-3 inline" /> button)</Step>
                        <Step n={2}>Enter a theme (e.g., &quot;Pop gratitude balloons&quot;)</Step>
                        <Step n={3}>Choose difficulty, then click <strong>&quot;Generate AR Game with AI&quot;</strong></Step>
                        <Step n={4}>If the AI deems it too complex, it suggests simpler alternatives</Step>
                        <Step n={5}>Review and edit AR config: type, object, color, spawn rate, game time, etc.</Step>
                        <Step n={6}>Save the AR game</Step>

                        <p className="font-medium mt-3">AR Game Types</p>
                        <div className="grid grid-cols-2 gap-2">
                            {["balloon_pop", "target_tap", "catch_game", "memory_match", "reaction_time", "spatial_puzzle"].map((t) => (
                                <div key={t} className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs">
                                    <Kbd>{t}</Kbd>
                                </div>
                            ))}
                        </div>

                        <p className="font-medium mt-3">Method 2: Raw HTML Game</p>
                        <Step n={1}>In the AR Game Generator, click <Code2 className="w-3 h-3 inline" /> <strong>&quot;Create from Raw HTML / JavaScript&quot;</strong></Step>
                        <Step n={2}>Paste your full HTML game (including CSS/JS)</Step>
                        <Step n={3}>Toggle <Eye className="w-3 h-3 inline" /> <strong>&quot;Preview&quot;</strong> to test it live in a sandboxed iframe</Step>
                        <Step n={4}>Set title, difficulty, max score, instructions</Step>
                        <Step n={5}>Save &mdash; the game is stored and rendered in a secure sandbox</Step>

                        <p className="font-medium mt-3">Method 3: Raw HTML in Card Form</p>
                        <p className="text-[var(--muted-foreground)]">
                            When creating a card with type <Kbd>game</Kbd>, the form shows an HTML editor with live preview. Same sandbox security applies.
                        </p>

                        <Tip>
                            Use <Kbd>SoulSync.postScore(n)</Kbd> to report score and <Kbd>SoulSync.complete(n)</Kbd> to signal game completion.
                            These bridge functions are auto-injected into every sandboxed game.
                        </Tip>
                    </Section>
                )}

                {/* ── 8. Sandbox Security ── */}
                {filteredSections.find((s) => s.id === "sandbox") && (
                    <Section id="sandbox" icon={Shield} title="Sandboxed HTML Games (Security)" color="bg-red-500/20 text-red-400" openSections={openSections} toggle={toggle}>
                        <p>All HTML games run inside a multi-layered security sandbox, similar to how Netflix isolates embedded content.</p>

                        <p className="font-medium mt-2">Security Layers</p>
                        <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-[var(--secondary)]/30">
                                <p className="font-medium text-red-400">1. Blob URL Isolation</p>
                                <p className="text-[var(--muted-foreground)] text-xs mt-1">
                                    HTML is converted to a Blob, then to an Object URL (<Kbd>blob:...</Kbd>). This gives the iframe its own unique origin, completely separate from your app. The game cannot read cookies, localStorage, or any DOM of the host page.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--secondary)]/30">
                                <p className="font-medium text-red-400">2. Sandbox Attribute</p>
                                <p className="text-[var(--muted-foreground)] text-xs mt-1">
                                    The iframe has <Kbd>sandbox=&quot;allow-scripts&quot;</Kbd>. Only JavaScript execution is allowed. Forms, popups, navigation, and same-origin access are all blocked.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--secondary)]/30">
                                <p className="font-medium text-red-400">3. Content Security Policy (CSP)</p>
                                <p className="text-[var(--muted-foreground)] text-xs mt-1">
                                    A strict CSP meta tag is injected. By default: no external fetch/XHR, no remote scripts, no remote images. Only inline scripts/styles and data: URIs are allowed.
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-[var(--secondary)]/30">
                                <p className="font-medium text-red-400">4. PostMessage Bridge</p>
                                <p className="text-[var(--muted-foreground)] text-xs mt-1">
                                    Communication between the game and host uses <Kbd>postMessage</Kbd>. The host validates origin. Games use the injected <Kbd>SoulSync</Kbd> bridge.
                                </p>
                            </div>
                        </div>

                        <p className="font-medium mt-3">SoulSync Bridge API</p>
                        <pre className="p-3 rounded-lg bg-[var(--secondary)]/50 text-xs font-mono overflow-x-auto">{`// Available inside every sandboxed game:
SoulSync.postScore(42);       // Report current score
SoulSync.complete(100);       // Signal game over + final score
SoulSync.postEvent("CUSTOM", { key: "value" }); // Custom event`}</pre>

                        <Warning>
                            Always test games in the preview before publishing. Games that try to access parent DOM, fetch external URLs, or open popups will be blocked silently by the sandbox.
                        </Warning>
                    </Section>
                )}

                {/* ── 9. Categories ── */}
                {filteredSections.find((s) => s.id === "categories") && (
                    <Section id="categories" icon={FolderOpen} title="Categories" color="bg-yellow-500/20 text-yellow-400" openSections={openSections} toggle={toggle}>
                        <p>Categories organise content on the <strong>Discover</strong> page (<Kbd>/discover</Kbd>) in a bento grid layout.</p>

                        <p className="font-medium mt-2">Managing Categories</p>
                        <Step n={1}>Go to <Kbd>/admin/categories</Kbd></Step>
                        <Step n={2}>Click <strong>&quot;Add Category&quot;</strong> to create, or the edit button on an existing one</Step>
                        <Step n={3}>Fill in: Display Name, Slug (URL-friendly), Emoji, Description, Color, Gradient, Icon, Sort Order</Step>
                        <Step n={4}>Toggle <strong>Active</strong> to show/hide on the Discover page</Step>

                        <p className="font-medium mt-2">Default Categories (12)</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                                "Arena (Games)", "Mind Quests (Quizzes)", "Joy Moments (Memes)",
                                "Share Cards", "Insights (Articles)", "Deep Dive (Thought Provoking)",
                                "Calm Corner (Visuals)", "Gems (Facts)", "Enigmas (Riddles)",
                                "Light Hearts (Jokes)", "Reflections (Journal)", "Boosts (Prayers)",
                            ].map((c) => (
                                <div key={c} className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs">{c}</div>
                            ))}
                        </div>

                        <p className="font-medium mt-2">Assigning Cards to Categories</p>
                        <p className="text-[var(--muted-foreground)]">
                            In the Card Form, use the <strong>Category</strong> dropdown to assign a card to a category. Cards are also auto-matched by type (e.g., <Kbd>game</Kbd> cards appear in the &quot;Arena&quot; category).
                        </p>
                    </Section>
                )}

                {/* ── 10. Featured, Trending & Pinning ── */}
                {filteredSections.find((s) => s.id === "featured") && (
                    <Section id="featured" icon={Star} title="Featured, Trending & Pinning" color="bg-amber-500/20 text-amber-400" openSections={openSections} toggle={toggle}>
                        <p>Control which cards get special placement in the feed and Discover page.</p>

                        <p className="font-medium mt-2"><Star className="w-3 h-3 inline text-amber-400" /> Featured</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li>Toggle <strong>Featured</strong> in the card form</li>
                            <li>Set <strong>Featured Start</strong> and <strong>Featured End</strong> dates to control duration</li>
                            <li>Featured cards appear in the &quot;Featured&quot; section on the Discover page and near the top of the feed (up to 3)</li>
                        </ul>

                        <p className="font-medium mt-2"><TrendingUp className="w-3 h-3 inline text-green-400" /> Trending</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li>Toggle <strong>Trending</strong> in the card form</li>
                            <li>Trending cards appear in the &quot;Trending&quot; section on Discover and in the middle of the feed (up to 3)</li>
                        </ul>

                        <p className="font-medium mt-2"><Pin className="w-3 h-3 inline text-red-400" /> Pinning</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li>Toggle <strong>Pinned</strong> in the card form</li>
                            <li>Set <strong>Pin Position</strong> (1-30) to control where in the feed it appears</li>
                            <li>Set <strong>Pin Start</strong> and <strong>Pin End</strong> dates for time-limited pinning</li>
                            <li>Pinned cards always appear at their position regardless of other feed logic</li>
                        </ul>

                        <Tip>
                            Use pinning with date ranges for time-limited campaigns (e.g., pin a marketing card for 7 days). The card automatically unpins after the end date.
                        </Tip>
                    </Section>
                )}

                {/* ── 11. Moods ── */}
                {filteredSections.find((s) => s.id === "moods") && (
                    <Section id="moods" icon={Smile} title="Moods" color="bg-cyan-500/20 text-cyan-400" openSections={openSections} toggle={toggle}>
                        <p>Moods affect the user&apos;s feed personalisation. Users select a mood and the feed re-sorts to prioritise relevant content.</p>

                        <p className="font-medium mt-2">Managing Moods</p>
                        <Step n={1}>Go to <Kbd>/admin/moods</Kbd></Step>
                        <Step n={2}>Click <strong>&quot;Add Mood&quot;</strong> or edit an existing one</Step>
                        <Step n={3}>Set: Name, Emoji, Color (hex), Description, Sort Order, Active status</Step>

                        <p className="text-[var(--muted-foreground)] mt-2">
                            Moods are displayed as colour-coded cards. The sort order controls the display order in the user mood picker. Inactive moods are hidden from users but preserved in the database.
                        </p>
                    </Section>
                )}

                {/* ── 12. Tasks ── */}
                {filteredSections.find((s) => s.id === "tasks") && (
                    <Section id="tasks" icon={ListTodo} title="Tasks" color="bg-teal-500/20 text-teal-400" openSections={openSections} toggle={toggle}>
                        <p>Tasks are actionable items users complete for points. Three types exist.</p>

                        <p className="font-medium mt-2">Task Types</p>
                        <div className="grid gap-2">
                            <div className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs"><Kbd>daily</Kbd> &mdash; Reset every day. Users get 3 daily tasks from the pool.</div>
                            <div className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs"><Kbd>weekly</Kbd> &mdash; Reset every week. Larger point rewards.</div>
                            <div className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs"><Kbd>challenge</Kbd> &mdash; One-time challenges with optional expiry dates.</div>
                        </div>

                        <p className="font-medium mt-2">Managing Tasks</p>
                        <Step n={1}>Go to <Kbd>/admin/tasks</Kbd></Step>
                        <Step n={2}>Click <strong>&quot;Add Task&quot;</strong></Step>
                        <Step n={3}>Link to a card (optional), set type, description, points reward, and optional expiry</Step>
                        <Step n={4}>Drag to reorder tasks within each type</Step>

                        <Tip>The first daily task is always auto-marked as complete (&quot;Visit Daily!&quot;) to reward users for logging in.</Tip>
                    </Section>
                )}

                {/* ── 13. Levels ── */}
                {filteredSections.find((s) => s.id === "levels") && (
                    <Section id="levels" icon={Trophy} title="Levels & XP" color="bg-orange-500/20 text-orange-400" openSections={openSections} toggle={toggle}>
                        <p>The level system drives gamified progression. Users earn XP and level up.</p>

                        <p className="font-medium mt-2">Managing Levels</p>
                        <Step n={1}>Go to <Kbd>/admin/levels</Kbd></Step>
                        <Step n={2}>Click <strong>&quot;Add Level&quot;</strong></Step>
                        <Step n={3}>Set: Level Number, Name, Badge Icon (emoji), XP Required, Points Reward</Step>

                        <p className="font-medium mt-2">How XP Works</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li>Users earn XP from daily logins, completing tasks, quizzes, games, and streaks</li>
                            <li>When a user&apos;s total XP reaches the threshold for the next level, they level up</li>
                            <li>Levelling up awards the configured <strong>Points Reward</strong></li>
                            <li>The badge emoji is shown next to the user&apos;s name</li>
                        </ul>

                        <Tip>Stats at the top of the page show total levels, max level number, and total XP required for the highest level.</Tip>
                    </Section>
                )}

                {/* ── 14. Users ── */}
                {filteredSections.find((s) => s.id === "users") && (
                    <Section id="users" icon={Users} title="User Management" color="bg-violet-500/20 text-violet-400" openSections={openSections} toggle={toggle}>
                        <p>View and manage all registered users.</p>

                        <p className="font-medium mt-2">Features</p>
                        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)]">
                            <li><strong className="text-[var(--foreground)]">Search</strong> &mdash; by username, display name, or user ID</li>
                            <li><strong className="text-[var(--foreground)]">Filter</strong> &mdash; by membership level (Free, Plus, Premium)</li>
                            <li><strong className="text-[var(--foreground)]">Stats</strong> &mdash; total users, admins, premium, plus counts</li>
                        </ul>

                        <p className="font-medium mt-2">Editing a User</p>
                        <Step n={1}>Click the edit button on a user row</Step>
                        <Step n={2}>Modify: Display Name, Membership Level (1=Free, 2=Plus, 3=Premium), Points, Streaks, Admin status</Step>
                        <Step n={3}>Save changes</Step>

                        <Warning>
                            Toggling <strong>Admin</strong> gives the user full access to this admin panel. Be careful granting admin privileges.
                        </Warning>

                        <p className="font-medium mt-2">Membership Levels</p>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs text-center"><strong>1</strong> &mdash; Free</div>
                            <div className="p-2 rounded-lg bg-blue-500/10 text-xs text-center"><strong>2</strong> &mdash; Plus</div>
                            <div className="p-2 rounded-lg bg-purple-500/10 text-xs text-center"><strong>3</strong> &mdash; Premium</div>
                        </div>
                        <p className="text-[var(--muted-foreground)] mt-1">
                            Cards with <Kbd>min_membership_level</Kbd> &gt; 1 are only shown to users with that membership level or above.
                        </p>
                    </Section>
                )}

                {/* ── 15. Settings ── */}
                {filteredSections.find((s) => s.id === "settings") && (
                    <Section id="settings" icon={Settings} title="Settings & Configuration" color="bg-gray-500/20 text-gray-400" openSections={openSections} toggle={toggle}>
                        <p>System-wide configuration for rewards, gamification, and app behaviour.</p>

                        <p className="font-medium mt-2">System Statistics</p>
                        <p className="text-[var(--muted-foreground)]">
                            Top of the page shows: Total Users, Content Cards, Moods, Total Points across all users, Average Points per user, and active/total Card Ratio.
                        </p>

                        <p className="font-medium mt-2">Configurable Settings</p>
                        <div className="space-y-2">
                            {[
                                { group: "Daily Login Rewards", desc: "Points and XP awarded for each daily login" },
                                { group: "Weekend Bonus", desc: "Extra points and XP for logging in on weekends" },
                                { group: "Share Rewards", desc: "Points and XP when a user shares content" },
                                { group: "Streak Milestones", desc: "Bonus points at 3, 7, 14, and 30 day streaks" },
                                { group: "Perfect Week Bonus", desc: "Points for logging in 7 consecutive days" },
                                { group: "Default Card Points", desc: "Points awarded per card interaction (default)" },
                                { group: "Default Membership Level", desc: "Membership level for new users (1=Free)" },
                            ].map((s) => (
                                <div key={s.group} className="p-2 rounded-lg bg-[var(--secondary)]/20 text-xs">
                                    <strong className="text-[var(--foreground)]">{s.group}</strong>
                                    <span className="text-[var(--muted-foreground)]"> &mdash; {s.desc}</span>
                                </div>
                            ))}
                        </div>

                        <p className="font-medium mt-2">Database Info</p>
                        <p className="text-[var(--muted-foreground)]">Shows the Supabase project URL and current environment (development/production).</p>
                    </Section>
                )}

                {/* ── 16. API Reference ── */}
                {filteredSections.find((s) => s.id === "api") && (
                    <Section id="api" icon={Code2} title="API Routes Reference" color="bg-emerald-500/20 text-emerald-400" openSections={openSections} toggle={toggle}>
                        <p>Admin-only API endpoints used by the panel. All require <Kbd>is_admin: true</Kbd>.</p>

                        <div className="space-y-3 mt-2">
                            {[
                                {
                                    method: "POST",
                                    path: "/api/admin/generate-content",
                                    desc: "Generate content card via AI",
                                    params: "type (verse|devotional|article|prayer|motivational|task), theme (string)",
                                },
                                {
                                    method: "POST",
                                    path: "/api/admin/generate-quiz",
                                    desc: "Generate quiz via AI",
                                    params: "theme, numQuestions (3-20), difficulty (easy|medium|hard)",
                                },
                                {
                                    method: "POST",
                                    path: "/api/admin/generate-ar-game",
                                    desc: "Generate AR game config via AI",
                                    params: "theme, difficulty (easy|medium|hard)",
                                },
                                {
                                    method: "POST",
                                    path: "/api/categories",
                                    desc: "Create a new content category",
                                    params: "name, slug, display_name, emoji, color, gradient_from, gradient_to, ...",
                                },
                                {
                                    method: "POST/PUT",
                                    path: "/api/settings",
                                    desc: "Update app settings",
                                    params: "settings (object of key-value pairs) or key + value",
                                },
                                {
                                    method: "DELETE",
                                    path: "/api/feed/clear-cache",
                                    desc: "Clear all users' feed cache",
                                    params: "none",
                                },
                            ].map((route) => (
                                <div key={route.path} className="p-3 rounded-lg bg-[var(--secondary)]/30 border border-[var(--border)]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            route.method === "POST" ? "bg-green-500/20 text-green-400" :
                                            route.method === "DELETE" ? "bg-red-500/20 text-red-400" :
                                            "bg-yellow-500/20 text-yellow-400"
                                        }`}>
                                            {route.method}
                                        </span>
                                        <code className="text-xs font-mono text-[var(--foreground)]">{route.path}</code>
                                    </div>
                                    <p className="text-xs text-[var(--muted-foreground)]">{route.desc}</p>
                                    <p className="text-[10px] text-[var(--muted-foreground)] mt-1">Params: {route.params}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-[var(--muted-foreground)] pb-8 pt-4">
                Soul Sync Admin Manual &mdash; {new Date().getFullYear()}
            </div>
        </div>
    );
}
