# Execution Mode Command

Manages the execution mode for task assignment and implementation.

## Usage

```bash
/mode manual     # Switch to MANUAL mode (human implementation)
/mode copilot     # Switch to COPILOT mode (GitHub Copilot implementation)
/mode status      # Show current execution mode
```

## Examples

```bash
/mode manual
/mode copilot
/mode status
```

## Mode Behaviors

### MANUAL Mode (Default)
- **Task Assignment**: Tasks assigned to human developer
- **Implementation**: /impl triggers manual implementation workflow
- **Validation**: Human performs all validation and commits
- **Branch Creation**: Human creates feature branches
- **PR Creation**: Human creates pull requests using /pr

### COPILOT Mode
- **Task Assignment**: Tasks assigned to @github-copilot
- **Implementation**: /impl triggers copilot implementation workflow
- **Validation**: GitHub Copilot performs all validation
- **Branch Creation**: Copilot creates feature branches automatically
- **PR Creation**: Copilot creates pull requests targeting staging

## Mode Persistence

- Mode setting persists throughout the current session
- Mode is stored in project configuration
- Can be changed anytime without affecting existing tasks
- Default mode is MANUAL when starting new session

## Mode-Specific Commands

### Manual Mode Workflow
```bash
/mode manual     # Ensure in manual mode
/plan > [task]   # Creates task for human
/impl > [number] # Human implements task
/pr > [feedback] # Human creates PR
```

### Copilot Mode Workflow
```bash
/mode copilot    # Switch to copilot mode
/plan > [task]   # Creates task for copilot
/impl > [number] # Copilot implements task
# Copilot creates PR automatically
```

## Related Commands

- /plan - Creates tasks assigned based on current mode
- /impl - Triggers implementation based on current mode
- /fcs - Context management (mode-independent)