# Task Planning Command

Creates atomic Task Issues using the TASKISSUE template based on current execution mode.

## Usage

```bash
/plan > [task description]      # Create Task Issue assigned by current mode
```

## Examples

```bash
/plan > Fix auto-registration infinite loop
/plan > Create React loading spinner component
/plan > Implement database schema for members
```

## Mode-Based Behavior

### MANUAL Mode (Default)
- Creates tasks assigned to human developer
- Uses EXECUTION MODE: MANUAL in task template
- Ready for: =impl command (manual implementation)

### COPILOT Mode
- Creates tasks assigned to @github-copilot
- Uses EXECUTION MODE: COPILOT in task template
- Ready for: =impl command (GitHub Copilot implementation)

## Template Used

Uses `/docs/TASK-ISSUE-TEMP.md` which contains:
- EXECUTION MODE field (MANDATORY)
- SINGLE OBJECTIVE section
- DELIVERABLE specifications
- TECHNICAL REQUIREMENTS
- ACCEPTANCE CRITERIA (100% validation)
- GIT WORKFLOW instructions

## GitHub CLI Implementation

### Create Atomic Task Issue
```bash
# MANUAL Mode - Assign to human
gh issue create \
  --title "[TASK-XXX-X] Atomic: [Single Deliverable]" \
  --body "$(cat docs/TASK-ISSUE-TEMP.md | sed 's/\[TASK-XXX-X\]/[TASK-XXX-X]/g; s/\[MANUAL\]/[MANUAL]/g')" \
  --assignee [github-username] \
  --label "atomic" \
  --label "manual" \
  --label "independent-execution"

# COPILOT Mode - Assign to @github-copilot
gh issue create \
  --title "[TASK-XXX-X] Atomic: [Single Deliverable]" \
  --body "$(cat docs/TASK-ISSUE-TEMP.md | sed 's/\[TASK-XXX-X\]/[TASK-XXX-X]/g; s/\[COPILOT\]/[COPILOT]/g')" \
  --assignee @github-copilot \
  --label "atomic" \
  --label "copilot" \
  --label "independent-execution"
```

## Output

Creates GitHub issues with naming format:
- `[TASK-XXX-X] Atomic: [Single Deliverable Description]`
- **Body**: Complete task template with mode-specific settings
- **Assignee**: Based on current execution mode
- **Labels**: `atomic`, `manual|copilot`, `independent-execution`

## Configuration

Updates `.claude/config.json` to track task numbers:
- Increments `lastTaskNumber` for new tasks
- Stores mapping between task numbers and GitHub issue numbers
- Tracks assignment by mode

## Prerequisites

- Context Issue must exist and be [Implementation Ready]
- All PLANNING READINESS CHECKLIST items must be ✅
- Current execution mode must be set
- GitHub CLI must be authenticated

## Related Commands

- /mode - Change execution mode
- /impl - Implement tasks based on current mode
- /fcs - Create context issues before planning