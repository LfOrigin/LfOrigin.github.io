---
title: Git 常用命令与工作流
date: 2026-11-08
icon: code-branch
---

# Git 常用命令与工作流

这份笔记记录日常开发中最高频的 Git 操作，以及一个够用的小团队工作流。

## 配置

```bash
git config --global user.name "你的名字"
git config --global user.email "you@example.com"

# 让换行符在 Windows 上也能正常工作
git config --global core.autocrlf true

# 更易读的日志
git config --global alias.lg "log --oneline --graph --decorate --all"
```

## 日常三板斧

```bash
git status          # 看当前状态
git diff            # 看未暂存的改动
git log --oneline   # 看提交历史
```

## 提交

```bash
git add -p              # 交互式选择要提交的片段，强烈推荐
git commit -m "feat: 支持文章分页"
git push
```

### 提交信息约定

采用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

| 前缀 | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档 |
| `style` | 格式调整，不影响逻辑 |
| `refactor` | 重构 |
| `chore` | 构建、依赖等杂项 |

## 分支

```bash
git switch -c feature/pagination   # 创建并切换分支
git switch main                    # 切回主分支
git branch -d feature/pagination   # 删除已合并分支
```

## 合并与变基

```bash
git merge feature/pagination   # 保留分支历史
git rebase main                # 把当前分支的提交移到 main 之后，历史更线性
```

::: warning 不要在公共分支上 rebase

`rebase` 会改写提交哈希。如果分支已经推送到远端并且有其他人使用，改写历史会让别人很痛苦。

:::

## 撤销

```bash
# 撤销工作区的修改（危险，未提交的改动会丢失）
git restore path/to/file

# 取消暂存
git restore --staged path/to/file

# 修改最后一次提交信息
git commit --amend

# 回退到某个提交，但保留改动在工作区
git reset --soft HEAD~1
```

## 暂存现场

写到一半需要切分支修 bug 时：

```bash
git stash push -m "wip: 分页组件"
git switch main
# 修完 bug 后回来
git switch -
git stash pop
```

## 一个够用的工作流

1. 从 `main` 拉新分支：`git switch -c feat/xxx`
2. 小步提交，提交信息写清楚
3. 推送分支并开 Pull Request
4. 至少一人 review 后合并
5. 合并后删除分支

对个人项目来说，直接在 `main` 上提交也没问题，但养成开分支的习惯在团队协作时很有用。
