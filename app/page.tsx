export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            🌱 ป๋าหนีด ปั่นหมี่
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Premium Member Calculator
          </h2>
          <p className="text-muted-foreground">
            ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น
          </p>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Welcome to LINE LIFF App</h3>
            <p className="text-sm text-muted-foreground">
              Next.js 14 foundation is ready for development
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Framework</div>
              <div className="text-muted-foreground">Next.js 14</div>
            </div>
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Language</div>
              <div className="text-muted-foreground">TypeScript</div>
            </div>
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Styling</div>
              <div className="text-muted-foreground">Tailwind CSS</div>
            </div>
            <div className="rounded-md bg-primary/10 p-3">
              <div className="font-medium text-primary">Components</div>
              <div className="text-muted-foreground">shadcn/ui</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Mobile-first design optimized for LINE WebView</p>
          <p className="mt-1">Minimum width: 320px | Touch targets: 44px</p>
        </div>
      </div>
    </main>
  )
}
