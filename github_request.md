# Steps to follow.
git checkout main                        ← switch to main
git pull origin main                     ← get latest code

git checkout -b feature/my-new-feature  ← create new branch

# ...make your changes...

git add .                                ← stage
git commit -m "what you did"            ← commit
git push origin feature/my-new-feature  ← push branch

# → go to GitHub → create Pull Request → review → merge

git checkout main                        ← back to main
git pull origin main                     ← sync the merge
git branch -d feature/my-new-feature    ← delete old branch

