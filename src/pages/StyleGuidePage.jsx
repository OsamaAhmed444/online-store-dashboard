import React, { useEffect, useState } from 'react'

import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'

const TOKEN_SWATCHES = [
  { name: 'background', label: 'Background' },
  { name: 'foreground', label: 'Foreground' },
  { name: 'card', label: 'Card' },
  { name: 'muted', label: 'Muted' },
  { name: 'border', label: 'Border' },
  { name: 'primary', label: 'Primary' },
  { name: 'accent', label: 'Accent' },
  { name: 'success', label: 'Success' },
  { name: 'warning', label: 'Warning' },
  { name: 'danger', label: 'Danger' },
]

function Section({ title, description, children }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="card flex flex-col gap-6 p-6">{children}</div>
    </section>
  )
}

function Row({ children }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>
}

export default function StyleGuidePage() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Style Guide</h1>
            <p className="text-sm text-muted-foreground">
              Default element styles &mdash; public preview, no login required.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
        <Section
          title="Color tokens"
          description="Semantic tokens from index.css. Values flip automatically when data-theme changes."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {TOKEN_SWATCHES.map((token) => (
              <div key={token.name} className="flex flex-col gap-2">
                <div
                  className="h-14 w-full rounded-lg border border-border"
                  style={{ backgroundColor: `var(--color-${token.name})` }}
                />
                <span className="text-xs font-medium text-foreground">{token.label}</span>
                <code className="text-xs text-muted-foreground">--color-{token.name}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons" description="Variants and sizes, built from .btn + .btn-{variant} classes.">
          <div className="flex flex-col gap-3">
            <Row>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link button</Button>
            </Row>
            <Row>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
            <Row>
              <Button disabled>Disabled</Button>
              <Button
                loading={loading}
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => setLoading(false), 1500)
                }}
              >
                {loading ? 'Loading...' : 'Click to load'}
              </Button>
            </Row>
          </div>
        </Section>

        <Section title="Inputs" description="The Input component, plus raw .textarea / .select / .checkbox / .radio classes.">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input label="Email" type="email" placeholder="you@example.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input
              label="Store name"
              placeholder="Acme Inc."
              helperText="Shown to customers on the storefront."
            />
            <Input
              label="Discount code"
              defaultValue="EXPIRED10"
              error="This code has expired."
            />
            <Input label="Disabled field" placeholder="Can't touch this" disabled />

            <div className="flex flex-col gap-1.5">
              <label className="label" htmlFor="sg-textarea">
                Description
              </label>
              <textarea
                id="sg-textarea"
                className="textarea"
                placeholder="Tell customers about this product..."
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="label" htmlFor="sg-select">
                Category
              </label>
              <select id="sg-select" className="select">
                <option>Electronics</option>
                <option>Home &amp; Kitchen</option>
                <option>Clothing</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 border-t border-border pt-6">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" className="checkbox" defaultChecked />
              Featured product
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" className="checkbox" disabled />
              Archived (disabled)
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="radio" name="sg-radio" className="radio" defaultChecked />
              In stock
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="radio" name="sg-radio" className="radio" />
              Out of stock
            </label>
          </div>
        </Section>

        <Section title="Badges">
          <Row>
            <span className="badge badge-default">Default</span>
            <span className="badge badge-primary">Primary</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-warning">Warning</span>
            <span className="badge badge-danger">Danger</span>
          </Row>
        </Section>

        <Section title="Alerts">
          <div className="flex flex-col gap-3">
            <div className="alert alert-info">Informational message for the merchant.</div>
            <div className="alert alert-success">Product saved successfully.</div>
            <div className="alert alert-warning">Low stock on 3 items.</div>
            <div className="alert alert-danger">Failed to reach the payments API.</div>
          </div>
        </Section>

        <Section title="Cards & spinner">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-4">
              <p className="font-medium text-foreground">Plain card</p>
              <p className="text-sm text-muted-foreground">
                Uses bg-card / text-card-foreground / border-border.
              </p>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <Spinner />
              <span className="text-sm text-muted-foreground">Loading spinner</span>
            </div>
          </div>
        </Section>

        <Section title="Links & text">
          <div className="flex flex-col gap-2 text-sm">
            <a href="#" className="text-primary underline-offset-4 hover:underline">
              Default link style
            </a>
            <p className="text-foreground">Body text (text-foreground)</p>
            <p className="text-muted-foreground">Muted / secondary text (text-muted-foreground)</p>
          </div>
        </Section>
      </main>
    </div>
  )
}
