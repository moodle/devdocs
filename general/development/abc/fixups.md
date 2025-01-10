---
title: "A better contribution: Fixup commits"
sidebar_label: Fixup commits
description: Using fixup commits when responding to review comments
tags:
  - Getting started
  - Contributing
  - Best practices
---

As Moodle developers, we spend a lot of time reviewing each other's code. When our code has been reviewed, we may want to improve it, and then it will need to be reviewed again. At this point there are two conflicting needs:

- We want finished code in a clean branch with a few logical commits, which is ready to be integrated.
- However, if the code needs to be re-reviewed by the same person who already looked at it, then they  just want to see what you changed.

Fortunately, there is a way to achieve both at the same time, and this page tells you how.

## Simple example with a bug fix

Suppose you have done a bug fix as one commit:

```
MDL-12345 mathslib: 2 + 2 acutally equals 4, not 5
```

This has now been reviewed and some changes suggested. You make those amends in your workspace:

```
$ git status
On branch MDL-12345_main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   lib/mathslib.php

no changes added to commit (use "git add" and/or "git commit -a")
```

If your only goal was to make an updated commit for integration, you could do `git commit -a --amend`. However, to be nice to the integrator, it is better to make a separate commit:

```
$ git commit -a -m "MDL-12345 code review changes"
[MDL-12345_main d4619086970] MDL-12345 code review changes
 1 file changed, 1 insertion(+), 1 deletion(-)
```

(Of course, that is not a very good commit comment. I am sure you can do better if there is more that is worth explaining.)

Now, we want to make that branch with two commits available to the reviewer, so they can see what we have done, so we can push it to GitHub with a different name:

```
git push origin MDL-12345_main:MDL-12345_fixups
```

We can now add a comment to the issue like:

> Thank you for reviewing my code. I have made the changes you suggested, which you can see at http<span>s://</span>github.com/[your-github]/moodle/commit/M<span>DL-12</span>345_fixups.

Then, we want to clean up the original M<span>DL-12</span>345_main branch, so there is no reason to delay if the reviewer is now happy. We can do that with a simple rebase -i to squash the two commits (although, like everything in git, there are other ways you could do this):

```
$ git rebase -i main
...
```

that opens your edit with the rebase steps. Change the second commit to 'f' for fixup:

```
pick 8a40fb4dbbd MDL-12345 mathslib: 2 + 2 acutally equals 4, not 5
f d4619086970 MDL-12345 code review changes
```

when you save in your editor, the rebase continues, and then you can push the cleaned up integration branch:

```
...
Successfully rebased and updated refs/heads/MDL-12345_main.

$ git push origin MDL-12345_main -f
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 4 threads
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 404 bytes | 202.00 KiB/s, done.
Total 4 (delta 3), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (3/3), completed with 3 local objects.
To github.com:timhunt/moodle.git
   7d6f282aef0..27c92c180ca  MDL-12345_main -> MDL-12345_main
```

## A more complex example

This is [a real example from MDL-80880](https://tracker.moodle.org/browse/MDL-80880?focusedId=1065188&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-1065188) from an improvement I made. The original work comprised two commits:

```
MDL-80880 quiz: summary of an attempt output changed to a templateable
MDL-80880 quiz: change display of previous attempts summary
```

The Integration reviewer made a few comments, and I made the required changes and committed them separately using a [particular git commit option](https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---fixupamendrewordltcommitgt) to say which original commit each fixup related to:

```
$ git commit -a --fixup fdefddce200
```

That left me with a set of commits like this:

```
MDL-80880 quiz: summary of an attempt output changed to a templateable
MDL-80880 quiz: change display of previous attempts summary
fixup! MDL-80880 quiz: summary of an attempt output changed to a templateable
fixup! MDL-80880 quiz: summary of an attempt output changed to a templateable
fixup! MDL-80880 quiz: change display of previous attempts summary
```

which I could push to show the fixups. The `--fixup` magic pays off when you rebase. You can use the [`--autosquash` option](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---autosquash) and it automatically creates the right set of rebase steps:

```
$ git rebase -i --autosquash
```

After working through that, we have the clean branch ready to push.

Except that it is possible to do even better. In the branch showing the fixups it would be nice to re-order them so that each fixup is next to the original commit it amends to and the history [looks like this](https://github.com/timhunt/moodle/compare/main...MDL-80880-fixups):

```
MDL-80880 quiz: summary of an attempt output changed to a templateable
fixup! MDL-80880 quiz: summary of an attempt output changed to a templateable
fixup! MDL-80880 quiz: summary of an attempt output changed to a templateable
MDL-80880 quiz: change display of previous attempts summary
fixup! MDL-80880 quiz: change display of previous attempts summary
```

The way to get that is to not let `git rebase -i --autosquash` do all of its magic. When your editor opens with the list of `pick` and `fixup` commands, you can change all the fixups back to picks, so the commits just get re-ordered. Once you have done that and pushed the branch showing the fixups, you can rebase again to squash the commits.

One other tip: When you are making the separate fixup commits, if you get carried away and make a lot of the changes in your workspace, and only later think about committing them separately, have a look at [`git add -p`](https://git-scm.com/docs/git-add#Documentation/git-add.txt--p).

If you would like to see an example of this being done in a really large change, see [this branch](https://github.com/timhunt/moodle/compare/main...MDL-74610-fixes-04-08), related to [this comment on MDL-74610](https://tracker.moodle.org/browse/MDL-74610?focusedId=1075220&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-1075220).

## Summary

When replying to a reviewer, you can make their task easier by pushing a branch where it is easy to see what changes you made. However, for integration, we want a clean branch that is ready to be merged. It is possible to have both by pushing your changes with two different branch names. Using a few simple git commands it is not too much trouble to make both branches.

Even though it is not that much work do to this, it is not always worth doing this. Some cases where I would not bother to do this:

1. If the whole changes is small and simple, for example a one-line fix with one added unit test to verify it, then it is no trouble for someone to review the whole thing.
2. If the requested change was really minor, for example if the review suggested you edit one comment to make it a bit clearer and you have done that, then this is another case where just pushing the amended branch is probably fine.
3. The other time when there is no point doing this is at the other extreme. Suppose the result of the first review was to suggest a completely different approach to the code, so you have largely re-written the change. In that case, the difference between the first and second attempted implementation is unlikely to be of any value. Just concentrate on making your second version of the code as good as possible and push that.
