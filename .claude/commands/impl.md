# Task Implementation Command

Triggers implementation workflow based on current execution mode.

## Usage

```bash
/impl > [task-number]              # Implement single task
/impl batch > [task-numbers]       # Parallel execution (comma-separated)
/impl status                       # Monitor implementation progress
```

## Examples

```bash
/impl > 16
/impl batch > 16,17,18,19
/impl status
```

## Mode-Based Behavior

### MANUAL Mode
1. **Pre-Implementation Checklist**:
   - git checkout staging && git pull origin staging
   - Confirm Task Issue [TASK-XXX-X] exists and assigned to human
   - Context Issue must be [Implementation Ready]
   - git status - working directory must be clean

2. **Task Tool Execution**:
   - Triggers specialized agent with task requirements
   - Agent creates feature branch from staging
   - Implements following atomic task specifications
   - Ensures 100% validation pass (build + lint + TypeScript)

3. **Manual PR Creation**:
   - Human commits and pushes changes
   - Uses /pr command to create PR targeting staging
   - Human performs final review and merge

### COPILOT Mode
1. **Pre-Implementation Checklist**:
   - Verify Task Issue [TASK-XXX-X] exists and assigned to @github-copilot
   - Ensure GitHub Copilot is enabled in repository settings
   - Context Issue must be [Implementation Ready]

2. **GitHub CLI Assignment**:
   ```bash
   gh issue edit [task-number] --assignee "github-copilot" --add-label "copilot,priority-high"
   ```

3. **GitHub Copilot Auto-Execution**:
   - GitHub Copilot picks up assigned tasks automatically
   - Creates feature branches: feature/task-[XXX]-[X]-[description]
   - Implements following task specifications exactly
   - Runs 100% validation: build + lint + TypeScript compilation
   - Creates PRs targeting staging branch (NEVER main)
   - Ensures atomic task independence (no conflicts)

4. **Task Issue Creation via GitHub CLI**:
   ```bash
   # Create atomic task issue
   gh issue create \
     --title "[TASK-XXX-X] Atomic: [Single Deliverable]" \
     --body "$(cat docs/TASK-ISSUE-TEMP.md | sed -n '/## \[TASK-XXX-X\] Atomic:/,/```/p')" \
     --assignee @copilot \
     --label "atomic" \
     --label "independent-execution"
   ```

## Validation Requirements (BOTH MODES)

✅ npm run build passes with ZERO errors or warnings
✅ npm run lint passes with ZERO violations
✅ npx tsc --noEmit passes (TypeScript compilation)
✅ PRs target staging branch only (NEVER main)
✅ Atomic task independence (no merge conflicts)
✅ Follow CLAUDE.md safety rules exactly

## Progress Monitoring

```bash
# COPILOT Mode
gh pr list --author "github-copilot" --base staging
gh issue list --assignee "github-copilot" --state open

# Monitor all modes
/impl status
```

## Related Commands

- /plan - Create tasks before implementation
- /mode - Switch execution modes
- /pr - Create pull requests after implementation
- /fcs - Create context issues for planning