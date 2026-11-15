# Learning to Build Agents for Online Tasks

**Goal:** Learn how to create agents that perform online tasks for me.

## What an agent is
Claude plus tools, working through a task on its own: it plans, acts, checks the result, and continues until done.

## Ways to get an agent to do online work (easiest first)
1. **Connectors.** Link Gmail, Calendar, Drive, etc. so Claude works with my real data. No code.
2. **Browser agent.** Claude in Chrome can click, fill forms, and read pages in my own browser, with my sign-ins.
3. **Scheduled tasks.** Ask Claude to run a task on a schedule (for example, a weekday morning summary).
4. **Cloud coding sessions.** Describe a task on a GitHub repo; Claude works in the cloud and opens a pull request.
5. **Build my own with the Claude Agent SDK.** Write a small program where Claude uses tools I define. Most flexible, needs some code.

## Phase 1: read-only agents (where I am starting)
For now, agents may only **gather information and report back to me**. They do not edit, send, buy, post, delete, or submit anything.

Good read-only tasks:
- Research a topic and report findings in chat
- Summarize my unread email (read, never reply or delete)
- Check a web page and tell me what changed
- Compare options (prices, reviews, specs) and give me a short list

Guardrails for this phase:
- Use read-only connector access where possible
- Never give an agent passwords or payment details
- In a browser agent, watch what it does and stop it if it tries to submit or buy anything
- Say it in the prompt: "Read and report only. Do not make any changes."

## Phase 2: later, once I trust it
Allow small, reversible actions (drafts, not sends) with my approval for each one.

## Rules of thumb
- Give a clear goal and what "done" looks like.
- Start read-only before letting an agent act (send, buy, delete).
- Review the output before trusting it; use pull requests as the safety net.
- Keep a human approval step for anything irreversible.

## My next steps
- [ ] Pick one read-only task from Phase 1
- [ ] Try it and read the report it gives me
- [ ] Note what worked before moving to Phase 2
