# Pull Request Command

Creates Pull Requests from pushed feature branches, ALWAYS targeting staging branch.

## Usage

```bash
/pr > [feedback]               # Create Pull Request with feedback
```

## Examples

```bash
/pr > Ready for review, all tests passing
/pr > Fixed auto-registration loop, please test
/pr > Implemented loading spinner component
```

## Critical Rules (NEVER VIOLATE)

❌ **NEVER target PR to main branch** - ALWAYS use staging branch as target
❌ **NEVER merge PRs yourself** - Provide PR link and wait for user instructions
✅ **ALWAYS target staging branch** - staging → main only direction
✅ **ALWAYS include validation status** - build, lint, test results

## PR Creation Workflow

### Pre-PR Checklist
- [ ] Feature branch pushed to remote
- [ ] All validation passed (100% build, 100% lint, 100% tests)
- [ ] Branch name follows format: feature/task-[XXX]-[X]-[description]
- [ ] Working directory is clean (no uncommitted changes)
- [ ] PR targeting staging branch (NEVER main)

### PR Creation Process
1. **Create PR**: Generates pull request from feature branch to staging
2. **Include Feedback**: Adds provided feedback as PR description
3. **Validation Status**: Includes build/lint/test results
4. **Link Only**: Provides PR link, never merges automatically
5. **Wait for Review**: Waits for user instructions before any merge

### PR Template Structure
```markdown
## [TASK-XXX-X] [Task Title]

### 🎯 Objective
[Single deliverable description]

### ✅ Validation Status
- **Build**: 100% PASS (0 errors, 0 warnings)
- **Lint**: 100% PASS (0 violations)
- **Tests**: 100% PASS (0 failures)
- **TypeScript**: Compilation successful

### 📝 Changes
- [List of files modified/created]
- [Summary of changes made]

### 🔄 Review Request
[User feedback provided]

### 🚨 Merge Instructions
- **Target**: staging branch (NEVER main)
- **Merge**: Wait for user approval before merging
```

## Related Commands

- /impl - Implementation before creating PR
- /mode - Mode affects who creates PRs
- /plan - Planning before implementation

## Safety Notes

- Always verify branch is targeting staging, not main
- Never merge automatically - wait for explicit user approval
- Include complete validation status in PR description
- Follow proper git workflow and branch naming conventions