# Contributing

All changes reach `main` through a pull request. Create a branch, open a PR against `main`, resolve all conversations, and wait for the required `ci-success` check before merging. Zero approvals are required for the solo maintainer, but direct pushes (including by administrators) are not allowed.

Before opening a PR, run:

```sh
npm ci
npm run lint
npm run type-check
npm test
npm run build
node scripts/check-package.mjs
```

Update `CHANGELOG.md` for user-facing changes. Use squash merges only.

## Initial ruleset setup

After this CI PR is merged, confirm that `ci-success` has run successfully on `main`, then apply the ruleset:

```sh
gh api --method POST repos/hemasurya106/react-generative-ui/rulesets --input .github/rulesets/main.json
```

The ruleset API cannot control which merge methods the repository offers. In **Settings → General → Pull Requests**, enable **Allow squash merging** and disable **Allow merge commits** and **Allow rebase merging**. Then go to **Settings → Rules → Rulesets**, open **Protect main**, and verify it targets `main`, has no bypass actors, requires a PR with zero approvals and resolved conversations, requires `ci-success` with branches up to date, requires linear history, blocks force pushes and deletions, and has merge queue disabled.
