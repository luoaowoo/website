---
title: "2026 寒假一中集团集训资料"
date: 2026-03-21
categories: ["算法性"]
tags: ["OI相关", "算法相关","集训"]
cover: " "
description: "2026 寒假郑州一中及其集团校集训资料，习题，题解汇总"
---

# [2026 寒假提高营 Day 1] 并查集 ＆ 堆

## 一、知识点讲解

### 1. 并查集 (Union-Find/Disjoint Set Union, DSU)

**核心功能**：高效地管理一些**不相交**的集合，支持两种操作：

- **查询 (Find)**：确定某个元素属于哪个集合（通常用该集合的“代表元”标识）。
- **合并 (Union)**：将两个元素所在的集合合并为一个集合。

**关键优化**：

- **路径压缩**：在`Find`操作时，将查询路径上的所有节点直接指向根节点，极大降低后续查询复杂度。
- **按秩合并**：在`Union`操作时，将深度较小的树合并到深度较大的树上，避免树退化成链。

**时间复杂度**：经过优化的并查集，单次操作的**均摊时间复杂度**接近常数级 `O(α(n))`，其中`α`是阿克曼函数的反函数，增长极慢。

### 2. 堆 (Heap)

**核心功能**：一种特殊的完全二叉树，满足堆序性质，能快速访问或移除最大/最小元素。

- **大根堆**：父节点的值总是大于或等于其子节点的值。
- **小根堆**：父节点的值总是小于或等于其子节点的值。

**支持操作**：

- **插入 (Push)**：将新元素放入堆尾，然后向上调整以维持堆序。
- **弹出堆顶 (Pop)**：移除堆顶元素（通常是最大或最小值），将堆尾元素移至堆顶，然后向下调整。
- **取堆顶 (Top)**：获取堆顶元素的值。

**实现方式**：

- **二叉堆**：通常使用数组实现，下标关系为：父节点 `i`，左孩子 `2*i`，右孩子 `2*i+1`。
- **优先队列 (Priority Queue)**：在C++ STL中，`priority_queue`默认是大根堆，是小根堆需要自定义比较器。

**时间复杂度**：插入和弹出的时间复杂度为 `O(log n)`，取堆顶为 `O(1)`。

## 二、模板题目思路及代码

### 1. 并查集模板 (P3367)

**题目概要**：实现一个并查集，支持合并两个集合和查询两个元素是否在同一集合中。
 **难度星级**：★☆☆☆☆ (基础模板)
 **简单思路**：直接套用并查集模板，实现`find`（带路径压缩）和`merge`（合并）函数即可。

**完整代码 (C++)**：

```c++
#include <iostream>
using namespace std;

const int MAXN = 10005;
int fa[MAXN]; // 父亲数组

// 查找 + 路径压缩
int find(int x) {
    if (fa[x] == x) return x;
    return fa[x] = find(fa[x]); // 路径压缩核心
}

// 合并
void merge(int a, int b) {
    int rootA = find(a);
    int rootB = find(b);
    if (rootA != rootB) {
        fa[rootA] = rootB; // 将a的根接到b的根上
    }
}

int main() {
    int n, m;
    cin >> n >> m;
    // 初始化，每个元素自成一个集合
    for (int i = 1; i <= n; ++i) fa[i] = i;

    while (m--) {
        int op, x, y;
        cin >> op >> x >> y;
        if (op == 1) {
            merge(x, y);
        } else if (op == 2) {
            if (find(x) == find(y)) {
                cout << "Y\n";
            } else {
                cout << "N\n";
            }
        }
    }
    return 0;
}
```

### 2. 堆模板 (P3378)

**题目概要**：实现一个小根堆，支持插入数字、查询最小值和删除最小值。
 **难度星级**：★☆☆☆☆ (基础模板)
 **简单思路**：使用数组手动实现小根堆，维护`push`、`pop`、`top`操作。

**完整代码 (C++ - 手写堆)**：

```c++
#include <iostream>
using namespace std;

const int MAXN = 1000005;
int heap[MAXN]; // 堆数组，下标从1开始
int heapSize = 0; // 当前堆的大小

// 向上调整
void shiftUp(int p) {
    while (p > 1) {
        if (heap[p] < heap[p / 2]) { // 小根堆，子比父小则交换
            swap(heap[p], heap[p / 2]);
            p /= 2;
        } else {
            break;
        }
    }
}

// 向下调整
void shiftDown(int p) {
    int child = p * 2; // 左孩子
    while (child <= heapSize) {
        // 选择左右孩子中较小的一个
        if (child + 1 <= heapSize && heap[child + 1] < heap[child]) {
            child++;
        }
        if (heap[child] < heap[p]) { // 孩子比父亲小则交换
            swap(heap[child], heap[p]);
            p = child;
            child = p * 2;
        } else {
            break;
        }
    }
}

// 插入
void push(int x) {
    heap[++heapSize] = x;
    shiftUp(heapSize);
}

// 弹出堆顶
void pop() {
    heap[1] = heap[heapSize--];
    shiftDown(1);
}

// 取堆顶
int top() {
    return heap[1];
}

int main() {
    int n;
    cin >> n;
    while (n--) {
        int op;
        cin >> op;
        if (op == 1) {
            int x;
            cin >> x;
            push(x);
        } else if (op == 2) {
            cout << top() << endl;
        } else if (op == 3) {
            pop();
        }
    }
    return 0;
}
```

**STL版本 (更简洁)**：

```c++
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    priority_queue<int, vector<int>, greater<int>> pq; // 小根堆
    int n;
    cin >> n;
    while (n--) {
        int op;
        cin >> op;
        if (op == 1) {
            int x;
            cin >> x;
            pq.push(x);
        } else if (op == 2) {
            cout << pq.top() << endl;
        } else if (op == 3) {
            pq.pop();
        }
    }
    return 0;
}
```

## 三、难题思路及代码

### 1. 并查集难题：食物链 (P2024)

**题目概要**：A吃B，B吃C，C吃A构成循环。给定N个动物和K句话（描述两者关系），输出假话的总数。
 **难度星级**：★★★★☆ (种类并查集/带权并查集经典题)
 **简单思路**：使用“扩展域”并查集或“带权”并查集。这里展示扩展域思路：将每个动物`i`拆成三个域：`i`(自身)，`i+N`(天敌)，`i+2*N`(食物)。

- 如果`x`和`y`是同类，则合并`(x, y)`, `(x+N, y+N)`, `(x+2N, y+2N)`。
- 如果`x`吃`y`，则合并`(x, y+N)`(x是y的天敌)，`(x+N, y+2N)`(x的天敌是y的食物)，`(x+2N, y)`(x的食物是y)。
- 每次操作前检查是否与已有关系矛盾。

**关键代码 (C++ - 扩展域)**：

```c++
#include <iostream>
using namespace std;

const int MAXN = 50005;
int fa[MAXN * 3]; // 三倍空间

int find(int x) {
    return fa[x] == x ? x : fa[x] = find(fa[x]);
}
void merge(int a, int b) {
    fa[find(a)] = find(b);
}

int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= 3 * n; ++i) fa[i] = i; // 初始化

    int ans = 0;
    while (k--) {
        int op, x, y;
        cin >> op >> x >> y;
        if (x > n || y > n) { // 条件2
            ans++;
            continue;
        }
        if (op == 1) { // x和y是同类
            // 如果x吃y，或者y吃x，则是假话
            if (find(x) == find(y + n) || find(y) == find(x + n)) {
                ans++;
            } else {
                merge(x, y);
                merge(x + n, y + n);
                merge(x + 2 * n, y + 2 * n);
            }
        } else { // op == 2, x吃y
            // 如果x和y是同类，或者y吃x，则是假话
            if (find(x) == find(y) || find(y) == find(x + n)) {
                ans++;
            } else {
                merge(x, y + n);       // x是y的天敌
                merge(x + n, y + 2 * n); // x的天敌是y的食物
                merge(x + 2 * n, y);     // x的食物是y
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```

### 2. 堆难题：合并果子 (P1090)

**题目概要**：每次合并两堆果子消耗体力值为两堆果子数目之和，求将所有果子合并成一堆的最小体力耗费值。
 **难度星级**：★★☆☆☆ (贪心 + 堆)
 **简单思路**：这是一个经典的**哈夫曼编码**问题。每次选择**当前最小的两堆**进行合并，并将新堆的体力值加入总消耗。使用**小根堆**可以高效地获取最小值。

**完整代码 (C++ - STL优先队列)**：

```c++
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    priority_queue<int, vector<int>, greater<int>> pq; // 小根堆
    for (int i = 0; i < n; ++i) {
        int a;
        cin >> a;
        pq.push(a);
    }

    int total_cost = 0;
    // 当堆里不止一堆时，持续合并
    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        int cost = a + b;
        total_cost += cost;
        pq.push(cost); // 将新的一堆放回
    }
    cout << total_cost << endl;
    return 0;
}
```

### 3. 堆难题：蚯蚓 (P2827)

**题目概要**：每秒切断最长的蚯蚓，切断后生成的两条新蚯蚓长度按比例计算，其他蚯蚓长度每秒增加q。求每秒被切断蚯蚓的长度和最终所有蚯蚓的长度。
 **难度星级**：★★★★☆ (NOIP真题，思维+队列)
 **简单思路**：关键在于发现**单调性**：先被切出的蚯蚓，其两段`floor(px)`和`x-floor(px)`的长度，一定**后**于后被切出的蚯蚓的对应段。因此可以用**三个队列**维护：原队列`q0`（初始蚯蚓，降序排序）、`q1`（存储`floor(px)`段）、`q2`（存储剩余段）。每次从三个队列队首选出最大的进行切割。全局增加的长度可以用一个`delta`变量记录，入队时减去当前`delta`，出队时加上。

**关键代码片段 (C++ - 三队列思路)**：

```c++
#include <iostream>
#include <algorithm>
#include <queue>
#include <cmath>
using namespace std;
typedef long long ll;

queue<ll> q1, q2; // q1存px段，q2存x-px段
ll q0[100005]; // 原数组

int main() {
    int n, m, qq;
    double u, v, p;
    cin >> n >> m >> qq >> u >> v >> p;
    for (int i = 0; i < n; ++i) cin >> q0[i];
    sort(q0, q0 + n, greater<ll>()); // 降序排序

    ll delta = 0; // 全局增长量
    for (int i = 1; i <= m; ++i) {
        ll maxVal = -1e18;
        int src = -1; // 来源队列 0,1,2
        if (!q0.empty() && q0[0] > maxVal) maxVal = q0[0], src = 0;
        if (!q1.empty() && q1.front() > maxVal) maxVal = q1.front(), src = 1;
        if (!q2.empty() && q2.front() > maxVal) maxVal = q2.front(), src = 2;

        // 弹出最大值并加上全局增长量
        if (src == 0) pop_heap(q0, q0 + n), n--;
        else if (src == 1) q1.pop();
        else q2.pop();
        maxVal += delta;

        if (i % qq == 0) cout << maxVal << " ";

        // 切割
        ll l1 = floor(maxVal * u / v);
        ll l2 = maxVal - l1;
        delta += qq; // 其他蚯蚓长度增加
        // 新蚯蚓入队时要减去当前的全局增长量，保证相对性
        q1.push(l1 - delta);
        q2.push(l2 - delta);
    }
    cout << endl;
    // ... (输出最终所有蚯蚓长度，类似操作)
    return 0;
}
```

## 四、剩余题目及思路

### 并查集相关题目

1. **P1551 亲戚**：★★☆☆☆ 并查集裸题，直接判断两人是否在同一集合。
2. **P1111 修复公路**：★★☆☆☆ 按时间排序边，用并查集维护连通性，当所有点连通时输出当前时间。
3. **P1196 [NOI2002] 银河英雄传说**：★★★☆☆ **带权并查集**，需要额外维护每个节点到根节点的距离以及集合大小，用于计算相隔战舰数。
4. **P5937 [CEOI 1999] Parity Game**：★★★★☆ 前缀和+扩展域并查集或带权并查集。将区间奇偶性转换为前缀和的关系。
5. **P1197 [JSOI2008] 星球大战**：★★★☆☆ **逆向思维** + 并查集。从最终状态倒着加边，动态维护连通块数量。

### 堆相关题目

1. **P1801 黑匣子**：★★★☆☆ **对顶堆**动态维护第k小值。一个大根堆存较小的k个数，一个小根堆存剩余的数。
2. **P1631 序列合并**：★★★☆☆ 多路归并思想。先将A[1]+B[1...N]入小根堆，每次弹出最小值(A[i]+B[j])后，将A[i+1]+B[j]入堆。
3. **P1168 中位数**：★★★☆☆ 同`P1801`，使用**对顶堆**动态维护中位数。
4. **P4053 [JSOI2007] 建筑抢修**：★★★☆☆ **贪心+堆**。按截止时间排序，用大根堆维护已选任务的修理时间。如果当前任务无法按时完成，比较堆顶任务耗时，进行替换。
5. **P2168 [NOI2015] 荷马史诗**：★★★★☆ **k叉哈夫曼树**。类似合并果子，但每次合并k个（需补0）。堆中元素需同时记录权值和深度（用于保证最长编码最短）。
6. **可并堆模板 (P3377, P1456, P2713, P1552, P3261)**：★★★★★ 涉及**左偏树**或**斜堆**等可并堆的实现，用于支持堆的合并操作，是更高级的数据结构。

## 五、注意事项

1. **并查集初始化**：务必记得将每个元素的父亲初始化为自身。
2. **路径压缩与按秩合并**：两者结合使用效果最佳，但通常路径压缩足以应对大部分题目。
3. **种类并查集**：遇到循环关系（如A吃B，B吃C，C吃A）或对立关系时，考虑使用扩展域（开多倍数组）或带权（维护到根距离的模）并查集。
4. **堆的数组下标**：手写堆时，通常从下标1开始，这样父子节点关系明确（`i`的父为`i/2`，子为`2*i`和`2*i+1`）。
5. **STL优先队列**：`priority_queue<T>`默认是大根堆。定义小根堆可用`priority_queue<T, vector<T>, greater<T>>`。
6. **对顶堆**：是解决**动态中位数**和**动态第K大**问题的利器，务必掌握其思想。
7. **时间与内存限制**：解题时务必关注题目给出的限制（如文档中所示），选择合适算法。例如，堆模板题内存限制512MB，而手写堆通常更节省内存；`P2827 蚯蚓`若用优先队列模拟可能会超时，需利用其单调性优化。
8. **逆向思维**：像`P1197 星球大战`这类删边问题，正向处理困难时，考虑逆向加边。

# [2026 寒假提高营 Day 2] 树状数组＆ST 表

## 一、知识点讲解

### 1.1 树状数组 (Binary Indexed Tree, BIT/Fenwick Tree)

树状数组是一种用于高效处理**前缀和**查询与**单点/区间**更新的数据结构，其核心思想是利用二进制下标的 `lowbit` 特性将线性结构转化为树形结构。

- **核心操作**：
  - `lowbit(x) = x & (-x)`：获取数字 `x` 二进制表示中最低位的1所代表的值。
  - **单点修改** `add(x, k)`：将下标 `x` 处的值增加 `k`，并向上更新其父节点（`x += lowbit(x)`）。
  - **前缀查询** `query(x)`：查询下标 `1` 到 `x` 的区间和，通过累加其子节点（`x -= lowbit(x)`）实现。
- **优点**：代码简洁，常数小，空间复杂度 O(n)。
- **缺点**：难以处理复杂的区间修改（需结合差分思想）和区间最值查询。
- **典型应用**：逆序对、动态前缀和、区间修改单点查询（结合差分）。

### 1.2 ST 表 (Sparse Table)

ST表是一种用于解决**静态区间最值查询**（RMQ）问题的数据结构，支持 O(1) 的查询，但无法进行修改。

- **核心思想**：倍增与动态规划。
- **预处理**：
  - 定义 `st[i][j]` 表示区间 `[i, i + 2^j - 1]` 的最值。
  - 状态转移：`st[i][j] = max/min(st[i][j-1], st[i + (1<<(j-1))][j-1])`。
  - 时间复杂度 O(n log n)。
- **查询**：
  - 对于区间 `[l, r]`，令 `k = log2(r - l + 1)`。
  - 查询结果 = `max/min(st[l][k], st[r - (1<<k) + 1][k])`。
  - 时间复杂度 O(1)。
- **优点**：查询极快。
  **缺点**：不支持修改，空间复杂度 O(n log n)。

## 二、模板题目思路及代码

### 2.1 【模板】树状数组 1 (P3374)

- **题目概要**：实现数据结构，支持**单点修改**和**区间求和**。
- **简单思路**：标准的树状数组应用。`add` 操作实现单点加，`query` 操作查询前缀和，区间 `[l, r]` 的和为 `query(r) - query(l-1)`。
- **难度星级**：★★☆☆☆
- **完整代码**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 5e5 + 5;
long long tree[MAXN];
int n, m;

int lowbit(int x) { return x & -x; }

void add(int x, int k) {
    while (x <= n) {
        tree[x] += k;
        x += lowbit(x);
    }
}

long long query(int x) {
    long long res = 0;
    while (x > 0) {
        res += tree[x];
        x -= lowbit(x);
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n >> m;
    for (int i = 1; i <= n; i++) {
        int a; cin >> a;
        add(i, a);
    }
    while (m--) {
        int op, x, y;
        cin >> op >> x >> y;
        if (op == 1) {
            add(x, y);
        } else {
            cout << query(y) - query(x - 1) << '\n';
        }
    }
    return 0;
}
```

### 2.2 【模板】树状数组 2 (P3368)

- **题目概要**：实现数据结构，支持**区间修改**（区间内每个数加一个值）和**单点查询**。
- **简单思路**：利用**差分**思想。原数组 `a[]` 的差分数组 `d[i] = a[i] - a[i-1]`。区间 `[l, r]` 加 `k` 等价于 `d[l] += k`, `d[r+1] -= k`。单点查询 `a[x]` 等价于差分数组的前缀和 `sum(d[1..x])`。用树状数组维护差分数组 `d` 即可。
- **难度星级**：★★☆☆☆
- **完整代码**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 5e5 + 5;
long long tree[MAXN];
int n, m;

int lowbit(int x) { return x & -x; }

void add(int x, long long k) {
    while (x <= n) {
        tree[x] += k;
        x += lowbit(x);
    }
}

long long query(int x) {
    long long res = 0;
    while (x > 0) {
        res += tree[x];
        x -= lowbit(x);
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin >> n >> m;
    long long last = 0, cur;
    for (int i = 1; i <= n; i++) {
        cin >> cur;
        add(i, cur - last); // 初始化差分数组
        last = cur;
    }
    while (m--) {
        int op, x, y;
        long long k;
        cin >> op;
        if (op == 1) {
            cin >> x >> y >> k;
            add(x, k);
            add(y + 1, -k);
        } else {
            cin >> x;
            cout << query(x) << '\n';
        }
    }
    return 0;
}
```

### 2.3 【模板】ST 表 & RMQ 问题 (P3865)

- **题目概要**：静态区间最大值查询。
- **简单思路**：标准 ST 表实现。预处理 `st` 数组，查询时利用对数函数获取区间长度对应的 `k` 值。
- **难度星级**：★★★☆☆
- **完整代码**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int MAXN = 1e5 + 5;
const int LOG = 17; // 2^17 > 1e5
int st[MAXN][LOG + 1];
int lg[MAXN]; // 预处理 log2 值

void initLog(int n) {
    lg[1] = 0;
    for (int i = 2; i <= n; i++) {
        lg[i] = lg[i / 2] + 1;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n, m;
    cin >> n >> m;
    initLog(n);
    for (int i = 1; i <= n; i++) {
        cin >> st[i][0];
    }
    // 预处理 ST 表
    for (int j = 1; j <= LOG; j++) {
        for (int i = 1; i + (1 << j) - 1 <= n; i++) {
            st[i][j] = max(st[i][j - 1], st[i + (1 << (j - 1))][j - 1]);
        }
    }
    // 查询
    while (m--) {
        int l, r;
        cin >> l >> r;
        int k = lg[r - l + 1];
        cout << max(st[l][k], st[r - (1 << k) + 1][k]) << '\n';
    }
    return 0;
}
```

## 三、难题思路及代码

### 3.1 [NOIP 2015 提高组] 运输计划 (P2680)

- **题目概要**：在树形网络中，有若干条预定路径。你可以将一条边的权值（时间）变为0，使得完成所有运输计划所需的最长时间最小化。求这个最小化的最长时间。
- **简单思路**：
  1. **问题转化**：最小化最大值 → **二分答案** `mid`。
  2. **判定**：判断是否可以通过将一条边权置零，使得所有原计划时间 > `mid` 的路径，其时间都减少到 <= `mid`。
  3. **关键**：所有超时的路径必须**都经过**某条公共边，且这条边的权值 >= `max(超时路径原时间 - mid)`。这需要快速求路径交集。
  4. **实现**：
     - 预处理 LCA 和树上距离。
     - 二分答案。
     - 对于每个 `mid`，找出所有超时路径，用树上差分标记这些路径覆盖的边。
     - 检查是否存在一条边，被所有超时路径覆盖，且边权满足条件。
- **难度星级**：★★★★★
- **关键代码框架**（核心二分判定部分）：

```c++
bool check(long long mid) {
    fill(diff, diff + n + 1, 0);
    int cnt = 0;
    long long max_exceed = 0;
    for (int i = 0; i < m; i++) {
        if (dist[i] > mid) {
            cnt++;
            max_exceed = max(max_exceed, dist[i] - mid);
            int u = plan[i].u, v = plan[i].v, l = plan[i].lca;
            diff[u]++; diff[v]++; diff[l] -= 2; // 边差分
        }
    }
    if (cnt == 0) return true;
    // DFS 计算子树和，得到每条边实际被覆盖的次数
    dfs_sum(1, 0);
    for (int i = 2; i <= n; i++) { // 边 i 连接 i 和 father[i]
        if (edge_cover[i] == cnt && edge_weight[i] >= max_exceed) {
            return true;
        }
    }
    return false;
}
```

### 3.2 [NOIP 2013 提高组] 火柴排队 (P1966)

- **题目概要**：有两列火柴，高度分别为 `a[i]` 和 `b[i]`。通过交换相邻火柴，使得 `∑(a[i]-b[i])^2` 最小。求最小交换次数。
- **简单思路**：
  1. **贪心**：当 `a` 和 `b` 都按相同顺序（同为升序或降序）排列时，距离平方和最小。
  2. **问题转化**：固定 `a` 的顺序（例如下标 `1~n`），求 `b` 需要按照 `a` 的大小关系重新排列的最小相邻交换次数。这等价于求 `b` 序列相对于 `a` 序列的**逆序对**数。
  3. **实现**：
     - 对 `a`, `b` 分别排序，得到它们排名到原下标的映射 `pa`, `pb`。
     - 构造数组 `c`，使得 `c[pa[i]] = pb[i]`。即 `c[新a排名] = 对应b的原下标`。
     - 问题转化为求数组 `c` 的**逆序对**数量。使用**树状数组**求解。
- **难度星级**：★★★★☆
- **关键代码框架**：

```c++
// 离散化并获取排名映射 pa, pb
// ... (排序、去重、二分查找等操作)

// 构造序列 c
for (int i = 1; i <= n; i++) {
    c[pa[i]] = pb[i]; // pa[i] 是 a[i] 的排名，pb[i] 是 b[i] 的排名
}
// 树状数组求序列 c 的逆序对
long long ans = 0;
for (int i = n; i >= 1; i--) {
    ans += query(c[i] - 1); // 查询比 c[i] 小的数有多少个（已插入的）
    add(c[i], 1);
}
cout << ans % MOD << endl;
```

### 3.3 [NOIP 2013 提高组] 货车运输 (P1967)

- **题目概要**：在可能带有重边的无向图中，多条询问从 `x` 到 `y` 的路径上，最大载重（即路径上最小边权）的最大值。
- **简单思路**：
  1. **最大生成树**：为了使得路径上的最小边权尽可能大，我们只关心图中的**最大生成树**。在生成树上，任意两点间路径的最小边权是唯一的，且是最大可能值。
  2. **树上查询**：问题转化为在最大生成树上，查询任意两点间路径上的最小边权。
  3. **实现**：
     - 使用 Kruskal 算法构建最大生成树。
     - 对于每个询问，如果两点不连通则输出 -1，否则使用**倍增法求LCA**，并在倍增过程中维护路径上的最小边权。
- **难度星级**：★★★★☆
- **关键数据结构**（倍增法维护最小值）：

```c++
// fa[u][k] 表示 u 的 2^k 级祖先
// minw[u][k] 表示 u 到 fa[u][k] 路径上的最小边权
void dfs(int u, int f, int w) {
    dep[u] = dep[f] + 1;
    fa[u][0] = f;
    minw[u][0] = w;
    for (int i = 1; i <= LOG; i++) {
        fa[u][i] = fa[fa[u][i-1]][i-1];
        minw[u][i] = min(minw[u][i-1], minw[fa[u][i-1]][i-1]);
    }
    for (auto &e : tree[u]) {
        if (e.v != f) dfs(e.v, u, e.w);
    }
}
int query(int x, int y) {
    if (find(x) != find(y)) return -1;
    if (dep[x] < dep[y]) swap(x, y);
    int res = INT_MAX;
    for (int i = LOG; i >= 0; i--) {
        if (dep[fa[x][i]] >= dep[y]) {
            res = min(res, minw[x][i]);
            x = fa[x][i];
        }
    }
    if (x == y) return res;
    for (int i = LOG; i >= 0; i--) {
        if (fa[x][i] != fa[y][i]) {
            res = min(res, min(minw[x][i], minw[y][i]));
            x = fa[x][i];
            y = fa[y][i];
        }
    }
    res = min(res, min(minw[x][0], minw[y][0](@ref));
    return res;
}
```

## 四、剩余题目及思路

### 4.1 逆序对 (P1908)

- **思路**：经典树状数组/归并排序应用。离散化后，从后往前遍历，树状数组统计当前数之后已出现的小于它的数的个数。
- **难度**：★★★☆☆

### 4.2 [SHOI2009] 会场预约 (P2161)

- **思路**：使用 `set` 或平衡树维护当前所有预约区间（按右端点排序）。新预约来时，查找所有与之冲突的旧预约并删除，同时计数。关键在于高效查找重叠区间。
- **难度**：★★★☆☆

### 4.3 跑路 (P1613)

- **思路**：注意到“跑路器”使得一步可以走 `2^k` 距离。预处理出所有能从 `i` 用一次跑路器到达 `j` 的点对（即距离为 `2^k`），这可以用倍增思想 (`f[i][k][j]` 表示 `i` 到 `j` 是否存在 `2^k` 距离的路径)。然后将问题转化为在这些新边（权为1）上的最短路问题（BFS或Floyd）。
- **难度**：★★★★☆

### 4.4 [GZOI2017] 配对统计 (P5677)

- **思路**：“好的配对”定义为差值最小的配对。先对数组排序，找出所有相邻数构成的“候选好配对”。对于多个询问 `[l, r]`，问区间内包含多少个好配对。这是一个**二维数点**问题：每个配对 `(x, y)` 对应一个点 `(min_id, max_id)`，询问就是矩形 `[l, r] x [l, r]` 内有多少个点，且点满足 `x != y`。可以用离线+树状数组解决。
- **难度**：★★★★☆

### 4.5 [eJOI 2020] Fountain (Day1) (P7167)

- **思路**：每个盘子有直径和容量。水从上一个盘子溢出会流向下一个直径**大于**它的盘子。这可以建模为一个**森林**或通过**单调栈**构建每个盘子的“下一个”指针。询问给定起始盘子和水量，求最终位置和剩余水量。需要快速跳跃，可以使用**倍增法**（`next[i][j]` 表示从 `i` 开始溢出 `2^j` 次后的盘子，以及这段路径的总容量）。
- **难度**：★★★★☆

### 4.6 【模板】最近公共祖先 (LCA) (P3379)

- **思路**：倍增法模板。预处理每个节点的 `2^k` 级祖先。查询时先将两点调至同一深度，然后一起向上跳。
- **难度**：★★★☆☆

### 4.7 【模板】线段树 1 (P3372)

- **思路**：支持区间加、区间求和的线段树模板。需要用到懒标记 (lazy tag) 来高效实现区间修改。
- **难度**：★★★☆☆

## 五、注意事项

1. **边界处理**：树状数组、线段树下标通常从1开始，注意输入数据范围。
2. **数据范围与溢出**：注意 `int` 和 `long long` 的使用，特别是求和、求积时。P1908逆序对结果可能超过 `int`。
3. **差分技巧**：树状数组结合差分是解决区间修改问题的利器（P3368）。树上差分是解决路径覆盖问题的利器（P2680）。
4. **离散化**：当数据值域大但数量少时（如P1966，P1908），需要先离散化，将值映射到排名，再用树状数组处理。
5. **倍增法**：不仅是LCA（P3379），还可以用于维护路径信息（P1967的边权最小值，P7167的容量和）、加速跳跃（P1613， P7167）。
6. **二分答案**：当问题要求“最小化最大值”或“最大化最小值”时（P2680），考虑二分答案，并设计 `check` 函数。
7. **时间复杂度**：根据题目数据规模（`n, m` 通常 `1e5` 量级）和时限（`1s`）选择合适算法。O(n log n) 通常可行，O(n^2) 通常不可行。
8. **调试**：模板题务必保证代码正确。难题可以先写出暴力或思路框架，再逐步优化。多利用样例和手造小数据。

# [2026 寒假提高营 Day 3] 线段树

## 一、知识点讲解

线段树是一种用于高效处理**区间查询**与**区间更新**问题的数据结构。它将一个区间递归地划分成若干个子区间（节点），每个节点存储其对应区间的某种聚合信息（如和、最大值、最小值等）。

- **核心思想**：分治与懒惰标记（Lazy Tag）。
- **基本操作**：
  1. **建树 (Build)**：从根节点开始，递归地将区间二分，直到叶子节点（区间长度为1），并初始化节点信息。
  2. **区间查询 (Query)**：查询一个区间`[l, r]`的信息。从根节点开始，若当前节点区间完全被查询区间包含，则直接返回其信息；否则，递归查询左右子节点，并合并结果。
  3. **单点/区间更新 (Update)**：
     - **单点更新**：找到对应的叶子节点进行修改，并向上更新其祖先节点。
     - **区间更新**：使用“懒惰标记”。当更新区间完全覆盖当前节点区间时，先更新当前节点的值，并打上标记，表示其子节点有待更新。后续查询或更新时，再将标记下传（Pushdown）。
- **常见应用**：区间和、最值、区间修改（加、乘、赋值）、区间合并问题（如最大连续子段和）、维护序列复杂性质等。

## 二、模板题目思路及代码

### 1. 基础模板：区间加 & 区间求和

- **题目概要**：P3372 【模板】线段树 1。给定一个数列，需要支持两种操作：1. 将某区间每个数加上一个值；2. 查询某区间所有数的和。
- **难度星级**：★★☆☆☆
- **简单思路**：标准的线段树区间修改（加法）与区间查询（求和）模板。需要使用懒惰标记来高效处理区间加操作。
- **完整代码 (C++)**：

```c++
#include <iostream>
using namespace std;
typedef long long ll;
const int MAXN = 1e5 + 5;

ll a[MAXN];
struct Node {
    int l, r;
    ll sum, add; // sum为区间和，add为懒惰加法标记
} tree[MAXN << 2];

void pushup(int p) {
    tree[p].sum = tree[p<<1].sum + tree[p<<1|1].sum;
}
void pushdown(int p) {
    if (tree[p].add) {
        int lc = p<<1, rc = p<<1|1;
        ll tag = tree[p].add;
        tree[lc].sum += tag * (tree[lc].r - tree[lc].l + 1);
        tree[rc].sum += tag * (tree[rc].r - tree[rc].l + 1);
        tree[lc].add += tag;
        tree[rc].add += tag;
        tree[p].add = 0;
    }
}
void build(int p, int l, int r) {
    tree[p].l = l; tree[p].r = r; tree[p].add = 0;
    if (l == r) {
        tree[p].sum = a[l];
        return;
    }
    int mid = (l + r) >> 1;
    build(p<<1, l, mid);
    build(p<<1|1, mid+1, r);
    pushup(p);
}
void update(int p, int l, int r, ll val) {
    if (l <= tree[p].l && tree[p].r <= r) {
        tree[p].sum += val * (tree[p].r - tree[p].l + 1);
        tree[p].add += val;
        return;
    }
    pushdown(p);
    int mid = (tree[p].l + tree[p].r) >> 1;
    if (l <= mid) update(p<<1, l, r, val);
    if (r > mid) update(p<<1|1, l, r, val);
    pushup(p);
}
ll query(int p, int l, int r) {
    if (l <= tree[p].l && tree[p].r <= r) return tree[p].sum;
    pushdown(p);
    int mid = (tree[p].l + tree[p].r) >> 1;
    ll res = 0;
    if (l <= mid) res += query(p<<1, l, r);
    if (r > mid) res += query(p<<1|1, l, r);
    return res;
}
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 1; i <= n; ++i) cin >> a[i];
    build(1, 1, n);
    while (m--) {
        int op, x, y;
        ll k;
        cin >> op >> x >> y;
        if (op == 1) {
            cin >> k;
            update(1, x, y, k);
        } else {
            cout << query(1, x, y) << endl;
        }
    }
    return 0;
}
```

### 2. 进阶模板：区间加 & 区间乘 & 区间求和

- **题目概要**：P3373 【模板】线段树 2。在基础模板上，增加了区间乘法操作。需要维护两种懒惰标记。
- **难度星级**：★★★☆☆
- **简单思路**：需要维护两个懒惰标记：加法标记`add`和乘法标记`mul`。关键在于**规定两种标记的优先级和下传顺序**。通常约定：先乘后加。即节点的真实值 = `(子节点值 * mul) + add`。下传时，需要同时更新子节点的`sum`、`mul`和`add`。
- **核心代码片段 (更新与下传逻辑)**：

```c++
struct Node {
    int l, r;
    ll sum, add, mul;
} tree[MAXN << 2];
void pushdown(int p) {
    int lc = p<<1, rc = p<<1|1;
    // 更新子节点的sum：先乘后加
    tree[lc].sum = (tree[lc].sum * tree[p].mul + tree[p].add * (tree[lc].r - tree[lc].l + 1)) % MOD;
    tree[rc].sum = (tree[rc].sum * tree[p].mul + tree[p].add * (tree[rc].r - tree[rc].l + 1)) % MOD;
    // 更新子节点的mul和add：注意add也要先乘
    tree[lc].mul = (tree[lc].mul * tree[p].mul) % MOD;
    tree[lc].add = (tree[lc].add * tree[p].mul + tree[p].add) % MOD;
    tree[rc].mul = (tree[rc].mul * tree[p].mul) % MOD;
    tree[rc].add = (tree[rc].add * tree[p].mul + tree[p].add) % MOD;
    // 清空父节点标记
    tree[p].mul = 1; tree[p].add = 0;
}
void update_add(int p, int l, int r, ll val) { /* 类似基础模板，但需考虑mul存在 */ }
void update_mul(int p, int l, int r, ll val) {
    if (l <= tree[p].l && tree[p].r <= r) {
        tree[p].sum = (tree[p].sum * val) % MOD;
        tree[p].mul = (tree[p].mul * val) % MOD;
        tree[p].add = (tree[p].add * val) % MOD; // 关键！加法标记也要乘
        return;
    }
    pushdown(p);
    /* ... 递归更新左右子树 ... */
    pushup(p);
}
```

## 三、难题思路及代码

### 1. 复杂区间统计与赋值 (P2572 [SCOI2010] 序列操作)

- **题目概要**：对一个01序列进行5种操作：区间赋0、区间赋1、区间取反、区间求和、区间求最长连续1的长度。
- **难度星级**：★★★★☆
- **简单思路**：线段树节点需要维护大量信息以支持合并：
  - `sum`: 区间内1的个数。
  - `l0, r0, m0`: 左起最长连续0，右起最长连续0，区间内最长连续0。
  - `l1, r1, m1`: 左起最长连续1，右起最长连续1，区间内最长连续1。
  - 需要两个懒惰标记：`assign`（-1表示无，0或1表示赋值）和 `rev`（是否取反）。
  - **标记处理顺序是难点**：赋值标记的优先级高于取反标记。当打上赋值标记时，需要清空取反标记。下传时先处理赋值，再处理取反。
- **关键代码片段 (节点结构与标记下传)**：

```c++
struct Node {
    int l, r;
    int sum;
    int l0, r0, m0, l1, r1, m1;
    int assign; // -1:无， 0:赋0， 1:赋1
    bool rev;
} tree[MAXN << 2];
void pushdown(int p) {
    int lc = p<<1, rc = p<<1|1;
    int lenL = tree[lc].r - tree[lc].l + 1;
    int lenR = tree[rc].r - tree[rc].l + 1;
    if (tree[p].assign != -1) {
        int v = tree[p].assign;
        // 对左儿子赋值
        tree[lc].sum = v * lenL;
        tree[lc].l0 = tree[lc].r0 = tree[lc].m0 = (v == 0 ? lenL : 0);
        tree[lc].l1 = tree[lc].r1 = tree[lc].m1 = (v == 1 ? lenL : 0);
        tree[lc].assign = v; tree[lc].rev = false; // 清空取反标记
        // 对右儿子赋值 (类似)
        tree[p].assign = -1;
    }
    if (tree[p].rev) {
        // 对左儿子取反：交换0和1的所有信息
        tree[lc].sum = lenL - tree[lc].sum;
        swap(tree[lc].l0, tree[lc].l1); swap(tree[lc].r0, tree[lc].r1); swap(tree[lc].m0, tree[lc].m1);
        tree[lc].rev ^= 1;
        // 对右儿子取反 (类似)
        tree[p].rev = false;
    }
}
// 区间取反操作
void update_rev(int p, int ql, int qr) {
    if (ql <= tree[p].l && tree[p].r <= qr) {
        int len = tree[p].r - tree[p].l + 1;
        tree[p].sum = len - tree[p].sum;
        swap(tree[p].l0, tree[p].l1); swap(tree[p].r0, tree[p].r1); swap(tree[p].m0, tree[p].m1);
        tree[p].rev ^= 1;
        return;
    }
    pushdown(p);
    /* ... 递归 ... */
    pushup(p); // pushup需要复杂合并左右儿子信息
}
```

#### 2. 区间开根与求和 (P4145 上帝造题的七分钟 2 / 花神游历各国)

- **题目概要**：区间开平方（向下取整）与区间求和。
- **难度星级**：★★★☆☆
- **简单思路**：一个数`x`最多开根`log log x`次就会变成1。利用这个性质，线段树节点额外维护一个区间最大值`mx`。当进行区间开根操作时，如果当前节点区间最大值`mx <= 1`，则无需继续递归（因为1开根还是1）。否则，递归到叶子节点进行单点修改。这样保证了总体复杂度在可接受范围内。
- **关键代码片段 (区间开根操作)**：

```c++
void update_sqrt(int p, int l, int r) {
    if (tree[p].l == tree[p].r) { // 叶子节点，直接修改
        tree[p].sum = tree[p].mx = sqrt(tree[p].sum);
        return;
    }
    if (l <= tree[p].l && tree[p].r <= r && tree[p].mx <= 1) {
        return; // 整个区间都是0或1，无需修改
    }
    // 否则，需要递归修改
    int mid = (tree[p].l + tree[p].r) >> 1;
    if (l <= mid) update_sqrt(p<<1, l, r);
    if (r > mid) update_sqrt(p<<1|1, l, r);
    pushup(p); // 更新sum和mx
}
```

## 四、剩余题目及思路

1. **P1438 无聊的数列** (★★★☆☆)：**差分数组+线段树**。将原序列的区间加等差数列，转化为对差分数组的两个单点修改和一个区间加。
2. **P4513 小白逛公园** (★★★★☆)：**区间最大子段和**。线段树节点需维护区间和`sum`、区间最大子段和`mx`、必须包含左端点的最大子段和`lmx`、必须包含右端点的最大子段和`rmx`。`pushup`合并是核心。
3. **P1471 方差** (★★★☆☆)：**维护区间和与区间平方和**。通过公式 `方差 = (平方和/n) - (和/n)^2`，线段树只需维护`sum`和`sum2`（平方和），支持区间加操作。
4. **P6492 [COCI 2010/2011 #6] STEP** (★★★☆☆)：**类似最大连续子段和**，但要求相邻字符不同。节点维护从左/右开始的最长合法序列长度，以及区间内总的最长长度。
5. **P2068 统计和** (★★☆☆☆)：**树状数组/线段树单点修改、区间求和**模板。
6. **P1486 [NOI2004] 郁闷的出纳员** (★★★☆☆)：**权值线段树**或平衡树。维护全体员工的工资集合，支持插入、删除低于下限的全体、查询第k大。
7. **P5459 [BJOI2016] 回转寿司** (★★★★☆)：**前缀和+权值线段树/平衡树**。求有多少区间和属于`[L, R]`。转化为对前缀和数组`pre[]`，求有多少对`(i, j)`满足 `L <= pre[j] - pre[i-1] <= R`。
8. **P5522 [yLOI2019] 棠梨煎雪** (★★★★★)：**线段树维护状态集合**。每个位置可能是`0`,`1`,`?`。线段树节点维护所有可能的状态组合，合并时进行位运算。思路巧妙，难度高。
9. **P2221 [HAOI2012] 高速公路** (★★★★☆)：**期望计算+线段树**。将费用公式展开，转化为维护区间`∑v[i]`、`∑i*v[i]`、`∑i*i*v[i]`，支持区间加。
10. **P1637 三元上升子序列** (★★★☆☆)：**树状数组/线段树**。离散化后，正反各做一次，求每个数左边比它小的个数`L[i]`和右边比它大的个数`R[i]`，答案即为`∑ L[i] * R[i]`。
11. **Codeforces 240F TorCoder** (★★★★☆)：**线段树维护26个字母的计数**。每个查询区间，统计各字母出现次数，判断能否构成回文，然后按字典序最小回文的顺序，进行**区间赋值**操作。
12. **Codeforces 620E New Year Tree** (★★★☆☆)：**DFS序+线段树**。将子树操作转化为区间操作。颜色只有60种，可以用一个`long long`的位掩码表示区间内颜色集合，查询时统计`popcount`。
13. **Codeforces 915E Physical Education Lessons** (★★★☆☆)：**动态开点线段树**或**珂朵莉树**。由于`n`很大(`1e9`)，不能建完整线段树。动态开点线段树只在需要时创建节点，适用于稀疏区间修改。

## 五、注意事项

1. **开数组大小**：线段树数组通常需要开**4倍**原数据大小 (`MAXN << 2`)。
2. **懒惰标记**：理解“先乘后加”等优先级顺序，并确保`pushdown`和`pushup`在正确时机调用。
3. **边界判断**：在`update`和`query`函数中，递归前判断 `if (l <= mid)` 和 `if (r > mid)`，而不是直接递归两边。
4. **数据类型**：根据数据范围使用`long long`，特别是求和时。
5. **离散化**：当值域很大但数据点不多时（如P1637, P5459），需要先将数据离散化。
6. **动态开点**：当区间范围极大(`1e9`)但操作次数有限时（如CF 915E），考虑动态开点线段树以避免MLE。
7. **复杂信息合并**：对于维护最大子段和、最长连续段等问题，仔细设计节点结构，并确保`pushup`函数能正确合并左右儿子的所有信息。
8. **调试**：可以编写一个`print_tree`函数输出线段树状态，帮助调试复杂问题。

# [2026 寒假提高营 Day 4] 基础数据结构

## 一、知识点讲解

今日主题是**基础数据结构**的深入应用与组合，核心在于理解并熟练运用**堆、单调队列、单调栈**，并了解**笛卡尔树**这一能将序列问题转化为树形问题的有力工具。这些结构不仅是实现特定算法的组件，更是优化动态规划、维护区间极值、处理序列问题的关键。

1. **堆 (Heap)**：一种完全二叉树，支持快速插入、删除最值。常用于贪心（如合并果子）、维护动态集合的最值、Dijkstra算法等。
2. **单调队列 (Monotonic Queue)**：队列中的元素保持单调性（递增或递减）。核心应用是**滑动窗口**求最值，能以O(n)时间复杂度解决。
3. **单调栈 (Monotonic Stack)**：栈中的元素保持单调性。常用于寻找每个元素左侧/右侧第一个比它大/小的元素，是解决“直方图最大矩形”、“美丽序列”等问题的基础。
4. **笛卡尔树 (Cartesian Tree)**：一种特殊的二叉树，同时满足二叉搜索树（中序遍历为原序列）和堆（父节点权值大于/小于子节点）的性质。常用于将序列的区间最值问题转化为树上的LCA或子树问题。

## 二、模板题目思路及代码

### 1. 堆 (P3378)

- **题目概要**：实现一个最小堆，支持插入、查询最小值、删除最小值。
- **思路**：使用数组模拟完全二叉树。`push`时将元素置于末尾并上浮；`pop`时将堆顶与末尾交换，删除末尾，再将新堆顶下沉；`top`即返回堆顶元素。
- **难度星级**：★★☆☆☆ (基础实现)
- **完整代码 (C++)**：

```c++
#include <iostream>
using namespace std;
const int N = 1e6 + 10;
int heap[N], cnt = 0; // cnt 为当前堆的大小

void push(int x) {
    heap[++cnt] = x;
    int i = cnt;
    while (i > 1 && heap[i] < heap[i >> 1]) { // 上浮
        swap(heap[i], heap[i >> 1]);
        i >>= 1;
    }
}

void pop() {
    if (cnt == 0) return;
    heap[1] = heap[cnt--];
    int i = 1;
    while (i * 2 <= cnt) { // 下沉
        int child = i * 2;
        if (child + 1 <= cnt && heap[child + 1] < heap[child]) child++;
        if (heap[child] >= heap[i]) break;
        swap(heap[i], heap[child]);
        i = child;
    }
}

int top() {
    return heap[1];
}

int main() {
    int n, op, x;
    scanf("%d", &n);
    while (n--) {
        scanf("%d", &op);
        if (op == 1) {
            scanf("%d", &x);
            push(x);
        } else if (op == 2) {
            printf("%d\n", top());
        } else {
            pop();
        }
    }
    return 0;
}
```

### 2. 单调队列/滑动窗口 (P1886)

- **题目概要**：给定一个数组和固定大小的滑动窗口，求窗口每次滑动时的最大值和最小值。
- **思路**：维护一个下标单调递增、值单调的队列。以求最小值为例：当新元素比队尾小时，不断弹出队尾，保持队列递增；同时检查队头是否已滑出窗口。队头即为当前窗口最小值。
- **难度星级**：★★★☆☆ (经典应用)
- **完整代码 (C++)**：

```c++
#include <iostream>
using namespace std;
const int N = 1e6 + 10;
int a[N], q[N]; // q为单调队列，存储下标

int main() {
    int n, k;
    scanf("%d %d", &n, &k);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);

    // 求最小值
    int hh = 0, tt = -1; // 队头，队尾
    for (int i = 1; i <= n; i++) {
        // 判断队头是否滑出窗口
        if (hh <= tt && q[hh] < i - k + 1) hh++;
        // 维护队列单调递增
        while (hh <= tt && a[q[tt]] >= a[i]) tt--;
        q[++tt] = i;
        if (i >= k) printf("%d ", a[q[hh]]);
    }
    printf("\n");

    // 求最大值
    hh = 0, tt = -1;
    for (int i = 1; i <= n; i++) {
        if (hh <= tt && q[hh] < i - k + 1) hh++;
        while (hh <= tt && a[q[tt]] <= a[i]) tt--;
        q[++tt] = i;
        if (i >= k) printf("%d ", a[q[hh]]);
    }
    return 0;
}
```

### 3. 单调栈 (P5788)

- **题目概要**：对于序列中每个元素，求其**右侧**第一个大于它的元素的下标。
- **思路**：维护一个值单调递减的栈（栈底到栈顶）。遍历时，若当前元素大于栈顶元素，则栈顶元素的答案就是当前下标，弹出栈顶；否则将当前下标入栈。
- **难度星级**：★★★☆☆ (经典应用)
- **完整代码 (C++)**：

```c++
#include <iostream>
#include <stack>
using namespace std;
const int N = 3e6 + 10;
int a[N], ans[N];

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);

    stack<int> stk; // 栈中存储下标
    for (int i = 1; i <= n; i++) {
        // 当前元素 a[i] 比栈顶对应的元素大，则找到了栈顶的答案
        while (!stk.empty() && a[i] > a[stk.top()]) {
            ans[stk.top()] = i;
            stk.pop();
        }
        stk.push(i);
    }
    // 栈中剩余的元素右侧没有更大的，答案为0
    while (!stk.empty()) {
        ans[stk.top()] = 0;
        stk.pop();
    }
    for (int i = 1; i <= n; i++) printf("%d ", ans[i]);
    return 0;
}
```

### 4. 笛卡尔树 (P5854)

- **题目概要**：给定一个互异整数序列，构建其大根堆性质的笛卡尔树，输出每个节点的父节点和左右子节点编号。
- **思路**：使用**单调栈**在线性时间内构建。维护一个存储“右链”（从根一直走右儿子形成的链）的单调栈（栈底到栈顶值递减）。新节点`x`加入时，不断弹出比`a[x]`小的栈顶作为`x`的左孩子；最后栈顶的右孩子设为`x`，`x`入栈。
- **难度星级**：★★★★☆ (构建思想巧妙)
- **完整代码 (C++)**：

```c++
#include <iostream>
#include <stack>
using namespace std;
const int N = 1e7 + 10;
int a[N], ls[N], rs[N], fa[N]; // 左、右、父

int main() {
    int n;
    scanf("%d", &n);
    for (int i = 1; i <= n; i++) scanf("%d", &a[i]);

    stack<int> stk; // 单调递减栈，存储“右链”节点下标
    for (int i = 1; i <= n; i++) {
        int last = 0; // 记录上一个弹出的节点
        while (!stk.empty() && a[stk.top()] > a[i]) {
            last = stk.top();
            stk.pop();
        }
        // 弹出的最后一个节点成为当前节点的左孩子
        if (!stk.empty()) {
            rs[stk.top()] = i;
            fa[i] = stk.top();
        }
        if (last) {
            ls[i] = last;
            fa[last] = i;
        }
        stk.push(i);
    }
    // 输出
    for (int i = 1; i <= n; i++) {
        printf("%d %d %d\n", fa[i], ls[i], rs[i]);
    }
    return 0;
}
```

## 三、难题思路及代码

### 1. P1725 琪露诺 (单调队列优化DP)

- **题目概要**：在数轴上从0跳到N，每次可跳`[L, R]`格，每格有分数，求最大得分。
- **思路**：`dp[i] = max(dp[j]) + a[i] (i-R <= j <= i-L)`。这是一个典型的滑动窗口求最值问题，可以用单调队列维护`dp[j]`的最大值。
- **难度星级**：★★★★☆
- **核心代码片段**：

```c++
// dp[i] 表示跳到位置 i 的最大得分
dp[0] = a[0];
int hh = 0, tt = -1;
int ans = -INF;
// 注意起点是0，且可能跳不到终点N
for (int i = L; i <= N; i++) { // 从能第一次起跳的位置开始
    // 维护窗口 [i-R, i-L]
    while (hh <= tt && q[hh] < i - R) hh++; // 队头出窗
    int j = i - L; // 新进入窗口的候选位置
    if (j >= 0 && dp[j] != -INF) { // 如果位置j可达
        while (hh <= tt && dp[q[tt]] <= dp[j]) tt--;
        q[++tt] = j;
    }
    if (hh <= tt) {
        dp[i] = dp[q[hh]] + a[i];
        if (i + R > N) ans = max(ans, dp[i]); // 从i可以一步跳到终点外
    }
}
printf("%d\n", ans);
```

### 2. P2569 [SCOI2010] 股票交易 (单调队列优化DP)

- **题目概要**：股票交易，有天数、最大持有数、买卖手续费、每天价格、买卖数量限制。求最大利润。
- **思路**：复杂的状态机DP。`dp[i][j]`表示第`i`天持有`j`股的最大收益。转移方程涉及`dp[i-w-1][k] + ap[i]*(k-j)`(买)或`-bp[i]*(j-k)`(卖)，其中`k`在`[j-as[i], j]`或`[j, j+bs[i]]`范围内。将方程变形后，`dp[i-w-1][k] + ap[i]*k`或`dp[i-w-1][k] + bp[i]*k`是只与`k`有关的值，可以用单调队列维护区间最值。
- **难度星级**：★★★★★
- **核心思路与代码结构**：

```c++
// 初始化 dp 为负无穷，dp[0] = 0
for (int i = 1; i <= T; i++) {
    // 1. 不交易的情况
    for (int j = 0; j <= MaxP; j++) dp[i][j] = max(dp[i][j], dp[i-1][j]);
    if (i <= W + 1) continue; // 无法进行上次交易
    int pre = i - W - 1;
    // 2. 买入
    int hh = 0, tt = -1;
    for (int j = 0; j <= MaxP; j++) {
        // 维护窗口 [j-AS[i], j-1]
        while (hh <= tt && q[hh] < j - AS[i]) hh++;
        // 将 k=j-1 加入队列
        int val = dp[pre][j-1] + AP[i] * (j-1);
        while (hh <= tt && dp[pre][q[tt]] + AP[i] * q[tt] <= val) tt--;
        q[++tt] = j-1;
        if (hh <= tt) {
            int k = q[hh];
            dp[i][j] = max(dp[i][j], dp[pre][k] - AP[i] * (j - k));
        }
    }
    // 3. 卖出 (类似，队列维护最大值)
    hh = 0, tt = -1;
    for (int j = MaxP; j >= 0; j--) {
        while (hh <= tt && q[hh] > j + BS[i]) hh++;
        int val = dp[pre][j+1] + BP[i] * (j+1);
        while (hh <= tt && dp[pre][q[tt]] + BP[i] * q[tt] <= val) tt--;
        q[++tt] = j+1;
        if (hh <= tt) {
            int k = q[hh];
            dp[i][j] = max(dp[i][j], dp[pre][k] + BP[i] * (k - j));
        }
    }
}
// 答案在 dp[T]
```

### 3. P4755 Beautiful Pair (分治/笛卡尔树)

- **题目概要**：求有多少对`(i, j)`满足`i<=j`且`a[i]*a[j] <= max(a[i..j])`。
- **思路**：经典分治问题。对于区间`[l, r]`，找到最大值位置`mid`。统计跨过`mid`的合法对。枚举较短的一边（假设左边），对于左边每个`a[i]`，计算右边满足`a[j] <= maxv / a[i]`的`j`的数量（用值域树状数组或排序+双指针）。利用笛卡尔树的性质，可以保证递归层数为O(n)。
- **难度星级**：★★★★★
- **核心代码片段 (分治思路)**：

```c++
long long solve(int l, int r) {
    if (l > r) return 0;
    int mid = query(l, r); // 用ST表或笛卡尔树预处理区间最大值位置
    long long res = solve(l, mid-1) + solve(mid+1, r);
    // 统计跨mid的pair
    int maxv = a[mid];
    if (mid - l < r - mid) { // 枚举左半部分
        vector<int> right_vals;
        for (int j = mid; j <= r; j++) right_vals.push_back(a[j]);
        sort(right_vals.begin(), right_vals.end());
        for (int i = l; i <= mid; i++) {
            long long limit = maxv / a[i];
            // 在right_vals中找到 <= limit 的个数
            int cnt = upper_bound(right_vals.begin(), right_vals.end(), limit) - right_vals.begin();
            res += cnt;
        }
    } else { // 枚举右半部分，同理
        // ...
    }
    return res;
}
```

## 四、剩余题目及思路

1. **P1090 合并果子**：贪心+小根堆。每次合并最小的两堆。
2. **P1198 最大数**：线段树或单调栈+二分。维护一个序列，支持在末尾添加数和查询最后L个数的最大值。
3. **P1631 序列合并**：堆。将A和B排序后，先将`A[i]+B[1]`入堆，每次取出最小和`A[i]+B[j]`后，将`A[i]+B[j+1]`入堆。
4. **P2216 理想的正方形**：二维滑动窗口。先用单调队列对每一行做滑动窗口，得到行方向上的最值矩阵；再对结果的每一列做滑动窗口，得到正方形区域的最值。
5. **P4147 玉蟾宫**：最大全1子矩阵。转化为“直方图最大矩形”问题，对每一行及其以上的部分构建直方图，用单调栈求解。
6. **P2659 美丽的序列**：单调栈。枚举每个值作为区间最小值，用单调栈求出以其为最小值的最大左右边界`L[i]`, `R[i]`，贡献为`a[i] * (i-L[i]+1) * (R[i]-i+1)`。
7. **P1295 [TJOI2011] 书架**：单调队列优化DP。`dp[i] = min(dp[j] + max(h[j+1..i]))`，其中`sum(h[j+1..i]) <= m`。用单调队列维护`max`值，同时保证区间和限制。
8. **P3509 [POI2010] ZAB-Frog**：倍增+单调队列。第k近的点可以用两个单调队列（左右各一个）预处理出来，然后倍增跳。
9. **P9607 [CERC2019] Be Geeks!**：笛卡尔树+数据结构。在笛卡尔树上，问题转化为所有子树内，满足`gcd`和`max`关系的点对统计，需要结合`map`或`vector`维护`gcd`的分布。

## 五、注意事项

1. **边界处理**：单调队列/栈在操作前一定要判断是否为空(`hh<=tt`或`!stk.empty()`)。DP初始化要合理（如设为负无穷或0）。
2. **下标与值**：单调队列通常存储下标，方便判断是否滑出窗口和取值。存储值时需另开数组记录对应下标。
3. **时间复杂度**：确认算法是否满足题目要求（如1e5数据通常需O(n)或O(n log n)）。使用STL `stack`和`queue`一般足够，手写数组栈/队列有时更快。
4. **空间复杂度**：注意内存限制（如512MB很大，125MB较常规）。开大数组时估算大小（`int`约4字节）。
5. **笛卡尔树应用**：当问题与区间最值密切相关，且涉及所有子区间时，考虑笛卡尔树分治。
6. **调试**：对于复杂DP（如股票交易），先写出朴素转移方程，再观察是否能转化为单调队列维护的形式。可以打印中间状态进行调试。

# [2026 寒假提高营 Day 5] 组合数学、进制与位运算相关

## 一、知识点讲解

本日主题聚焦于利用**组合数学**原理进行计数，以及运用**进制（特别是二进制）** 和**位运算（异或、或、与）** 的性质来分析和解决问题。

- **位运算核心性质**：
  - **异或 (XOR, ^)**：`a ^ b = c` 等价于 `a ^ c = b` 和 `b ^ c = a`。`a ^ a = 0`， `a ^ 0 = a`。常用于成对抵消、加密、判断奇偶性。
  - **按位或 (OR, |)**：`a | b` 的结果在 `a` 和 `b` 的二进制表示中，只要某一位有1，结果该位就是1。用于最大化数值。
  - **按位与 (AND, &)**：`a & b` 的结果只有在 `a` 和 `b` 的对应位都为1时才为1。常用于取特定位、判断奇偶。
- **组合数学**：涉及排列组合、二项式定理等，用于计算满足特定条件的方案数。
- **二进制思维**：将问题转化为二进制位上的独立操作，是解决许多位运算难题的关键。

## 二、模板题目思路及代码

### 1. P1469 找筷子 (洛谷)

- **题目概要**：给定一堆长度不同的筷子，其中只有一只筷子是落单的（出现奇数次），其余都成对（出现偶数次），找出这只落单筷子的长度。

- **核心思路**：利用**异或运算的消去律**。`a ^ a = 0`， `0 ^ b = b`。将所有数字进行异或，成对出现的会互相抵消为0，最终结果就是那个落单的数字。

- **难度星级**：★☆☆☆☆ (入门)

- **完整代码 (C++)**：

  ```c++
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      scanf(“%d”, &n);
      int ans = 0, x;
      for(int i = 0; i < n; ++i) {
          scanf(“%d”, &x);
          ans ^= x; // 核心：将所有数依次异或
      }
      printf(“%d\n”, ans);
      return 0;
  }
  ```

### 2. Problem - 627A - XOR Equation (Codeforces)

- **题目概要**：给定两个正整数 `s` (和) 和 `x` (异或值)，求有多少个有序正整数对 `(a, b)` 满足 `a + b = s` 且 `a ^ b = x`。

- **核心思路**：

  1. 由 `a + b = a ^ b + 2 * (a & b)`，可得 `a & b = (s - x) / 2`。首先判断 `(s - x)` 必须非负且为偶数，否则无解（输出0）。
  2. 设 `andVal = (s - x) / 2`。`a & b` 的二进制位决定了 `a` 和 `b` 在该位必须同时为1。
  3. 考虑 `x` 的每一位：
     - 如果 `x` 的某位是 `1`，则 `a` 和 `b` 在该位必须不同（一个0一个1）。此时 `andVal` 的对应位必须是 `0`，否则矛盾（因为`&`要求同时为1）。满足此条件时，该位有两种分配方式（`a=0,b=1` 或 `a=1,b=0`）。
     - 如果 `x` 的某位是 `0`，则 `a` 和 `b` 在该位必须相同。此时 `andVal` 的对应位决定了它们的值（同为0或同为1），只有一种确定方式。
  4. 因此，总方案数为 `2` 的 `(x的二进制中1的个数)` 次方。记作 `1LL << __builtin_popcountll(x)`。
  5. **最后需要排除非法解**：如果 `andVal & x != 0`，说明存在某位在 `x` 和 `andVal` 中同时为1，这与上述分析矛盾，方案数为0。
  6. 另外，如果求出的 `a` 或 `b` 可能为0，而题目要求是正整数。当 `s == x` 时，会包含 `(0, s)` 和 `(s, 0)` 这两组解，需要减去。即最终答案为 `ans - 2 * (s == x)`。

- **难度星级**：★★★☆☆ (中等)

- **完整代码 (C++)**：

  ```c++
  #include <bits/stdc++.h>
  using namespace std;
  typedef long long ll;
  int main() {
      ll s, x;
      cin >> s >> x;
      ll andVal = s - x;
      if(andVal < 0 || (andVal & 1)) {
          cout << 0 << endl;
          return 0;
      }
      andVal >>= 1;
      if((andVal & x) != 0) {
          cout << 0 << endl;
          return 0;
      }
      ll ans = 1LL << __builtin_popcountll(x);
      if(s == x) ans -= 2; // 减去 (0, s) 和 (s, 0)
      cout << ans << endl;
      return 0;
  }
  ```

## 三、难题思路及代码

### 1. Problem - 1188D - Make Equal (Codeforces)

- **题目概要**：给定 `n` 个数 `a[i]`，每次操作可以给任意一个数加上 `2` 的非负整数次幂。求使所有数相等的最小操作次数。

- **核心思路**：

  1. 假设最终所有数都等于 `target`。令 `b[i] = target - a[i]`，则 `b[i] >= 0`。操作就是给某些 `a[i]` 加 `2^k`，等价于减少对应的 `b[i]`。目标是让所有 `b[i]` 变为0。
  2. 最小化总操作数，等价于最小化所有 `b[i]` 的二进制表示中 `1` 的个数之和（因为每次加 `2^k` 就是消除一个 `1`）。
  3. 设最终相等的数为 `M`。可以证明，最优的 `M` 一定是 `max(a)` 或 `max(a) + delta`，其中 `delta` 是一个用于处理进位的偏移量。更优雅的做法是：令 `mx = max(a)`，定义 `c[i] = mx - a[i]`。问题转化为通过加 `2^k` 使所有 `c[i]` 相等（设为 `X`），最小化总 `1` 的个数。最终 `M = mx + X`。
  4. **动态规划 (DP)**：从二进制低位到高位（第0位到第60位）进行DP。状态设计是关键。
     - 状态：`dp[bit][carry]` 表示我们处理到第 `bit` 位时，来自低位的进位为 `carry`（即有多少个数在这一位需要加1来处理上一位的进位），所花费的最小操作数。
     - 对于第 `bit` 位，我们计算所有 `c[i]` 在这一位的值 `bit_val = (c[i] >> bit) & 1`。设 `cnt1` 为 `bit_val` 为1的个数，`cnt0 = n - cnt1`。
     - 决策：我们决定给其中 `add` 个数在这一位执行“加”操作（即加上 `2^bit` 来影响这一位和更高位）。`add` 的范围是 `[carry, n]`（因为至少要处理掉上来的进位）。
     - 执行 `add` 次操作后，这一位的总和变成了 `total = cnt1 + add + carry`。我们希望这一位最终是 `0`（因为要让所有 `c[i]` 相等，我们最终希望 `X` 的每一位是确定的，这里DP隐含地处理了让所有数相等的条件，最终状态是所有位都为0且无进位）。
     - 当前位的值 `cur_bit = total % 2`，产生新的进位 `new_carry = total / 2`。
     - 如果 `cur_bit == 0`，说明这一位“摆平”了，可以转移到下一位。转移方程为：`dp[bit+1][new_carry] = min(dp[bit+1][new_carry], dp[bit][carry] + add)`。其中 `add` 是操作次数，`new_carry` 是新的进位。
  5. 初始化 `dp[0] = 0`，答案为 `dp[0]`（处理完所有位且无进位）。

- **难度星级**：★★★★★ (非常困难)

- **核心代码框架 (C++)**：

  ```c++
  #include <bits/stdc++.h>
  using namespace std;
  typedef long long ll;
  const int B = 61; // 足够处理 10^17 的范围
  const ll INF = 1e18;
  int main() {
      int n; cin >> n;
      vector<ll> a(n);
      ll mx = 0;
      for(auto &x : a) { cin >> x; mx = max(mx, x); }
      vector<ll> c(n);
      for(int i = 0; i < n; ++i) c[i] = mx - a[i];
      vector<vector<ll>> dp(B+2, vector<ll>(n+1, INF));
      dp[0] = 0;
      for(int bit = 0; bit <= B; ++bit) {
          int cnt1 = 0;
          for(int i = 0; i < n; ++i) cnt1 += ((c[i] >> bit) & 1);
          int cnt0 = n - cnt1;
          for(int carry = 0; carry <= n; ++carry) {
              if(dp[bit][carry] == INF) continue;
              for(int add = carry; add <= n; add += 1) { // 枚举加操作次数
                  int total = cnt1 + add; // 注意：这里 total = cnt1 + add + carry? 需要仔细推导
                  // 更准确的推导：
                  // 当前位原始1的个数: cnt1
                  // 来自低位的进位: carry (表示有多少个数在这一位需要+1)
                  // 我们决定进行 add 次 + (1<<bit) 操作。
                  // 那么，实际在这一位“生效”的加法次数是 add + carry。
                  // 所以 total = cnt1 + add + carry。
                  int cur_bit = (cnt1 + add + carry) & 1;
                  int new_carry = (cnt1 + add + carry) >> 1;
                  if(cur_bit == 0) { // 这一位符合要求
                      dp[bit+1][new_carry] = min(dp[bit+1][new_carry], dp[bit][carry] + add);
                  }
                  // 注意：add 每次加1即可，不需要加2，因为进位carry可能为奇数。
              }
          }
      }
      cout << dp[B+1][0] << endl;
      return 0;
  }
  // 注意：上述DP的“add”循环范围可以优化，因为new_carry不会超过n，且add的有效范围与carry和cnt1有关。
  // 标准解法通常会对add的范围进行剪枝，或通过另一种状态定义来优化。
  ```

### 2. P4551 最长异或路径 (洛谷)

- **题目概要**：给定一棵带边权的树，求树上两点路径上所有边权的异或和的最大值。

- **核心思路**：

  1. 设 `d[u]` 为根节点（任意选取，如1）到节点 `u` 的路径上所有边权的异或值。
  2. 那么对于树上任意两点 `u` 和 `v`，它们之间路径的异或和等于 `d[u] ^ d[v]`（因为从根到 `u` 和根到 `v` 的路径，公共部分异或了两次，抵消为0）。
  3. 问题转化为：给定一个数组 `d[1..n]`，求其中两个数异或的最大值。
  4. 这是经典的**最大异或对**问题，可以使用**二进制字典树 (Trie)** 解决。
  5. 将每个 `d[i]` 的二进制形式（从高位到低位）插入到一棵只有0和1分支的字典树中。
  6. 对于每个 `d[i]`，在字典树中贪心地查找：尽可能走与当前位 `bit` 相反的分支（如果存在），因为 `1^0=1`， `0^1=1`，这样才能使该位异或结果为1，从而最大化最终值。如果相反分支不存在，则走相同分支。
  7. 遍历所有 `i`，取查找过程中的最大值即为答案。

- **难度星级**：★★★★☆ (较难)

- **完整代码 (C++)**：

  ```c++
  #include <bits/stdc++.h>
  using namespace std;
  const int N = 100005, M = N * 2;
  int h[N], e[M], w[M], ne[M], idx;
  int d[N];
  int trie[N * 32][2], tot; // 字典树，每个数最多31位（int范围），n个数
  void add(int a, int b, int c) {
      e[idx] = b, w[idx] = c, ne[idx] = h[a], h[a] = idx++;
  }
  void dfs(int u, int fa, int val) {
      d[u] = val;
      for(int i = h[u]; ~i; i = ne[i]) {
          int v = e[i];
          if(v == fa) continue;
          dfs(v, u, val ^ w[i]);
      }
  }
  void insert(int x) {
      int p = 0;
      for(int i = 30; i >= 0; --i) {
          int bit = (x >> i) & 1;
          if(!trie[p][bit]) trie[p][bit] = ++tot;
          p = trie[p][bit];
      }
  }
  int query(int x) {
      int p = 0, res = 0;
      for(int i = 30; i >= 0; --i) {
          int bit = (x >> i) & 1;
          if(trie[p][!bit]) { // 存在相反位
              res |= (1 << i);
              p = trie[p][!bit];
          } else {
              p = trie[p][bit];
          }
      }
      return res;
  }
  int main() {
      int n; scanf(“%d”, &n);
      memset(h, -1, sizeof h);
      for(int i = 1; i < n; ++i) {
          int u, v, c; scanf(“%d%d%d”, &u, &v, &c);
          add(u, v, c); add(v, u, c);
      }
      dfs(1, -1, 0);
      int ans = 0;
      insert(d[1](@ref); // 先插入一个，避免自己和自己异或
      for(int i = 2; i <= n; ++i) {
          ans = max(ans, query(d[i]));
          insert(d[i]);
      }
      printf(“%d\n”, ans);
      return 0;
  }
  ```

## 四、剩余题目及思路

1. **Problem - 2146D1/D2 - Max Sum OR (Codeforces)**：
   - **概要**：重排区间 `[l, r]` 的数组 `a`，最大化 `Σ(a[i] [9](@context-ref?id=2)| b[i])`，其中 `b` 是原始顺序 `[l, l+1, ..., r]`。
   - **思路**：核心是**贪心**。要使或和最大，应尽可能让每个二进制位为1。对于每个位，统计区间内有多少个数在该位为1（记为 `cnt`）。最优策略是让 `cnt` 个该位为1的数，与 `cnt` 个该位为0的数（如果存在）配对，这样 `cnt` 个配对在该位都能得到1。对于 `l=0` 的简单版本，一个经典构造是 `[r, r-1, ..., l]` 即降序排列，可以证明这在 `l=0` 时最优。困难版本需要更精细的构造或证明。
2. **P6225 [eJOI 2019] 异或橙子 (洛谷)**：
   - **概要**：维护一个数组，支持单点修改，查询区间 `[l, r]` 内所有长度为奇数的子区间的异或和之和。
   - **思路**：关键在于发现规律。对于位置 `i`，若 `i` 与 `l` 奇偶性相同，则 `a[i]` 在查询中会出现奇数次，贡献其值；若奇偶性不同，则出现偶数次，贡献为0。因此，问题转化为维护两个树状数组或线段树，分别存储奇数下标和偶数下标的值，支持单点修改和区间求和。
3. **Problem - 1999F - Expected Median (Codeforces)**：
   - **概要**：计算二进制数组所有长度为奇数 `k` 的子序列的中位数之和。
   - **思路**：**组合计数**。中位数为1，当且仅当在选出的 `k` 个数中，至少有 `(k+1)/2` 个1。枚举每个 `1` 作为“关键的第 `(k+1)/2` 个1”，统计它作为中位数的方案数。需要预处理组合数，并利用前缀和优化。
4. **P8594 「KDOI-02」一个仇的复 (洛谷)**：
   - **概要**：题目描述不完整，但从标题和平台看，可能涉及复杂的构造或计数，可能与位运算或组合数学相关。需查看原题具体描述。
5. **QOJ.ac 系列题目 (如 #1089 Biological Software Utilities)**：
   - **概要**：这些是来自Petrozavodsk等高水平比赛的题目，通常难度很大，涉及知识面广。`Biological Software Utilities`, `Bank Security Unification`, `Brief Statements Union` 等，从标题难以判断具体内容，但属于需要深入研究的难题。

## 五、注意事项

1. **边界条件**：位运算题目要特别注意数据范围，使用 `long long` 类型，处理负数时要小心（通常题目保证非负）。
2. **优先级**：位运算的优先级低于比较运算符和加减乘除，务必多用括号确保运算顺序正确。例如 `(a & b) == c` 和 `a & (b == c)` 完全不同。
3. **贪心证明**：许多位运算的最优化问题（如 Max Sum OR）需要使用贪心，务必思考或尝试证明贪心策略的正确性，不能想当然。
4. **字典树空间**：使用字典树解决异或问题时，要提前估算节点数（通常为 `数据数量 * 位数`），避免数组越界。
5. **组合数取模**：涉及组合计数的题目，若需要取模，应预处理阶乘和逆元，使用费马小定理或线性求逆元的方法。
6. **调试技巧**：对于位运算DP或复杂逻辑，可以编写函数将数字打印为二进制格式，便于调试观察中间状态。

# [2026 寒假提高营 Day 6] 最短路

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

```c++
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

```c++
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

```c++
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

```c++
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

```c++
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

```c++
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

```c++
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

# [2026 寒假提高营 Day 7] Tarjan算法专题

## 一、知识点讲解

Tarjan算法由Robert Tarjan提出，是一种基于深度优先搜索(DFS)的图算法，主要用于求解有向图的**强连通分量(Strongly Connected Component, SCC)**。其核心在于维护每个节点的`dfn`（深度优先搜索序）和`low`（能追溯到的最早栈中节点序号），并通过栈来记录当前搜索路径上的节点。

1. **核心数组**：
   - `dfn[u]`: 节点`u`的DFS序（时间戳）。
   - `low[u]`: 从`u`出发，能回溯到的最早的栈中节点的`dfn`值。
   - `stack`: 用于存储当前搜索路径上的节点。
   - `in_stack[u]`: 标记节点`u`是否在栈中。
   - `scc_id[u]`: 节点`u`所属的强连通分量编号。
2. **算法流程**：
   - 对每个未访问的节点进行DFS。
   - 初始化`dfn[u] = low[u] = ++timestamp`，将`u`入栈。
   - 遍历`u`的邻接点`v`：
     - 若`v`未访问，则递归搜索`v`，并用`low[v]`更新`low[u]`。
     - 若`v`已访问且在栈中，用`dfn[v]`更新`low[u]`。
   - 回溯时，若`dfn[u] == low[u]`，则说明`u`是一个SCC的“根”，将栈中节点弹出直到`u`，这些节点构成一个SCC。
3. **主要应用**：
   - **有向图缩点**：将每个SCC缩成一个新节点，得到一个有向无环图(DAG)，便于进行拓扑排序、DP等操作。
   - **2-SAT问题**：将布尔逻辑表达式转化为蕴含关系图，通过求SCC并检查每个变量的两个状态是否在同一SCC中来判断可满足性。

## 二、模板题目思路及代码

以下两道题是Tarjan算法最直接、最经典的应用模板。

### 1. P3387 【模板】缩点

- **题目概要**：给定一个有向图，每个点有点权。找一条路径，使得经过的点权之和最大。允许重复经过点或边，但点权只计算一次。
- **简单思路**：
  1. 使用Tarjan算法求出所有强连通分量。
  2. 将每个SCC缩成一个新点，新点的权值为原SCC内所有点的权值之和。
  3. 在原图的边基础上，建立缩点后的新图（DAG）。注意去重边。
  4. 在DAG上，由于拓扑序确定，可以进行动态规划（DP）求最长路。设`dp[i]`表示以缩点`i`为终点的最大点权和，转移方程为：`dp[v] = max(dp[v], dp[u] + val[v])`，其中`(u->v)`是新图的边。
- **难度星级**：★★★☆☆
- **完整代码（C++）**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 1e4 + 5, M = 1e5 + 5;

int n, m, w[N];
int h[N], e[M], ne[M], idx; // 原图
int hs[N], es[M], nes[M], idxs; // 缩点后的新图
int dfn[N], low[N], timestamp;
int stk[N], top; bool in_stk[N];
int scc_id[N], scc_cnt, scc_w[N]; // scc_w记录每个SCC的总点权
int dp[N]; // DP数组

void add(int h[], int e[], int ne[], int &idx, int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void tarjan(int u) {
    dfn[u] = low[u] = ++timestamp;
    stk[++top] = u, in_stk[u] = true;
    for (int i = h[u]; ~i; i = ne[i]) {
        int v = e[i];
        if (!dfn[v]) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if (in_stk[v]) {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (dfn[u] == low[u]) {
        ++scc_cnt;
        int y;
        do {
            y = stk[top--];
            in_stk[y] = false;
            scc_id[y] = scc_cnt;
            scc_w[scc_cnt] += w[y];
        } while (y != u);
    }
}

int main() {
    memset(h, -1, sizeof h);
    memset(hs, -1, sizeof hs);
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i++) scanf("%d", &w[i]);
    for (int i = 0; i < m; i++) {
        int a, b;
        scanf("%d%d", &a, &b);
        add(h, e, ne, idx, a, b);
    }
    // 1. Tarjan求SCC
    for (int i = 1; i <= n; i++)
        if (!dfn[i]) tarjan(i);
    // 2. 缩点建新图
    unordered_set<long long> S; // 用哈希去重边
    for (int u = 1; u <= n; u++) {
        for (int i = h[u]; ~i; i = ne[i]) {
            int v = e[i];
            int a = scc_id[u], b = scc_id[v];
            if (a != b) {
                long long hash = a * 1000000LL + b;
                if (!S.count(hash)) {
                    S.insert(hash);
                    add(hs, es, nes, idxs, a, b);
                }
            }
        }
    }
    // 3. 在DAG上DP求最长路 (由于建图时是a->b，入度便于计算，这里用拓扑序DP)
    vector<int> in_deg(scc_cnt + 1, 0);
    for (int u = 1; u <= scc_cnt; u++) {
        for (int i = hs[u]; ~i; i = nes[i]) {
            in_deg[es[i]]++;
        }
    }
    queue<int> q;
    for (int i = 1; i <= scc_cnt; i++) {
        if (in_deg[i] == 0) q.push(i);
        dp[i] = scc_w[i]; // 初始化dp值为自身点权
    }
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int i = hs[u]; ~i; i = nes[i]) {
            int v = es[i];
            dp[v] = max(dp[v], dp[u] + scc_w[v]);
            if (--in_deg[v] == 0) q.push(v);
        }
    }
    // 4. 答案为所有dp值中的最大值
    int ans = *max_element(dp + 1, dp + scc_cnt + 1);
    printf("%d\n", ans);
    return 0;
}
```

### 2. P4782 【模板】2-SAT

- **题目概要**：给定n个布尔变量和m个形如`(x_i为a) ∨ (x_j为b)`的条件（∨表示或），判断是否存在一组赋值使得所有条件成立。
- **简单思路**：
  1. **建图**：将每个变量`x_i`拆成两个点：`i`表示`x_i`为真，`i+n`表示`x_i`为假。
  2. **条件转化**：条件`(x_i = a) ∨ (x_j = b)`可以转化为两条**蕴含关系**（若A则B）：
     - 若`x_i`不为`a`，则`x_j`必须为`b`。
     - 若`x_j`不为`b`，则`x_i`必须为`a`。
       对应加边：`add(i + (a?0:n), j + (b?n:0))` 和 `add(j + (b?0:n), i + (a?n:0))`。
  3. **求解**：对建好的蕴含图（共2n个点）跑Tarjan求SCC。
  4. **判断**：若任意`i`和`i+n`在同一个SCC中，说明`x_i`必须同时为真和假，矛盾，无解。否则有解。
  5. **构造方案**：对缩点后的DAG进行拓扑排序。对于变量`x_i`，我们选择其拓扑序较大的那个状态（即SCC编号较小的，因为Tarjan算法中后求出的SCC编号小，相当于反图的拓扑序大）。因为如果选择了拓扑序小的状态，可能会通过蕴含关系推导出另一个状态，导致矛盾。
- **难度星级**：★★★★☆
- **完整代码（C++）**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 2e6 + 5, M = 2e6 + 5; // 注意点数开2倍

int n, m;
int h[N], e[M], ne[M], idx;
int dfn[N], low[N], timestamp;
int stk[N], top; bool in_stk[N];
int scc_id[N], scc_cnt;

void add(int a, int b) {
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void tarjan(int u) {
    dfn[u] = low[u] = ++timestamp;
    stk[++top] = u, in_stk[u] = true;
    for (int i = h[u]; ~i; i = ne[i]) {
        int v = e[i];
        if (!dfn[v]) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if (in_stk[v]) {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (dfn[u] == low[u]) {
        ++scc_cnt;
        int y;
        do {
            y = stk[top--];
            in_stk[y] = false;
            scc_id[y] = scc_cnt;
        } while (y != u);
    }
}

int main() {
    memset(h, -1, sizeof h);
    scanf("%d%d", &n, &m);
    for (int i = 0; i < m; i++) {
        int x, a, y, b;
        scanf("%d%d%d%d", &x, &a, &y, &b);
        // 变量x: x为真->点x, x为假->点x+n
        // 条件 (x为a) 或 (y为b)
        // 加边: !(x为a) -> (y为b) 和 !(y为b) -> (x为a)
        int X1 = x + (a ? 0 : n), X2 = x + (a ? n : 0); // X1为a状态，X2为非a状态
        int Y1 = y + (b ? 0 : n), Y2 = y + (b ? n : 0); // Y1为b状态，Y2为非b状态
        add(X2, Y1); // 如果x不是a，那么y必须是b
        add(Y2, X1); // 如果y不是b，那么x必须是a
    }
    for (int i = 1; i <= 2 * n; i++)
        if (!dfn[i]) tarjan(i);
    // 检查是否有矛盾
    for (int i = 1; i <= n; i++) {
        if (scc_id[i] == scc_id[i + n]) {
            puts("IMPOSSIBLE");
            return 0;
        }
    }
    puts("POSSIBLE");
    // 构造方案：对于每个变量，选择其所在SCC编号较小的状态（即拓扑序较大的状态）
    for (int i = 1; i <= n; i++) {
        if (scc_id[i] < scc_id[i + n]) printf("1 "); // 真
        else printf("0 "); // 假
    }
    return 0;
}
```

## 三、难题思路及代码

以下题目在Tarjan/2-SAT的基础上，需要更复杂的建模或结合其他算法。

### 1. P5025 [SNOI2017] 炸弹

- **题目概要**：数轴上有n个炸弹，每个炸弹有坐标`x[i]`和爆炸半径`r[i]`。一个炸弹爆炸会引爆在其爆炸范围内的所有炸弹，求每个炸弹能直接或间接引爆的炸弹总数。
- **简单思路**：
  1. **建图**：每个炸弹是一个节点。如果炸弹`i`能直接引爆炸弹`j`（即`|x[i]-x[j]| <= r[i]`），则连一条有向边`i->j`。这是一个区间覆盖问题，可以用线段树优化建图或直接二分查找左右边界来建边，避免O(n²)的复杂度。
  2. **问题转化**：炸弹`i`能引爆的所有炸弹，就是从节点`i`出发，在图中能到达的所有节点。在**有向图**中，这通常需要求传递闭包，但n很大（≤5×10^5），不可行。
  3. **关键观察**：炸弹的引爆是单向的（坐标顺序有影响），但引爆具有传递性。如果我们对原图进行**缩点**，得到DAG。那么在同一个SCC内的炸弹可以互相引爆。在DAG上，一个点能到达的所有点，就是它自身所在的SCC以及它后代的所有SCC。
  4. **算法步骤**：
     - 优化建图（如二分+前缀优化）。
     - Tarjan缩点，记录每个SCC包含的原节点数`size[c]`。
     - 在DAG上，由于边是从左向右（坐标小指向坐标大）的，拓扑序是确定的。可以按照拓扑序（或逆拓扑序）进行DP，求出每个SCC能到达的节点总数`sum[c]`。`sum[c] = size[c] + sum[v] (对于所有c->v)`。
     - 对于原图中每个炸弹`i`，答案就是它所属SCC的`sum`值。
- **难度星级**：★★★★★
- **核心代码框架（建图与DP部分）**：

```c++
// 假设已输入x[], r[]，并已排序（或使用原始顺序并记录排序后的位置）
vector<int> g[N], new_g[N]; // 原图邻接表，缩点后新图邻接表
int scc_size[N], sum[N];
// 1. 建图：对于每个i，二分找到它能覆盖的左右边界L, R，向区间[L, R]内所有点连边。
//    常用优化：不直接连所有边，而是i->i+1->...->R 和 i->i-1->...->L，利用传递性。
//    更优的方法是使用线段树优化建图。
// 2. Tarjan缩点 (代码略，同模板)
// 3. 建新图，并计算入度
// 4. 拓扑排序 + DP (逆拓扑序更方便)
queue<int> q;
for(int c = 1; c <= scc_cnt; c++) if(in_deg[c]==0) q.push(c);
vector<int> topo_order;
while(!q.empty()){
    int u = q.front(); q.pop();
    topo_order.push_back(u);
    for(int v : new_g[u]) if(--in_deg[v]==0) q.push(v);
}
// 逆序遍历拓扑序
reverse(topo_order.begin(), topo_order.end());
for(int u : topo_order){
    sum[u] = scc_size[u];
    for(int v : new_g[u]) sum[u] += sum[v]; // u能到达v，所以v的sum已经算好
}
// 5. 计算答案
for(int i=1; i<=n; i++) ans[i] = sum[scc_id[i]];
```

### 2. P3825 [NOI2017] 游戏

- **题目概要**：有n场游戏，每场游戏有3种地图类型(a,b,c)，但有些场次会限制某些地图不能选。有m个限制条件，格式为“若第i场游戏选了地图h_i，则第j场游戏必须选地图h_j”。求一种满足所有限制的地图选择方案。
- **简单思路**：
  1. **转化为2-SAT**：每场比赛可以看成是一个变量，但取值有2种或3种。对于地图类型固定的场次，是二选一；对于不固定的场次，理论上是三选一，无法直接用2-SAT。
  2. **关键技巧**：注意到地图只有三种(a,b,c)，且每场比赛最多有两种地图不可用。我们可以**枚举x型地图**（即不限制地图类型的场次）的可用地图组合。因为每场比赛只能选一种地图，若我们枚举了某场比赛不能选的地图，那么它就只能从剩下的两种中选，就变成了二选一问题。
  3. **具体实现**：用dfs枚举所有x型场次的地图类型（枚举它是`'A'`或`'B'`或`'C'`，但实际只需枚举两种，因为第三种是确定的）。对于每种枚举情况，将所有场次转化为二选一变量，然后根据m个限制条件建蕴含图，跑2-SAT模板判断即可。
  4. **限制条件处理**：对于限制`(i, h_i, j, h_j)`：
     - 如果第i场比赛不能选地图`h_i`，那么这个限制条件永远成立，忽略。
     - 如果第j场比赛不能选地图`h_j`，那么第i场比赛就不能选`h_i`，转化为`i选h_i`为假。
     - 否则，就是标准的蕴含关系：`i选h_i` -> `j选h_j`，同时其逆否命题：`j不选h_j` -> `i不选h_i`。
- **难度星级**：★★★★★
- **核心代码框架（枚举与建图部分）**：

```c++
int n, d, m;
char s[N]; // 初始地图类型字符串
struct Rule { int i, j; char hi, hj; } rules[M];
int pos[10]; // 记录x型场次的位置
char choice[N][2]; // 对于每场比赛，可选的两种地图字符（经过枚举后确定）

bool solve(int state) {
    // 根据枚举状态state，确定每个x型场次的地图限制，填充choice数组
    for(int k=0; k<d; k++){
        int p = pos[k];
        char forbid = 'A' + ((state >> (2*k)) & 3); // 根据state决定这个位置禁止的地图
        // 根据forbid，确定这场比赛可选的两种地图，填入choice[p][0]和choice[p]
    }
    // 对于非x型场次，直接根据s[i]确定choice[i][0]和choice[i]
    // 建图（共2n个点）
    init_graph();
    for(int k=0; k<m; k++){
        int i = rules[k].i, j = rules[k].j;
        char hi = rules[k].hi, hj = rules[k].hj;
        // 处理限制条件，转化为2-SAT加边
        if(choice[i][0]!=hi && choice[i][1]!=hi) continue; // i不能选hi，限制无效
        if(choice[j][0]!=hj && choice[j][1]!=hj){
            // j不能选hj，则i必须不选hi
            // 加边：i选hi -> i不选hi (即直接矛盾边，或转化为i必须选另一个)
            int u = get_node(i, hi, true); // 得到i选hi对应的点编号
            int v = get_node(i, hi, false);// 得到i不选hi对应的点编号
            add(u, v); // 强制让u为假
            continue;
        }
        // 标准蕴含关系加边
        int u = get_node(i, hi, true); // i选hi
        int v = get_node(j, hj, true); // j选hj
        add(u, v); // u->v
        add(v^1, u^1); // 逆否命题
    }
    // 跑Tarjan 2-SAT
    // 判断并构造解
}
// 主函数中枚举state
for(int state=0; state<(1<<(2*d)); state++) { // 实际枚举3^d种，但用4进制压缩
    if(solve(state)) {
        output_answer();
        return 0;
    }
}
printf("-1");
```

## 四、剩余题目及思路

以下题目也涉及Tarjan、缩点或2-SAT思想，可作为扩展练习。

1. **P7251 [JSOI2014] 强连通图**
   - **思路**：第一问即求最大强连通分量大小（Tarjan直接求）。第二问是至少加多少条边能使整个图强连通，结论是：将原图缩点成DAG后，统计入度为0的点数`in0`和出度为0的点数`out0`，答案即为`max(in0, out0)`。注意若整个图已经是一个SCC，答案为0。
2. **P1407 [国家集训队] 稳定婚姻**
   - **思路**：判断婚姻是否“不稳定”，即是否存在一对男女，他们彼此喜欢对方胜过自己当前的配偶。可以建模为有向图：若男A喜欢女C胜过现任女B，则连边`A->C`；若女C喜欢男A胜过现任男D，则连边`C->A`。如果存在一个**环**，则说明这个环上的关系可以重组，导致不稳定。因此，问题转化为判断图中是否有环，或更具体地，**求强连通分量**。若某对夫妻`(A,B)`在同一个SCC中，且该SCC大小大于1，则他们的婚姻是不稳定的。
3. **P1262 [POI 1996 R3] 间谍网络**
   - **思路**：给定有向图，某些点可以被贿赂（有代价），问能否控制整个图（即从被贿赂点出发能到达所有点），以及最小代价。**Tarjan缩点**后，对于DAG上每个入度为0的SCC，如果这个SCC内部没有可以被贿赂的点，则无法控制整个图。否则，最小代价就是所有入度为0的SCC中，贿赂其内部点所需的最小代价之和。
4. **P2272 [ZJOI2007] 最大半连通子图**
   - **思路**：半连通子图定义：对于图中任意两点u,v，存在u->v或v->u的路径。**最大**指节点数最多。先Tarjan缩点，因为一个SCC内任意两点双向可达，肯定半连通。问题转化为在DAG上找一个最大节点数的链（因为DAG上的路径保证单向可达）。需要求DAG的**最长路（按节点数）**，并统计方案数。注意缩点后要去掉新图中的重边，否则方案数会重复计算。
5. **P4171 [JSOI2010] 满汉全席**
   - **思路**：经典的**2-SAT**问题模型。每个评委有两个要求，每个要求是“某道菜是满式(m)或汉式(h)”。转化为“`(菜i为a) 或 (菜j为b)`”的形式，直接套用2-SAT模板即可。
6. **P5782 [POI 2001 R2] 和平委员会**
   - **思路**：2-SAT问题。每个党派有2名代表，委员会需从每党选1人，且有m对冲突关系（两人不能同时入选）。设变量`x_i`表示第i个党派的第一个代表是否入选。冲突`(a,b)`意味着“a入选 -> b不入选”且“b入选 -> a不入选”。建图跑2-SAT。
7. **P3513 [POI 2011] KON-Conspiracy**
   - **思路**：将n个人划分成两个集合：团（集合内所有人互相认识）和独立集（集合内所有人互不认识）。这是一个**2-SAT**的高级应用。需要根据认识关系，构造出每个人作为“团内点”或“独立集内点”时必须连带的其他人的选择条件，然后求解。难度在于模型的构建。
8. **P6378 [PA 2010] Riddle**
   - **思路**：2-SAT问题，但带有“每个部分至少选一个关键点”的额外条件。需要用到**前缀优化建图**技巧来将“至少选一个”这种子句转化为O(n)规模的蕴含边，避免O(n²)的边数。是练习2-SAT优化建图的好题。
9. **P4819 [中山市选] 杀人游戏**
   - **思路**：给定有向图表示信任关系，询问最小的调查人数，使得能确定杀手身份。**缩点**后，在DAG中，调查所有入度为0的SCC中的任意一人是必要的。但有一个特殊情况：如果存在一个SCC，大小为1，且其入度为0，且它指向的所有SCC的入度都大于1（即它的出边不影响其他SCC的入度），那么调查它可能可以替代调查另一个入度为0的SCC？需要仔细分析概率。核心仍是缩点后分析DAG的结构。
10. **P1073 [NOIP 2009 提高组] 最优贸易**
    - **思路**：本题虽然不直接使用Tarjan，但可以用**缩点**来简化。在同一个SCC内的城市，可以自由买卖，因此可以求出每个SCC内的最小买入价和最大卖出价。缩点后得到DAG，从起点所在的SCC到终点所在的SCC，找一条路径使得`(最大卖出价 - 最小买入价)`最大。这可以在DAG上用DP完成。
11. **P3609 [USACO17JAN] Hoof, Paper, Scissor G**
    - **思路**：本题是DP问题，与Tarjan无关。
12. **P4835 [JSOI2014] 学生选课**
    - **思路**：本题提交量极少，可能是2-SAT或网络流题目，资料不足。

## 五、注意事项

1. **数组大小**：Tarjan和2-SAT题目常需开较大的数组，特别是边数。要根据题目数据范围精确计算，**邻接表存储时，边数组大小通常要开点数的2倍甚至更多**（如2-SAT中，m个条件最多产生4m条边）。
2. **栈溢出**：递归实现的Tarjan在深度很大时可能栈溢出。可以通过编译指令`-Wl,--stack=更大值`（Windows）或改用迭代栈，或在OJ上判断递归深度。
3. **去重边**：缩点后建立新图时，务必对重边进行处理，否则可能影响拓扑排序或DP结果的正确性（尤其是统计方案数时，如P2272）。
4. **2-SAT输出方案**：标准方法是选择SCC编号较小的状态。因为Tarjan算法求出的SCC编号是**反拓扑序**，编号越小，在反图中拓扑序越大，在原蕴含图中拓扑序越小。选择拓扑序大的状态（即编号小的状态）能保证不产生矛盾。
5. **时间复杂度**：Tarjan算法本身是O(V+E)的。但难点往往在于**建图**（如P5025的线段树优化建图）和**问题转化**（如P3825的枚举）。
6. **调试**：可以尝试输出缩点后的SCC信息、每个SCC的大小、新图的边等，帮助理解图的结构和验证算法正确性。

# [2026 寒假提高营 Day 8] 动态规划

## 一、知识点讲解

动态规划（Dynamic Programming, DP）是一种通过将复杂问题分解为重叠子问题，并存储子问题的解以避免重复计算，从而高效解决问题的算法思想。其核心在于**状态定义**、**状态转移方程**和**边界条件**。

常见DP类型：

1. **线性DP**：状态沿线性（如序列）递推。如：最长上升子序列(LIS)、编辑距离。
2. **区间DP**：状态定义在区间上，通过合并小区间得到大区间的解。如：石子合并、回文串。
3. **树形DP**：在树结构上进行DP，通常结合DFS后序遍历。如：没有上司的舞会、二叉苹果树。
4. **状态压缩DP**：用二进制位等紧凑形式表示一个集合的状态。常用于解决棋盘、排列等问题。如：互不侵犯、炮兵阵地。
5. **背包DP**：在容量限制下选择物品以最大化价值。变种：01背包、完全背包、分组背包、依赖背包（树形背包）。
6. **数位DP**：统计满足特定条件的数字个数，通常与数字的每一位相关。
7. **概率/期望DP**：计算随机过程中的概率或期望值。
8. **状压DP优化**：使用轮廓线、插头DP等处理更复杂的状态。

## 二、模板题目思路及代码

以下选取几类最经典的DP问题作为模板。

### 模板1：树形DP - P1352 没有上司的舞会

- **题目概要**：一棵树，每个节点有权值。不能同时选择直接相连的父子节点。求所选节点权值和的最大值。
- **思路**：`dp[u][0/1]` 表示以 `u` 为根的子树，`u` 不参加(0)/参加(1)舞会能获得的最大快乐值。
  - `dp[u][1] = happy[u] + sum(dp[v][0](@ref)` (v是u的儿子)
  - `dp[u][0] = sum(max(dp[v][0], dp[v][1](@ref))`
  - 通过DFS从叶子向根递推。
- **难度星级**：★★★☆☆
- **完整代码 (C++)**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 6005;
vector<int> g[N];
int happy[N], dp[N][2], fa[N];

void dfs(int u) {
    dp[u][1] = happy[u];
    for (int v : g[u]) {
        dfs(v);
        dp[u][1] += dp[v][0];
        dp[u][0] += max(dp[v][0], dp[v][1](@ref);
    }
}

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> happy[i];
    for (int i = 1; i < n; i++) {
        int l, k;
        cin >> l >> k;
        g[k].push_back(l);
        fa[l] = k;
    }
    int root = 1;
    while (fa[root]) root = fa[root];
    dfs(root);
    cout << max(dp[root][0], dp[root][1](@ref) << endl;
    return 0;
}
```

### 模板2：区间DP - P1040 [NOIP2003] 加分二叉树

- **题目概要**：给定二叉树的中序遍历序列及各节点分数，定义子树加分规则。求加分最大的二叉树（输出其前序遍历）。
- **思路**：中序遍历特性：`[l, r]` 区间若以 `k` 为根，则左子树为 `[l, k-1]`，右子树为 `[k+1, r]`。
  - `dp[l][r]` 表示中序遍历区间 `[l, r]` 构成子树的最大加分。
  - 转移：`dp[l][r] = max(dp[l][k-1] * dp[k+1][r] + score[k])`，其中 `l <= k <= r`。需记录使 `dp[l][r]` 最大的根 `root[l][r] = k`，用于递归输出前序遍历。
- **难度星级**：★★★★☆
- **完整代码 (C++)**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 35;
long long dp[N][N];
int root[N][N], score[N];

void print_preorder(int l, int r) {
    if (l > r) return;
    cout << root[l][r] << ' ';
    print_preorder(l, root[l][r] - 1);
    print_preorder(root[l][r] + 1, r);
}

int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> score[i];
        dp[i][i] = score[i];
        root[i][i] = i;
    }
    for (int len = 2; len <= n; len++) {
        for (int l = 1; l + len - 1 <= n; l++) {
            int r = l + len - 1;
            for (int k = l; k <= r; k++) {
                long long left = (k == l) ? 1 : dp[l][k-1];
                long long right = (k == r) ? 1 : dp[k+1][r];
                long long val = left * right + score[k];
                if (val > dp[l][r]) {
                    dp[l][r] = val;
                    root[l][r] = k;
                }
            }
        }
    }
    cout << dp[n] << endl;
    print_preorder(1, n);
    return 0;
}
```

### 模板3：线性DP - P1020 [NOIP1999] 导弹拦截

- **题目概要**：第一问：求最长不上升子序列长度。第二问：求最少需要多少个不上升子序列覆盖整个序列（Dilworth定理：等于最长上升子序列长度）。
- **思路**：
  - 第一问：经典 `O(n^2)` DP 或 `O(n log n)` 贪心+二分（维护单调不上升数组）。
  - 第二问：转换为求最长上升子序列(LIS)长度，同样可用 `O(n log n)` 贪心+二分（维护单调上升数组）。
- **难度星级**：★★★★☆
- **完整代码 (O(n log n), C++)**：

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 5;
int a[N], d1[N], d2[N]; // d1: 不上升序列， d2: 上升序列

int main() {
    int n = 0, x;
    while (cin >> x) a[++n] = x;
    int len1 = 1, len2 = 1;
    d1[1] = d2[1] = a[1];
    for (int i = 2; i <= n; i++) {
        // 第一问：最长不上升子序列
        if (a[i] <= d1[len1]) d1[++len1] = a[i];
        else *upper_bound(d1 + 1, d1 + len1 + 1, a[i], greater<int>()) = a[i];
        // 第二问：最长上升子序列
        if (a[i] > d2[len2]) d2[++len2] = a[i];
        else *lower_bound(d2 + 1, d2 + len2 + 1, a[i]) = a[i];
    }
    cout << len1 << endl << len2 << endl;
    return 0;
}
```

 三、难题思路及代码

选取两道综合性较强、难度较高的题目。

### 难题1：P3953 [NOIP2017] 逛公园

- **题目概要**：求有向图中，从1到N的长度不超过最短路长度+K的路径条数。允许0边，可能存在0环。
- **思路**：最短路计数+DP。先跑最短路（Dijkstra）得到 `dis[i]`。
  - 定义 `dp[u][k]`：从1到u，路径长度恰好为 `dis[u] + k` 的路径条数。
  - 转移：对于边 `(u, v, w)`，有 `extra = (dis[u] + k + w) - dis[v]`。若 `0 <= extra <= K`，则 `dp[v][extra] += dp[u][k]`。
  - 关键：需要按 `dis` 排序后DP，或者记忆化搜索。若在搜索中遇到状态 `(u, k)` 成环且 `k` 不变，说明存在0环，且该环在合法路径上，则答案为-1。
- **难度星级**：★★★★★
- **核心代码框架 (记忆化搜索)**：

```c++
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
const int N = 1e5 + 5, M = 2e5 + 5, INF = 0x3f3f3f3f;
struct Edge { int to, w, next; } e[M], rev[M];
int h[N], rh[N], idx, dis[N], dp[N][55];
bool vis[N], inStack[N][55];
int T, n, m, K, P, flag;

void add(int h[], int a, int b, int c) { e[++idx] = {b, c, h[a]}; h[a] = idx; }
void dijkstra() {
    priority_queue<PII, vector<PII>, greater<PII>> pq;
    memset(dis, 0x3f, sizeof dis); memset(vis, 0, sizeof vis);
    dis[1] = 0; pq.push({0, 1});
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        if (vis[u]) continue; vis[u] = true;
        for (int i = h[u]; i; i = e[i].next) {
            int v = e[i].to, w = e[i].w;
            if (dis[v] > dis[u] + w) {
                dis[v] = dis[u] + w;
                pq.push({dis[v], v});
            }
        }
    }
}
int dfs(int u, int k) {
    if (inStack[u][k]) { flag = 1; return 0; }
    if (dp[u][k] != -1) return dp[u][k];
    inStack[u][k] = true;
    int res = 0;
    for (int i = rh[u]; i; i = e[i].next) { // 在反图上搜索
        int v = e[i].to, w = e[i].w;
        int extra = dis[v] + w - dis[u] + k; // 从v到u，消耗的额外长度
        if (extra >= 0 && extra <= K) {
            res = (res + dfs(v, extra)) % P;
            if (flag) return 0;
        }
    }
    inStack[u][k] = false;
    if (u == 1 && k == 0) res = 1; // 边界：回到起点且无额外长度
    return dp[u][k] = res;
}
int main() {
    cin >> T;
    while (T--) {
        // 初始化图...
        dijkstra();
        memset(dp, -1, sizeof dp); memset(inStack, 0, sizeof inStack);
        flag = 0;
        int ans = 0;
        for (int k = 0; k <= K; k++) {
            ans = (ans + dfs(n, k)) % P;
            if (flag) break;
        }
        if (flag) cout << -1 << endl;
        else cout << ans << endl;
    }
    return 0;
}
```

#### 难题2：P5666 [CSP-S2019] 树的重心

- **题目概要**：给定一棵树，枚举每条边，将其断开后得到两棵树，求这两棵树的所有重心编号之和。
- **思路**：需要深刻理解重心的性质：1) 树的重心至多两个。2) 重心在树的重直径上。3) 以 `u` 为根时，若一个节点 `v` 是重心，则其最大子树大小 `<= n/2`。
  - 核心：换根DP。先以1为根DFS，预处理 `size[u]`, `son[u]`（最大子树）, `son2[u]`（次大子树），以及 `f[u]` 表示 `u` 向上走的那棵“子树”的大小。
  - 枚举边 `(u, v)`（设 `u` 是 `v` 的父节点），断开后得到以 `v` 为根的子树 `T1` 和剩余部分 `T2`。
  - 分别计算 `T1` 和 `T2` 的重心：
    - 对于 `T1`（子树 `v`）：在 `v` 的子树内，利用预处理的最大/次大子树信息，结合 `size[v]` 判断。
    - 对于 `T2`（整树去掉 `v` 子树）：需要动态维护以 `u` 为根时，`u` 的最大子树（可能来自 `son[u]` 或 `f[u]`），以及 `u` 的父节点方向的信息。这需要第二次DFS（换根）来为每个节点计算其作为“根”时，其子树外部分的信息。
  - 实现复杂，需要仔细分类讨论。
- **难度星级**：★★★★★
- **核心思路提示**：
  1. 第一次DFS预处理子树信息。
  2. 第二次DFS进行换根，计算每个节点 `x` 的 `up[x]`（`x` 的父节点方向“子树”的大小）以及 `up_son[x]`（来自父节点方向的最大可能子树大小）。
  3. 枚举边时，对于 `T2`，其“根”可以看作是断开后 `u` 所在的连通块。需要结合 `u` 的子树信息（排除 `v` 后）和 `u` 的父节点方向信息，来动态计算 `T2` 中每个节点是否符合重心条件。通常需要从 `u` 开始在 `T2` 中向两侧（子树和父方向）寻找可能的重心。

### 四、剩余题目及思路

以下对文档中其他DP题目进行简要思路归类。

#### 线性/序列DP

- **P1091 合唱队形**：双向LIS。`dp_up[i]` 以 `i` 结尾的LIS长度，`dp_down[i]` 以 `i` 开头的LDS长度。答案：`n - max(dp_up[i]+dp_down[i]-1)`。
- **P2758 编辑距离**：经典二维DP。`dp[i][j]` 表示A前i个变到B前j个的最小操作数。操作：增、删、改。
- **P1435 回文字串**：求给定串至少插入多少字符变成回文串。等价于 `n - (原串与逆序串的最长公共子序列长度)`。
- **P1140 相似基因**：类似编辑距离，给定碱基匹配得分表，进行带权匹配。
- **P3205 合唱队**：区间DP。`dp[l][r][0/1]` 表示区间 `[l,r]` 排成队形，最后一个人从左边(0)或右边(1)插入的方案数。

#### 区间DP

- **P1880 石子合并（环形）**：破环成链，复制一倍数组，在长度为 `2n` 的链上做区间DP，答案取 `max/min(dp[i][i+n-1])`。
- **P1063 能量项链**：环形区间DP，处理方式同上。
- **P4342 Polygon**：环形区间DP，需要同时维护最大值和最小值（因为存在乘法，负负得正）。
- **P4170 涂色**：区间DP。`dp[l][r]` 涂完 `[l,r]` 的最少次数。若 `s[l]==s[r]`，则 `dp[l][r]` 可以从 `dp[l+1][r]` 或 `dp[l][r-1]` 转移来（相当于扩展一笔）。否则枚举分割点 `k`。
- **P3146 248 G / P3147 262144 P**：区间DP变种。`dp[i][j]` 表示以 `i` 为起点，能合并出数值 `j` 的区间的右端点。转移：`if(dp[i][j-1] && dp[dp[i][j-1]+1][j-1]) dp[i][j] = dp[dp[i][j-1]+1][j-1]`。

#### 树形DP

- **P2015 二叉苹果树**：树形背包（依赖背包）。`dp[u][j]` 表示以 `u` 为根的子树保留 `j` 条边的最大苹果数。对每个儿子做分组背包。
- **P2014 选课**：森林转化为虚根0后的树形背包。`dp[u][j]` 表示以 `u` 为根的子树，选择 `j` 门课（包括 `u`）的最大学分。
- **P1122 最大子树和**：类似“最大子段和”的树形版本。`dp[u]` 表示包含 `u` 的连通块最大和。`dp[u] = val[u] + sum(max(0, dp[v]))`。
- **P3177 树上染色**：树形背包。`dp[u][j]` 表示以 `u` 为根的子树，有 `j` 个点被染成黑色，对整棵树的贡献值。转移时需要考虑边 `(u,v)` 的贡献（这条边被经过的次数 = 黑点数量之积 + 白点数量之积）。
- **P4316 绿豆蛙的归宿**：期望DP，拓扑序上DP。`dp[u]` 表示从 `u` 到终点的期望长度。`dp[u] = sum((w + dp[v]) / outdeg[u])`。

#### 状态压缩DP

- **P1896 互不侵犯**：`dp[i][j][s]` 表示前 `i` 行，已放 `j` 个国王，第 `i` 行状态为 `s` 的方案数。预处理合法单行状态和行间兼容状态。
- **P1879 Corn Fields G**：类似互不侵犯，条件变为土地是否肥沃。
- **P2704 炮兵阵地**：状态需存两行（因为影响两行）。`dp[i][s1][s2]` 表示第 `i` 行状态为 `s1`，第 `i-1` 行状态为 `s2` 的最大部署数。空间和时间优化是关键。
- **P2622 关灯问题II**：BFS/状压DP。`dp[mask]` 表示达到状态 `mask` 的最小步数，每个按钮相当于一种状态转移。

#### 背包及其变种

- **P2515 软件安装**：先Tarjan缩点（处理环），将强连通分量视为一个物品（价值、重量为分量内总和），然后在新生成的DAG上做树形背包（依赖背包）。
- **P1450 硬币购物**：容斥原理+完全背包预处理。先预处理不限数量时凑出 `s` 的方案数 `dp[s]`。对于每次询问，用容斥减去某种硬币超限的方案。
- **P1070 道路游戏**：线性DP。`dp[i]` 表示前 `i` 时刻的最大收益。转移时，枚举 `j` 表示上一次买机器人的时刻，以及机器人类型 `p`，计算从 `j+1` 到 `i` 时刻该机器人的收益。

#### 其他经典/综合DP

- **P2831 愤怒的小鸟**：状压DP。预处理所有能由一条抛物线打掉的猪的集合 `line[i][j]`。`dp[mask]` 表示打掉集合 `mask` 中的猪所需的最小小鸟数。`dp[mask|line[i][j]] = min(dp[mask]+1)`。优化：每次固定打掉 `mask` 中最低位的猪。
- **P3959 宝藏**：状压DP。`dp[s][i]` 表示已开发集合 `s`，当前树深度为 `i` 的最小代价。转移：枚举 `s` 的补集 `t` 作为下一层节点，计算连接 `s` 和 `t` 的最小边权总和（每个 `t` 中节点连向 `s` 的最小边权 * (i+1)）。
- **P1220 关路灯**：区间DP。`dp[l][r][0/1]` 表示关掉 `[l, r]` 区间所有灯后，人站在左端点(0)或右端点(1)时，已经消耗的最小总功耗（不包括未关灯的功耗）。转移时加上“剩余未关灯功率 * 移动时间”。
- **P2473 奖励关**：期望DP（倒推）。`dp[i][s]` 表示从第 `i` 轮开始，当前已获得宝物集合为 `s`，到第 `k` 轮结束能获得的期望最大分数。决策：第 `i` 轮的宝物若能吃（前提满足），则比较吃与不吃的期望。
- **P4290 玩具取名**：区间DP。`dp[l][r][ch]` 表示区间 `[l,r]` 能否合并成字符 `ch`。根据给定的合并规则进行转移。

### 五、注意事项

1. **状态设计**：优先考虑问题的最优子结构，定义清晰、无后效性的状态。有时增加一维（如记录最后一步的选择）能简化转移。
2. **转移顺序**：确保计算当前状态时，其所依赖的子状态已被计算。线性、区间DP通常按长度、树形DP按DFS序、状压DP按状态枚举。
3. **边界初始化**：仔细设定DP数组的初始值，特别是 `dp[0]` 或 `dp[i][i]` 这类边界。
4. **空间优化**：滚动数组（如背包问题）、降维（如某些区间DP可用 `dp[l][r]` 替代 `dp[l][r][k]` 如果 `k` 可推导）。
5. **时间优化**：预处理、前缀和、单调队列/数据结构优化（如斜率优化）、减少不必要的状态枚举。
6. **环形处理**：破环成链（复制一倍）是通用方法。
7. **输出方案**：通常用与 `dp` 数组同结构的 `pre` 数组记录转移来源，然后递归或迭代输出。
8. **调试**：打印DP表，检查边界和转移逻辑。对于复杂DP，先写暴力搜索验证思路。
9. **模运算**：题目要求取模时，注意 `dp` 初始化、负数取模（`(x%P+P)%P`）、乘法溢出（用 `long long` 中转）。
10. **特判与精度**：注意 `n=0,1` 等边界。浮点数DP注意精度问题，有时需用 `long double` 或整数化处理。