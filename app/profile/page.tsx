'use client'

import { ProfileDisplay } from '@/components/auth/profile-display'

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            LINE User Profile
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Demo page for LINE authentication system
          </p>
        </div>

        <ProfileDisplay 
          showActions={true}
          onProfileChange={(profile) => {
            console.log('Profile updated:', profile)
          }}
        />
      </div>
    </main>
  )
}
