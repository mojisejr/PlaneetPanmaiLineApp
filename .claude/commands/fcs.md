# Context Management Command

Creates and manages Context Issues for iterative discussions using GitHub CLI and ISSUETEMP template.

## Usage

```bash
/fcs > [topic-name]           # Create new Context Issue via GitHub
/fcs > [ISSUE-XXX]            # Update existing Context Issue via GitHub
/fcs list                     # Show all active Context Issues
```

## Examples

```bash
/fcs > auto-registration-loop
/fcs > ISSUE-123
/fcs list
```

## Implementation

This command follows the exact workflow specified in CLAUDE.md and uses GitHub CLI:

1. **Phase 1**: Create GitHub Issue with context template
2. **Phase 2**: Update context iteratively through GitHub issue comments
3. **Phase 3**: Context reaches [Ready for Planning] status
4. **Ready for**: =plan command to create atomic tasks

## GitHub CLI Commands Used

### Create New Context Issue
```bash
gh issue create \
  --title "[ISSUE-XXX] [Topic Name]" \
  --body "$(cat /docs/ISSUE-TEMP.md | sed 's/\[ISSUE-XXX\]/[ISSUE-XXX]/g')" \
  --label "context" \
  --label "planning"
```

### Update Existing Context Issue
```bash
gh issue edit [ISSUE-XXX] \
  --add-comment "## Session Update - $(date)

### New Context Added
[Updated discussion content]

### Status Updated
[New status information]"
```

### List Context Issues
```bash
gh issue list --label "context" --state open
```

## Template Used

Uses `/docs/ISSUE-TEMP.md` which contains:
- DISCUSSION LOG for session tracking
- ACCUMULATED CONTEXT for requirements gathering
- PLANNING READINESS CHECKLIST for validation
- TECHNICAL ARCHITECTURE section
- Related issues tracking

## Output

Creates GitHub Issues with:
- **Title**: `[ISSUE-XXX] [Topic Name]`
- **Body**: Complete context template with initial information
- **Labels**: `context`, `planning`
- **Updates**: Via GitHub issue comments for iterative discussions

## Configuration

Updates `.claude/config.json` to track issue numbers:
- Increments `lastContextNumber` for new issues
- Stores mapping between local numbers and GitHub issue numbers