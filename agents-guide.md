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

## Good first agent tasks
- Summarize my unread email each morning
- Watch a page and tell me when it changes
- Research a topic and save a report to this repo
- Fill out a repetitive web form

## Rules of thumb
- Give a clear goal and what "done" looks like.
- Start read-only (research, summaries) before letting an agent act (send, buy, delete).
- Review the output before trusting it; use pull requests as the safety net.
- Keep a human approval step for anything irreversible.

## My next steps
- [ ] Pick one small task from the list above
- [ ] Try it with a connector or scheduled task
- [ ] Log what worked in this repo
