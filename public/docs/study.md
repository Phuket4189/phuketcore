# Vue 3 组合式 API 学习笔记
category: Vue
level: 入门
tags: Vue3, 组合式API, 基础

## 概述
Vue 3 引入了组合式 API（Composition API），它提供了一种更灵活的方式来组织组件逻辑。

## 核心概念
- `setup()` 函数：组合式 API 的入口
- `ref()` 和 `reactive()`：响应式数据
- `computed()`：计算属性
- `watch()` 和 `watchEffect()`：侦听器

## 与选项式 API 的对比
组合式 API 允许将相关的逻辑组织在一起，而不是按照选项（data、methods、computed）分散。

---

# Python 列表推导式
category: Python
level: 入门
tags: Python, 列表推导, 基础

## 什么是列表推导式
列表推导式提供了一种简洁的语法来创建新列表。

## 基本语法
```python
# 传统方式
squares = []
for x in range(10):
    squares.append(x**2)

# 列表推导式
squares = [x**2 for x in range(10)]
```

## 带条件的推导式
```python
# 只保留偶数的平方
even_squares = [x**2 for x in range(10) if x % 2 == 0]
```

---

# JavaScript 闭包详解
category: JavaScript
level: 进阶
tags: 闭包, 作用域, 函数

## 什么是闭包
闭包是指有权访问另一个函数作用域中变量的函数。

## 实际应用场景
- 数据私有化
- 函数柯里化
- 防抖与节流

---

# React Hooks 最佳实践
category: React
level: 进阶
tags: React, Hooks, 最佳实践

## 常用 Hooks
- `useState`：状态管理
- `useEffect`：副作用处理
- `useContext`：上下文共享
- `useMemo` 和 `useCallback`：性能优化

## 注意事项
- 只在最顶层使用 Hooks
- 只在 React 函数中调用 Hooks
- 正确使用依赖数组
