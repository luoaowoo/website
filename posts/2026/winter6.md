---
title: "[2026 寒假提高营 Day 6] 最短路"
date: 2026-03-21
categories: ["算法性"]
tags: ["OI相关", "算法相关","集训"]
cover: " "
description: "如题，集训Day6"
---

## 一、知识点讲解

最短路问题是图论中的核心问题之一，旨在寻找图中两点之间总权重最小的路径。根据图的性质（有无负权、有无负环、单源还是全源）和约束条件，需要选用不同的算法。

### 1.1 核心算法概览

- **单源最短路 (Single-Source Shortest Path, SSSP)**：求从一个起点到图中所有其他点的最短距离。
  - **Dijkstra算法**：适用于**无负权边**的图。基于贪心思想，使用优先队列（堆）优化后时间复杂度为 `O((V+E)logV)`。
  - **Bellman-Ford算法**：适用于**有负权边但无负环**的图。通过对所有边进行 `V-1` 轮松弛操作来求解，时间复杂度为 `O(VE)`。可用于检测负环。
  - **SPFA (Shortest Path Faster Algorithm)**：Bellman-Ford的队列优化版本，在随机图上效率较高，但最坏情况时间复杂度仍为 `O(VE)`。**常被用于负环检测**。
- **全源最短路 (All-Pairs Shortest Path, APSP)**：求图中任意两点之间的最短距离。
  - **Floyd-Warshall算法**：基于动态规划，代码简洁，时间复杂度为 `O(V^3)`，适用于稠密图或顶点数不多的情况。
  - **Johnson算法**：适用于稀疏图。通过引入一个虚拟源点，使用一次Bellman-Ford进行重赋权，消除负权边，然后对每个点运行一次Dijkstra。时间复杂度为 `O(VE log V)`。
- **特殊问题与变种**：
  - **最短路计数**：在求最短路的同时，记录达到最短距离的路径条数。
  - **次短路**：长度严格大于最短路的最短路径。
  - **分层图最短路**：通过“拆点”将状态（如已使用的特殊机会次数）也作为图的一部分，构建分层图后跑最短路。
  - **最短路径树 & 必经边/点**：与最短路径的拓扑结构相关的问题。

### 1.2 算法选择流程图

```
<code>graph TD
    A[开始: 单源最短路] --> B{图中有负权边?};
    B -- 否 --> C[Dijkstra (堆优化)];
    B -- 是 --> D{需要检测负环?};
    D -- 是 --> E[Bellman-Ford / SPFA];
    D -- 否, 仅求最短路 --> F[SPFA (注意可能被卡)];

    G[开始: 全源最短路] --> H{顶点数V?};
    H -- V较小 (≤500) --> I[Floyd-Warshall];
    H -- V较大, 图稀疏 --> J{有负权边?};
    J -- 否 --> K[对每个点运行 Dijkstra];
    J -- 是 --> L[Johnson算法];
</code>
```

## 二、模板题目思路及代码

### 2.1 单源最短路 (Dijkstra - 标准版) - P4779

- **题目概要**：给定有向/无向图，边权非负，求从源点 `s` 到所有点的最短距离。
- **思路**：使用**优先队列（小根堆）优化**的Dijkstra算法。每次从队列中取出当前距离最小的点进行松弛操作，确保每个点只被取出一次。
- **难度星级**：★★★☆☆ (核心模板，必须掌握)
- **完整代码 (C++)**：

```
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int MAXN = 1e5 + 5, MAXM = 2e5 + 5;
const ll INF = 0x3f3f3f3f3f3f3f3f;

struct Edge {
    int to, w, next;
} e[MAXM];
int head[MAXN], cnt;
ll dis[MAXN];
bool vis[MAXN];

void addEdge(int u, int v, int w) {
    e[++cnt] = {v, w, head[u]};
    head[u] = cnt;
}

void dijkstra(int s) {
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    memset(dis, 0x3f, sizeof(dis));
    dis[s] = 0;
    pq.emplace(0, s);
    
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (vis[u]) continue; // 已确定最短距离
        vis[u] = true;
        for (int i = head[u]; i; i = e[i].next) {
            int v = e[i].to, w = e[i].w;
            if (dis[v] > d + w) {
                dis[v] = d + w;
                pq.emplace(dis[v], v);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, s;
    cin >> n >> m >> s;
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        addEdge(u, v, w);
    }
    dijkstra(s);
    for (int i = 1; i <= n; ++i) {
        cout << (dis[i] == INF ? 2147483647 : dis[i]) << " \n"[i == n];
    }
    return 0;
}
```

### 2.2 负环检测 - P3385

- **题目概要**：判断给定有向/无向图中是否存在从 `1` 号点出发可达的负环。
- **思路**：使用 **SPFA** 算法。记录每个点的入队次数，如果某个点的入队次数超过 `n`（顶点数），则说明存在负环。也可以记录最短路径包含的边数。
- **难度星级**：★★★☆☆
- **完整代码 (C++) - SPFA判负环**：

```
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 2005, MAXM = 6005; // 注意无向边要开2倍
struct Edge { int to, w, next; } e[MAXM];
int head[MAXN], cnt, dis[MAXN], inqCnt[MAXN];
bool inq[MAXN];

void addEdge(int u, int v, int w) {
    e[++cnt] = {v, w, head[u]};
    head[u] = cnt;
}

bool spfa(int n) {
    queue<int> q;
    memset(dis, 0x3f, sizeof(dis));
    memset(inqCnt, 0, sizeof(inqCnt));
    memset(inq, 0, sizeof(inq));
    dis[1] = 0;
    q.push(1);
    inq[1] = true;
    inqCnt[1] = 1;
    
    while (!q.empty()) {
        int u = q.front(); q.pop();
        inq[u] = false;
        for (int i = head[u]; i; i = e[i].next) {
            int v = e[i].to, w = e[i].w;
            if (dis[v] > dis[u] + w) {
                dis[v] = dis[u] + w;
                if (!inq[v]) {
                    if (++inqCnt[v] > n) return true; // 入队超过n次，有负环
                    inq[v] = true;
                    q.push(v);
                }
            }
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m;
        cin >> n >> m;
        cnt = 0;
        memset(head, 0, sizeof(head));
        for (int i = 0; i < m; ++i) {
            int u, v, w;
            cin >> u >> v >> w;
            addEdge(u, v, w);
            if (w >= 0) addEdge(v, u, w); // 无向边
        }
        cout << (spfa(n) ? "YES" : "NO") << '\n';
    }
    return 0;
}
```

### 2.3 全源最短路 (Johnson) - P5905

- **题目概要**：给定有向图，可能有负权边，但保证无负环。求任意两点间的最短距离。
- **思路**：
  1. 新建虚拟源点 `0`，向所有点连一条权重为 `0` 的边。
  2. 以 `0` 为起点跑一次 **SPFA/Bellman-Ford**，得到每个点的势能 `h[i]`。如果检测到负环，则算法失败（本题保证无负环）。
  3. 对原图的每条边 `(u, v, w)` 进行重赋权：`w' = w + h[u] - h[v]`。可以证明新边权非负。
  4. 以每个点 `i` 为起点，在新图上跑一次 **Dijkstra**，得到距离 `d'[i][j]`。
  5. 原图真实最短距离为 `d[i][j] = d'[i][j] - h[i] + h[j]`。
- **难度星级**：★★★★☆ (综合了负权处理和Dijkstra)
- **完整代码 (C++)**：

```
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int MAXN = 3005, MAXM = 9005; // 原边 + 虚拟点连边
const ll INF = 1e9;
struct Edge { int to, w, next; } e[MAXM];
int head[MAXN], cnt;
ll h[MAXN], dis[MAXN];
bool vis[MAXN];

void addEdge(int u, int v, int w) {
    e[++cnt] = {v, w, head[u]};
    head[u] = cnt;
}

bool spfa(int n) { // 求势能h，并判负环
    queue<int> q;
    vector<int> inqCnt(n + 1, 0);
    vector<bool> inq(n + 1, false);
    fill(h, h + n + 1, 0);
    for (int i = 1; i <= n; ++i) {
        q.push(i);
        inq[i] = true;
        inqCnt[i]++;
    }
    while (!q.empty()) {
        int u = q.front(); q.pop();
        inq[u] = false;
        for (int i = head[u]; i; i = e[i].next) {
            int v = e[i].to, w = e[i].w;
            if (h[v] > h[u] + w) {
                h[v] = h[u] + w;
                if (!inq[v]) {
                    if (++inqCnt[v] > n) return false; // 有负环
                    inq[v] = true;
                    q.push(v);
                }
            }
        }
    }
    return true;
}

void dijkstra(int s, int n) {
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    fill(dis, dis + n + 1, INF);
    fill(vis, vis + n + 1, false);
    dis[s] = 0;
    pq.emplace(0, s);
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (vis[u]) continue;
        vis[u] = true;
        for (int i = head[u]; i; i = e[i].next) {
            int v = e[i].to, w = e[i].w;
            if (dis[v] > d + w) {
                dis[v] = d + w;
                pq.emplace(dis[v], v);
            }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        addEdge(u, v, w);
    }
    // 添加虚拟源点0的边
    for (int i = 1; i <= n; ++i) addEdge(0, i, 0);
    
    if (!spfa(n)) {
        cout << -1 << endl;
        return 0;
    }
    // 重赋权
    for (int u = 1; u <= n; ++u) {
        for (int i = head[u]; i; i = e[i].next) {
            if (e[i].to == 0) continue; // 忽略虚拟点连出的边
            e[i].w += h[u] - h[e[i].to]; // w' = w + h[u] - h[v]
        }
    }
    // 对每个点跑Dijkstra
    for (int s = 1; s <= n; ++s) {
        dijkstra(s, n);
        ll ans = 0;
        for (int t = 1; t <= n; ++t) {
            if (dis[t] == INF) ans += t * INF;
            else ans += t * (dis[t] - h[s] + h[t]); // 还原真实距离
        }
        cout << ans << '\n';
    }
    return 0;
}
```

## 三、难题思路及代码

### 3.1 最短路计数 - P1144

- **题目概要**：无向无权图（边权为1），求从 `1` 号点到每个点的最短路径条数。
- **思路**：在 **BFS** 或 **Dijkstra** 求最短路的过程中，同步维护计数数组 `cnt[v]`。当 `dis[v] > dis[u] + 1` 时，更新距离并重置计数 `cnt[v] = cnt[u]`；当 `dis[v] == dis[u] + 1` 时，累加计数 `cnt[v] = (cnt[v] + cnt[u]) % MOD`。
- **难度星级**：★★★☆☆
- **关键代码片段 (Dijkstra部分)**：

```
vector<int> cnt(n + 1, 0);
vector<int> dis(n + 1, INF);
cnt[1] = 1;
dis[1] = 0;
priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
pq.emplace(0, 1);
while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dis[u]) continue;
    for (int v : graph[u]) {
        if (dis[v] > d + 1) {
            dis[v] = d + 1;
            cnt[v] = cnt[u]; // 找到更短路径，计数重置
            pq.emplace(dis[v], v);
        } else if (dis[v] == d + 1) {
            cnt[v] = (cnt[v] + cnt[u]) % MOD; // 找到等长路径，计数累加
        }
    }
}
```

### 3.2 分层图最短路 - P4568 [JLOI2011] 飞行路线

- **题目概要**：可以选择 `k` 条边将其权值变为 `0`，求从 `s` 到 `t` 的最短路。
- **思路**：构建 `k+1` 层图。第 `i` 层表示已经使用了 `i` 次免费机会的状态。层内边权为原边权 `w`，从第 `i` 层向第 `i+1` 层连边权为 `0` 的边（代表使用一次免费机会）。然后在 `(s, 0)` 到 `(t, i)` (`0<=i<=k`) 中找最短路。
- **难度星级**：★★★★☆
- **核心建图与求解思路**：

```
// 假设点编号1~n，将其映射到分层图中：id = u + i * n， 其中i是层数(0~k)
void buildGraph(int n, int m, int k) {
    for (int i = 0; i < m; ++i) {
        int u, v, w; cin >> u >> v >> w;
        for (int j = 0; j <= k; ++j) { // 每层内部连原边
            addEdge(u + j*n, v + j*n, w);
            addEdge(v + j*n, u + j*n, w);
            if (j < k) { // 向下一层连免费边
                addEdge(u + j*n, v + (j+1)*n, 0);
                addEdge(v + j*n, u + (j+1)*n, 0);
            }
        }
    }
}
// 然后以 s (即 s + 0*n) 为起点跑Dijkstra
// 答案取 min(dis[t + i*n]) for i in [0, k]
```

### 3.3 最短路 + DP - P3953 [NOIP2017 提高组] 逛公园

- **题目概要**：求从 `1` 到 `n` 的长度不超过 `最短路+K` 的路径条数。
- **思路**：
  1. 先跑出从 `1` 出发和从 `n` 出发（在反向图上）的最短路 `dis1[]`, `disn[]`。
  2. 定义 `dp[u][r]` 表示走到点 `u`，当前路径长度比 `dis1[u]` 多出 `r` (`0 <= r <= K`) 的方案数。
  3. 记忆化搜索：`dp[u][r] = sum(dp[v][ r - (w - (dis1[v] - dis1[u])) ])`，其中 `(u->v, w)` 是一条边。转移需满足新差值 `>=0`。
  4. 需要判断 `0` 环：如果在搜索过程中，状态 `(u, r)` 再次被访问且尚未完成计算，说明存在 `0` 环，且该环在合法路径上，则有无穷多解。
- **难度星级**：★★★★★ (思维难度高，细节多)
- **关键代码框架 (记忆化搜索)**：

```
vector<vector<int>> dp(n + 1, vector<int>(K + 1, -1)); // -1未访问，-2访问中，>=0为方案数
vector<bool> inStack(n + 1, false); // 用于0环判断，更精确的做法是记录状态(u, r)

int dfs(int u, int r) {
    if (r < 0 || r > K) return 0;
    if (dp[u][r] != -1) return dp[u][r];
    if (u == n) dp[u][r] = 1; // 到达终点，找到一条路径
    else dp[u][r] = 0;
    
    inStack[u] = true; // 标记当前路径上的点（简化判断，实际应对状态）
    for (auto &[v, w] : graph[u]) {
        int nr = r - (w - (dis1[v] - dis1[u]));
        if (nr < 0) continue;
        if (inStack[v]) { // 发现可能构成0环（需更精确判断）
            // 如果 dis1[u] + w + disn[v] <= dis1[n] + K，则0环在合法路径上
            if (dis1[u] + w + disn[v] <= dis1[n] + K) {
                dp[u][r] = -2; // 标记无穷解
                break;
            }
        }
        int res = dfs(v, nr);
        if (res == -2) { // 子状态有无穷解
            dp[u][r] = -2;
            break;
        }
        dp[u][r] = (dp[u][r] + res) % MOD;
    }
    inStack[u] = false;
    return dp[u][r];
}
// 最终答案 = dfs(1, 0)。若为-2则输出-1。
```

## 四、剩余题目及思路

### 4.1 单源最短路 (弱化版) - P3371

- **思路**：数据较弱，Dijkstra (未优化)、SPFA 或 Bellman-Ford 均可通过。**但建议仍使用堆优化Dijkstra作为标准写法**。

### 4.2 邮递员送信 - P1629

- **思路**：从1号点到所有点送信（正向图最短路） + 所有点返回1号点（在**反向图**上求从1出发的最短路）。两段距离相加。

### 4.3 灾后重建 - P1119

- **思路**：**Floyd算法的动态应用**。村庄按时间顺序重建，每次修复一个村庄后，将其作为中转点 `k`，更新所有 `dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j])`。查询时，若两点均已修复，则直接输出当前 `dis[u][v]`。

### 4.4 最优贸易 - P1073

- **思路**：正反图结合。从起点 `1` 跑SPFA/Dijkstra（求最小值）得到到每个点 `i` 的路径上的**最低买入价 `minp[i]`**。从终点 `n` 在反向图上跑SPFA/Dijkstra（求最大值）得到从每个点 `i` 到 `n` 的路径上的**最高卖出价 `maxp[i]`**。答案即为 `max(maxp[i] - minp[i])`。

### 4.5 其他题目快速索引

| 题目编号 | 名称           | 核心考点/思路                                                | 难度  |
| :------- | :------------- | :----------------------------------------------------------- | :---- |
| P3647    | 连珠线         | **树形DP**，与最短路关联不大                                 | ★★★★★ |
| P6464    | 传送门         | 枚举添加的边，跑多次最短路                                   | ★★★☆☆ |
| P1938    | Job Hunt S     | 将点权转化为边权，求最长路，可判正环                         | ★★★☆☆ |
| P5837    | Milk Pumping G | 二分流量下界，检查最短路长度                                 | ★★★☆☆ |
| P1772    | 物流运输       | **DP + 最短路**。`dp[i]`表示前i天最小成本，`cost[j][i]`为第j到i天使用同一航线的最短路成本。 | ★★★★☆ |
| P2505    | 道路           | 枚举边，计算该边被多少条最短路径经过                         | ★★★★☆ |
| P4042    | 骑士游戏       | **SPFA/Dijkstra的变种**，类似“动态规划转移图上的最短路”      | ★★★★☆ |
| P1266    | 速度限制       | 二维状态最短路 `(结点, 当前速度)`                            | ★★★☆☆ |
| P2149    | Elaxia的路线   | 求出两条最短路的公共边，构建新图求最长链                     | ★★★★☆ |
| P2047    | 社交网络       | **Floyd** 求最短路并统计最短路径条数，计算重要度             | ★★★☆☆ |
| P4366    | 最短路         | 利用**二进制优化建图**，将边数从 `O(n^2)` 降到 `O(n log n)`  | ★★★★☆ |

## 五、注意事项

1. **初始化与无穷大**：
   - 距离数组 `dis` 要初始化为 `INF`。`INF` 的值应足够大（如 `0x3f3f3f3f` 对于int， `0x3f3f3f3f3f3f3f3f` 对于long long），但要防止加法溢出。
   - 在Dijkstra中，`vis` 数组标记已确定最短距离的点，避免重复松弛。
2. **存图方式**：
   - **邻接表** (`vector<vector<pair<int, int>>>` 或链式前向星) 是处理稀疏图的标准做法，务必掌握。
   - 对于需要反向图的题目，记得建两个图。
3. **负环与0环判断**：
   - SPFA判负环：记录**入队次数**（>`n`）或**最短路径边数**（`>=n`）。
   - 在类似P3953的问题中，0环的判断需要结合当前路径长度是否在允许的偏移范围内。
4. **分层图建图技巧**：
   - 将状态 `(节点, 已用次数)` 编码成一个新节点（如 `u * (K+1) + k`）。
   - 层内连原边，层间连代表“使用机会”的边（权值通常为0或其它代价）。
5. **最短路与DP结合**：
   - 通常先求出“基准”最短路（如从起点/终点到各点的距离）。
   - DP状态设计常包含“当前节点”和“与基准最短路的差值”。
   - 注意使用记忆化搜索并处理好环的情况。
6. **时间复杂度考量**：
   - `V` (顶点数) 和 `E` (边数) 是选择算法的关键。
   - SPFA在最坏情况下会退化为 `O(VE)`，在无负权的题目中谨慎使用，可能被针对性数据卡超时。
   - Floyd的 `O(V^3)` 限制了 `V` 通常不超过500。
7. **题目中的隐含条件**：
   - 仔细阅读数据范围，判断是有向图还是无向图。
   - 注意重边和自环的处理（邻接表存储时通常无需特殊处理，会自然遍历所有边）。
   - 对于“路径条数”类问题，通常要对一个大质数取模。