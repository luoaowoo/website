---
title: "[2026 寒假提高营 Day 1] 并查集 ＆ 堆"
date: 2026-03-21
categories: ["算法性"]
tags: ["OI相关", "算法相关","集训"]
cover: " "
description: "如题，集训Day1"
---

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

```
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

```
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

```
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

```
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

```
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

```
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