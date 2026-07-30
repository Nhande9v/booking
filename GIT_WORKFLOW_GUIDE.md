# 🌿 Git Workflow Guide cho dự án Booking

> File này hướng dẫn **đúng tình trạng hiện tại** của repo bạn:
> - Remote đã trỏ về `https://github.com/Nhande9v/booking.git` ✅
> - Đang có **27+ file thay đổi** chưa commit (gồm Docker setup, healthcheck, ...)
> - Chưa có `.gitignore` ở root, chưa có PR template
> - `frontend/.env` chưa được ignore — **rất nguy hiểm**

---

## 🎯 Mục tiêu sau khi xong file này

1. Commit tất cả công việc Docker đã làm với commit message chuẩn
2. Push lên GitHub branch `main`
3. Tạo nhánh `develop`, làm 1 feature thử rồi mở Pull Request
4. Bảo vệ branch `main` để không ai (kể cả bạn) push thẳng lên
5. Hiểu workflow Git Flow để áp dụng từ giờ trở đi

---

## ⚠️ Những file mình đã chuẩn bị giúp bạn

### 1. `.gitignore` ở root (mới tạo)
- Ignore `node_modules`, `.env`, `dist`, `*.pem`, `.vscode/`...
- **Quan trọng:** chặn tất cả `.env` và file `*.pem` (như `global-bundle.pem`) khỏi bị push lên GitHub

### 2. `backend/.gitignore` (đã sửa)
- File cũ có lỗi `.node_modules/` (có dấu chấm thừa → không hoạt động)
- Đã sửa lại đúng

### 3. `.github/pull_request_template.md` (mới tạo)
- Template tự động hiện ra khi bạn mở PR trên GitHub
- Buộc bản thân (và team sau này) viết PR có format chuẩn

---

## 🚨 KIỂM TRA QUAN TRỌNG TRƯỚC KHI COMMIT

### Bước 0.1: Đảm bảo `.env` chưa từng bị commit lên GitHub

Mở terminal Git Bash, chạy:

```bash
git ls-files | grep -E "\.env$|\.pem$"
```

**Kết quả mong đợi:** không có gì in ra (terminal trống).

**Nếu có in ra `.env` hoặc `.pem`:**
- File secret đã bị commit từ trước → cần xóa khỏi history
- Báo mình biết, mình sẽ hướng dẫn dùng `git filter-repo` để xóa

### Bước 0.2: Kiểm tra `.env` đang được ignore đúng

```bash
git check-ignore -v frontend/.env backend/.env
```

**Kết quả mong đợi:** in ra dòng nói rằng file bị ignore bởi `.gitignore` (ở root hoặc subfolder).

Nếu không in gì → `.env` chưa bị ignore, cần kiểm tra lại `.gitignore`.

---

## 📦 Bước 1: Commit và push công việc đang dở

Bạn đang có rất nhiều thay đổi. Commit gộp tất cả thành **một lần duy nhất** sẽ khó review. Tốt hơn là **commit theo từng nhóm logic**.

### 1.1. Stage và commit từng nhóm

#### Nhóm 1: Cấu hình Git (gitignore, PR template)

```bash
git add .gitignore backend/.gitignore .github/pull_request_template.md
git commit -m "chore: setup gitignore and PR template"
```

#### Nhóm 2: Docker setup (Dockerfile, compose, dockerignore)

```bash
git add backend/Dockerfile backend/Dockerfile.prod backend/.dockerignore \
        frontend/Dockerfile frontend/.dockerignore frontend/nginx.conf \
        docker-compose.yml dockerprocess.md
git commit -m "feat(docker): containerize backend and frontend with healthcheck"
```

#### Nhóm 3: Health check endpoint trong backend

```bash
git add backend/src/controllers/healthController.js \
        backend/src/routes/healthRouters.js \
        backend/src/server.js
git commit -m "feat(health): add liveness and readiness probes for /api/health"
```

#### Nhóm 4: Tài liệu DevOps

```bash
git add DEVOPS_ROADMAP.md DOCKER_FINAL_TASKS.md HEALTHCHECK_GUIDE.md GIT_WORKFLOW_GUIDE.md
git commit -m "docs: add DevOps roadmap and learning guides"
```

#### Nhóm 5: Toàn bộ thay đổi code app còn lại

Đây là tất cả các file frontend/backend bạn đã sửa trong quá trình develop dự án. Commit gộp:

```bash
git add .
git commit -m "feat: refactor components and update app features"
```

> Sau lệnh này, `git status` phải báo "nothing to commit, working tree clean".

### 1.2. Push lên GitHub

```bash
git push origin main
```

> Lần đầu push nhiều commit nên có thể mất vài giây. Sau khi push xong, vào https://github.com/Nhande9v/booking sẽ thấy đầy đủ.

### 1.3. Tại sao chia commit ra như vậy?

| Cách commit | Ưu điểm | Nhược điểm |
| ----------- | ------- | ---------- |
| Một commit duy nhất `git add . && commit -m "update"` | Nhanh, gọn | Khó review, khó revert |
| Chia theo nhóm logic | Lịch sử rõ ràng, revert chính xác | Lâu hơn 5 phút |
| Một commit cho mỗi file | Quá chi tiết | Spam history |

**Tip:** xem lịch sử đẹp:
```bash
git log --oneline --graph --all
```

---

## 🎨 Bước 2: Hiểu Conventional Commits

Conventional Commits là chuẩn đặt tên commit phổ biến nhất hiện tại. Format:

```
<type>(<scope>): <message>
```

### Các `type` thường dùng

| Type | Khi nào dùng |
| ---- | ------------ |
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `docs` | Sửa tài liệu, không sửa code |
| `style` | Format code (space, indent), không đổi logic |
| `refactor` | Cải tiến code nhưng không đổi behavior |
| `perf` | Tối ưu hiệu năng |
| `test` | Thêm/sửa test |
| `build` | Sửa hệ thống build (Webpack, Vite, npm scripts) |
| `ci` | Sửa CI config (GitHub Actions, Jenkins) |
| `chore` | Việc lặt vặt: cập nhật deps, .gitignore, configure tool |

### Ví dụ tốt vs xấu

❌ Xấu:
```
update
fix bug
abc
asdfgh
123
```

✅ Tốt:
```
feat(auth): add Google OAuth login
fix(booking): prevent double booking same room
docs(readme): update setup instructions
chore(deps): bump react from 19.0.0 to 19.2.4
ci: add backend lint workflow
refactor(api): extract booking validation to middleware
```

### Tại sao phải theo chuẩn?

1. **Tự sinh CHANGELOG**: tool như `standard-version`, `release-please` đọc commit để tự tạo release notes
2. **Semantic versioning tự động**: `feat:` → minor bump, `fix:` → patch bump, `BREAKING CHANGE` → major bump
3. **Dễ tìm**: search `git log --grep "fix(booking)"` để tìm tất cả bug fix module booking

---

## 🌳 Bước 3: Setup Git Flow (branching strategy)

### Quy ước nhánh

```
main          ────●──────●──────●──── Production - LUÔN ổn định
                  │      │      │
develop       ────●──●───●──●───●──── Tích hợp các feature trước khi release
                     │      │
feature/xxx   ───────●──────│         Mỗi feature 1 nhánh
                            │
hotfix/yyy    ──────────────●         Sửa lỗi gấp trên production
```

### 3.1. Tạo nhánh `develop`

```bash
git checkout -b develop
git push -u origin develop
```

> `-u origin develop` set up tracking branch — sau này chỉ cần `git push` (không cần ghi rõ remote và branch).

### 3.2. Quy trình làm 1 feature

Giả sử bạn muốn thêm tính năng "filter hotel theo giá":

```bash
# Đảm bảo đang ở develop và đã sync mới nhất
git checkout develop
git pull origin develop

# Tạo branch feature từ develop
git checkout -b feature/filter-hotel-by-price

# Code... code... code...
# Sau đó:
git add .
git commit -m "feat(search): add price range filter for hotels"

# Push lên GitHub
git push -u origin feature/filter-hotel-by-price
```

GitHub sẽ tự động hiển thị banner "Compare & pull request" → nhấn vào → mô tả PR (template mình tạo sẵn sẽ tự xuất hiện) → tạo PR vào `develop`.

### 3.3. Quy trình làm hotfix (sửa lỗi gấp trên production)

Hotfix khác feature: cắt từ `main`, không phải `develop`.

```bash
git checkout main
git pull origin main
git checkout -b hotfix/fix-booking-crash

# Sửa bug...
git commit -m "fix(booking): prevent crash when checkin date is null"
git push -u origin hotfix/fix-booking-crash
```

→ Mở 2 PR: một vào `main`, một vào `develop` (để bug fix có cả ở dev environment).

---

## 🔒 Bước 4: Bảo vệ nhánh `main`

Đây là bước **cực kỳ quan trọng** — không có nó thì Git Flow vô nghĩa vì ai cũng push thẳng được vào main.

### 4.1. Trên GitHub:

1. Vào repo `Nhande9v/booking`
2. Click tab **Settings** (góc trên cùng bên phải)
3. Bên menu trái → **Branches**
4. Mục **Branch protection rules** → click **Add branch protection rule**

### 4.2. Cấu hình rule cho `main`:

| Field | Giá trị | Tại sao |
| ----- | ------- | ------- |
| **Branch name pattern** | `main` | Áp dụng cho nhánh main |
| ✅ **Require a pull request before merging** | bật | Bắt buộc qua PR, không push thẳng |
| → Require approvals | 1 (nếu đi 1 mình thì để 0) | Cần người duyệt |
| ✅ **Require status checks to pass** | bật | Buộc CI phải xanh mới merge (sẽ dùng ở Giai đoạn 3) |
| ✅ **Require conversation resolution** | bật | Phải resolve hết comment review |
| ✅ **Do not allow bypassing** | bật | Kể cả admin cũng phải tuân thủ |
| ❌ **Allow force pushes** | KHÔNG bật | Force push xóa lịch sử, cực nguy hiểm |
| ❌ **Allow deletions** | KHÔNG bật | Không cho ai xóa main |

→ **Save changes**.

### 4.3. Test thử

Quay về terminal, thử push trực tiếp vào main:

```bash
git checkout main
echo "test" > test.txt
git add test.txt
git commit -m "test direct push"
git push
```

GitHub sẽ **từ chối** với thông báo:
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Required status check ... is missing.
```

→ Hoàn hảo. Giờ bạn buộc phải qua PR.

Xóa commit vừa rồi:
```bash
git reset --hard HEAD~1
rm test.txt
```

---

## 🛠️ Bước 5: Bài thực hành để hoàn thành Giai đoạn 2

### 5.1. Tạo feature branch để test workflow

```bash
git checkout develop
git pull origin develop

git checkout -b feature/add-readme
```

Mở `README.md` ở root (nếu chưa có thì tạo), thêm vài dòng giới thiệu dự án:

```markdown
# Booking - MERN Stack Hotel Booking App

## Tech Stack
- Frontend: React 19 + Vite + TailwindCSS
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- DevOps: Docker + Docker Compose

## Quick Start
\`\`\`bash
docker compose up --build -d
\`\`\`

App: http://localhost:5173
API: http://localhost:5001/api
```

Commit và push:

```bash
git add README.md
git commit -m "docs: add project README with quick start guide"
git push -u origin feature/add-readme
```

### 5.2. Tạo Pull Request

1. Vào https://github.com/Nhande9v/booking
2. GitHub sẽ hiện banner xanh: **"feature/add-readme had recent pushes — Compare & pull request"** → click
3. **Base branch:** `develop` (không phải `main`!)
4. **Compare branch:** `feature/add-readme`
5. PR template sẽ tự xuất hiện — điền vào
6. Click **Create pull request**

### 5.3. Review và merge

1. Đọc lại "Files changed" trong PR
2. Nếu OK → click **Merge pull request** → **Confirm merge**
3. Sau đó GitHub gợi ý xóa branch → **Delete branch** (clean repo)

### 5.4. Sync về local

```bash
git checkout develop
git pull origin develop          # Pull commit merge về

# Xóa branch local đã merge
git branch -d feature/add-readme
```

### 5.5. Khi đủ feature, merge develop vào main (release)

```bash
# Tạo PR từ develop vào main
git checkout develop
# Trên GitHub: New PR, base=main, compare=develop
# Hoặc CLI: dùng gh tool
```

---

## 📋 Checklist hoàn thành Giai đoạn 2

- [ ] Đã chạy `git ls-files | grep -E "\.env$|\.pem$"` và không thấy file secret nào
- [ ] Đã commit theo nhóm logic (5 commit) và push lên main
- [ ] Đã tạo branch `develop` và push
- [ ] Đã bảo vệ branch `main` trên GitHub Settings
- [ ] Đã tạo 1 feature branch, viết commit theo Conventional Commits
- [ ] Đã mở 1 Pull Request, sử dụng template, merge vào develop
- [ ] Đã pull về và xóa branch local đã merge
- [ ] Hiểu rõ Git Flow: main / develop / feature / hotfix

---

## 🚨 Bonus: Các lệnh Git "cứu nguy" khi sai

| Tình huống | Lệnh |
| ---------- | ---- |
| Commit nhầm message | `git commit --amend -m "message mới"` (chỉ commit chưa push) |
| Quên file trong commit cuối | `git add file && git commit --amend --no-edit` |
| Hủy commit cuối nhưng giữ thay đổi | `git reset --soft HEAD~1` |
| Hủy commit cuối và xóa thay đổi | `git reset --hard HEAD~1` ⚠️ |
| Đã push commit nhạy cảm (chứa secret) | Đổi key ngay → `git filter-repo` xóa khỏi history → force push |
| Lỡ tay push lên nhánh sai | `git revert <commit-hash>` (an toàn hơn reset đã push) |
| Sync branch local với remote | `git fetch origin && git reset --hard origin/<branch>` |

---

## 🎯 Khi nào sang Giai đoạn 3?

Khi tất cả checkpoint trên đã tick xong. Giai đoạn 3 là **CI/CD với GitHub Actions** — sẽ dùng đúng cấu trúc branch + PR mà bạn vừa setup. Khi mở PR sẽ tự chạy lint + test, merge xong tự build Docker image push lên Docker Hub.

> 💡 **Lời khuyên:** Đừng skip Giai đoạn 2 dù bạn nghĩ "đã biết Git rồi". Workflow Git Flow + PR + branch protection là yêu cầu **căn bản** ở mọi công ty có quy trình. Học cho chắc giờ tiết kiệm thời gian sau này.
