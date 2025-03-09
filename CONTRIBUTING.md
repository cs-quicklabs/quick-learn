# Contributing Guidelines

Welcome! We appreciate your interest in contributing to this project. This guide outlines the process for contributing code, documentation, or other improvements.

## Before You Contribute

1. Review the codebase: Familiarize yourself with the project's code and structure.
2. Fork the repository: Create a fork of the repository on your GitHub account.
3. Set up a development environment: Install the necessary tools and dependencies

### How to Contribute

1. Create a new branch: Create a new branch on your forked repository for your specific contribution.
2. Make changes: Make your changes to the code or documentation.
3. Commit your changes: Write clear and concise commit messages that describe your changes.
4. Test your changes: Thoroughly test your changes to ensure they don't introduce regressions.
5. Push your changes: Push your changes to your forked repository branch.
6. Open a pull request: Create a pull request on the main repository proposing your changes.

### Creating a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Create a branch from `dev` and make your changes on it:

   ```shell
   git checkout -b <branch-name>
   ```

2. Push those changes on GitHub:

   ```shell
   git push -u origin <branch-name>
   ```

3. If you’ve fixed a bug or added code that should be tested, add tests!
4. Ensure that all tests pass:

   ```bash
   # To run the tests in headless mode, (hides the browser)
   yarn test-run

   # To run the tests in browser
   yarn test-open
   ```

5. Before creating a PR, build the project in your local system, ensuring-3 no
   build error:
   ```shell
   yarn build
   ```
6. In GitHub, send a pull request to `dev`.

### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull
the changes from the dev (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your
  local shell as follows:

  ```shell
  git push origin --delete <branch-name>
  ```

- Check out the dev branch:

  ```shell
  git checkout dev -f
  ```

- Delete the local branch:

  ```shell
  git branch -D <branch-name>
  ```

- Update your dev with the latest upstream version:

  ```shell
  git pull origin dev
  ```

### Style Guide

We use code formatter [Prettier](https://prettier.io/) with
[husky](https://github.com/typicode/husky) &
[lint-staged](https://github.com/okonet/lint-staged) which automatically format
supported files that are marked as “staged” via `git add` before you commit.

## <a name="commit-format"></a> Commit Message Format

This format leads to **easier to read commit history**.

Each commit message consists of a **header**, a **body**, and a **footer**.

```properties
header: <type>[optional scope]: <short summary>

body: [optional body]

footer: [optional footer(s)]
```

#### <a name="commit-header"></a>Commit Message Header

```
<type>(<optional scope>): <short summary>
  │             │               │
  │             │               └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │             │
  │             └─⫸ Commit Scope: core|constants|deps
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is
optional.

##### Type

Must be one of the following:

- **ci**: Changes to our CI configuration files and scripts
  - `"ci: add github actions build workflow"`
- **chore**: Build script configuration edits, dependency package updates and
  other updates that do not alter production code

  - `"chore(deps): bump next.js v10.0.8 to v12.0.4"`

- **docs**: Documentation only changes

  - `"docs: add detailed installation instructions for Windows"`

- **feat**: A new feature

  - `"feat: add ability to filter tests by user"`

- **fix**: A bug fix

  - `"fix: check if file exists before attempting to unlink"`

- **perf**: A code change that improves performance
  - `"perf: add debounce in searchbox"`
- **refactor**: A code change that neither fixes a bug nor adds a feature
  - `"refactor: rename Header component to UserHeader component"`
- **test**: Adding missing tests or correcting existing tests
  - `"test: add assertions for Collection update and destroy methods"`
- **revert**: The commit reverts a previous commit
  - `"revert: let us never again speak of the noodle incident"`

##### Summary

Use the summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

#### <a name="commit-body"></a>Commit Message Body

Explain the motivation for the change in the commit message body. This commit
message should explain _why_ you are making the change. You can include a
comparison of the previous behavior with the new behavior in order to illustrate
the impact of the change.

#### <a name="commit-footer"></a>Commit Message Footer

The footer can contain information about breaking changes and deprecations and
is also the place to reference GitHub issues, Jira tickets, and other PRs that
this commit closes or is related to. For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #<pr number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: "
followed by a summary of the breaking change, a blank line, and a detailed
description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with "DEPRECATED: " followed by a
short description of what is deprecated, a blank line, and a detailed
description of the deprecation that also mentions the recommended update path.

### Revert commits

The content of the commit message body should contain:

- information about the SHA of the commit being reverted in the following
  format: `This reverts commit <SHA>`,
- a clear description of the reason for reverting the commit message.

### Reference:

- [Conventional Commits](https://conventionalcommits.org)
- [Angular Commit Message Convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md/)
