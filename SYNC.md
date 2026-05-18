# Sync and Git workflow

How this project moves between the laptop, the home Mac, and GitHub.

## The architecture in one paragraph

The project folder lives inside a Syncthing-mirrored share (run by the UGREEN NAS app). Syncthing mirrors the **working tree** (the actual files you edit) to the NAS and the home Mac. It does **not** mirror `.git/` — the `.stignore` file at the parent level excludes all dotfiles, which is what we want. Git history is synced via **GitHub** (`git pull` / `git push`). Each Mac has its own local `.git/` directory pointing at the same GitHub remote.

So: Syncthing = working-tree backup. Git = the real sync between machines.

## Daily workflow (both Macs)

Run these from inside the project folder.

**When you sit down:**
```
git pull
```

**When you stand up:**
```
git add -A
git commit -m "what you changed"
git push
```

That's it. The Syncthing mirror catches up in the background; you don't have to wait for it.

## The one rule

**Only edit on one Mac at a time.** Before opening the project on the other Mac, make sure:
1. The Mac you're leaving has run `git push`.
2. The Mac you're moving to runs `git pull` before you start editing.

If you forget step 1, you'll lose nothing — but the other Mac's `git pull` will bring in stale state. You'll notice quickly.

## Home Mac: one-time setup

The first time you sit down at the home Mac after this setup, do this once. The synced folder already has the working-tree files (Syncthing put them there), but it's not yet a Git repo on the home Mac.

```
# 1. Generate an SSH key on the home Mac (no passphrase for convenience)
ssh-keygen -t ed25519 -C "alexgray84-homemac" -f ~/.ssh/id_ed25519 -N ""

# 2. Print the public key — copy it
cat ~/.ssh/id_ed25519.pub

# 3. In a browser, paste it into https://github.com/settings/ssh/new
#    Title: "Home Mac"

# 4. Test the connection
ssh -T git@github.com
# Should say: "Hi alexgray84! You've successfully authenticated..."

# 5. Set Git identity
git config --global user.name "Alex Gray"
git config --global user.email "alexgray84@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.fileMode false
git config --global core.fsmonitor false
git config --global core.untrackedCache false

# 6. cd into the synced project folder (path depends on where the
#    UGREEN NAS app put the synced share on the home Mac).
cd "/path/to/Coding Projects/Science Site"

# 7. Attach a fresh .git/ to the existing working tree.
#    The working tree on the home Mac was put there by Syncthing
#    and matches what's on GitHub, so this aligns the two safely.
git init
git remote add origin git@github.com:alexgray84/Biology.git
git fetch origin
git reset --hard origin/main
git branch --set-upstream-to=origin/main main
```

From then on, the home Mac uses the same `git pull` / `git push` workflow as the laptop.

## Recovery: if Git gets weird

Symptoms: `git status` shows nonsense, push fails with errors about missing objects, you see files like `something.pack.sync-conflict-*`.

Recovery is cheap because everything is on GitHub:

```
cd "/Applications/Coding Projects"
mv "Science Site" "Science Site.broken-$(date +%Y-%m-%d)"
git clone git@github.com:alexgray84/Biology.git "Science Site"
```

Then delete the broken folder once you've confirmed nothing unpushed was in it (look at `git status` and `git log` inside the broken copy first).

## What's in `.gitignore`

`.DS_Store`, macOS resource forks (`._*`), Syncthing artefacts (`.stfolder*`, `.stversions/`, `#SyncVersion/`), Syncthing conflict files (`*.sync-conflict-*`), editor swap files, `excalidraw.log`, and `IGCSE/files.zip` (the source folder is committed; the zip is redundant).

If Syncthing ever does produce a `*.sync-conflict-*` file, it's already ignored — but it's a signal that the one-machine-at-a-time rule was broken. Look at the conflict file, decide which version is correct, and delete the wrong one.

## Backups

- `~/CodeBackups/science-site-prerepo-2026-05-18.tar.gz` on this laptop is the pre-Git snapshot of the folder. Keep it for a few weeks then delete.
- `Science Site.local-backup-2026-05-18/` next to the project is the same content as a folder. Delete once you're confident nothing's missing from the repo. **Do not** let this folder get synced to the NAS as-is — it'll just be dead weight. Either move it to `~/CodeBackups/` or delete it.

## Remote

```
git remote -v
# origin  git@github.com:alexgray84/Biology.git (fetch)
# origin  git@github.com:alexgray84/Biology.git (push)
```

GitHub Pages serves the `main` branch at https://alexgray84.github.io/Biology/. Any push to `main` will be live on Pages within a minute or two.
