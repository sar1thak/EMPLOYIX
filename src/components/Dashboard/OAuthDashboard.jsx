import React from 'react'
import Header from '../other/Header'

const OAuthDashboard = ({ changeUser, data }) => {
  return (
    <div className="min-h-screen text-white px-8 md:px-12 py-10 bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#020617]">
      <Header changeUser={changeUser} data={data} />

      <div className="mt-10 max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
        <h2 className="text-2xl font-semibold">OAuth Account Connected</h2>
        <p className="mt-2 text-white/70">Your login is now handled by backend OAuth + MongoDB.</p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
            <p className="text-sm text-white/60">Name</p>
            <p className="text-lg">{data?.name || 'N/A'}</p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
            <p className="text-sm text-white/60">Email</p>
            <p className="text-lg">{data?.email || 'N/A'}</p>
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-4">
            <p className="text-sm text-white/60">Provider</p>
            <p className="text-lg">{data?.provider || 'google'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OAuthDashboard
