# Daily Retrospective Command

Creates daily retrospective GitHub Issues for team reflection and improvement.

## Usage

```bash
/rrr > [message]              # Create daily retrospective GitHub Issue
```

## Examples

```bash
/rrr > Fixed authentication loop, deployed to staging
/rrr > Completed 3 atomic tasks, all validations passing
/rrr > Debugged auto-registration issue, found root cause
```

## GitHub CLI Implementation

### Create Daily Retrospective Issue
```bash
gh issue create \
  --title "[RETRO-YYYY-MM-DD] Daily Retrospective" \
  --body "$(cat <<'EOF'
# Daily Retrospective - [YYYY-MM-DD]

## 🎯 Today's Accomplishments
- [Accomplishment from user message]
- [Additional accomplishments discovered]

## 🐛 Challenges & Blockers
- [Challenge 1]
- [Challenge 2]
- [Blocker if any]

## 📊 Metrics
- **Tasks Completed**: [number]
- **Build Success Rate**: [percentage]
- **Test Coverage**: [percentage]
- **PRs Merged**: [number]

## 🔄 What Went Well
- [Process that worked well]
- [Tool that was effective]
- [Collaboration success]

## ⚠️ What Could Be Improved
- [Process issue identified]
- [Tool limitation encountered]
- [Area for optimization]

## 🎯 Action Items for Tomorrow
- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Follow-up needed]

## 📝 Notes & Learnings
- [Technical insight gained]
- [Process lesson learned]
- [New skill practiced]

---

*Created with Claude Code Workflow System*
EOF
)" \
  --label "retrospective" \
  --label "daily"
```

## Output Structure

### GitHub Issue Creation
Creates GitHub Issue with:
- **Title**: `[RETRO-YYYY-MM-DD] Daily Retrospective`
- **Body**: Complete retrospective template with user's message
- **Labels**: `retrospective`, `daily`
- **Tracking**: Date-based for easy organization

## Template Structure

The retrospective template includes:
- **Accomplishments**: What was completed today
- **Challenges**: Problems encountered and blockers
- **Metrics**: Quantitative measures of progress
- **What Went Well**: Process and tool successes
- **What Could Be Improved**: Areas for optimization
- **Action Items**: Concrete next steps
- **Notes & Learnings**: Insights and lessons learned

## Configuration

Updates `.claude/config.json` to track retrospective activity:
- Tracks last retrospective date
- Stores mapping between dates and GitHub issue numbers
- Maintains retrospective history for pattern analysis

## Related Commands

- /fcs - For context creation discussions
- /plan - For task planning based on insights
- /impl - For implementing improvements identified

## Best Practices

- Be specific and honest in retrospectives
- Include both technical and process learnings
- Focus on actionable improvements
- Track patterns across multiple retrospectives
- Use insights to improve workflow and processes
- Link to related issues and PRs when relevant

## GitHub Integration Benefits

- **Centralized**: All retrospectives stored in GitHub issues
- **Searchable**: Easy to find past retrospectives
- **Referenceable**: Can link to specific retrospectives from other issues
- **Collaborative**: Team members can comment and contribute
- **Trackable**: GitHub's issue tracking for retrospective follow-ups