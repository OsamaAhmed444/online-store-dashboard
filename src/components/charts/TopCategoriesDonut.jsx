import React, { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import EmptyState from '../common/EmptyState'

const PALETTE = ['#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#94a3b8']

function aggregateCategories(products, topProducts) {
  const soldByKey = new Map(topProducts.map((product) => [product.id || product.name, product.quantity]))
  const revenueByCategory = new Map()
  products.forEach((product) => {
    const category = product.category || 'Uncategorized'
    const key = product._id || product.id || product.name
    const quantity = soldByKey.get(key) || 0
    const revenue = quantity * Number(product.price || 0)
    revenueByCategory.set(category, (revenueByCategory.get(category) || 0) + revenue)
  })

  let entries = [...revenueByCategory.entries()].filter(([, value]) => value > 0)
  if (entries.length === 0) {
    const countByCategory = new Map()
    products.forEach((product) => {
      const category = product.category || 'Uncategorized'
      countByCategory.set(category, (countByCategory.get(category) || 0) + 1)
    })
    entries = [...countByCategory.entries()]
  }

  const total = entries.reduce((sum, [, value]) => sum + value, 0)
  return entries
    .map(([name, value]) => ({ name, value, percent: total ? Math.round((value / total) * 100) : 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
}

export default function TopCategoriesDonut({ products = [], topProducts = [] }) {
  const categories = useMemo(() => aggregateCategories(products, topProducts), [products, topProducts])

  return <section className="surface-panel categories-panel">
    <div className="section-heading">
      <div><p className="eyebrow">CATEGORIES</p><h2>Top selling categories</h2></div>
    </div>
    <p className="categories-subtitle">Share of sales by category</p>
    {categories.length ? <>
      <div className="categories-donut-area">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categories} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={3} stroke="none">
              {categories.map((entry, index) => <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />)}
            </Pie>
            <Tooltip formatter={(value, name, item) => [`${item.payload.percent}%`, name]} contentStyle={{ background: '#171a1e', border: '1px solid #292e35', borderRadius: 10, color: '#f2f2f3' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="categories-legend">
        {categories.map((entry, index) => <li key={entry.name}>
          <span className="categories-legend-percent">{entry.percent}%</span>
          <span className="categories-legend-name">{entry.name}</span>
          <span className="categories-legend-dot" style={{ background: PALETTE[index % PALETTE.length] }} />
        </li>)}
      </ul>
    </> : <EmptyState title="No category data yet" message="Category sales will appear once orders come in." />}
  </section>
}
