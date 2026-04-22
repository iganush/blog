import dotenv from "dotenv";
import mongoose from "mongoose";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import { removeBlogCoverImage } from "../services/blogMedia.js";
import { uploadImageBuffer } from "../services/cloudinary.js";

dotenv.config();

const mongoUri = (process.env.MONGODB_URL || "").trim().replace(/^['"]|['"]$/g, "");

const demoUsers = [
  {
    fullName: "Aarav Kapoor",
    email: "aarav.writer@blogify.demo",
    password: "Aarav@123",
    bio: "Builds calm systems, writes practical essays, and loves turning complex tech into simple stories.",
    profileImageURL: "https://api.dicebear.com/9.x/adventurer/svg?seed=Aarav%20Kapoor",
  },
  {
    fullName: "Siya Mehta",
    email: "siya.codes@blogify.demo",
    password: "Siya@123",
    bio: "Frontend engineer with a soft spot for product design, clean UX, and useful side projects.",
    profileImageURL: "https://api.dicebear.com/9.x/adventurer/svg?seed=Siya%20Mehta",
  },
  {
    fullName: "Kabir Malhotra",
    email: "kabir.growth@blogify.demo",
    password: "Kabir@123",
    bio: "Writes about startups, creator businesses, and the routines that make teams move faster.",
    profileImageURL: "https://api.dicebear.com/9.x/adventurer/svg?seed=Kabir%20Malhotra",
  },
  {
    fullName: "Mira Sen",
    email: "mira.life@blogify.demo",
    password: "Mira@123",
    bio: "Interested in mindful living, healthy habits, and making everyday decisions feel lighter.",
    profileImageURL: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mira%20Sen",
  },
  {
    fullName: "Rohan Iyer",
    email: "rohan.notes@blogify.demo",
    password: "Rohan@123",
    bio: "Learns in public about AI, writing, and how small systems create big momentum over time.",
    profileImageURL: "https://api.dicebear.com/9.x/adventurer/svg?seed=Rohan%20Iyer",
  },
];

const demoPosts = [
  {
    authorEmail: "aarav.writer@blogify.demo",
    category: "Programming",
    title: "The 30-Minute Refactor That Saved Our Entire Week",
    intro:
      "Most bugs in student and startup projects do not come from advanced logic. They come from code that is technically working but emotionally expensive to maintain. A small refactor can remove that pressure faster than another late-night patch.",
    insight:
      "The best refactor we made this month was not heroic. We renamed unclear functions, moved one repeated query into a helper, and removed two nearly identical condition blocks. That gave the whole team cleaner error messages, faster onboarding, and fewer accidental regressions. The surprising part was how quickly confidence returned once the code started reading like plain English again.",
    action:
      "If you want a practical rule, refactor when one confusing block makes three future tasks slower. Set a timer for 30 minutes, clean naming first, then duplication, then the happy-path flow. You do not need perfection. You just need the next developer, including future you, to understand what the code is trying to protect.",
  },
  {
    authorEmail: "siya.codes@blogify.demo",
    category: "Web Development",
    title: "Designing Forms That Feel Friendly Instead of Heavy",
    intro:
      "People decide how trustworthy a product feels in the first few seconds of filling a form. A signup page can either feel like a gate or like an invitation, and that mood changes conversion more than we usually admit.",
    insight:
      "The friendliest forms reduce fear before they reduce friction. Clear labels, one obvious primary action, supportive helper text, and short error messages make people feel guided instead of judged. Even tiny changes such as describing why you need an email address can increase completion because they answer the silent question users always have: why should I trust this step?",
    action:
      "When you polish a form, start with emotional load. Remove one non-essential field, rewrite one robotic label, and make every error message actionable. If the screen sounds like a calm teammate, users move forward with much less resistance.",
  },
  {
    authorEmail: "rohan.notes@blogify.demo",
    category: "Artificial Intelligence",
    title: "A Simple AI Workflow for Students Who Want Better Notes",
    intro:
      "AI becomes genuinely useful when it fits into work you are already doing. For students, the best use case is not writing everything from scratch. It is structuring messy information into a study system you can actually revisit.",
    insight:
      "A strong routine looks like this: capture rough class notes, ask AI to summarize the main ideas, then ask it to generate five recall questions from the same topic. The magic is in the third step, where you compare your answer with the summary and close the gap while the lecture is still fresh. That turns passive notes into active revision with very little extra effort.",
    action:
      "Use AI as a second-pass editor, not as a substitute for thinking. Keep your own examples in the notes, then let the model organize, compress, and test you. That balance gives you speed without losing understanding.",
  },
  {
    authorEmail: "kabir.growth@blogify.demo",
    category: "Business",
    title: "Why Small Products Win When Their Promise Is Specific",
    intro:
      "A lot of early products fail because their home page sounds ambitious but not believable. Broad promises feel exciting to the maker and vague to the user. Clear products win because they help one person achieve one result without confusion.",
    insight:
      "The strongest positioning we tested recently was a sentence that named the audience, the job, and the timeframe. Instead of saying we help creators grow faster, we said we help newsletter writers plan a week of content in one sitting. Suddenly the product felt more real. People could imagine themselves using it because the promise had shape.",
    action:
      "If your product copy feels fuzzy, write one sentence that begins with who it is for and ends with what changes after using it. Specificity will often do more for growth than another feature release.",
  },
  {
    authorEmail: "mira.life@blogify.demo",
    category: "Lifestyle",
    title: "The Evening Reset Routine That Makes Mornings Easier",
    intro:
      "Good mornings are often built the night before. The problem is that most evening routines try to be inspiring instead of realistic, so they collapse after a long day.",
    insight:
      "The version that actually sticks is short. Put tomorrow's top task on paper, clear the surface where you will work, and set out one thing that makes the morning frictionless. That could be a filled water bottle, workout clothes, or a packed bag. These tiny preparations tell your future self that starting is already half done.",
    action:
      "Do not chase the perfect nighttime ritual. Pick three actions that reduce the first ten minutes of tomorrow. Consistency grows when the routine feels supportive, not performative.",
  },
  {
    authorEmail: "aarav.writer@blogify.demo",
    category: "Technology",
    title: "What We Learned After Moving a Side Project to Production",
    intro:
      "Shipping a project to production teaches a different set of lessons than building it locally. Everything that felt small in development suddenly matters: naming, logging, environment variables, and how safely your app behaves when something goes wrong.",
    insight:
      "The biggest surprise for our team was not scale. It was assumptions. We assumed file paths would behave the same on every platform, that cookies would work the same over HTTP and HTTPS, and that uploads stored locally would still be there tomorrow. Production corrected all of those assumptions quickly. Once we respected deployment as its own environment, our fixes became much simpler.",
    action:
      "Treat deployment as part of development from day one. Test with production-like settings early, document your environment variables clearly, and prefer services that survive restarts. You will save yourself a lot of debugging energy later.",
  },
  {
    authorEmail: "siya.codes@blogify.demo",
    category: "Tutorials",
    title: "A Beginner-Friendly Checklist Before You Push to Vercel",
    intro:
      "Deploying a project feels scary mostly because the failure points are scattered. One missing environment variable, one wrong file name, or one storage assumption can make an otherwise good app look broken.",
    insight:
      "The safest pre-deploy routine is simple. Check that route names match file names exactly, confirm all required environment variables are configured in the dashboard, and verify that uploads use durable storage instead of local disk when needed. Add one pass for cookie settings and one pass for database access. That is usually enough to catch the majority of first-deploy issues.",
    action:
      "Create your own deployment checklist and keep it in the repo. A reusable checklist turns stress into process, and process is what helps teams ship consistently.",
  },
  {
    authorEmail: "rohan.notes@blogify.demo",
    category: "Science",
    title: "Learning Faster Starts With Better Feedback Loops",
    intro:
      "People often say they want to learn faster, but what they really need is a faster feedback loop. The brain improves when it sees the result of an action quickly enough to adjust the next one.",
    insight:
      "This is true in coding, fitness, language learning, and writing. If you practice in a way that delays feedback for days, your errors become habits before you notice them. The best systems compress the distance between attempt and correction. That is why quizzes work, prototypes help, and public writing improves clarity. You are not just doing more reps. You are learning from each rep sooner.",
    action:
      "Build your projects and routines around visible feedback. Review small outputs often, make one adjustment at a time, and let progress come from iteration rather than intensity alone.",
  },
  {
    authorEmail: "kabir.growth@blogify.demo",
    category: "Finance",
    title: "The Quiet Power of a Personal Runway",
    intro:
      "Financial advice usually focuses on wealth. For students and early-career builders, a more useful target is runway. Runway is not glamorous, but it buys time, better decisions, and a lot less panic.",
    insight:
      "When you have even a few months of breathing room, you stop accepting every urgent opportunity by default. You can compare roles more carefully, test a side project longer, or recover from a bad month without spiraling. The freedom is not only financial. It changes the quality of your thinking because your decisions become less defensive.",
    action:
      "If building wealth feels far away, start by building stability. Track your fixed costs, reduce one recurring drain, and set a runway target you can explain in months. Clarity often matters more than complexity here.",
  },
  {
    authorEmail: "mira.life@blogify.demo",
    category: "Health & Fitness",
    title: "Walking Is Underrated Because It Looks Too Simple",
    intro:
      "Simple habits are easy to dismiss because they do not feel dramatic. Walking suffers from that bias even though it improves energy, digestion, mood, and consistency more reliably than many intense plans people abandon within two weeks.",
    insight:
      "Walking works because it is low friction. You do not need perfect clothes, a strong mood, or a recovery day. You just need a little time and a reason to begin. That makes it easier to repeat, and repeatable habits almost always outperform ideal plans that never become real. It is also one of the easiest ways to think clearly when your mind feels crowded.",
    action:
      "If you want a sustainable reset, start with one daily walk linked to something you already do. After lunch, after class, or after work are all good anchors. Let the habit become ordinary before you try to make it impressive.",
  },
  {
    authorEmail: "aarav.writer@blogify.demo",
    category: "Career & Interviews",
    title: "What Interviewers Actually Notice in Project Explanations",
    intro:
      "When candidates explain projects, many rush to tools before they explain the problem. That usually makes the work sound more complicated and less useful at the same time.",
    insight:
      "The clearest project explanations follow a simple sequence: what problem existed, what constraint made it hard, what you changed, and what happened after. This structure helps interviewers understand your judgment, not just your stack. They want to know how you think through tradeoffs, how you debug uncertainty, and whether you can talk about real work in a grounded way.",
    action:
      "Practice describing one project without mentioning the tech stack for the first two sentences. Lead with the user problem and the decision you made. Your explanation will instantly sound more senior and more memorable.",
  },
  {
    authorEmail: "siya.codes@blogify.demo",
    category: "Mobile Apps",
    title: "Features People Love in Mobile Apps Usually Save Time",
    intro:
      "The most appreciated mobile features are rarely the flashiest ones. They are the ones that reduce taps, remember context, and let people pick up where they left off without thinking.",
    insight:
      "Mobile design is a game of respecting attention. Good apps preserve drafts, show progress clearly, cache what matters, and avoid making users repeat work across sessions. Every extra tap is a small tax, and those taxes add up fast on smaller screens. When teams obsess over convenience, retention often improves because people feel the app is cooperating with them.",
    action:
      "The next time you review a mobile flow, count how many actions it takes to finish the main task. Then remove one. That single improvement often matters more than a decorative redesign.",
  },
  {
    authorEmail: "rohan.notes@blogify.demo",
    category: "Education",
    title: "Why Teaching a Topic Once Makes You Remember It Better",
    intro:
      "One of the fastest ways to test whether you understand something is to explain it to someone else. Teaching exposes fuzzy logic immediately because weak understanding cannot hide for long inside simple language.",
    insight:
      "This works even when there is no real audience. Record a voice note, write a short thread, or explain the topic to an empty room. The moment you hesitate, you find the concept that still needs work. That is why teaching feels mentally demanding. It forces your brain to organize knowledge instead of just recognizing it on a page.",
    action:
      "Add one teaching loop to your study sessions. Spend ten minutes turning a topic into a plain-language explanation. It is one of the most efficient forms of self-testing available.",
  },
  {
    authorEmail: "kabir.growth@blogify.demo",
    category: "General",
    title: "Consistency Looks Different Once You Stop Chasing Motivation",
    intro:
      "Many people think consistency means feeling ready every day. In reality, consistency is what remains when motivation becomes optional and the system still works.",
    insight:
      "The most dependable routines are designed for low-energy days. They have a smaller version, a clear start point, and a reason that still matters when the mood is gone. This is true for writing, coding, reading, and fitness. You do not need to feel inspired to stay in motion. You need a version of the habit that survives ordinary life.",
    action:
      "Build a minimum version of your main routine today. One paragraph, one push-up set, one solved problem, or ten minutes of revision. Small floors create stronger streaks than ambitious ceilings.",
  },
  {
    authorEmail: "mira.life@blogify.demo",
    category: "Travel",
    title: "How Slow Travel Helps You Remember a Place Better",
    intro:
      "Fast trips give you photos. Slow trips give you texture. When you stay long enough to repeat small routines in a place, it becomes memorable in a way that checklists rarely create.",
    insight:
      "The moments people remember most are often ordinary: the tea stall near the hostel, the walk to a viewpoint at sunrise, the bookshop you returned to twice. Slower travel lets a city become slightly familiar instead of constantly impressive. That familiarity changes the story from sightseeing to relationship.",
    action:
      "If you can, leave space in your itinerary for repetition. Visit one neighborhood twice, eat at one local place more than once, and allow yourself an unplanned afternoon. Memory usually grows where pace softens.",
  },
  {
    authorEmail: "aarav.writer@blogify.demo",
    category: "Cyber Security",
    title: "Security Basics That Matter Even on Small Personal Projects",
    intro:
      "Small projects are not exempt from security mistakes. In fact, they are often more vulnerable because developers assume nobody will look closely enough for the weak spots.",
    insight:
      "A few habits cover a surprising amount of risk. Move secrets into environment variables, validate uploads carefully, avoid trusting client-side input, and make sure authentication tokens are stored with sensible cookie settings. None of these steps are glamorous, but they prevent the kind of issues that turn a learning project into an uncomfortable lesson.",
    action:
      "Think of security as hygiene instead of a special phase. Add one protective improvement every time you touch auth, storage, or user input. The compound effect is much bigger than it looks.",
  },
  {
    authorEmail: "siya.codes@blogify.demo",
    category: "Entertainment",
    title: "Why Some Online Communities Feel Alive and Others Feel Empty",
    intro:
      "A platform can have traffic and still feel dead. Communities feel alive when members sense that their presence changes the space instead of just passing through it.",
    insight:
      "That feeling usually comes from visible participation loops. New members get welcomed, creators get feedback, and small actions leave traces that others can respond to. Empty platforms often skip this layer and focus only on publishing mechanics. But content without community signals becomes a library, not a gathering place.",
    action:
      "If you are building a social feature, ask how users know they have been noticed. One follow, one comment, or one visible interaction can shift a product from passive to alive.",
  },
  {
    authorEmail: "rohan.notes@blogify.demo",
    category: "Book Reviews",
    title: "The Best Books Change How You Notice Ordinary Moments",
    intro:
      "Good books do more than teach ideas. They sharpen your ability to notice things you were already living through but not fully naming.",
    insight:
      "That is why memorable books keep echoing after you finish them. They give language to patterns you had felt but not articulated: burnout that looks like productivity, friendship that survives through routine, or ambition that quietly reshapes identity. Once a book helps you see one of those patterns, everyday life starts reflecting it back to you.",
    action:
      "When you finish a strong book, do not only summarize the argument. Ask what it made you notice differently this week. That question is often where the real value begins.",
  },
  {
    authorEmail: "kabir.growth@blogify.demo",
    category: "Motivation",
    title: "Ambition Becomes Sustainable When It Stops Being Performative",
    intro:
      "Ambition looks impressive from the outside when it is loud, but the healthiest ambition is usually quiet. It is less concerned with appearing driven and more concerned with being reliable over time.",
    insight:
      "Performative ambition burns energy on visibility. Sustainable ambition puts that energy into process. It asks better questions: what pace can I maintain, what tradeoffs am I willing to accept, and what kind of life should this work support? Those questions may look less dramatic, but they produce momentum that lasts much longer.",
    action:
      "Check whether your current goals need an audience to feel meaningful. If they do, bring the focus back to the work itself. Durable motivation grows when the process is worth returning to privately, not just publicly.",
  },
  {
    authorEmail: "mira.life@blogify.demo",
    category: "Personal Experiences",
    title: "What a Month of Digital Boundaries Taught Me About Attention",
    intro:
      "I expected digital boundaries to make me more disciplined. What they actually made me was more honest about how often I was reaching for distraction whenever a task became slightly uncomfortable.",
    insight:
      "The first week felt strange because I had removed the easiest escape hatches. Without constant checking, I could see how often boredom appeared in small gaps. But after a while, the silence became useful. Reading felt deeper, work blocks stretched longer, and even conversations felt less fractured. The biggest surprise was not productivity. It was relief.",
    action:
      "You do not need a dramatic detox to feel this shift. Start by protecting one part of the day from unnecessary scrolling. Attention grows where access becomes a little less automatic.",
  },
  {
    authorEmail: "aarav.writer@blogify.demo",
    category: "History",
    title: "Why Historical Patterns Are Useful for Modern Builders",
    intro:
      "History rarely repeats in exact form, but it repeats in structure. That is why reading history can help modern builders think more clearly about cycles, incentives, and unintended consequences.",
    insight:
      "Many decisions that look new are old in disguise: centralization versus independence, convenience versus resilience, growth versus control. Historical case studies help us recognize these tensions earlier because they show what happens when one force dominates for too long. They do not give perfect predictions, but they improve judgment by widening context.",
    action:
      "When facing a messy product or career decision, look for a historical analogy instead of only another hot take. Broader context often creates calmer and wiser strategy.",
  },
  {
    authorEmail: "siya.codes@blogify.demo",
    category: "Movies",
    title: "The Best Tech Movies Understand Human Stakes First",
    intro:
      "Movies about technology work when they remember that tools are only interesting because people are using them under pressure. Without human stakes, code and machines become visual wallpaper.",
    insight:
      "The strongest stories in this space usually revolve around obsession, ambition, trust, or loneliness. Technology sharpens those themes rather than replacing them. That is why we remember scenes of tension between teammates or founders more vividly than scenes of abstract technical brilliance. People connect with the cost of creation as much as the creation itself.",
    action:
      "The next time you watch a tech-centered film, notice which emotional conflict is doing the real work. That lens makes the story richer and helps explain why certain scenes stay with us.",
  },
  {
    authorEmail: "rohan.notes@blogify.demo",
    category: "Short Stories",
    title: "The Last Draft in the Shared Folder",
    intro:
      "Every evening after the college lab emptied, Nikhil opened the shared folder one more time. Most days there was nothing new in it except his own half-finished files and the quiet pressure of a project no one believed would ship on time.",
    insight:
      "Then one night he saw a document named final-final-v7-real. It was full of comments from his teammates, each one small but specific: better error message here, cleaner heading there, one note just saying this finally feels like us. For the first time in weeks, the work stopped feeling like a burden one person was dragging uphill. It felt like evidence that everyone had stayed with it.",
    action:
      "He left the lab later than usual, but lighter. The folder had not only changed the draft. It had changed the story he was telling himself about doing hard things with other people.",
  },
  {
    authorEmail: "mira.life@blogify.demo",
    category: "Sports",
    title: "What Team Sports Teach Us About Momentum",
    intro:
      "Momentum in sports often looks magical from the outside, but it is usually built from repeatable behaviors under pressure. Teams create it by staying organized when the game becomes noisy.",
    insight:
      "That lesson transfers surprisingly well to study groups, startup teams, and personal routines. Momentum is not just energy. It is coordinated trust. Everyone knows the next move, the standards are visible, and small wins are recognized quickly enough to keep belief alive. Chaos kills rhythm long before effort does.",
    action:
      "If your team feels stuck, do not begin with motivation speeches. Start with role clarity, one shared target, and a visible next action. Momentum prefers structure over drama.",
  },
  {
    authorEmail: "aarav.writer@blogify.demo",
    category: "Others",
    title: "The Case for Making Your Personal Projects More Visible",
    intro:
      "Personal projects often stay hidden because people assume unfinished work is not worth showing. In reality, visible progress can create opportunities long before the project feels complete.",
    insight:
      "A visible project acts like a living resume. It shows taste, persistence, and how you think through problems over time. It also gives other people a natural way to support you, whether that means feedback, introductions, or collaboration. The project does not have to be huge. It just has to be real enough for someone else to see movement.",
    action:
      "Pick one project and document it publicly this week. Share a screenshot, a short note, or one lesson from the build. Momentum grows faster when other people can see that you are already in motion.",
  },
];

const followGraph = {
  "aarav.writer@blogify.demo": [
    "siya.codes@blogify.demo",
    "rohan.notes@blogify.demo",
  ],
  "siya.codes@blogify.demo": [
    "aarav.writer@blogify.demo",
    "mira.life@blogify.demo",
  ],
  "kabir.growth@blogify.demo": [
    "aarav.writer@blogify.demo",
    "siya.codes@blogify.demo",
    "rohan.notes@blogify.demo",
  ],
  "mira.life@blogify.demo": [
    "kabir.growth@blogify.demo",
    "rohan.notes@blogify.demo",
  ],
  "rohan.notes@blogify.demo": [
    "aarav.writer@blogify.demo",
    "siya.codes@blogify.demo",
    "mira.life@blogify.demo",
  ],
};

const coverPalettes = [
  ["#1d3557", "#457b9d", "#a8dadc"],
  ["#3a0ca3", "#4361ee", "#4cc9f0"],
  ["#264653", "#2a9d8f", "#e9c46a"],
  ["#7f5539", "#b08968", "#ddb892"],
  ["#2b2d42", "#8d99ae", "#edf2f4"],
];

function createCoverSvg(post, index) {
  const [bgStart, bgEnd, accent] = coverPalettes[index % coverPalettes.length];
  const safeTitle = post.title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const safeCategory = post.category
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}" />
          <stop offset="100%" stop-color="${bgEnd}" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#bg)" />
      <circle cx="1300" cy="160" r="220" fill="${accent}" opacity="0.18" />
      <circle cx="220" cy="760" r="180" fill="${accent}" opacity="0.1" />
      <rect x="110" y="120" width="1380" height="660" rx="42" fill="rgba(10, 14, 25, 0.12)" stroke="rgba(255,255,255,0.22)" />
      <text x="160" y="240" fill="#ffffff" font-size="34" font-family="Segoe UI, Arial, sans-serif" opacity="0.9">${safeCategory}</text>
      <text x="160" y="360" fill="#ffffff" font-size="72" font-weight="700" font-family="Georgia, Times New Roman, serif">
        <tspan x="160" dy="0">${safeTitle.slice(0, 34)}</tspan>
        <tspan x="160" dy="92">${safeTitle.slice(34, 68)}</tspan>
        <tspan x="160" dy="92">${safeTitle.slice(68, 102)}</tspan>
      </text>
      <text x="160" y="700" fill="#ffffff" font-size="28" font-family="Segoe UI, Arial, sans-serif" opacity="0.85">Blogify Demo Collection</text>
    </svg>
  `;
}

function buildPostBody(post) {
  return `${post.intro}\n\n${post.insight}\n\n${post.action}`;
}

async function resetExistingDemoContent() {
  const existingUsers = await User.find({
    email: { $in: demoUsers.map(user => user.email) },
  }).select("_id");

  const existingUserIds = existingUsers.map(user => user._id);
  if (existingUserIds.length === 0) {
    return;
  }

  const existingBlogs = await Blog.find({
    createdBy: { $in: existingUserIds },
  }).select("_id coverImageURL coverImagePublicId");

  await Promise.all(
    existingBlogs.map(async blog => {
      try {
        await removeBlogCoverImage(blog);
      } catch (error) {
        console.error(`Failed to remove old asset for blog ${blog._id}`, error.message);
      }
    })
  );

  await Comment.deleteMany({
    $or: [
      { createdBy: { $in: existingUserIds } },
      { blogId: { $in: existingBlogs.map(blog => blog._id) } },
    ],
  });

  await Blog.deleteMany({
    createdBy: { $in: existingUserIds },
  });

  await User.updateMany(
    {},
    {
      $pull: {
        followers: { $in: existingUserIds },
        following: { $in: existingUserIds },
      },
    }
  );

  await User.deleteMany({
    _id: { $in: existingUserIds },
  });
}

async function createDemoUsers() {
  const createdUsers = await Promise.all(
    demoUsers.map(user => User.create(user))
  );
  return createdUsers.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
  }, {});
}

async function createDemoPosts(usersByEmail) {
  const createdPosts = [];

  for (const [index, post] of demoPosts.entries()) {
    const author = usersByEmail[post.authorEmail];
    let coverImageURL = null;
    let coverImagePublicId = null;

    try {
      const svg = createCoverSvg(post, index);
      const uploadResult = await uploadImageBuffer(Buffer.from(svg), {
        folder: "blogify/demo-posts",
        public_id: `demo-post-${String(index + 1).padStart(2, "0")}`,
      });

      coverImageURL = uploadResult?.secure_url || null;
      coverImagePublicId = uploadResult?.public_id || null;
    } catch (error) {
      console.error(`Cloudinary upload failed for "${post.title}"`, error.message);
    }

    const createdBlog = await Blog.create({
      title: post.title,
      body: buildPostBody(post),
      category: post.category,
      coverImageURL,
      coverImagePublicId,
      createdBy: author._id,
    });

    createdPosts.push(createdBlog);
  }

  return createdPosts;
}

async function addFollows(usersByEmail) {
  for (const [email, followingEmails] of Object.entries(followGraph)) {
    const currentUser = usersByEmail[email];
    const followingIds = followingEmails
      .map(targetEmail => usersByEmail[targetEmail]?._id)
      .filter(Boolean);

    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: {
        following: { $each: followingIds },
      },
    });

    await User.updateMany(
      { _id: { $in: followingIds } },
      {
        $addToSet: {
          followers: currentUser._id,
        },
      }
    );
  }
}

async function addLikesAndComments(usersByEmail, posts) {
  const userList = Object.values(usersByEmail);

  for (const [index, post] of posts.entries()) {
    const likeUsers = userList.filter((user, userIndex) => {
      if (String(user._id) === String(post.createdBy)) {
        return false;
      }

      return (index + userIndex) % 2 === 0 || userIndex === (index + 1) % userList.length;
    });

    await Blog.findByIdAndUpdate(post._id, {
      $set: {
        likedBy: likeUsers.map(user => user._id),
        likesCount: likeUsers.length,
      },
    });

    if (index % 2 === 0) {
      const commenter = userList[(index + 2) % userList.length];
      await Comment.create({
        content:
          "Loved the clarity in this post. The examples made the idea easy to understand and practical to apply.",
        blogId: post._id,
        createdBy: commenter._id,
      });
    }
  }
}

async function main() {
  if (!mongoUri) {
    throw new Error("MONGODB_URL is missing. Add it to your .env before seeding.");
  }

  await mongoose.connect(mongoUri);

  await resetExistingDemoContent();
  const usersByEmail = await createDemoUsers();
  const posts = await createDemoPosts(usersByEmail);
  await addFollows(usersByEmail);
  await addLikesAndComments(usersByEmail, posts);

  console.log(`Seed complete: ${Object.keys(usersByEmail).length} users and ${posts.length} posts created.`);
  console.log("Demo credentials:");
  demoUsers.forEach(user => {
    console.log(`- ${user.email} / ${user.password}`);
  });
}

main()
  .catch(error => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
